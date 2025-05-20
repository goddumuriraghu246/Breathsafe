import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiAlertCircle, FiClock, FiMapPin } from 'react-icons/fi';

const HealthReportDetail = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previousReports, setPreviousReports] = useState(() => {
    const savedReports = localStorage.getItem('generatedReports');
    return savedReports ? JSON.parse(savedReports) : [];
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view health reports');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/api/health/report/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          setReport(data.report);
        } else {
          setError(data.message);
        }
      } catch (err) {
        console.error('Error fetching health report:', err);
        setError('Failed to fetch health report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const removeReport = (reportId) => {
    setPreviousReports(prev => {
      const updated = prev.filter(r => r.id !== reportId);
      localStorage.setItem('generatedReports', JSON.stringify(updated));
      return updated;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 border-4 rounded-full border-primary-500 border-t-transparent animate-spin"></div>
            <span className="ml-3 text-gray-700 dark:text-gray-300">Loading health report...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center text-danger-500">
            <FiAlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Report Content */}
          <div className="lg:col-span-8">
            {/* Back button */}
            <Link
              to="/health-reports"
              className="inline-flex items-center mb-6 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              <FiArrowLeft className="w-5 h-5 mr-2" />
              <span>Back to Health Reports</span>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-8"
            >
              {/* Header */}
              <div className="border-b dark:border-gray-700 pb-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Health Report
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <FiMapPin className="w-4 h-4 mr-1" />
                    <span>
                      {report.location.name || 
                        `${report.location.latitude.toFixed(4)}, ${report.location.longitude.toFixed(4)}`}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="w-4 h-4 mr-1" />
                    <span>{new Date(report.report.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Personal Information
                </h2>
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {report.healthData?.name || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Age</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {report.healthData?.age ? `${report.healthData.age} years` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AQI Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Air Quality Information
                </h2>
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">AQI Value</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {report.aqiData.value}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {report.aqiData.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-8">
                {/* General Recommendations */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    General Recommendations
                  </h2>
                  <ul className="space-y-3">
                    {report.report.generalRecommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-2 h-2 mt-2 mr-3 rounded-full bg-primary-500"></span>
                        <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Age-Specific Recommendations */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Age-Specific Recommendations
                  </h2>
                  <ul className="space-y-3">
                    {report.report.ageSpecificRecommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-2 h-2 mt-2 mr-3 rounded-full bg-primary-500"></span>
                        <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Health-Specific Recommendations */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Health-Specific Recommendations
                  </h2>
                  <ul className="space-y-3">
                    {report.report.healthSpecificRecommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-2 h-2 mt-2 mr-3 rounded-full bg-primary-500"></span>
                        <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </motion.div>

            {/* Previous Reports Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Previous Reports
                </h2>
                <div className="space-y-4">
                  {previousReports.map((prevReport) => (
                    <div 
                      key={prevReport.id} 
                      className={`relative bg-gray-50 dark:bg-dark-700 rounded-lg p-4 border ${prevReport.id === id ? 'border-primary-500' : 'border-gray-200 dark:border-gray-700'}`}
                    >
                      <button
                        onClick={() => removeReport(prevReport.id)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <Link 
                        to={`/health-reports/${prevReport.id}`} 
                        className={`block -m-4 p-4 ${prevReport.id === id ? 'cursor-default' : 'hover:bg-gray-100 dark:hover:bg-dark-600'}`}
                      >
                        <div className="text-sm text-gray-600 dark:text-gray-400">{prevReport.timestamp}</div>
                        <div className="font-medium text-gray-900 dark:text-white mt-1">{prevReport.location}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">AQI: {prevReport.aqi}</div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthReportDetail;
