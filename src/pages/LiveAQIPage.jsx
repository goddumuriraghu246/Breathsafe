import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiNavigation, FiSearch, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import AQICard from '../components/aqi/AQICard';
import AQIMap from '../components/aqi/AQIMap';

const LiveAQIPage = () => {
  const [coordinates, setCoordinates] = useState({
    latitude: 37.7749,
    longitude: -122.4194
  });
  const [isLoading, setIsLoading] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');

  // Mock AQI data
  const aqiData = {
    value: 42,
    status: 'Good',
    color: 'success',
    pollutants: [
      { name: 'PM2.5', value: 12, percentage: 40 },
      { name: 'PM10', value: 18, percentage: 20 },
      { name: 'O₃', value: 35, percentage: 35 },
      { name: 'NO₂', value: 15, percentage: 15 },
      { name: 'SO₂', value: 3, percentage: 5 },
      { name: 'CO', value: 0.8, percentage: 8 },
    ],
    updated: new Date().toLocaleTimeString(),
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleLocationSearch = (e) => {
    e.preventDefault();
    if (locationSearch.trim()) {
      setIsLoading(true);
      // Simulate geolocation search
      setTimeout(() => {
        // Mock coordinates update
        const randomLat = 37.7749 + (Math.random() - 0.5) * 0.1;
        const randomLng = -122.4194 + (Math.random() - 0.5) * 0.1;
        setCoordinates({
          latitude: randomLat,
          longitude: randomLng
        });
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleMapClick = (lat, lng) => {
    setCoordinates({
      latitude: lat,
      longitude: lng
    });
  };

  const handleDetectLocation = () => {
    setIsLoading(true);
    // Simulate geolocation
    setTimeout(() => {
      // Mock user location
      setCoordinates({
        latitude: 37.7849,
        longitude: -122.4294
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="pt-20 pb-16">
      <div className="container-custom">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="heading-md text-gray-900 dark:text-white mb-3">Live AQI Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Monitor real-time air quality data for any location. Click on the map or enter coordinates 
            to check specific areas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel - Map and controls */}
          <motion.div 
            className="lg:col-span-2 card p-4 sm:p-6 h-[600px] flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <form onSubmit={handleLocationSearch} className="flex-grow flex gap-2">
                  <input
                    type="text"
                    placeholder="Search location"
                    className="flex-grow px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    className="btn-primary p-2"
                    disabled={isLoading}
                  >
                    <FiSearch className="w-5 h-5" />
                  </button>
                </form>
                <button 
                  onClick={handleDetectLocation}
                  className="btn-secondary flex items-center gap-2"
                  disabled={isLoading}
                >
                  <FiNavigation className="w-4 h-4" />
                  <span>Detect Location</span>
                </button>
              </div>
              
              <div className="flex flex-wrap gap-4 items-center text-sm text-gray-700 dark:text-gray-300">
                <div>
                  <span className="font-medium">Latitude:</span> {coordinates.latitude.toFixed(4)}
                </div>
                <div>
                  <span className="font-medium">Longitude:</span> {coordinates.longitude.toFixed(4)}
                </div>
                <button 
                  onClick={handleRefresh}
                  className="ml-auto flex items-center gap-1 text-primary-500 hover:text-primary-600"
                  disabled={isLoading}
                >
                  <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
            
            <div className="flex-grow relative rounded-lg overflow-hidden border border-gray-200 dark:border-dark-700">
              {isLoading && (
                <div className="absolute inset-0 bg-white/70 dark:bg-dark-800/70 flex items-center justify-center z-10">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-2"></div>
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
          
          {/* Right panel - AQI information */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AQICard 
              aqiData={aqiData} 
              coordinates={coordinates}
              isLoading={isLoading}
            />
            
            <motion.div 
              className="card p-4 sm:p-6 mt-6 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FiAlertCircle className="w-5 h-5 text-primary-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Health Advisory</h3>
                  <div className="mt-2 text-gray-700 dark:text-gray-300 space-y-2">
                    <p>
                      Current air quality is <span className="font-medium text-success-600 dark:text-success-400">Good</span>. 
                      It's a great time for outdoor activities.
                    </p>
                    <p>
                      Pollutant levels are below thresholds of concern for most individuals, including sensitive groups.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LiveAQIPage;