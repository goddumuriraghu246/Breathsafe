import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  const socialLinks = [
    { icon: <FaFacebook />, url: '#', label: 'Facebook' },
    { icon: <FaTwitter />, url: '#', label: 'Twitter' },
    { icon: <FaInstagram />, url: '#', label: 'Instagram' },
    { icon: <FaLinkedin />, url: '#', label: 'LinkedIn' },
  ];

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { label: 'Features', url: '#features' },
        { label: 'About', url: '#about' },
        { label: 'Get Started', url: '/live-aqi' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'FAQ', url: '/faq' },
        { label: 'Privacy Policy', url: '/privacy' },
        { label: 'Terms of Service', url: '/terms' },
      ],
    },
  ];

  return (
    <footer className="transition-colors duration-300 bg-white dark:bg-dark-800">
    <div className="px-4 py-12 mx-auto container-custom lg:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
        {/* Brand */}
        <div className="flex flex-col space-y-6">
          <Link to="/" className="inline-block mb-2 text-2xl font-bold text-primary-500">
            BreatheSafe
            <motion.span
              className="ml-1 text-3xl text-success-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              .
            </motion.span>
          </Link>
          <p className="text-gray-600 dark:text-gray-400">
            Get personalized health insights based on real-time air quality around you.
          </p>
          <div className="flex gap-3 mt-2">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                className="text-2xl text-gray-500 transition-colors duration-200 hover:text-primary-500"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
  
        {/* Footer Links */}
        {footerLinks.map((section, idx) => (
          <div key={idx} className="flex flex-col space-y-3">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link, linkIdx) => (
                <li key={linkIdx}>
                  <Link
                    to={link.url}
                    className="text-gray-600 transition-colors dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
  
        {/* Newsletter */}
        <div className="flex flex-col space-y-3">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Stay Updated</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Subscribe to our newsletter for the latest AQI updates and health tips.
          </p>
          <form className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-dark-600 dark:bg-dark-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 btn-primary sm:whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
  
      <div className="flex flex-col items-center justify-between gap-4 pt-6 mt-10 border-t border-gray-200 sm:flex-row dark:border-dark-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} BreatheSafe. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
          </span>
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 rounded-full dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  </footer>
  
  );
};

export default Footer;