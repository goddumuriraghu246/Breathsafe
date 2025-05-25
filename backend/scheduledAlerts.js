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

// Function to format time in 24-hour format
const formatTime = (date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // Format hours in 24-hour format
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  
  // Convert to 12-hour format for display
  let twelveHour = hours;
  let ampm = 'AM';
  if (hours === 0) {
    twelveHour = 12;
    ampm = 'AM';
  } else if (hours > 12) {
    twelveHour = hours - 12;
    ampm = 'PM';
  } else if (hours === 12) {
    ampm = 'PM';
  }
  
  return `${year}-${month}-${day}, ${formattedHours}:${formattedMinutes} (${twelveHour}:${formattedMinutes} ${ampm})`;
};

// Function to fetch forecast data for a location
const fetchForecastData = async (location) => {
  try {
    // Clean and format location name
    const cleanLocation = location.trim().replace(/\s+/g, ' ');
    
    // Use Open-Meteo's geocoding API to get coordinates for the location
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanLocation)}&count=5&language=en`;
    const geocodingResponse = await fetch(geocodingUrl);
    const geocodingData = await geocodingResponse.json();

    if (!geocodingData.results || geocodingData.results.length === 0) {
      console.error(`Location not found: ${cleanLocation}`);
      throw new Error(`Location not found: ${cleanLocation}. Please check the spelling or try a nearby major city.`);
    }

    // Find the best match for the location
    const bestMatch = geocodingData.results.find(result => 
      result.name.toLowerCase() === cleanLocation.toLowerCase() ||
      result.admin1?.toLowerCase() === cleanLocation.toLowerCase() ||
      result.country?.toLowerCase() === cleanLocation.toLowerCase()
    ) || geocodingData.results[0];

    console.log(`Found location: ${bestMatch.name}, ${bestMatch.admin1}, ${bestMatch.country}`);
    const { latitude, longitude } = bestMatch;

    // Get current time in UTC
    const now = new Date();
    
    // Fetch air quality data using the coordinates
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`;
    console.log('Fetching AQI data from:', aqiUrl);
    
    const aqiResponse = await fetch(aqiUrl);
    const aqiData = await aqiResponse.json();

    if (!aqiData || !aqiData.hourly) {
      throw new Error(`No air quality data available for ${bestMatch.name}`);
    }

    // Verify and log the forecast data
    console.log('\nForecast Data Verification:');
    console.log('------------------------');
    console.log(`Location: ${bestMatch.name}`);
    console.log(`Coordinates: ${latitude}, ${longitude}`);
    
    // Get current system time
    const systemNow = new Date();
    console.log(`Current system time: ${formatTime(systemNow)}`);
    
    console.log('\nNext 24 hours AQI forecast:');
    console.log('------------------------');
    
    // Find the index in the forecast data that matches current hour
    const currentHour = systemNow.getHours();
    const forecastStartIndex = aqiData.hourly.time.findIndex(time => {
      const forecastTime = new Date(time);
      return forecastTime.getHours() === currentHour;
    });

    if (forecastStartIndex === -1) {
      throw new Error('Could not find matching forecast data for current time');
    }

    // Log the next 24 hours of forecast data
    for (let i = 0; i < 24; i++) {
      const forecastIndex = (forecastStartIndex + i) % 24;
      const forecastTime = new Date(aqiData.hourly.time[forecastIndex]);
      const formattedTime = formatTime(forecastTime);
      const aqi = Math.round(aqiData.hourly.us_aqi[forecastIndex]);
      
      console.log(`${formattedTime}: AQI = ${aqi} (${getAQIDescription(aqi)})`);
      
      // If this is the current hour and AQI is high, log a warning
      if (i === 0 && aqi > 94) {
        console.log(`\n⚠️ WARNING: High AQI detected for current hour (${formattedTime})`);
      }
    }

    return aqiData;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
};

// Function to create concise SMS message
const createSMSMessage = (location, time, aqi, pollutants) => {
  const timeStr = formatTime(time);
  
  const aqiStatus = getAQIDescription(aqi);
  const message = `⚠️ AQI Alert: ${location}\n` +
    `Date & Time: ${timeStr}\n` +
    `AQI: ${Math.round(aqi)} (${aqiStatus})\n` +
    `PM2.5: ${Math.round(pollutants.PM2_5)} μg/m³\n` +
    `PM10: ${Math.round(pollutants.PM10)} μg/m³\n` +
    `NO2: ${Math.round(pollutants.NO2)} μg/m³`;
  return message;
};

// Main function to process alerts
const processAlerts = async () => {
  try {
    const now = new Date();
    console.log('\n=== AQI Alert System Verification ===');
    console.log('Current time:', formatTime(now));
    console.log('AQI Threshold: > 94 (Moderate to Unhealthy)');
    
    // Get all users with their locations
    const users = await User.find({ 
      phone: { $exists: true, $ne: null, $ne: '' },
      location: { $exists: true, $ne: null, $ne: '' }
    });

    console.log(`\nFound ${users.length} users with valid phone numbers and locations`);

    for (const user of users) {
      try {
        console.log(`\n=== Processing User: ${user.fullName} ===`);
        console.log(`Phone: ${user.phone}`);
        console.log(`Location: ${user.location}`);

        // Fetch forecast data for user's location
        const forecastData = await fetchForecastData(user.location);
        
        if (!forecastData || !forecastData.hourly || !forecastData.hourly.us_aqi) {
          console.error(`No forecast data available for user ${user._id}`);
          continue;
        }

        console.log('\n=== 24-Hour Forecast Analysis ===');
        let highAQICount = 0;
        let alertsSent = 0;

        // Process next 24 hours of data
        for (let i = 0; i < 24; i++) {
          const aqi = Math.round(forecastData.hourly.us_aqi[i]);
          const timestamp = new Date(forecastData.hourly.time[i]);
          const formattedTime = formatTime(timestamp);

          // Log all AQI values for verification
          console.log(`${formattedTime}: AQI = ${aqi} (${getAQIDescription(aqi)})`);

          // Only process if AQI is above 94 (Moderate to Unhealthy)
          if (aqi > 94) {
            highAQICount++;
            const pollutants = {
              PM2_5: Math.round(forecastData.hourly.pm2_5[i]),
              PM10: Math.round(forecastData.hourly.pm10[i]),
              CO: Math.round(forecastData.hourly.carbon_monoxide[i]),
              NO2: Math.round(forecastData.hourly.nitrogen_dioxide[i]),
              SO2: Math.round(forecastData.hourly.sulphur_dioxide[i]),
              O3: Math.round(forecastData.hourly.ozone[i])
            };

            console.log(`\n⚠️ ALERT TRIGGERED:`);
            console.log(`Time: ${formattedTime}`);
            console.log(`AQI: ${aqi} (${getAQIDescription(aqi)})`);
            console.log(`Pollutants: PM2.5=${pollutants.PM2_5}, PM10=${pollutants.PM10}, NO2=${pollutants.NO2}`);
            console.log(`Note: High AQI predicted at this time`);

            // Create and send SMS
            const message = createSMSMessage(user.location, timestamp, aqi, pollutants);
            console.log('\nSending SMS Alert...');
            await sendSMS(message, user.phone);
            console.log('✅ SMS sent successfully');

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
            console.log('✅ Alert stored and updated successfully');
            alertsSent++;
          }
        }

        console.log('\n=== Summary for User ===');
        console.log(`Total hours with high AQI: ${highAQICount}`);
        console.log(`Total alerts sent: ${alertsSent}`);
        console.log('========================\n');

      } catch (error) {
        console.error(`Error processing alerts for user ${user._id}:`, error);
      }
    }
    console.log('\n=== Alert Processing Completed ===');
  } catch (error) {
    console.error('Error in processAlerts:', error);
  }
};

// Schedule alerts to run at 10 AM daily
const scheduleAlerts = () => {
  const cronSchedule = '00 10 * * *'; // Run at 10 AM (24-hour format)
  cron.schedule(cronSchedule, async () => {
    console.log('Running scheduled alerts check at 11:22...');
    await processAlerts();
  });
  console.log('SMS alerts scheduled to run at 10:00 daily');
};

// Export both functions
module.exports = {
  processAlerts,
  scheduleAlerts
}; 