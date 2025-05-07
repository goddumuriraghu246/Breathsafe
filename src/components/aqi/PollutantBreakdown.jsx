import PropTypes from 'prop-types';

// Helper for pollutant color
function getPollutantColor(name, value) {
  if (name === 'pm2_5' || name === 'pm10') {
    if (value <= 50) return 'bg-green-500';
    if (value <= 100) return 'bg-yellow-500';
    if (value <= 150) return 'bg-orange-500';
    return 'bg-red-600';
  }
  if (name === 'co' || name === 'no2' || name === 'so2' || name === 'o3') {
    if (value <= 50) return 'bg-green-500';
    if (value <= 100) return 'bg-yellow-500';
    if (value <= 200) return 'bg-orange-500';
    return 'bg-red-600';
  }
  return 'bg-gray-400';
}

const PollutantBreakdown = ({ pollutants }) => (
  <div className="card p-6">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pollutant Breakdown</h2>
    <div className="space-y-4">
      {pollutants.map((pollutant) => (
        <div key={pollutant.name} className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300 font-medium">{pollutant.label || pollutant.name}</span>
          <div className="flex items-center">
            <div className="w-24 h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getPollutantColor(pollutant.name, pollutant.value)} rounded-full`}
                style={{ width: `${Math.min((pollutant.value / 200) * 100, 100)}%` }}
              />
            </div>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{pollutant.value}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

PollutantBreakdown.propTypes = {
  pollutants: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      label: PropTypes.string
    })
  ).isRequired
};

export default PollutantBreakdown; 