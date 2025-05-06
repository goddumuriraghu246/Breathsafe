import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiX, FiUser } from 'react-icons/fi';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      if (formData.email === 'user@example.com' && formData.password === 'password') {
        window.location.href = '/dashboard';
      } else {
        setError('Invalid email or password. Please try again.');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen pt-20 pb-10 duration-300 trnsition-colors bg-gradient-to-tr from-primary-100 via-blue-100 to-blue-200 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <div className="px-4 container-custom">
        <div className="max-w-md mx-auto">
          <motion.div
            className="relative p-8 border border-gray-200 shadow-2xl bg-white/70 dark:bg-dark-800/80 backdrop-blur-lg rounded-3xl sm:p-10 dark:border-dark-700"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Close Button */}
            <button
              type="button"
              className="absolute text-gray-400 top-4 right-4 hover:text-primary-500 dark:hover:text-white focus:outline-none"
              aria-label="Close"
              onClick={() => navigate(-1)}
            >
              <FiX className="w-6 h-6" />
            </button>

            {/* Logo/Icon */}
            <div className="flex justify-center mb-4">
              <span className="p-3 rounded-full shadow-md bg-primary-100 text-primary-500 dark:bg-dark-700 dark:text-primary-400">
                <FiUser className="w-8 h-8" />
              </span>
            </div>

            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome Back</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to your <span className="font-semibold text-primary-500">BreatheSafe</span> account
              </p>
            </div>

            {error && (
              <motion.div
                className="p-4 mb-6 border rounded-lg bg-danger-50 dark:bg-danger-900/30 border-danger-200 dark:border-danger-800 text-danger-800 dark:text-danger-200"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiMail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 text-gray-900 transition border border-gray-300 rounded-xl dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-600 bg-white/80 dark:bg-dark-700 dark:text-white"
                    placeholder="Your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiLock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 text-gray-900 transition border border-gray-300 rounded-xl dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-600 bg-white/80 dark:bg-dark-700 dark:text-white"
                    placeholder="Your password"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 focus:outline-none"
                    >
                      {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="w-4 h-4 border-gray-300 rounded text-primary-500 focus:ring-primary-400 dark:border-dark-600"
                  />
                  <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm font-medium text-primary-500 hover:text-primary-600">
                  Forgot your password?
                </a>
              </div>

              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 6px 24px 0 rgba(80, 72, 229, 0.2)" }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Sign in
                    <FiArrowRight className="ml-2" />
                  </span>
                )}
              </motion.button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-primary-500 hover:text-primary-600">
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
