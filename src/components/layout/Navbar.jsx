import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled
      ? 'bg-white/90 dark:bg-dark-900/90 backdrop-blur-md shadow-sm'
      : 'bg-transparent'
  }`;

  const linkClasses = 'font-medium transition-colors duration-200 hover:text-primary-500';
  const activeLinkClasses = 'text-primary-500 font-semibold';

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/live-aqi', label: 'Live AQI Tracker' },
    { path: '/forecasting', label: 'AQI Forecasting' },
    { path: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <nav className={navbarClasses}>
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-500">
            <span className="flex items-center">
              BreatheSafe
              <motion.span
                className="ml-1 text-success-500 text-3xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
              >
                .
              </motion.span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`${linkClasses} ${
                    location.pathname === path ? activeLinkClasses : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </button>
              
              <Link to="/login" className="btn-secondary py-2 px-4">
                Login
              </Link>
              
              <Link to="/signup" className="btn-primary py-2 px-4">
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
            
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}
        initial={false}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container-custom py-4 pb-6 bg-white dark:bg-dark-800 shadow-lg rounded-b-lg">
          <div className="flex flex-col space-y-4">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`${linkClasses} py-2 ${
                  location.pathname === path ? activeLinkClasses : 'text-gray-700 dark:text-gray-300'
                }`}
                onClick={closeMenu}
              >
                {label}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200 dark:border-dark-700">
              <Link
                to="/login"
                className="btn-secondary w-full text-center py-2"
                onClick={closeMenu}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="btn-primary w-full text-center py-2"
                onClick={closeMenu}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;