const cron = require('node-cron');
const mongoose = require('mongoose');
const User = require('./models/User');
const Alert = require('./models/Alert');
const sendSMS = require('./sendSMS');

// AQI Ranges for reference
const AQI_RANGES = {
  GOOD: { min: 0, max: 50, description: "Good - Air quality is satisfactory" },
  MODERATE: { min: 51, max: 100, description: "Moderate - Air quality is acceptable" },
  UNHEALTHY_SENSITIVE: { min: 101, max: 150, description: "Unhealthy for Sensitive Groups" },
  UNHEALTHY: { min: 151, max: 200, description: "Unhealthy" },
  VERY_UNHEALTHY: { min: 201, max: 300, description: "Very Unhealthy" },
  HAZARDOUS: { min: 301, max: 500, description: "Hazardous" }
};

// Function to get AQI description
const getAQIDescription = (aqi) => {
  for (const [key, range] of Object.entries(AQI_RANGES)) {
    if (aqi >= range.min && aqi <= range.max) {
      return range.description;
    }
  }
  return "Unknown";
};

// Function to format pollutants data
const formatPollutants = (pollutants) => {
  return Object.entries(pollutants)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
};

// Function to store alert in database
const storeAlert = async (userId, location, aqi, pollutants, timestamp) => {
  try {
    const alert = new Alert({
      userId,
      location,
      aqiValue: aqi,
      pollutants,
      timestamp,
      smsSent: false
    });
    await alert.save();
    return alert._id;
  } catch (error) {
    console.error('Error storing alert:', error);
    throw error;
  }
};

// Function to fetch forecast data for a location
const fetchForecastData = async (location) => {
  try {
    // Use Open-Meteo's geocoding API to get coordinates for the location
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
    const geocodingResponse = await fetch(geocodingUrl);
    const geocodingData = await geocodingResponse.json();

    if (!geocodingData.results || geocodingData.results.length === 0) {
      throw new Error(`Location not found: ${location}`);
    }

    const { latitude, longitude } = geocodingData.results[0];

    // Fetch air quality data using the coordinates
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;
    const aqiResponse = await fetch(aqiUrl);
    const aqiData = await aqiResponse.json();
    return aqiData;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
};

// Function to create concise SMS message
const createSMSMessage = (location, time, aqi, pollutants) => {
  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const aqiStatus = getAQIDescription(aqi);
  const message = `⚠️ AQI Alert: ${location}\n` +
    `Time: ${timeStr}\n` +
    `AQI: ${aqi} (${aqiStatus})\n` +
    `PM2.5: ${Math.round(pollutants.PM2_5)} μg/m³\n` +
    `PM10: ${Math.round(pollutants.PM10)} μg/m³\n` +
    `NO2: ${Math.round(pollutants.NO2)} μg/m³`;
  return message;
};

// Main function to process alerts
const processAlerts = async () => {
  try {
    // Check if current time is 10 AM
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour !== 10) {
      console.log(`Skipping alerts - current hour is ${currentHour}, waiting for 10 AM`);
      return;
    }

    // Get all users with their locations
    const users = await User.find({ 
      phone: { $exists: true, $ne: null, $ne: '' },
      location: { $exists: true, $ne: null, $ne: '' }
    });

    console.log(`Found ${users.length} users with valid phone numbers and locations`);

    for (const user of users) {
      try {
        console.log(`\nProcessing user: ${user.fullName} (${user.phone})`);
        console.log(`Location: ${user.location}`);

        // Fetch forecast data for user's location
        const forecastData = await fetchForecastData(user.location);
        
        if (!forecastData || !forecastData.hourly || !forecastData.hourly.us_aqi) {
          console.error(`No forecast data available for user ${user._id}`);
          continue;
        }

        // Process next 24 hours of data
        for (let i = 0; i < 24; i++) {
          const aqi = forecastData.hourly.us_aqi[i];
          const timestamp = new Date(forecastData.hourly.time[i]);
          
          // Only process if AQI is above 100 (Unhealthy for Sensitive Groups)
          if (aqi > 250) {
            const pollutants = {
              PM2_5: forecastData.hourly.pm2_5[i],
              PM10: forecastData.hourly.pm10[i],
              CO: forecastData.hourly.carbon_monoxide[i],
              NO2: forecastData.hourly.nitrogen_dioxide[i],
              SO2: forecastData.hourly.sulphur_dioxide[i],
              O3: forecastData.hourly.ozone[i]
            };

            console.log(`AQI > 100 detected for ${timestamp.toLocaleString()}. AQI: ${aqi}`);

            // Create and send SMS
            const message = createSMSMessage(user.location, timestamp, aqi, pollutants);
            console.log('Sending SMS...');
            await sendSMS(message, user.phone);
            console.log('SMS sent successfully');

            // Store alert in database
            console.log('Storing alert in database...');
            await storeAlert(
              user._id,
              user.location,
              aqi,
              pollutants,
              timestamp
            );

            // Update alert with SMS sent status
            await Alert.findOneAndUpdate(
              { userId: user._id, timestamp: timestamp },
              { smsSent: true, smsSentAt: new Date() }
            );
            console.log('Alert stored and updated successfully');
          }
        }
      } catch (error) {
        console.error(`Error processing alerts for user ${user._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in processAlerts:', error);
  }
};

// Schedule alerts to run at configurable times
const scheduleAlerts = (cronSchedule = '0 10 * * *') => { // Default to 10 AM daily
  cron.schedule(cronSchedule, async () => {
    console.log('Running scheduled alerts check...');
    await processAlerts();
  });
};

// Export both functions
module.exports = {
  processAlerts,
  scheduleAlerts
}; 