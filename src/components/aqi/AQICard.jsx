import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const AQICard = ({ aqiData, coordinates, isLoading }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'good':
        return 'success';
      case 'moderate':
        return 'yellow';
      case 'unhealthy for sensitive groups':
        return 'orange';
      case 'unhealthy':
        return 'danger';
      case 'very unhealthy':
        return 'purple';
      case 'hazardous':
        return 'red';
      default:
        return 'success';
    }
  };

  const getColorClass = (colorName) => {
    switch (colorName) {
      case 'success':
        return 'bg-success-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'orange':
        return 'bg-orange-500';
      case 'danger':
        return 'bg-danger-500';
      case 'purple':
        return 'bg-purple-500';
      case 'red':
        return 'bg-red-700';
      default:
        return 'bg-success-500';
    }
  };

  const statusColor = getStatusColor(aqiData.status);
  const colorClass = getColorClass(statusColor);

  return (
    <motion.div 
      className="card overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-dark-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Current AQI</h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Last updated: {aqiData.updated}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Location: {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
        </p>
      </div>
      
      {/* AQI Value */}
      <div className="flex flex-col items-center justify-center py-8 px-6 bg-gray-50 dark:bg-dark-800/50">
        <div className={`relative flex items-center justify-center w-36 h-36 rounded-full ${isLoading ? 'bg-gray-200 dark:bg-dark-700' : colorClass}`}>
          {isLoading ? (
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <motion.span 
              className="text-5xl font-bold text-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {aqiData.value}
            </motion.span>
          )}
        </div>
        <h3 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
          {aqiData.status}
        </h3>
      </div>
    </motion.div>
  );
};

AQICard.propTypes = {
  aqiData: PropTypes.shape({
    value: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    pollutants: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        percentage: PropTypes.number.isRequired,
      })
    ).isRequired,
    updated: PropTypes.string.isRequired,
  }).isRequired,
  coordinates: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }).isRequired,
  isLoading: PropTypes.bool
};

export default AQICard;