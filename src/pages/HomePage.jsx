import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { FiMapPin, FiAlertCircle, FiActivity, FiHeart, FiChevronDown } from "react-icons/fi";
import HeroSection from '../components/home/HeroSection';
import FeatureCard from '../components/home/FeatureCard';
import ContactForm from '../components/home/ContactForm';

const FAQS = [
  {
    question: "What is AQI and why does it matter?",
    answer:
      "AQI stands for Air Quality Index. It's a standardized measure of air pollution levels. A higher AQI means more pollution and greater health risks, especially for sensitive groups.",
  },
  {
    question: "How often is the air quality data updated?",
    answer:
      "Our platform fetches real-time data and updates every hour to ensure you always have the latest air quality information for your location.",
  },
  {
    question: "What health advice do you provide?",
    answer:
      "We offer personalized health tips based on the AQI and your health profile, such as when to avoid outdoor activities or use a mask.",
  },
  {
    question: "How accurate are your AQI forecasts?",
    answer:
      "Our 24-hour AQI predictions use advanced machine learning models and trusted open data sources for high accuracy.",
  },
  {
    question: "Can I get alerts for poor air quality?",
    answer:
      "Yes! Our platform sends you instant notifications when air quality drops to unhealthy levels in your area.",
  },
  {
    question: "Is my location data safe?",
    answer:
      "Absolutely. We use your location only to provide relevant air quality info and never share it with third parties.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="section bg-gray-50 dark:bg-dark-900">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <motion.h2
              className="mb-4 text-gray-900 heading-md dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Answers to common questions about air quality and how our platform helps you stay safe.
            </motion.p>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white shadow dark:bg-dark-800 rounded-xl">
                <button
                  className="flex items-center justify-between w-full px-6 py-4 text-left focus:outline-none"
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  aria-expanded={openIndex === idx}
                >
                  <span className="text-base font-medium text-gray-900 dark:text-white">{faq.question}</span>
                  <motion.span
                    animate={{ rotate: openIndex === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiChevronDown className="w-5 h-5 text-primary-500" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === idx && (
                    <motion.div
                      key="content"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { height: "auto", opacity: 1 },
                        collapsed: { height: 0, opacity: 0 },
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-base text-gray-700 dark:text-gray-300">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

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
      icon: <FiMapPin className="w-8 h-8 text-blue-500" />,
      title: "Real-time AQI Monitoring",
      description: "Get accurate air quality data for your location, updated in real-time to keep you informed.",
    },
    {
      icon: <FiHeart className="w-8 h-8 text-pink-500" />,
      title: "Personalized Health Advice",
      description: "Receive tailored health recommendations based on the air quality and your personal health profile.",
    },
    {
      icon: <FiActivity className="w-8 h-8 text-green-500" />,
      title: "24-hour AQI Prediction",
      description: "Plan your day with confidence using our accurate machine learning powered AQI forecasts.",
    },
    {
      icon: <FiAlertCircle className="w-8 h-8 text-red-500" />,
      title: "Health Alerts",
      description: "Get immediate notifications when air quality poses a risk to your health in your area.",
    },
  ];

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      // Show login modal/form
      setShowLogin(true);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <section id="about" className="bg-white section dark:bg-dark-800">
        <div className="container-custom">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-gray-900 heading-md dark:text-white">Our Mission</h2>
            <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              We believe everyone has the right to breathe clean air. BreatheSafe provides accurate, 
              real-time air quality data and personalized health insights to help you make informed 
              decisions about your outdoor activities and take control of your respiratory health.
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
      
      {/* Features Section */}
      <section id="features" className="section bg-gray-50 dark:bg-dark-900">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <motion.h2 
              className="mb-4 text-gray-900 heading-md dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Powerful Features
            </motion.h2>
            <motion.p 
              className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Everything you need to stay informed about the air you breathe and protect your health.
            </motion.p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
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
     <section id="contact" className="bg-white section dark:bg-dark-800">
  <div className="container-custom">
    <div className="max-w-5xl p-5 mx-auto sm:p-14">
      <div className="mb-6 text-center sm:mb-8 sm:pl-4">
        <motion.h2
          className="mb-2 text-gray-900 heading-md dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Get in Touch
        </motion.h2>
        <motion.p
          className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Have questions or suggestions? We'd love to hear from you!
        </motion.p>
      </div>

      <div className="max-w-4xl mx-auto">
        <ContactForm />
      </div>
    </div>
  </div>
</section>



      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
};

export default HomePage;
