import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import LiveAQIPage from "./pages/LiveAQIPage";
import ForecastingPage from "./pages/ForecastingPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AboutPage from "./pages/AboutPage";
import RespiratoryIssuesForm from "./pages/RespiratoryIssuesForm"; // See below
import HealthAdvisoryDetails from "./pages/HealthAdvisoryDetails";
import ChatBot from "./context/ChatBot";
import HealthReports from "./pages/HealthReports";
import HealthReportDetail from "./pages/HealthReportDetail";

function App() {
  const location = useLocation();
  const background = location.state && location.state.background;

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Check if current route is dashboard
  const isDashboard = location.pathname === "/dashboard";

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-dark-900">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 19999,color:"black" }}
        />
        {!isDashboard && <Navbar />}
        
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes location={background || location} key={(background || location).pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/live-aqi" element={<LiveAQIPage />} />
              <Route path="/forecasting" element={<ForecastingPage />} />
              <Route path="/form-input" element={<RespiratoryIssuesForm />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/advisory-details" element={<HealthAdvisoryDetails />} />
              <Route path="/health-reports" element={<HealthReports />} />
              <Route path="/health-reports/:id" element={<HealthReportDetail />} />
            </Routes>
          </AnimatePresence>

          {/* Modal routes rendered outside AnimatePresence/Routes */}
          {background && (
            <>
              {location.pathname === "/login" && <LoginPage />}
              {location.pathname === "/signup" && <SignupPage />}
            </>
          )}
        </main>
        {!isDashboard && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;
