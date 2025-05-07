import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiMapPin, FiAlertCircle, FiActivity, FiHeart } from 'react-icons/fi';
import HeroSection from '../components/home/HeroSection';
import FeatureCard from '../components/home/FeatureCard';
import ContactForm from '../components/home/ContactForm';

const HomePage = () => {
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
      description: "Get accurate air quality data for your location, updated in real-time to keep you informed.",
    },
    {
      icon: <FiHeart className="h-8 w-8 text-pink-500" />,
      title: "Personalized Health Advice",
      description: "Receive tailored health recommendations based on the air quality and your personal health profile.",
    },
    {
      icon: <FiActivity className="h-8 w-8 text-green-500" />,
      title: "24-hour AQI Prediction",
      description: "Plan your day with confidence using our accurate machine learning powered AQI forecasts.",
    },
    {
      icon: <FiAlertCircle className="h-8 w-8 text-red-500" />,
      title: "Health Alerts",
      description: "Get immediate notifications when air quality poses a risk to your health in your area.",
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <section id="about" className="section bg-white dark:bg-dark-800">
        <div className="container-custom">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-md mb-6 text-gray-900 dark:text-white">Our Mission</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              We believe everyone has the right to breathe clean air. BreatheSafe provides accurate, 
              real-time air quality data and personalized health insights to help you make informed 
              decisions about your outdoor activities and take control of your respiratory health.
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
      
      {/* Features Section */}
      <section id="features" className="section bg-gray-50 dark:bg-dark-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.h2 
              className="heading-md text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Powerful Features
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Everything you need to stay informed about the air you breathe and protect your health.
            </motion.p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
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

      {/* Contact Form Section */}
      <section id="contact" className="section bg-white dark:bg-dark-800">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <motion.h2 
                className="heading-md text-gray-900 dark:text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Get in Touch
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Have questions or suggestions? We'd love to hear from you!
              </motion.p>
            </div>
            
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;