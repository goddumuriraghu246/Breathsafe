export default function HealthAdvisoryDetails() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-900">
      <main className="flex flex-col items-center flex-grow px-4 py-8 mt-20">
        <div className="w-full max-w-2xl p-8 bg-white border shadow-2xl dark:bg-dark-800 rounded-2xl border-primary-100 dark:border-primary-700">
          <h1 className="mb-3 text-3xl font-bold text-primary-700 dark:text-primary-300">
            Detailed Health Advisory
          </h1>
          <p className="mb-2 text-lg text-gray-800 dark:text-gray-200">
            Today’s AQI is <span className="font-semibold text-yellow-600 dark:text-yellow-400">moderate</span>. People with asthma, children, and elderly should limit heavy outdoor activity, especially near traffic or during afternoon ozone peaks.
          </p>
          <ul className="pl-6 mb-2 space-y-1 text-base text-gray-700 list-disc dark:text-gray-300">
            <li>Keep windows closed during high pollution hours.</li>
            <li>Use air purifiers indoors if available.</li>
            <li>Monitor symptoms and consult a doctor if you feel unwell.</li>
          </ul>
          <p className="text-base text-gray-700 dark:text-gray-300">
            For more information, visit the{" "}
            <a
              href="https://app.cpcbccr.com/AQI_India/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary-600 dark:text-primary-400"
            >
              CPCB AQI Portal
            </a>.
          </p>
        </div>
      </main>
    </div>
  );
}
