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
  FiDownload,
  FiAlertTriangle,
  FiCloud,
  FiMenu,
  FiSun,
  FiMoon,
  FiLogOut,
  FiTrash2
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const SidebarLogo = (
    <Link
      to="/"
      className="flex items-center gap-2 text-2xl font-bold text-primary-600 dark:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
      tabIndex={0}
      style={{ pointerEvents: "auto", zIndex: 50 }}
    >
      BreatheSafe
    </Link>
  );

  const handleDelete = (id) => {
    setHistory(prev => prev.filter(record => record.id !== id));
  };



  const stats = [
    {
      label: "Active Users",
      value: "123", // Replace with your dynamic data
      icon: <FiUser className="text-green-400" />,
    },
    {
      label: "Alert Notifications",
      value: "12", // Replace with your dynamic data
      icon: <FiAlertTriangle className="text-yellow-500" />,
    },
    {
      label: "AQI Searches",
      value: "57", // Replace with your AQI search count
      icon: <FiCloud className="text-blue-400" />,
    },
    {
      label: "Downloads",
      value: "8", // Replace with your downloads count
      icon: <FiDownload className="text-purple-400" />,
    },
  ];


  const [history, setHistory] = useState([
    { id: 1, date: "2025-05-19", city: "Paris", aqi: 42, status: "Good" },
    { id: 2, date: "2025-05-18", city: "London", aqi: 86, status: "Moderate" },
    { id: 3, date: "2025-05-17", city: "Delhi", aqi: 150, status: "Unhealthy" },
  ]);

  function getStatusBadgeClasses(status) {
    switch (status) {
      case "Good":
        return "bg-green-100 text-green-800";
      case "Moderate":
        return "bg-amber-100 text-amber-900";
      case "Unhealthy":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }


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
    backgroundColor: isDarkMode ? "#23263A" : "#fff", // Use backgroundColor for Recharts
    color: isDarkMode ? "#fff" : "#23263A",
    border: isDarkMode ? "1px solid #444" : "1px solid #ddd",
    borderRadius: "8px",
    fontWeight: 500,
    boxShadow: isDarkMode
      ? "0 4px 16px 0 rgba(0,0,0,0.32)"
      : "0 4px 16px 0 rgba(0,0,0,0.08)",
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
            <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  className={`rounded-3xl shadow-lg p-6 flex flex-col gap-2 hover:shadow-xl transition-shadow ${getCardBg(
                    isDarkMode
                  )}`}
                  whileHover={{ y: -5 }}>
                  <div className="flex items-center justify-center w-12 h-12 mb-2 text-2xl text-white rounded-2xl bg-white/10 backdrop-blur-sm">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Main Graphs */}
            <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
              {/* Weekly AQI Trend */}
              <div
                className={`col-span-2 rounded-3xl p-6 shadow-lg ${getCardBg(
                  isDarkMode
                )}`}>
                <h2 className="mb-4 text-lg font-semibold">Weekly AQI Trend</h2>
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
                <h2 className="mb-4 text-lg font-semibold">
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div
              className={`rounded-3xl p-6 shadow-lg ${getCardBg(isDarkMode)}`}>
              <h2 className="mb-4 text-xl font-semibold">Weekly AQI Trend</h2>
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
              <h2 className="mb-4 text-xl font-semibold">
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
            <h2 className="mb-6 text-xl font-semibold">AQI History</h2>
            <div className="overflow-x-auto">
              {!history.length ? (
                <div>No records found.</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-xs font-bold tracking-wide text-left text-gray-600 dark:text-gray-300 uppercase bg-gray-50 dark:bg-[#23263A]">
                        Date
                      </th>
                      <th className="px-4 py-3 text-xs font-bold tracking-wide text-left text-gray-600 dark:text-gray-300 uppercase bg-gray-50 dark:bg-[#23263A]">
                        City
                      </th>
                      <th className="px-4 py-3 text-xs font-bold tracking-wide text-left text-gray-600 dark:text-gray-300 uppercase bg-gray-50 dark:bg-[#23263A]">
                        AQI
                      </th>
                      <th className="px-4 py-3 text-xs font-bold tracking-wide text-left text-gray-600 dark:text-gray-300 uppercase bg-gray-50 dark:bg-[#23263A]">
                        Status
                      </th>
                      <th className="px-4 py-3 text-xs font-bold tracking-wide text-left text-gray-600 dark:text-gray-300 uppercase bg-gray-50 dark:bg-[#23263A]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(record => (
                      <tr
                        key={record.id}
                        className="transition hover:bg-primary-50 dark:hover:bg-primary-900/40"
                      >
                        <td className="px-4 py-3 font-medium whitespace-nowrap">{record.date}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{record.city}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{record.aqi}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClasses(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => handleDelete(record.id)}
                            className={`
                                  flex items-center justify-center transition rounded-full w-9 h-9
                                  bg-transparent
                                  hover:bg-red-100 dark:hover:bg-red-900
                                  hover:scale-20 hover:shadow-lg focus:outline-none group
                                `}
                            title="Delete"
                          >
                            <FiTrash2
                              className={`
                                      w-5 h-5 transition-colors duration-100
                                      ${isDarkMode
                                       ? "text-red-400 group-hover:text-red-200"
                                  : "text-red-600 group-hover:text-red-800"
                                }
                              `}
                            />
                          </button>


                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
      case "settings":
        return (
          <div className={`rounded-3xl p-6 shadow-lg ${getCardBg(isDarkMode)}`}>
            <h2 className="mb-6 text-xl font-semibold">Profile Settings</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <input
                    className="w-full px-4 py-2 text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-lg dark:bg-dark-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Location
                  </label>
                  <input
                    className="w-full px-4 py-2 text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-lg dark:bg-dark-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your location"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    className="w-full px-4 py-2 text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-lg dark:bg-dark-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-lg dark:bg-dark-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter new password"
                    autoComplete="new-password"
                  />

                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600">
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

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully!');
  };

  const handleSave = async (fields) => {
    const update = {};
    Object.keys(fields).forEach(key => {
      if (fields[key]) update[key] = fields[key];
    });
    if (Object.keys(update).length) {
      await fetch('/api/user/settings', { method: 'PATCH', body: JSON.stringify(update) });
      toast.success('Settings updated!');
    }
  };

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 ${isDarkMode ? "bg-[#1F2128] text-white" : "bg-gray-50 text-gray-900"
        }`}>
      {/* Sidebar for desktop/tablet */}
      <aside
        className={`hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:flex md:flex-col py-8 px-4 ${sidebarMinimized ? "w-20" : "w-64"
          } transition-all duration-300 ease-in-out ${isDarkMode ? "bg-[#23263A]" : "bg-white border-r border-gray-200"
          }`}>
        <div className="flex items-center justify-between px-4 mb-10">
          {!sidebarMinimized && (
            <span className="text-lg font-bold text-primary-500">
              <Link to="/">BreatheSafe</Link>
            </span>
          )}
          <button
            onClick={() => setSidebarMinimized(!sidebarMinimized)}
            className={`transition-colors ${isDarkMode
              ? "text-gray-400 hover:text-white"
              : "text-gray-400 hover:text-gray-700"
              }`}
            aria-label="Toggle sidebar">
            <FiMenu size={20} />
          </button>
        </div>
        <nav className="flex-1 px-2 mt-10 space-y-4 ">
          {sidebarNav.map((item) => (
            <button
              key={item.id}
              className={`
                    flex items-center gap-2 px-3 py-2 rounded transition
                    ${activeTab === item.id
                  ? isDarkMode
                    ? "text-primary-400 bg-[#23263A]" // dark: colored text + subtle bg
                    : "text-primary-600 bg-transparent" // light: colored text, NO bg
                  : isDarkMode
                    ? "text-gray-300"
                    : "text-gray-600"
                }
                    hover:text-primary-500
                  `}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              {!sidebarMinimized && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div
          className={`mt-auto px-2 pb-8 ${sidebarMinimized ? "flex justify-center" : ""
            }`}
        >
          <button
            className={`
            flex items-center gap-2 p-2 rounded-full transition
            focus:outline-none
            ${isDarkMode
                ? "text-gray-300 hover:text-red-500"
                : "text-gray-600 hover:text-red-500"
              }
          `}
            onClick={handleLogout}
            aria-label="Logout"
          >
            <FiLogOut className="w-6 h-6" />
            {!sidebarMinimized && (
              <span className="text-base font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>
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
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className={`w-64 h-full flex flex-col py-8 px-4 ${isDarkMode
                ? "bg-[#1F2128]"
                : "bg-white border-r border-gray-200"
                }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 mb-10">
                {/* Updated: Logo is now a link */}
                <Link
                  to="/"
                  className="text-lg font-bold text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  tabIndex={0}
                  style={{ pointerEvents: "auto" }}
                >
                  BreatheSafe
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400 hover:text-white"
                  aria-label="Close sidebar"
                >
                  <FiMenu size={20} />
                </button>
              </div>
              <nav className="flex-1 px-2 space-y-1">
                {sidebarNav.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
                      ? "bg-[#23263A] text-white"
                      : "text-gray-400 hover:bg-[#23263A] hover:text-white"
                      }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
              <div className="px-2 pb-8 mt-auto">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#23263A] hover:text-white transition-colors"
                >
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
        className={`flex-1 px-2 sm:px-4 md:px-10 py-8 min-h-screen ml-0 ${sidebarMinimized ? "md:ml-20" : "md:ml-64"
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
                className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                Here's your analytic details
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-full border-2 ${isDarkMode
                ? "border-primary-500 bg-[#23263A] text-primary-400"
                : "border-primary-500 bg-white text-primary-600"
                } shadow-sm hover:shadow-md transition-all`}>

              <span className="hidden text-sm font-semibold tracking-wide md:inline">
                {user?.fullName || 'User'}
              </span>
            </div>
            <button
              className="p-2 transition rounded-full hover:bg-primary-100 dark:hover:bg-primary-900 hover:scale-110 hover:shadow-lg"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
          </div>
        </div>
        {/* Content Area */}
        <div className="space-y-8">{renderContent()}</div>
      </main>
    </div>
  );
};

export default DashboardPage;
