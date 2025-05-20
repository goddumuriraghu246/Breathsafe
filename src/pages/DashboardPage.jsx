import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiSun, FiMoon, FiHome, FiUser, FiSettings } from "react-icons/fi";

const sidebarNav = [
  { id: "home", label: "Home", icon: <FiHome />, path: "/" },
  { id: "profile", label: "Profile", icon: <FiUser />, path: "/profile" },
  { id: "settings", label: "Settings", icon: <FiSettings />, path: "/settings" },
];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Desktop sidebar styles
  const desktopSidebarClass = `hidden md:flex flex-col w-64 h-screen py-8 px-4 ${
    isDarkMode ? "bg-[#1F2128]" : "bg-white border-r border-gray-200"
  }`;

  // Mobile sidebar overlay styles
  const mobileOverlayStyle = {
    background: isDarkMode ? "rgba(24,26,32,0.85)" : "rgba(0,0,0,0.3)",
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="flex items-center md:hidden p-4 bg-primary-500 text-white">
        <button
          onClick={() => setSidebarOpen(true)}
          className="mr-4"
          aria-label="Open sidebar"
        >
          <FiMenu size={24} />
        </button>
        <span className="font-bold text-lg">BreatheSafe</span>
      </div>

      {/* Desktop Sidebar */}
      <aside className={desktopSidebarClass}>
        <div className="flex items-center justify-between px-4 mb-10">
          <Link
            to="/"
            className="text-lg font-bold text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            tabIndex={0}
          >
            BreatheSafe
          </Link>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {sidebarNav.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                navigate(item.path);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
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
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex md:hidden"
            style={mobileOverlayStyle}
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className={`w-64 h-full flex flex-col py-8 px-4 ${
                isDarkMode ? "bg-[#1F2128]" : "bg-white border-r border-gray-200"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 mb-10">
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
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
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
    </>
  );
}
