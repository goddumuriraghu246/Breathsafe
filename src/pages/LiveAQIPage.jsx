import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiNavigation, FiSearch, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import AQICard from '../components/aqi/AQICard';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// Fix default marker icon for leaflet in React
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const API_KEY = "35d606f31374c4419588af77798c33f7";

// Helper functions for AQI status/advisory
function getAQIStatus(aqi) {
  switch (aqi) {
    case 1: return "Good";
    case 2: return "Fair";
    case 3: return "Moderate";
    case 4: return "Poor";
    case 5: return "Very Poor";
    default: return "Unknown";
  }
}

function getAQIColor(aqi) {
  switch (aqi) {
    case 1: return "success";
    case 2: return "info";
    case 3: return "warning";
    case 4: return "danger";
    case 5: return "danger";
    default: return "secondary";
  }
}

function getAQIAdvisory(aqi) {
  switch (aqi) {
    case 1:
      return {
        headline: "Great air quality!",
        message: "It's a great time for outdoor activities. Pollutant levels are below thresholds of concern."
      };
    case 2:
      return {
        headline: "Fair air quality",
        message: "Air quality is acceptable; most people can enjoy outdoor activities."
      };
    case 3:
      return {
        headline: "Moderate air quality",
        message: "Some pollutants may slightly affect very sensitive individuals."
      };
    case 4:
      return {
        headline: "Poor air quality",
        message: "Sensitive groups should reduce prolonged or heavy outdoor exertion."
      };
    case 5:
      return {
        headline: "Very poor air quality",
        message: "Everyone should avoid outdoor exertion; sensitive groups stay indoors."
      };
    default:
      return {
        headline: "No data",
        message: "Air quality data is not available for this location."
      };
  }
}

// Dynamic Leaflet Map component
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

  // Fetch AQI data from OpenWeatherMap when coordinates change
  useEffect(() => {
    async function fetchAQI() {
      setIsLoading(true);
      setSearchError('');
      try {
        const resp = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${API_KEY}`
        );
        const data = await resp.json();
        if (data && data.list && data.list.length > 0) {
          const aqi = data.list[0];
          setAqiData({
            value: aqi.main.aqi,
            status: getAQIStatus(aqi.main.aqi),
            color: getAQIColor(aqi.main.aqi),
            // Show all pollutants dynamically
            pollutants: Object.entries(aqi.components).map(([name, value]) => ({
              name, value
            })),
            updated: new Date(aqi.dt * 1000).toLocaleTimeString(),
          });
        } else {
          setAqiData(null);
        }
      } catch (e) {
        setAqiData(null);
        setSearchError('Failed to fetch AQI data.');
      }
      setIsLoading(false);
    }
    fetchAQI();
  }, [coordinates.latitude, coordinates.longitude]);

  const handleRefresh = () => {
    setCoordinates({ ...coordinates });
  };

  // Geocode location search using Nominatim
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

  // Detect location using browser geolocation
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
          setLocationName('Your detected location');
          setIsLoading(false);
        },
        () => {
          setSearchError('Unable to detect your location.');
          setLocationName('');
          setIsLoading(false);
        }
      );
    } else {
      setSearchError('Geolocation not supported.');
      setLocationName('');
      setIsLoading(false);
    }
  };

  const handleMapClick = (lat, lng) => {
    setCoordinates({
      latitude: lat,
      longitude: lng
    });
    setLocationName(''); // Clear name, since map click may not have a name
  };

  // Get advisory for current AQI
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
            Monitor real-time air quality data for any location. Click on the map or enter coordinates 
            to check specific areas.
          </p>
        </motion.div>

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

            {/* AQI Card below (Updated Section) */}
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
      </div>
    </div>
  );
};

export default LiveAQIPage;
