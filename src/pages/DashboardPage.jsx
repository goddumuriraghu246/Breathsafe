import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import { 
  FiHome, FiMap, FiTrendingUp, FiUser, FiStar, FiAlertTriangle, FiFilter
} from 'react-icons/fi';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // Mock data for charts
  const chartData = {
    monthlyTrends: [
      { name: 'Jan', aqi: 45 },
      { name: 'Feb', aqi: 52 },
      { name: 'Mar', aqi: 38 },
      { name: 'Apr', aqi: 30 },
      { name: 'May', aqi: 55 },
      { name: 'Jun', aqi: 70 },
      { name: 'Jul', aqi: 80 },
      { name: 'Aug', aqi: 62 },
      { name: 'Sep', aqi: 48 },
      { name: 'Oct', aqi: 40 },
      { name: 'Nov', aqi: 35 },
      { name: 'Dec', aqi: 50 }
    ],
    weeklyTrends: [
      { name: 'Mon', aqi: 42 },
      { name: 'Tue', aqi: 55 },
      { name: 'Wed', aqi: 38 },
      { name: 'Thu', aqi: 45 },
      { name: 'Fri', aqi: 60 },
      { name: 'Sat', aqi: 70 },
      { name: 'Sun', aqi: 45 }
    ],
    cityComparison: [
      { name: 'New York', aqi: 45 },
      { name: 'London', aqi: 38 },
      { name: 'Tokyo', aqi: 62 },
      { name: 'Beijing', aqi: 120 },
      { name: 'Delhi', aqi: 145 },
      { name: 'Los Angeles', aqi: 75 }
    ],
    pollutantBreakdown: [
      { name: 'PM2.5', value: 35 },
      { name: 'PM10', value: 25 },
      { name: 'O₃', value: 20 },
      { name: 'NO₂', value: 10 },
      { name: 'SO₂', value: 5 },
      { name: 'CO', value: 5 }
    ]
  };

  // Dashboard stats
  const stats = [
    { label: 'Cities Tracked', value: '256', icon: <FiMap />, color: 'bg-primary-500' },
    { label: 'Avg. AQI', value: '42', icon: <FiStar />, color: 'bg-success-500' },
    { label: 'Alerts Today', value: '15', icon: <FiAlertTriangle />, color: 'bg-danger-500' },
    { label: 'Active Users', value: '12.4K', icon: <FiUser />, color: 'bg-primary-400' }
  ];

  // COLORS for pie chart
  const COLORS = ['#1E90FF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="pt-20 pb-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="heading-md text-gray-900 dark:text-white">Your AQI Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor air quality trends and get insights about your tracked locations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="card p-4">
              <nav className="space-y-1">
                {[
                  { id: 'overview', label: 'Overview', icon: <FiHome /> },
                  { id: 'cities', label: 'Cities Tracked', icon: <FiMap /> },
                  { id: 'trends', label: 'AQI Trends', icon: <FiTrendingUp /> },
                  { id: 'profile', label: 'User Stats', icon: <FiUser /> }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center p-3 text-left rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-6 card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Your Favorite Locations
              </h3>
              <ul className="space-y-3">
                {[
                  { city: 'New York', aqi: 45, color: 'bg-success-500' },
                  { city: 'London', aqi: 38, color: 'bg-success-500' },
                  { city: 'San Francisco', aqi: 62, color: 'bg-yellow-500' }
                ].map((location, index) => (
                  <li key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <span className="font-medium text-gray-900 dark:text-white">{location.city}</span>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${location.color} mr-2`}></div>
                      <span className="text-gray-700 dark:text-gray-300">AQI {location.aqi}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="btn-secondary w-full mt-4 py-2 text-sm">
                Add Location
              </button>
            </div>
          </motion.div>

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3 space-y-8"
          >
            {/* Stats row */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="card p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-gray-600 dark:text-gray-400 text-sm">
                      {stat.label}
                    </div>
                    <div className={`${stat.color} p-2 rounded-lg text-white`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Charts section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly trend chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="card p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Monthly AQI Trends
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <FiFilter className="mr-1" /> Filter
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                          border: 'none' 
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="aqi" 
                        stroke="#1E90FF" 
                        strokeWidth={3} 
                        dot={{ r: 4 }} 
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* City comparison chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="card p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    City Comparison
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <FiFilter className="mr-1" /> Filter
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.cityComparison}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                          border: 'none' 
                        }}
                      />
                      <Bar dataKey="aqi" fill="#1E90FF" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Weekly trend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="card p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Weekly AQI Trends
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <FiFilter className="mr-1" /> Filter
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.weeklyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                          border: 'none' 
                        }}
                      />
                      <Bar dataKey="aqi" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Pollutant Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="card p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Pollutant Breakdown
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <FiFilter className="mr-1" /> Filter
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.pollutantBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.pollutantBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                          border: 'none' 
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Latest reports section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Latest AQI Reports
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
                  <thead className="bg-gray-50 dark:bg-dark-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        AQI
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Reported At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                    {[
                      { location: 'New York', aqi: 45, status: 'Good', time: '10:30 AM' },
                      { location: 'London', aqi: 38, status: 'Good', time: '3:45 PM' },
                      { location: 'Tokyo', aqi: 62, status: 'Moderate', time: '7:15 PM' },
                      { location: 'Beijing', aqi: 120, status: 'Unhealthy', time: '9:20 AM' },
                      { location: 'Los Angeles', aqi: 75, status: 'Moderate', time: '11:05 AM' }
                    ].map((report, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {report.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {report.aqi}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            report.status === 'Good' 
                              ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-200' 
                              : report.status === 'Moderate'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                              : 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-200'
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {report.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-center">
                <button className="btn-secondary py-2 px-4 text-sm">
                  View All Reports
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;