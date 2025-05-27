import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const socialLinks = [
    {
      icon: <FaFacebook />,
      url: "#",
      label: "Facebook",
      color: "text-blue-600",
    },
    { icon: <FaTwitter />, url: "#", label: "Twitter", color: "text-blue-400" },
    {
      icon: <FaInstagram />,
      url: "#",
      label: "Instagram",
      color: "text-purple-500",
    },
    {
      icon: <FaLinkedin />,
      url: "#",
      label: "LinkedIn",
      color: "text-blue-700",
    },
  ];

  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", url: "#" },
        { label: "About", url: "#" },
        { label: "Get Started", url: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "FAQ", url: "#" },
        { label: "Privacy Policy", url: "#" },
        { label: "Terms of Service", url: "#" },
      ],
    },
  ];

  return (
    <footer className="transition-colors duration-300 bg-white dark:bg-dark-800">
      <div className="px-6 py-12 mx-auto space-y-12 container-custom lg:py-16 lg:px-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {/* Brand Section */}
          <div className="flex flex-col space-y-6">
            <Link
              to="/"
              className="inline-block text-3xl font-bold text-primary-500">
              BreatheSafe
              <motion.span
                className="ml-1 text-4xl text-success-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}>
                .
              </motion.span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400">
              Get personalized health insights based on real-time air quality
              around you.
            </p>
            <div className="flex gap-4 mt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className={`p-3 text-2xl transition transform bg-gray-100 rounded-full hover:scale-110 hover:bg-opacity-10 ${social.color} dark:bg-dark-700 dark:hover:bg-opacity-10`}
                  aria-label={social.label}>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, idx) => (
            <div key={idx} className="flex flex-col space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      to={link.url}
                      className="text-gray-600 transition-colors duration-200 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Stay Updated
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Subscribe to our newsletter for the latest AQI updates and health
              tips.
            </p>
            <form className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-dark-600 dark:bg-dark-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 text-white rounded-lg btn-primary sm:whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 pt-6 border-t border-gray-200 sm:flex-row dark:border-dark-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} BreatheSafe. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isDarkMode ? "Dark Mode" : "Light Mode"}
            </span>
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 transition transform rounded-full dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:scale-110"
              aria-label="Toggle theme">
              {isDarkMode ? (
                <FiSun className="w-5 h-5" />
              ) : (
                <FiMoon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
