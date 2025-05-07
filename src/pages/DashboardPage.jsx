import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import { 
  FiHome, FiActivity, FiClock, FiSettings, FiUser, FiStar, FiAlertTriangle, 
  FiMap, FiMenu, FiSun, FiMoon, FiEdit2, FiMapPin, FiMail
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();
  const [sidebarMinimized, setSidebarMinimized] = useState(false);

  // Mock data for charts
  const chartData = {
    weeklyTrends: [
      { name: 'Mon', aqi: 42 },
      { name: 'Tue', aqi: 55 },
      { name: 'Wed', aqi: 38 },
      { name: 'Thu', aqi: 45 },
      { name: 'Fri', aqi: 60 },
      { name: 'Sat', aqi: 70 },
      { name: 'Sun', aqi: 45 }
    ],
    pollutantBreakdown: [
      { name: 'PM2.5', value: 35 },
      { name: 'PM10', value: 25 },
      { name: 'O₃', value: 20 },
      { name: 'NO₂', value: 10 },
      { name: 'SO₂', value: 5 },
      { name: 'CO', value: 5 }
    ],
    latestReports: [
      { city: 'New York', aqi: 45, time: '10:30 AM', status: 'Good' },
      { city: 'London', aqi: 38, time: '10:15 AM', status: 'Good' },
      { city: 'Tokyo', aqi: 62, time: '10:00 AM', status: 'Moderate' },
      { city: 'Delhi', aqi: 145, time: '9:45 AM', status: 'Unhealthy' },
      { city: 'Paris', aqi: 55, time: '9:30 AM', status: 'Moderate' },
      { city: 'Berlin', aqi: 42, time: '9:15 AM', status: 'Good' }
    ]
  };

  const stats = [
    { label: 'Cities Tracked', value: '256', icon: <FiMap className="text-indigo-400" />, color: 'bg-gradient-to-r from-purple-600 to-indigo-600' },
    { label: 'Avg. AQI', value: '42', icon: <FiStar className="text-green-400" />, color: 'bg-gradient-to-r from-green-500 to-teal-500' },
    { label: 'Alerts Today', value: '15', icon: <FiAlertTriangle className="text-pink-400" />, color: 'bg-gradient-to-r from-pink-500 to-red-500' },
    { label: 'Active Users', value: '12.4K', icon: <FiUser className="text-blue-400" />, color: 'bg-gradient-to-r from-blue-500 to-cyan-500' }
  ];

  const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const getCardBg = (isDarkMode) => isDarkMode ? 'bg-[#23263A] text-white' : 'bg-white text-gray-900';
  const getTableBg = (isDarkMode) => isDarkMode ? 'bg-[#23263A] text-white' : 'bg-white text-gray-900';
  const getTableRowHover = (isDarkMode) => isDarkMode ? 'hover:bg-[#1F2128]' : 'hover:bg-gray-100';
  const getTooltipStyle = (isDarkMode) => ({ background: isDarkMode ? '#23263A' : '#fff', color: isDarkMode ? '#fff' : '#23263A', border: 'none', borderRadius: '8px' });

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  className={`rounded-3xl shadow-lg p-6 flex flex-col gap-2 hover:shadow-xl transition-shadow ${getCardBg(isDarkMode)}`}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl text-white text-2xl bg-white/10 backdrop-blur-sm mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Main Graphs and Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Weekly AQI Trend */}
              <div className={`col-span-2 rounded-3xl p-6 shadow-lg ${getCardBg(isDarkMode)}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-lg">Weekly AQI Trend</span>
                  <span className="text-xs text-gray-400">EPA Scale</span>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.weeklyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#23263A" />
                      <XAxis dataKey="name" stroke="#aaa" />
                      <YAxis stroke="#aaa" />
                      <Tooltip contentStyle={getTooltipStyle(isDarkMode)} />
                      <Line type="monotone" dataKey="aqi" stroke="#7C3AED" strokeWidth={3} dot={{ r: 4, fill: '#fff' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* Pollutant Breakdown Pie */}
              <div className={`rounded-3xl p-6 shadow-lg flex flex-col ${getCardBg(isDarkMode)}`}>
                <span className="font-semibold text-lg mb-4">Pollutant Breakdown</span>
                <div className="flex-1 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={chartData.pollutantBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.pollutantBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={getTooltipStyle(isDarkMode)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent AQI Reports Table */}
            <div className={`rounded-3xl p-6 shadow-lg ${getTableBg(isDarkMode)}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-lg">Recent AQI Reports</span>
                <select className="bg-[#181A20] text-gray-400 px-3 py-1 rounded-lg text-sm">
                  <option>Last 24h</option>
                  <option>Last 7d</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-gray-400">
                      <th className="py-3 px-4 text-left">City</th>
                      <th className="py-3 px-4 text-left">AQI</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.latestReports.map((report, idx) => (
                      <tr key={idx} className={`border-b border-[#23263A] last:border-0 transition-colors ${getTableRowHover(isDarkMode)}`}>
                        <td className="py-3 px-4 font-medium text-white">{report.city}</td>
                        <td className="py-3 px-4">{report.aqi}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            report.status === 'Good' ? 'bg-green-600 text-white' :
                            report.status === 'Moderate' ? 'bg-yellow-600 text-white' :
                            'bg-red-600 text-white'
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-400">{report.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );

      case 'activity':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`rounded-3xl p-6 shadow-lg ${getCardBg(isDarkMode)}`}>
              <h2 className="text-xl font-semibold mb-4">Weekly AQI Trend</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.weeklyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#23263A" />
                    <XAxis dataKey="name" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip contentStyle={getTooltipStyle(isDarkMode)} />
                    <Line type="monotone" dataKey="aqi" stroke="#7C3AED" strokeWidth={3} dot={{ r: 4, fill: '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className={`rounded-3xl p-6 shadow-lg ${getCardBg(isDarkMode)}`}>
              <h2 className="text-xl font-semibold mb-4">Pollutant Breakdown</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.pollutantBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.pollutantBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={getTooltipStyle(isDarkMode)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className={`rounded-3xl p-6 shadow-lg ${getTableBg(isDarkMode)}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">AQI History</h2>
              <div className="flex gap-4">
                <select className="bg-[#181A20] text-gray-400 px-3 py-2 rounded-lg text-sm">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
                <button className="bg-[#181A20] text-gray-400 px-3 py-2 rounded-lg text-sm hover:bg-[#1F2128] transition-colors">
                  Export Data
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-gray-400">
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Location</th>
                    <th className="py-3 px-4 text-left">AQI</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">PM2.5</th>
                    <th className="py-3 px-4 text-left">PM10</th>
                    <th className="py-3 px-4 text-left">O₃</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.latestReports.map((report, idx) => (
                    <tr key={idx} className={`border-b border-[#23263A] last:border-0 transition-colors ${getTableRowHover(isDarkMode)}`}>
                      <td className="py-3 px-4 text-gray-400">2024-03-{String(idx + 1).padStart(2, '0')}</td>
                      <td className="py-3 px-4 font-medium text-white">{report.city}</td>
                      <td className="py-3 px-4">{report.aqi}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          report.status === 'Good' ? 'bg-green-600 text-white' :
                          report.status === 'Moderate' ? 'bg-yellow-600 text-white' :
                          'bg-red-600 text-white'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">25</td>
                      <td className="py-3 px-4 text-gray-400">35</td>
                      <td className="py-3 px-4 text-gray-400">42</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className={`rounded-3xl p-6 shadow-lg ${getCardBg(isDarkMode)}`}>
            <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 bg-[#181A20] border border-[#23263A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMapPin className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 bg-[#181A20] border border-[#23263A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="New York, USA"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-500" />
                    </div>
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-2 bg-[#181A20] border border-[#23263A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Theme</label>
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#181A20] border border-[#23263A] rounded-lg text-white hover:bg-[#1F2128] transition-colors"
                  >
                    {isDarkMode ? (
                      <>
                        <FiSun className="text-yellow-500" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <FiMoon className="text-blue-500" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDarkMode ? 'bg-[#181A20] text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <aside className={`h-screen flex flex-col py-8 px-4 ${sidebarMinimized ? 'w-20' : 'w-20 md:w-64'} transition-all duration-300 ${isDarkMode ? 'bg-[#1F2128]' : 'bg-white border-r border-gray-200'}`}>
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="font-bold text-lg tracking-wide text-primary-500">BreathSafe</Link>
          <button className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FiMenu className="w-6 h-6" />
          </button>
          <button className="ml-2" onClick={() => setSidebarMinimized((v) => !v)}>
            <FiMenu className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 space-y-2">
          {[
            { id: 'overview', label: 'Dashboard', icon: <FiHome className="text-indigo-400" /> },
            { id: 'activity', label: 'Activity', icon: <FiActivity className="text-green-400" /> },
            { id: 'history', label: 'History', icon: <FiClock className="text-yellow-400" /> },
            { id: 'settings', label: 'Settings', icon: <FiSettings className="text-pink-400" /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors font-medium text-sm ${
                activeTab === item.id
                  ? (isDarkMode ? 'bg-[#23263A] text-white shadow-md' : 'bg-gray-100 text-gray-900 shadow-md')
                  : (isDarkMode ? 'text-gray-400 hover:bg-[#23263A] hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900')
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {!sidebarMinimized && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-400 hover:bg-[#23263A] hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            {isDarkMode ? <FiSun className="w-5 h-5 text-yellow-400" /> : <FiMoon className="w-5 h-5 text-blue-500" />}
            {!sidebarMinimized && <span>Toggle Theme</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 px-4 md:px-10 py-8 min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#181A20]' : 'bg-gray-50'}`}>
        {/* Topbar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Here's your analytic details</p>
          </div>
          <div className="flex items-center gap-4">
            <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? 'bg-[#23263A] text-gray-300 hover:text-white' : 'bg-gray-100 text-gray-700 hover:text-gray-900'}`}>Filter by</button>
            <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? 'bg-[#23263A] text-gray-300 hover:text-white' : 'bg-gray-100 text-gray-700 hover:text-gray-900'}`}>Exports</button>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDarkMode ? 'bg-[#23263A]' : 'bg-gray-100'}`}>
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="w-8 h-8 rounded-full" />
              <span className="hidden md:inline text-sm font-medium">Admin</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;