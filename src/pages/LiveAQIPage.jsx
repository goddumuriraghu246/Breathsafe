import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiNavigation, FiSearch, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import AQICard from '../components/aqi/AQICard';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PollutantBreakdown from '../components/aqi/PollutantBreakdown';

// Fix default marker icon for leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// EPA AQI Scale (unchanged)
const EPA_AQI_SCALE = {
  0: { label: "Good", color: "success", range: "0-50" },
  1: { label: "Moderate", color: "info", range: "51-100" },
  2: { label: "Unhealthy for Sensitive Groups", color: "warning", range: "101-150" },
  3: { label: "Unhealthy", color: "danger", range: "151-200" },
  4: { label: "Very Unhealthy", color: "danger", range: "201-300" },
  5: { label: "Hazardous", color: "danger", range: "301-500" }
};

function getAQIStatus(aqi) {
  if (aqi <= 50) return EPA_AQI_SCALE[0].label;
  if (aqi <= 100) return EPA_AQI_SCALE[1].label;
  if (aqi <= 150) return EPA_AQI_SCALE[2].label;
  if (aqi <= 200) return EPA_AQI_SCALE[3].label;
  if (aqi <= 300) return EPA_AQI_SCALE[4].label;
  return EPA_AQI_SCALE[5].label;
}

function getAQIColor(aqi) {
  if (aqi <= 50) return EPA_AQI_SCALE[0].color;
  if (aqi <= 100) return EPA_AQI_SCALE[1].color;
  if (aqi <= 150) return EPA_AQI_SCALE[2].color;
  if (aqi <= 200) return EPA_AQI_SCALE[3].color;
  if (aqi <= 300) return EPA_AQI_SCALE[4].color;
  return EPA_AQI_SCALE[5].color;
}

function getAQIAdvisory(aqi) {
  if (aqi <= 50) {
    return {
      headline: "Good Air Quality",
      message: "Air quality is satisfactory, and air pollution poses little or no risk."
    };
  } else if (aqi <= 100) {
    return {
      headline: "Moderate Air Quality",
      message: "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution."
    };
  } else if (aqi <= 150) {
    return {
      headline: "Unhealthy for Sensitive Groups",
      message: "Members of sensitive groups may experience health effects. The general public is less likely to be affected."
    };
  } else if (aqi <= 200) {
    return {
      headline: "Unhealthy",
      message: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects."
    };
  } else if (aqi <= 300) {
    return {
      headline: "Very Unhealthy",
      message: "Health warnings of emergency conditions. The entire population is more likely to be affected."
    };
  } else {
    return {
      headline: "Hazardous",
      message: "Health alert: everyone may experience more serious health effects. Emergency conditions."
    };
  }
}

// Dynamic Leaflet Map component (unchanged)
const AQIMap = ({ coordinates, onClick }) => {
  function ClickHandler() {
    useMapEvents({
      click(e) {
        onClick(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  return (
    <MapContainer
      center={[coordinates.latitude, coordinates.longitude]}
      zoom={12}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom
      key={`${coordinates.latitude},${coordinates.longitude}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[coordinates.latitude, coordinates.longitude]}>
        <Popup>
          Selected Location<br />
          Lat: {coordinates.latitude.toFixed(4)}<br />
          Lng: {coordinates.longitude.toFixed(4)}
        </Popup>
      </Marker>
      <ClickHandler />
    </MapContainer>
  );
};

const LiveAQIPage = () => {
  const [coordinates, setCoordinates] = useState({
    latitude: 37.7749,
    longitude: -122.4194
  });

  const [locationName, setLocationName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [searchError, setSearchError] = useState('');
  const [aqiData, setAqiData] = useState(null);

useEffect(() => {
  async function fetchAQI() {
    setIsLoading(true);
    setSearchError('');
    try {
      const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi`;
      const resp = await fetch(url);
      const data = await resp.json();

      if (data?.hourly?.us_aqi) {
        // Find last non-null AQI index
        const aqiArray = data.hourly.us_aqi;
        let lastIdx = aqiArray.length - 1;
        while (lastIdx >= 0 && aqiArray[lastIdx] === null) lastIdx--;

        if (lastIdx < 0) {
          setAqiData(null);
          setSearchError('No recent AQI data available');
          return;
        }

        // Helper function for safe value extraction
        const safe = (arr) => arr?.[lastIdx] ?? 0;

        // Get pollutant values with proper unit conversions
        const pollutants = [
          { 
            name: 'pm2_5',
            label: 'PM2.5',
            value: safe(data.hourly.pm2_5),
            unit: 'μg/m³'
          },
          { 
            name: 'pm10',
            label: 'PM10',
            value: safe(data.hourly.pm10),
            unit: 'μg/m³'
          },
          { 
            name: 'co',
            label: 'CO',
            value: safe(data.hourly.carbon_monoxide) / 1000, // Convert to mg/m³
            unit: 'mg/m³'
          },
          { 
            name: 'no2',
            label: 'NO₂',
            value: safe(data.hourly.nitrogen_dioxide),
            unit: 'μg/m³'
          },
          { 
            name: 'so2',
            label: 'SO₂',
            value: safe(data.hourly.sulphur_dioxide),
            unit: 'μg/m³'
          },
          { 
            name: 'o3',
            label: 'O₃',
            value: safe(data.hourly.ozone),
            unit: 'μg/m³'
          }
        ];

        setAqiData({
          value: safe(data.hourly.us_aqi),
          status: getAQIStatus(safe(data.hourly.us_aqi)),
          color: getAQIColor(safe(data.hourly.us_aqi)),
          pollutants,
          updated: data.hourly.time[lastIdx]
        });
      }
    } catch (e) {
      setAqiData(null);
      setSearchError('Failed to fetch AQI data');
    }
    setIsLoading(false);
  }
  fetchAQI();
}, [coordinates.latitude, coordinates.longitude]);




  const handleRefresh = () => {
    setCoordinates({ ...coordinates });
  };

  // Geocode location search using Nominatim (unchanged)
  const handleLocationSearch = async (e) => {
    e.preventDefault();
    setSearchError('');
    if (locationSearch.trim()) {
      setIsLoading(true);
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationSearch)}`
        );
        const data = await resp.json();
        if (data && data.length > 0) {
          setCoordinates({
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
          });
          setLocationName(data[0].display_name);
        } else {
          setSearchError('Location not found.');
          setLocationName('');
        }
      } catch {
        setSearchError('Error searching location.');
        setLocationName('');
      }
      setIsLoading(false);
    }
  };

  // Most accurate device location mechanism for web
  const handleDetectLocation = () => {
    setIsLoading(true);
    setSearchError('');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoordinates({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setLocationName(
            `Your detected location${pos.coords.accuracy ? ` (±${Math.round(pos.coords.accuracy)} meters)` : ''}`
          );
          setIsLoading(false);
        },
        (err) => {
          if (err.code === 1) {
            setSearchError(
              'Location access denied. Please allow location access in your browser settings for the most accurate air quality data.'
            );
          } else if (err.code === 2) {
            setSearchError('Location unavailable. Please ensure your device location is enabled.');
          } else if (err.code === 3) {
            setSearchError('Location request timed out. Try again.');
          } else {
            setSearchError('Could not get your location.');
          }
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true, // Use GPS if available
          timeout: 20000,
          maximumAge: 0,
        }
      );
    } else {
      setSearchError('Geolocation is not supported by your browser.');
      setIsLoading(false);
    }
  };

  // Map click handler (unchanged)
  const handleMapClick = (lat, lng) => {
    setCoordinates({
      latitude: lat,
      longitude: lng
    });
    setLocationName('');
    setLocationSearch('');
  };

  // Advisory for current AQI
  const advisory = getAQIAdvisory(aqiData?.value);

  return (
    <div className="pt-20 pb-16">
      <div className="container-custom">
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="pt-5 mb-3 text-gray-900 heading-md dark:text-white">Live AQI Tracker</h1>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
            Monitor real-time air quality data for any location.
          </p>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left panel - Map and controls */}
          <motion.div 
            className="lg:col-span-2 card p-4 sm:p-6 h-[600px] flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="mb-4">
              <div className="flex flex-col gap-4 mb-4 sm:flex-row">
                <form onSubmit={handleLocationSearch} className="flex flex-grow gap-2">
                  <input
                    type="text"
                    placeholder="Search location"
                    className="flex-grow px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    className="p-2 btn-primary"
                    disabled={isLoading}
                  >
                    <FiSearch className="w-5 h-5" />
                  </button>
                </form>
                <button 
                  onClick={handleDetectLocation}
                  className="flex items-center gap-2 btn-secondary"
                  disabled={isLoading}
                >
                  <FiNavigation className="w-4 h-4" />
                  <span>Detect Location</span>
                </button>
              </div>
              {searchError && (
                <div className="mt-2 text-sm text-danger-600 dark:text-danger-400">{searchError}</div>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-700 dark:text-gray-300">
                <div>
                  <span className="font-medium">Latitude:</span> {coordinates.latitude.toFixed(4)}
                </div>
                <div>
                  <span className="font-medium">Longitude:</span> {coordinates.longitude.toFixed(4)}
                </div>
                <button 
                  onClick={handleRefresh}
                  className="flex items-center gap-1 ml-auto text-primary-500 hover:text-primary-600"
                  disabled={isLoading}
                >
                  <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
              {locationName && (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">Location:</span> {locationName}
                </div>
              )}
            </div>
            <div className="relative flex-grow overflow-hidden border border-gray-200 rounded-lg dark:border-dark-700">
              {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 dark:bg-dark-800/70">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 mb-2 border-4 rounded-full border-primary-500 border-t-transparent animate-spin"></div>
                    <p className="text-gray-700 dark:text-gray-300">Loading data...</p>
                  </div>
                </div>
              )}
              <AQIMap 
                coordinates={coordinates} 
                onClick={handleMapClick} 
              />
            </div>
          </motion.div>
          {/* Right panel - Health Advisory and AQI Card */}
          <motion.div 
            className="flex flex-col gap-6 lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Health Advisory at the top */}
            <div className="p-4 border card sm:p-6 bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-800">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FiAlertCircle className={`w-5 h-5 text-${aqiData ? getAQIColor(aqiData.value) : "primary"}-500`} />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{advisory.headline}</h3>
                  <div className="mt-2 space-y-2 text-gray-700 dark:text-gray-300">
                    <p>
                      Current air quality is <span className={`font-medium text-${aqiData ? getAQIColor(aqiData.value) : "primary"}-600 dark:text-${aqiData ? getAQIColor(aqiData.value) : "primary"}-400`}>
                        {aqiData ? aqiData.status : "Loading..."}
                      </span>.
                    </p>
                    <p>{advisory.message}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AQI Card below */}
            {isLoading ? (
              <div className="p-6 text-center card">
                <p className="text-gray-600 dark:text-gray-400">Loading AQI data...</p>
              </div>
            ) : aqiData ? (
              <AQICard 
                aqiData={aqiData} 
                coordinates={coordinates}
                isLoading={isLoading}
              />
            ) : (
              <div className="p-6 text-center card">
                <p className="text-gray-600 dark:text-gray-400">
                  No AQI data available for this location.  
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Pollutant Breakdown always below the main grid */}
        {aqiData && (
          <div className="mt-8">
            <PollutantBreakdown pollutants={aqiData.pollutants} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveAQIPage;
