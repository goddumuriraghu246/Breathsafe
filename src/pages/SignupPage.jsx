import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiX, FiCheck, FiMapPin } from 'react-icons/fi';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Form, 2: Success
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validateForm = () => {
    if (formData.name.length < 2) {
      setError("Please enter your name.");
      return false;
    }
    if (!formData.email.includes('@')) {
      setError("Please enter a valid email.");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setError(null);

    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false);
      setStep(2); // Show success
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen pt-24 pb-10 transition-colors duration-300 bg-gradient-to-tr from-primary-100 via-blue-100 to-blue-200 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <div className="px-4 container-custom">
        <div className="max-w-md mx-auto">
          {step === 1 ? (
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
                <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Create Your Account</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Join <span className="font-semibold text-primary-500">BreatheSafe</span> for personalized air quality insights
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
                  <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FiUser className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-10 text-gray-900 transition border border-gray-300 rounded-xl dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-600 bg-white/80 dark:bg-dark-700 dark:text-white"
                      placeholder="Your name"
                    />
                  </div>
                </div>

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
                  <label htmlFor="location" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    City Location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FiMapPin className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      autoComplete="off"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-10 text-gray-900 transition border border-gray-300 rounded-xl dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-600 bg-white/80 dark:bg-dark-700 dark:text-white"
                      placeholder="Your city"
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
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-10 text-gray-900 transition border border-gray-300 rounded-xl dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-600 bg-white/80 dark:bg-dark-700 dark:text-white"
                      placeholder="Create a password"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 focus:outline-none"
                        tabIndex={-1}
                      >
                        {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Must be at least 8 characters long
                  </p>
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
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Sign up
                      <FiArrowRight className="ml-2" />
                    </span>
                  )}
                </motion.button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-primary-500 hover:text-primary-600">
                    Sign in
                  </Link>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="relative flex flex-col items-center p-8 border border-gray-200 shadow-2xl bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-3xl sm:p-10 dark:border-dark-700"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="p-3 mb-4 rounded-full bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-400">
                <FiCheck className="w-8 h-8" />
              </span>
              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Account Created!</h2>
              <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
                Welcome to <span className="font-semibold text-primary-500">BreatheSafe</span>.<br />
                You can now sign in to your account.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all shadow-lg rounded-xl bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600"
              >
                Go to Login <FiArrowRight />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
