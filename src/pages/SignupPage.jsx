import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiMapPin, FiPhone } from "react-icons/fi"; // Added FiPhone
import { toast } from "react-toastify";
import Modal from "../components/common/Modal";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",        // <-- Added phone here
    location: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signup } = useAuth();
  const isModal = location.state?.background;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      toast.success('Account created successfully! Please log in.');
      navigate('/')
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginClick = () => {
    navigate("/login", {
      state: { background: location.state?.background || location },
    });
  };

  const content = (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h2 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
          Create your account
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Join BreatheSafe today
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label
            htmlFor="signup-fullName"
            className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiUser className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              id="signup-fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="block w-full py-2 pl-10 pr-3 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-dark-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="signup-email"
            className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiMail className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="email"
              id="signup-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-full py-2 pl-10 pr-3 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-dark-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="signup-password"
            className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiLock className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="signup-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="block w-full py-2 pl-10 pr-10 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-dark-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Create a password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPassword ? (
                <FiEyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <FiEye className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="signup-phone"
            className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiPhone className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="tel"
              id="signup-phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="block w-full py-2 pl-10 pr-3 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-dark-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Location */}
        <div className="pb-5">
          <label
            htmlFor="signup-location"
            className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Location
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiMapPin className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              id="signup-location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="block w-full py-2 pl-10 pr-3 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-dark-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your location"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg shadow-sm bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>

        {/* Sign In Link */}
        <div className="text-sm text-center">
          <span className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
          </span>
          <button
            type="button"
            onClick={handleLoginClick}
            className="font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );

  if (isModal) {
    return <Modal isOpen={true}>{content}</Modal>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-dark-900">
      {content}
    </div>
  );
};

export default SignupPage;
