import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FiHome,
  FiActivity,
  FiClock,
  FiSettings,
  FiUser,
  FiStar,
  FiAlertTriangle,
  FiMap,
  FiMenu,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  // Mock data for charts
  const chartData = {
    weeklyTrends: [
      { name: "Mon", aqi: 42 },
      { name: "Tue", aqi: 55 },
      { name: "Wed", aqi: 38 },
      { name: "Thu", aqi: 45 },
      { name: "Fri", aqi: 60 },
      { name: "Sat", aqi: 70 },
      { name: "Sun", aqi: 45 },
    ],
    pollutantBreakdown: [
      { name: "PM2.5", value: 35 },
      { name: "PM10", value: 25 },
      { name: "O₃", value: 20 },
      { name: "NO₂", value: 10 },
      { name: "SO₂", value: 5 },
      { name: "CO", value: 5 },
    ],
  };

  const stats = [
    {
      label: "Cities Tracked",
      value: "256",
      icon: <FiMap className="text-indigo-400" />,
    },
    {
      label: "Avg. AQI",
      value: "42",
      icon: <FiStar className="text-green-400" />,
    },
    {
      label: "Alerts Today",
      value: "15",
      icon: <FiAlertTriangle className="text-pink-400" />,
    },
    {
      label: "Active Users",
      value: "12.4K",
      icon: <FiUser className="text-blue-400" />,
    },
  ];

  const COLORS = [
    "#6366F1",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
  ];

  const getCardBg = (isDarkMode) =>
    isDarkMode ? "bg-[#23263A] text-white" : "bg-white text-gray-900";
  const getTooltipStyle = (isDarkMode) => ({
    background: isDarkMode ? "#23263A" : "#fff",
    color: isDarkMode ? "#fff" : "#23263A",
  });

  const sidebarNav = [
    {
      id: "overview",
      label: "Dashboard",
      icon: <FiHome className="w-6 h-6" />,
    },
    {
      id: "activity",
      label: "Activity",
      icon: <FiActivity className="w-6 h-6" />,
    },
    { id: "history", label: "History", icon: <FiClock className="w-6 h-6" /> },
    {
      id: "settings",
      label: "Settings",
      icon: <FiSettings className="w-6 h-6" />,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  className={`rounded-3xl shadow-lg p-6 flex flex-col gap-2 hover:shadow-xl transition-shadow ${getCardBg(
                    isDarkMode
                  )}`}
                  whileHover={{ y: -5 }}>
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl text-white text-2xl bg-white/10 backdrop-blur-sm mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Main Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Weekly AQI Trend */}
              <div
                className={`col-span-2 rounded-3xl p-6 shadow-lg ${getCardBg(
                  isDarkMode
                )}`}>
                <h2 className="font-semibold text-lg mb-4">Weekly AQI Trend</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData.weeklyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#23263A" />
                    <XAxis dataKey="name" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip contentStyle={getTooltipStyle(isDarkMode)} />
                    <Line
                      type="monotone"
                      dataKey="aqi"
                      stroke="#7C3AED"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#fff" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Pollutant Breakdown */}
              <div
                className={`rounded-3xl p-6 shadow-lg ${getCardBg(
                  isDarkMode
                )}`}>
                <h2 className="font-semibold text-lg mb-4">
                  Pollutant Breakdown
                </h2>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData.pollutantBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }>
                      {chartData.pollutantBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={getTooltipStyle(isDarkMode)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        );
      case "activity":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              className={`rounded-3xl p-6 shadow-lg ${getCardBg(isDarkMode)}`}>
              <h2 className="text-xl font-semibold mb-4">Weekly AQI Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#23263A" />
                  <XAxis dataKey="name" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip contentStyle={getTooltipStyle(isDarkMode)} />
                  <Line
                    type="monotone"
                    dataKey="aqi"
                    stroke="#7C3AED"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#fff" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div
              className={`rounded-3xl p-6 shadow-lg ${getCardBg(isDarkMode)}`}>
              <h2 className="text-xl font-semibold mb-4">
                Pollutant Breakdown
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.pollutantBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }>
                    {chartData.pollutantBreakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={getTooltipStyle(isDarkMode)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case "history":
        return (
          <div className={`rounded-3xl p-6 shadow-lg ${getCardBg(isDarkMode)}`}>
            <h2 className="text-xl font-semibold mb-6">AQI History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      City
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AQI
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-[#23263A] divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap">2024-06-01</td>
                    <td className="px-4 py-2 whitespace-nowrap">New York</td>
                    <td className="px-4 py-2 whitespace-nowrap">58</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">
                        Moderate
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap">2024-06-01</td>
                    <td className="px-4 py-2 whitespace-nowrap">Delhi</td>
                    <td className="px-4 py-2 whitespace-nowrap">180</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">
                        Unhealthy
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap">2024-06-01</td>
                    <td className="px-4 py-2 whitespace-nowrap">London</td>
                    <td className="px-4 py-2 whitespace-nowrap">42</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                        Good
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap">2024-06-01</td>
                    <td className="px-4 py-2 whitespace-nowrap">Beijing</td>
                    <td className="px-4 py-2 whitespace-nowrap">120</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-800 text-xs">
                        Unhealthy for Sensitive Groups
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className={`rounded-3xl p-6 shadow-lg ${getCardBg(isDarkMode)}`}>
            <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  className="bg-[#181A20] border border-[#23263A] rounded-lg px-4 py-2 focus:outline-none"
                  placeholder="Full Name"
                />
                <input
                  className="bg-[#181A20] border border-[#23263A] rounded-lg px-4 py-2 focus:outline-none"
                  placeholder="Location"
                />
                <input
                  className="bg-[#181A20] border border-[#23263A] rounded-lg px-4 py-2 focus:outline-none"
                  placeholder="Email"
                />
                <button
                  onClick={toggleTheme}
                  className="bg-[#181A20] border border-[#23263A] rounded-lg px-4 py-2">
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
              <div className="flex justify-end">
                <button className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
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
    <div
      className={`min-h-screen flex transition-colors duration-300 ${
        isDarkMode ? "bg-[#181A20] text-white" : "bg-gray-50 text-gray-900"
      }`}>
      {/* Sidebar for desktop/tablet */}
      <aside
        className={`hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:flex md:flex-col py-8 px-4 ${
          sidebarMinimized ? "w-20" : "w-64"
        } transition-all duration-300 ease-in-out ${
          isDarkMode ? "bg-[#1F2128]" : "bg-white border-r border-gray-200"
        }`}>
        <div className="flex items-center justify-between px-4 mb-10">
          {!sidebarMinimized && (
            <span className="font-bold text-lg text-primary-500">
              <Link to='/'>BreathSafe</Link>
            </span>
          )}
          <button
            onClick={() => setSidebarMinimized(!sidebarMinimized)}
            className={`transition-colors ${
              isDarkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-400 hover:text-gray-700"
            }`}
            aria-label="Toggle sidebar">
            <FiMenu size={20} />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-2">
          {sidebarNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center ${
                sidebarMinimized ? "justify-center" : "gap-4"
              } px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-[#23263A] text-white"
                  : "text-gray-400 hover:bg-[#23263A] hover:text-white"
              }`}>
              <span
                className={`flex items-center justify-center ${
                  sidebarMinimized
                    ? isDarkMode
                      ? "w-12 h-12 rounded-full bg-[#23263A] text-white"
                      : "w-12 h-12"
                    : ""
                }`}>
                {item.icon}
              </span>
              {!sidebarMinimized && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div
          className={`mt-auto px-2 pb-8 ${
            sidebarMinimized ? "flex justify-center" : ""
          }`}>
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#23263A] hover:text-white transition-colors ${
              sidebarMinimized ? "justify-center w-12 h-12 p-0" : "w-full"
            }`}
            aria-label="Toggle theme">
            {isDarkMode ? (
              <FiSun className="w-6 h-6" />
            ) : (
              <FiMoon className="w-6 h-6" />
            )}
            {!sidebarMinimized && (
              <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            )}
          </button>
        </div>
      </aside>
      {/* Sidebar Drawer for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed inset-0 z-50 flex md:hidden`}
            style={{
              background: isDarkMode
                ? "rgba(24,26,32,0.85)"
                : "rgba(0,0,0,0.3)",
            }}
            onClick={() => setSidebarOpen(false)}>
            <div
              className={`w-64 h-full flex flex-col py-8 px-4 ${
                isDarkMode
                  ? "bg-[#1F2128]"
                  : "bg-white border-r border-gray-200"
              }`}
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-4 mb-10">
                <span className="font-bold text-lg text-primary-500">
                  BreathSafe
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400 hover:text-white"
                  aria-label="Close sidebar">
                  <FiMenu size={20} />
                </button>
              </div>
              <nav className="flex-1 space-y-1 px-2">
                {sidebarNav.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? "bg-[#23263A] text-white"
                        : "text-gray-400 hover:bg-[#23263A] hover:text-white"
                    }`}>
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
              <div className="mt-auto px-2 pb-8">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#23263A] hover:text-white transition-colors">
                  {isDarkMode ? (
                    <FiSun className="w-6 h-6" />
                  ) : (
                    <FiMoon className="w-6 h-6" />
                  )}
                  <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      {/* Main Content */}
      <main
        className={`flex-1 px-2 sm:px-4 md:px-10 py-8 min-h-screen ml-0 ${
          sidebarMinimized ? "md:ml-20" : "md:ml-64"
        } transition-all duration-300`}>
        {/* Topbar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#23263A]"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar">
              <FiMenu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p
                className={`text-sm mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                Here's your analytic details
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-full border-2 ${
                isDarkMode
                  ? "border-primary-500 bg-[#23263A] text-primary-400"
                  : "border-primary-500 bg-white text-primary-600"
              } shadow-sm hover:shadow-md transition-all`}>
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="avatar"
                className="w-8 h-8 rounded-full border-2 border-primary-400"
              />
              <span className="hidden md:inline text-sm font-semibold tracking-wide">
                Admin
              </span>
              <FiUser className="w-5 h-5" />
            </div>
          </div>
        </div>
        {/* Content Area */}
        <div className="space-y-8">{renderContent()}</div>
      </main>
    </div>
  );
};

export default DashboardPage;
