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
      icon: <FiMapPin className="h-8 w-8 text-blue-500" />,
      title: "Real-time AQI Monitoring",
      description:
        "Get accurate air quality data for your location, updated in real-time to keep you informed.",
    },
    {
      icon: <FiHeart className="h-8 w-8 text-pink-500" />,
      title: "Personalized Health Advice",
      description:
        "Receive tailored health recommendations based on the air quality and your personal health profile.",
    },
    {
      icon: <FiActivity className="h-8 w-8 text-green-500" />,
      title: "24-hour AQI Prediction",
      description:
        "Plan your day with confidence using our accurate machine learning powered AQI forecasts.",
    },
    {
      icon: <FiAlertCircle className="h-8 w-8 text-red-500" />,
      title: "Health Alerts",
      description:
        "Get immediate notifications when air quality poses a risk to your health in your area.",
    },
  ];

  // Team values
  const values = [
    {
      icon: <FiUsers className="h-8 w-8 text-purple-500" />,
      title: "Community First",
      description:
        "We prioritize the health and well-being of our community members above all else.",
    },
    {
      icon: <FiTarget className="h-8 w-8 text-indigo-500" />,
      title: "Data-Driven",
      description:
        "Our decisions and recommendations are based on accurate, real-time air quality data.",
    },
    {
      icon: <FiAward className="h-8 w-8 text-yellow-500" />,
      title: "Excellence",
      description:
        "We strive for excellence in everything we do, from data accuracy to user experience.",
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-white to-gray-50 dark:from-dark-900 dark:to-dark-800">
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>
            <h1 className="heading-lg mb-6 text-gray-900 dark:text-white">
              About BreatheSafe
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              We're on a mission to make air quality information accessible to
              everyone, helping communities make informed decisions about their
              health and environment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section bg-white dark:bg-dark-800">
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <h2 className="heading-md mb-6 text-gray-900 dark:text-white">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              We believe everyone has the right to breathe clean air.
              BreatheSafe provides accurate, real-time air quality data and
              personalized health insights to help you make informed decisions
              about your outdoor activities and take control of your respiratory
              health.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
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
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}>
            <h2 className="heading-md text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              These core values guide everything we do at BreatheSafe.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}>
            {values.map((value, index) => (
              <motion.div key={index} variants={itemVariants}>
                <div className="card p-6 h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/30 rounded-xl">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
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

      {/* Features Section */}
      <section className="section bg-white dark:bg-dark-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.h2
              className="heading-md text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}>
              Powerful Features
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}>
              Everything you need to stay informed about the air you breathe and
              protect your health.
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}>
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary-500">
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <h2 className="heading-md mb-6">
              Ready to Take Control of Your Air Quality?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of users who are already making informed decisions
              about their health with BreatheSafe's real-time air quality
              monitoring.
            </p>
            <Link
              to="/live-aqi"
              className="btn bg-white text-primary-500 hover:bg-gray-100">
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
