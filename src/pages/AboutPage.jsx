import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiMapPin,
  FiAlertCircle,
  FiActivity,
  FiHeart,
  FiUsers,
  FiTarget,
  FiAward,
} from "react-icons/fi";
import FeatureCard from "../components/home/FeatureCard";

const AboutPage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Features data
  const features = [
    {
      icon: <FiMapPin className="w-8 h-8 text-blue-500" />,
      title: "Real-time AQI Monitoring",
      description:
        "Get accurate air quality data for your location, updated in real-time to keep you informed.",
    },
    {
      icon: <FiHeart className="w-8 h-8 text-pink-500" />,
      title: "Personalized Health Advice",
      description:
        "Receive tailored health recommendations based on the air quality and your personal health profile.",
    },
    {
      icon: <FiActivity className="w-8 h-8 text-green-500" />,
      title: "24-hour AQI Prediction",
      description:
        "Plan your day with confidence using our accurate machine learning powered AQI forecasts.",
    },
    {
      icon: <FiAlertCircle className="w-8 h-8 text-red-500" />,
      title: "Health Alerts",
      description:
        "Get immediate notifications when air quality poses a risk to your health in your area.",
    },
  ];

  // Team values
  const values = [
    {
      icon: <FiUsers className="w-8 h-8 text-purple-500" />,
      title: "Community First",
      description:
        "We prioritize the health and well-being of our community members above all else.",
    },
    {
      icon: <FiTarget className="w-8 h-8 text-indigo-500" />,
      title: "Data-Driven",
      description:
        "Our decisions and recommendations are based on accurate, real-time air quality data.",
    },
    {
      icon: <FiAward className="w-8 h-8 text-yellow-500" />,
      title: "Excellence",
      description:
        "We strive for excellence in everything we do, from data accuracy to user experience.",
    },
  ];

  return (
    <div className="pt-16">
  
      {/* Mission Section */}
      <section className="bg-white section dark:bg-dark-800">
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <h2 className="mb-6 text-gray-900 heading-md dark:text-white">
              Our Mission
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              We believe everyone has the right to breathe clean air.
              BreatheSafe provides accurate, real-time air quality data and
              personalized health insights to help you make informed decisions
              about your outdoor activities and take control of your respiratory
              health.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/live-aqi" className="btn-primary">
                Check Your Air Quality
              </Link>
              <Link to="/forecasting" className="btn-secondary">
                View AQI Forecast
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section bg-gray-50 dark:bg-dark-900">
        <div className="container-custom">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-gray-900 heading-md dark:text-white">
              Our Values
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
              These core values guide everything we do at BreatheSafe.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}>
            {values.map((value, index) => (
              <motion.div key={index} variants={itemVariants}>
                <div className="h-full p-6 card">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 mb-4 bg-primary-50 dark:bg-primary-900/30 rounded-xl">
                      {value.icon}
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
