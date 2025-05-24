import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiAlertCircle, FiClock, FiMapPin, FiDownload } from 'react-icons/fi';
import html2pdf from 'html2pdf.js';

const HealthReportDetail = () => {
  // Helper function to get color class based on AQI value
  const getAqiColorClass = (aqi) => {
    if (aqi <= 50) return 'bg-green-500';
    if (aqi <= 100) return 'bg-yellow-500';
    if (aqi <= 150) return 'bg-orange-500';
    if (aqi <= 200) return 'bg-red-500';
    if (aqi <= 300) return 'bg-purple-500';
    return 'bg-red-900';
  };

  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view health reports');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/api/health-report/reports/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          console.log('Report data received:', data.report);
          console.log('outdoorActivitySafety:', data.report.outdoorActivitySafety);
          console.log('maskRecommendations:', data.report.maskRecommendations);
          setReport(data.report);
        } else {
          setError(data.message || 'Failed to fetch report');
        }
      } catch (err) {
        console.error('Error fetching health report:', err);
        setError('Failed to fetch health report');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id]);

  const downloadReport = () => {
    setDownloading(true);
    const reportElement = document.getElementById('health-report');
    const options = {
      margin: 10,
      filename: `health-report-${report._id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()
      .from(reportElement)
      .set(options)
      .save()
      .then(() => {
        setDownloading(false);
      })
      .catch(err => {
        console.error('Error generating PDF:', err);
        setDownloading(false);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-50 dark:bg-dark-900">
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
      <div className="min-h-screen p-6 bg-gray-50 dark:bg-dark-900">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center text-danger-500">
            <FiAlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
          <div className="mt-4">
            <Link to="/live-aqi" className="text-primary-500 hover:text-primary-600">
              <FiArrowLeft className="inline-block mr-2" />
              Back to Live AQI
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-dark-900">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <div className="mb-4 mt-14">
          <Link
            to="/live-aqi"
            className="inline-flex items-center text-sm font-medium cursor-pointer text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Live AQI</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main Report Content */}
          <div className="lg:col-span-12">
            <motion.div
              id="health-report"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-white rounded-lg shadow-lg dark:bg-dark-800"
            >
              {/* Header with Air Quality Status */}
              <div className="pb-6 mb-6 border-b dark:border-gray-700">
                <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
                  <div>
                    <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
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
                  
                  {/* Air Quality Status Card */}
                  <div className={`flex-shrink-0 rounded-lg p-4 text-white ${getAqiColorClass(report.aqiData.value)}`}>
                    <div className="text-center">
                      <h3 className="mb-1 text-xl font-bold">Air Quality</h3>
                      <div className="mb-1 text-4xl font-bold">{report.aqiData.value}</div>
                      <div className="text-lg font-medium">{report.aqiData.status}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-8">
                {/* General Recommendations */}
                <section>
                  <h2 className="flex items-center mb-4 text-xl font-semibold text-blue-600 dark:text-blue-400">
                    <span className="inline-block mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </span>
                    General Recommendation
                  </h2>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-dark-700">
                    {report.report.generalRecommendations.map((rec, index) => (
                      <div key={index} className="text-gray-700 dark:text-gray-300">{rec}</div>
                    ))}
                  </div>
                </section>

                {/* Age-Specific Recommendations */}
                <section>
                  <h2 className="flex items-center mb-4 text-xl font-semibold text-blue-600 dark:text-blue-400">
                    <span className="inline-block mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </span>
                    Age-specific Recommendation
                  </h2>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-dark-700">
                    {report.report.ageSpecificRecommendations.map((rec, index) => (
                      <div key={index} className="text-gray-700 dark:text-gray-300">{rec}</div>
                    ))}
                  </div>
                </section>

                {/* Health Condition Recommendations */}
                <section>
                  <h2 className="flex items-center mb-4 text-xl font-semibold text-blue-600 dark:text-blue-400">
                    <span className="inline-block mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Health Condition Recommendation
                  </h2>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-dark-700">
                    {report.report.healthSpecificRecommendations.map((rec, index) => (
                      <div key={index} className="text-gray-700 dark:text-gray-300">{rec}</div>
                    ))}
                  </div>
                </section>
                
                {/* Time-Specific Recommendations */}
                <section>
                  <h2 className="flex items-center mb-4 text-xl font-semibold text-blue-600 dark:text-blue-400">
                    <span className="inline-block mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Time-specific Recommendation
                  </h2>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-dark-700">
                    {report.outdoorActivitySafety && (
                      <div className="text-gray-700 dark:text-gray-300">{report.outdoorActivitySafety.recommendation}</div>
                    )}
                  </div>
                </section>

                {/* Mask Recommendations */}
                <section>
                  <h2 className="flex items-center mb-4 text-xl font-semibold text-blue-600 dark:text-blue-400">
                    <span className="inline-block mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Mask Recommendation
                  </h2>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-dark-700">
                    {report.maskRecommendations && report.maskRecommendations.isRecommended && (
                      <div className="flex">
                        <div className="bg-pink-100 text-pink-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
                          Mask Recommended
                        </div>
                        <div className="text-gray-700 dark:text-gray-300">
                          {report.maskRecommendations.usage}
                        </div>
                      </div>
                    )}
                    {report.maskRecommendations && !report.maskRecommendations.isRecommended && (
                      <div className="text-gray-700 dark:text-gray-300">
                        Mask wearing is optional based on current air quality conditions.
                      </div>
                    )}
                  </div>
                </section>

                {/* Medication Recommendations */}
                <section>
                  <h2 className="flex items-center mb-4 text-xl font-semibold text-blue-600 dark:text-blue-400">
                    <span className="inline-block mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Medication Recommendations
                  </h2>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-dark-700">
                    <div className="mb-4">
                      <h3 className="mb-2 font-medium text-gray-900 dark:text-white">General Recommendations</h3>
                      <p className="text-gray-700 dark:text-gray-300">{report.report.medicationRecommendations.general}</p>
                    </div>
                    <div>
                      <h3 className="mb-2 font-medium text-gray-900 dark:text-white">Specific Recommendations</h3>
                      <div className="space-y-2">
                        {Object.entries(report.report.medicationRecommendations.specific).map(([symptom, recommendation]) => (
                          <div key={symptom} className="p-3 bg-white rounded-md shadow-sm dark:bg-dark-800">
                            <h4 className="mb-1 font-medium text-gray-900 dark:text-white">{symptom}</h4>
                            <p className="text-gray-700 dark:text-gray-300">{recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      <p>{report.report.medicationRecommendations.disclaimer}</p>
                    </div>
                  </div>
                </section>
              </div>
              
              <div className="mt-6 mb-8">
                <p className="mb-6 text-sm text-center text-gray-500 dark:text-gray-400">
                  This report is generated based on current air quality data and your provided health information. It is intended as general guidance and not as medical advice. Please consult with a healthcare professional for personalized medical recommendations.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={downloadReport}
                    disabled={downloading}
                    className="flex items-center justify-center px-6 py-3 font-medium text-white transition duration-150 ease-in-out bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloading ? (
                      <>
                        <div className="w-5 h-5 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <FiDownload className="w-5 h-5 mr-2" />
                        <span>Download Your Health Report</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthReportDetail;
