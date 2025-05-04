import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, ReferenceLine, Area, ComposedChart
} from 'recharts';
import { FiClock, FiCalendar, FiSliders, FiRefreshCw } from 'react-icons/fi';

const ForecastingPage = () => {
  const [forecastPeriod, setForecastPeriod] = useState(24);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetailedChart, setShowDetailedChart] = useState(false);

  // Generate mock forecast data
  const generateForecastData = (hours) => {
    const data = [];
    const now = new Date();
    const baseAQI = 40;
    
    for (let i = 0; i < hours; i++) {
      const time = new Date(now.getTime() + i * 60 * 60 * 1000);
      const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Create more realistic AQI patterns
      // Morning increase, afternoon peak, evening decrease
      const hourOfDay = (now.getHours() + i) % 24;
      let factor = 1;
      
      if (hourOfDay >= 7 && hourOfDay <= 10) {
        // Morning increase
        factor = 1.2;
      } else if (hourOfDay >= 11 && hourOfDay <= 15) {
        // Afternoon peak
        factor = 1.4;
      } else if (hourOfDay >= 19 && hourOfDay <= 23) {
        // Evening decrease
        factor = 0.8;
      } else if (hourOfDay >= 0 && hourOfDay <= 5) {
        // Night low
        factor = 0.6;
      }
      
      // Add some randomness
      const randomVariation = Math.sin(i * 0.5) * 10 + Math.random() * 5;
      const aqi = Math.round(baseAQI * factor + randomVariation);
      
      const pollutantData = {
        pm25: Math.round(aqi * 0.4 + Math.random() * 5),
        pm10: Math.round(aqi * 0.6 + Math.random() * 8),
        o3: Math.round((hourOfDay >= 11 && hourOfDay <= 16) ? aqi * 0.8 + Math.random() * 10 : aqi * 0.3 + Math.random() * 5),
        no2: Math.round((hourOfDay >= 7 && hourOfDay <= 9) || (hourOfDay >= 17 && hourOfDay <= 19) ? aqi * 0.7 + Math.random() * 8 : aqi * 0.2 + Math.random() * 4),
      };
      
      data.push({
        time: timeStr,
        hour: hourOfDay,
        aqi,
        ...pollutantData,
      });
    }
    
    return data;
  };

  const forecastData = generateForecastData(forecastPeriod);

  const handleForecastPeriodChange = (period) => {
    setIsLoading(true);
    setTimeout(() => {
      setForecastPeriod(period);
      setIsLoading(false);
    }, 1000);
  };

  const getAQIColor = (value) => {
    if (value <= 50) return '#10B981'; // Good
    if (value <= 100) return '#F59E0B'; // Moderate
    if (value <= 150) return '#FB923C'; // Unhealthy for Sensitive Groups
    if (value <= 200) return '#EF4444'; // Unhealthy
    if (value <= 300) return '#9333EA'; // Very Unhealthy
    return '#7F1D1D'; // Hazardous
  };

  // Calculate current AQI and max predicted AQI
  const currentAQI = forecastData[0]?.aqi || 0;
  const maxAQI = Math.max(...forecastData.map(item => item.aqi));
  const aqiColorCurrent = getAQIColor(currentAQI);
  const aqiColorMax = getAQIColor(maxAQI);
  
  // Determine forecast summary text
  const getForecastSummary = () => {
    if (maxAQI <= 50) {
      return "AQI is expected to remain Good throughout the forecast period. It's a great time for outdoor activities.";
    } else if (maxAQI <= 100) {
      return "AQI will rise to Moderate levels. People who are unusually sensitive to air pollution should consider reducing prolonged outdoor activities.";
    } else if (maxAQI <= 150) {
      return "AQI will reach levels Unhealthy for Sensitive Groups. Active children and adults, and people with respiratory disease should limit prolonged outdoor exertion.";
    } else {
      return "AQI will reach Unhealthy levels. Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.";
    }
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
          <h1 className="heading-md text-gray-900 dark:text-white mb-3">AQI Forecasting</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            View air quality predictions for the next 24 hours based on our advanced ML models.
            Plan your outdoor activities with confidence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel - Controls and summary */}
          <motion.div 
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Forecast controls */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Forecast Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FiClock className="inline mr-2" />
                    Forecast Period
                  </label>
                  <div className="flex space-x-2">
                    {[6, 12, 24].map(period => (
                      <button
                        key={period}
                        onClick={() => handleForecastPeriodChange(period)}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                          forecastPeriod === period
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                        }`}
                        disabled={isLoading}
                      >
                        {period} hours
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FiCalendar className="inline mr-2" />
                    Current Date
                  </label>
                  <div className="bg-gray-100 dark:bg-dark-700 py-2 px-4 rounded-lg text-gray-700 dark:text-gray-300">
                    {new Date().toLocaleDateString(undefined, { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FiSliders className="inline mr-2" />
                    View Options
                  </label>
                  <div className="flex items-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showDetailedChart}
                        onChange={() => setShowDetailedChart(!showDetailedChart)}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-dark-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-500"></div>
                      <span className="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Show pollutant details
                      </span>
                    </label>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => setIsLoading(false), 1500);
                  }}
                  className="flex items-center justify-center w-full py-2 px-4 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FiRefreshCw className="animate-spin mr-2" />
                      Updating Forecast...
                    </>
                  ) : (
                    <>
                      <FiRefreshCw className="mr-2" />
                      Refresh Forecast
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Forecast summary */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Forecast Summary</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Current AQI</div>
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: aqiColorCurrent }}
                    >
                      {currentAQI}
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {currentAQI <= 50 ? 'Good' : 
                       currentAQI <= 100 ? 'Moderate' : 
                       currentAQI <= 150 ? 'Unhealthy for Sensitive Groups' : 
                       'Unhealthy'}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Maximum Predicted AQI</div>
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: aqiColorMax }}
                    >
                      {maxAQI}
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {maxAQI <= 50 ? 'Good' : 
                       maxAQI <= 100 ? 'Moderate' : 
                       maxAQI <= 150 ? 'Unhealthy for Sensitive Groups' : 
                       'Unhealthy'}
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-200 dark:border-dark-700">
                  <p className="text-gray-700 dark:text-gray-300">
                    {getForecastSummary()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right panel - Chart */}
          <motion.div 
            className="lg:col-span-2 card p-4 sm:p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {forecastPeriod}-Hour AQI Forecast
            </h2>
            
            <div className="h-[400px] w-full relative">
              {isLoading && (
                <div className="absolute inset-0 bg-white/70 dark:bg-dark-800/70 flex items-center justify-center z-10">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-gray-700 dark:text-gray-300">Updating forecast...</p>
                  </div>
                </div>
              )}
              
              <ResponsiveContainer width="100%" height="100%">
                {showDetailedChart ? (
                  <ComposedChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        border: 'none'
                      }} 
                    />
                    <Legend />
                    <ReferenceLine y={50} yAxisId="left" label="Good" stroke="#10B981" strokeDasharray="3 3" />
                    <ReferenceLine y={100} yAxisId="left" label="Moderate" stroke="#F59E0B" strokeDasharray="3 3" />
                    <ReferenceLine y={150} yAxisId="left" label="Unhealthy for Sensitive Groups" stroke="#FB923C" strokeDasharray="3 3" />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="aqi" 
                      name="AQI" 
                      stroke="#1E90FF" 
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="pm25" 
                      name="PM2.5" 
                      stroke="#8884d8" 
                      strokeDasharray="5 5"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="pm10" 
                      name="PM10" 
                      stroke="#82ca9d"
                      strokeDasharray="3 3" 
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="o3" 
                      name="O₃" 
                      stroke="#ffc658"
                      strokeDasharray="3 3" 
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="no2" 
                      name="NO₂" 
                      stroke="#ff8042"
                      strokeDasharray="3 3" 
                    />
                  </ComposedChart>
                ) : (
                  <ComposedChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        border: 'none'
                      }}
                    />
                    <Legend />
                    <ReferenceLine y={50} label="Good" stroke="#10B981" strokeDasharray="3 3" />
                    <ReferenceLine y={100} label="Moderate" stroke="#F59E0B" strokeDasharray="3 3" />
                    <ReferenceLine y={150} label="Unhealthy for Sensitive Groups" stroke="#FB923C" strokeDasharray="3 3" />
                    <defs>
                      <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1E90FF" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#1E90FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="aqi" 
                      stroke="#1E90FF" 
                      fillOpacity={1} 
                      fill="url(#colorAqi)" 
                      name="AQI"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="aqi" 
                      name="AQI" 
                      stroke="#1E90FF" 
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </ComposedChart>
                )}
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="font-medium mb-1">Understanding the forecast:</div>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="text-success-600 dark:text-success-400 font-medium">0-50 (Good):</span> Air quality is satisfactory and poses little or no risk.</li>
                <li><span className="text-yellow-600 dark:text-yellow-400 font-medium">51-100 (Moderate):</span> Acceptable air quality, but some pollutants may be a concern for very sensitive individuals.</li>
                <li><span className="text-orange-600 dark:text-orange-400 font-medium">101-150 (Unhealthy for Sensitive Groups):</span> Members of sensitive groups may experience health effects.</li>
                <li><span className="text-danger-600 dark:text-danger-400 font-medium">151-200 (Unhealthy):</span> Everyone may begin to experience health effects.</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForecastingPage;