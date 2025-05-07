import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FiMapPin, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PollutantBreakdown from '../components/aqi/PollutantBreakdown';
import { useTheme } from '../context/ThemeContext';

// Fix default marker icon for leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const OPENWEATHER_API_KEY = "35d606f31374c4419588af77798c33f7";

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

const ForecastingPage = () => {
  const [coordinates, setCoordinates] = useState({ latitude: 37.7749, longitude: -122.4194 });
  const [locationName, setLocationName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [searchError, setSearchError] = useState('');
  const [forecastData, setForecastData] = useState([]);
  const [pollutants, setPollutants] = useState([]);
  const { isDarkMode } = useTheme();

  // Fetch forecast AQI data from OpenWeather
  useEffect(() => {
    async function fetchForecast() {
      setIsLoading(true);
      try {
        // Fetch current for pollutant breakdown
        const currentResp = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${OPENWEATHER_API_KEY}`
        );
        const currentData = await currentResp.json();
        if (currentData && currentData.list && currentData.list.length > 0) {
          const aqi = currentData.list[0];
          setPollutants([
            { name: 'pm2_5', label: 'PM2.5', value: aqi.components.pm2_5 },
            { name: 'pm10', label: 'PM10', value: aqi.components.pm10 },
            { name: 'co', label: 'CO', value: aqi.components.co },
            { name: 'no2', label: 'NO₂', value: aqi.components.no2 },
            { name: 'so2', label: 'SO₂', value: aqi.components.so2 },
            { name: 'o3', label: 'O₃', value: aqi.components.o3 }
          ]);
        }
        // Fetch forecast for graph
        const resp = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${OPENWEATHER_API_KEY}`
        );
        const data = await resp.json();
        if (data && data.list && data.list.length > 0) {
          const processedData = data.list.map(item => ({
            time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            aqi: item.main.aqi * 50 // Map 1-5 to 50-250 for EPA scale
          }));
          setForecastData(processedData);
        } else {
          setForecastData([]);
        }
      } catch (e) {
        setForecastData([]);
        setPollutants([]);
      }
      setIsLoading(false);
    }
    fetchForecast();
  }, [coordinates.latitude, coordinates.longitude]);

  const handleMapClick = (lat, lng) => {
    setCoordinates({ latitude: lat, longitude: lng });
    setLocationName('');
  };

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
          setCoordinates({ latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) });
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

  const handleDetectLocation = () => {
    setIsLoading(true);
    setSearchError('');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoordinates({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
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

  // Prepare 24-hour AQI trend data (mock for now)
  const forecastDataMock = [
    { hour: '00:00', aqi: 42 },
    { hour: '03:00', aqi: 38 },
    { hour: '06:00', aqi: 35 },
    { hour: '09:00', aqi: 45 },
    { hour: '12:00', aqi: 52 },
    { hour: '15:00', aqi: 48 },
    { hour: '18:00', aqi: 40 },
    { hour: '21:00', aqi: 38 },
    { hour: '23:59', aqi: 36 }
  ];

  return (
    <div className={`pt-24 pb-16 min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <div className="container-custom">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={`heading-md mb-3 pt-10 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>AQI Forecasting</h1>
          <p className={`max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>View air quality predictions for the next 24 hours based on real-time data.</p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel - Map and controls */}
          <motion.div 
            className={`lg:col-span-2 card p-4 sm:p-6 h-[600px] flex flex-col ${isDarkMode ? 'bg-dark-800' : 'bg-white'} transition-colors duration-300`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="mb-4">
              <form onSubmit={handleLocationSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiSearch className="w-5 h-5 text-gray-400" />
                  </div>
                      <input
                    type="text"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    placeholder="Search location..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/80 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-600"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Search
                </button>
                <button 
                  type="button"
                  onClick={handleDetectLocation}
                  className="px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                >
                  <FiMapPin className="w-5 h-5" />
                </button>
              </form>
              {searchError && (
                <p className="mt-2 text-sm text-danger-500">{searchError}</p>
              )}
            </div>
            <div className="flex-1 relative rounded-lg overflow-hidden mt-4">
              <AQIMap coordinates={coordinates} onClick={handleMapClick} />
            </div>
          </motion.div>
          {/* Right panel - Forecast data */}
          <motion.div 
            className={`lg:col-span-1 space-y-6 ${isDarkMode ? 'bg-dark-800' : 'bg-white'} card p-6 transition-colors duration-300`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div>
              <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{locationName || 'Selected Location'}</h2>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Latitude: {coordinates.latitude.toFixed(4)}<br />Longitude: {coordinates.longitude.toFixed(4)}</div>
            </div>
            <PollutantBreakdown pollutants={pollutants} />
          </motion.div>
        </div>
        {/* Modern 24-Hour AQI Trend Chart */}
        <motion.div 
          className={`mt-8 card p-6 rounded-2xl shadow-xl ${isDarkMode ? 'bg-[#23263A] text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>24-Hour AQI Trend</h2>
            <span className="text-xs text-gray-400">EPA Scale</span>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastDataMock} margin={{ top: 30, right: 40, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
                <XAxis dataKey="hour" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} tick={{ fontSize: 16 }} />
                <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} tick={{ fontSize: 16 }} />
                <Tooltip contentStyle={{ background: isDarkMode ? '#23263A' : '#fff', color: isDarkMode ? '#fff' : '#23263A', borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }} labelStyle={{ color: isDarkMode ? '#fff' : '#23263A', fontWeight: 600 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 16, color: isDarkMode ? '#fff' : '#23263A' }} />
                <Line type="monotone" dataKey="aqi" stroke="#7C3AED" strokeWidth={4} dot={{ r: 6, fill: '#fff', stroke: '#7C3AED', strokeWidth: 2 }} activeDot={{ r: 8 }} name="AQI" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForecastingPage;