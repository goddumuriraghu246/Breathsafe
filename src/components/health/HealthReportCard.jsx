import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiClock, FiMapPin, FiArrowRight } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const HealthReportCard = ({ aqiData, location, onClose, readOnly = false }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const generateReport = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to generate a health report');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/health-report/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            location,
            aqiData
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to generate health report');
        }

        if (data.success) {
          setReport(data.report);
        } else {
          setError(data.message || 'Failed to generate health report');
        }
      } catch (err) {
        console.error('Error generating health report:', err);
        setError(err.message || 'Failed to generate health report. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    generateReport();
  }, [aqiData, location]);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-dark-800">
        <div className="flex items-center justify-center">
          <div className="w-10 h-10 border-4 rounded-full border-primary-500 border-t-transparent animate-spin"></div>
          <span className="ml-3 text-gray-700 dark:text-gray-300">Generating health report...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-dark-800">
        <div className="flex items-center text-danger-500">
          <FiAlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 bg-white rounded-lg shadow-lg dark:bg-dark-800"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Personalized Health Report</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ×
        </button>
      </div>

      {/* Location and Time */}
      <div className="flex items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center">
          <FiMapPin className="w-4 h-4 mr-1" />
          <span>{location.name || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}</span>
        </div>
        <div className="flex items-center">
          <FiClock className="w-4 h-4 mr-1" />
          <span>{new Date(report.report.timestamp).toLocaleString()}</span>
        </div>
      </div>

      {/* Report Sections */}
      <div className="space-y-6">
        {/* General Recommendations */}
        <section>
          <h4 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">General Recommendations</h4>
          <ul className="space-y-2">
            {report.report.generalRecommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 mt-2 mr-2 rounded-full bg-primary-500"></span>
                <span className="text-gray-700 dark:text-gray-300">{rec}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Age-Specific Recommendations */}
        <section>
          <h4 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">Age-Specific Recommendations</h4>
          <ul className="space-y-2">
            {report.report.ageSpecificRecommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 mt-2 mr-2 rounded-full bg-primary-500"></span>
                <span className="text-gray-700 dark:text-gray-300">{rec}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Health-Specific Recommendations */}
        <section>
          <h4 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">Health-Specific Recommendations</h4>
          <ul className="space-y-2">
            {report.report.healthSpecificRecommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 mt-2 mr-2 rounded-full bg-primary-500"></span>
                <span className="text-gray-700 dark:text-gray-300">{rec}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Read More Link */}
      {report._id && (
        <Link
          to={`/health-reports/${report._id}`}
          className="mt-6 inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <span>Read More</span>
          <FiArrowRight className="w-4 h-4 ml-2" />
        </Link>
      )}
    </motion.div>
  );
};

HealthReportCard.propTypes = {
  aqiData: PropTypes.shape({
    value: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    pollutants: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        unit: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired,
  location: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    name: PropTypes.string
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  readOnly: PropTypes.bool
};

export default HealthReportCard;