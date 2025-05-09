import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import LiveAQIPage from "./pages/LiveAQIPage";
import ForecastingPage from "./pages/ForecastingPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AboutPage from "./pages/AboutPage";

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
    <div className="flex flex-col min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-dark-900">
      {!isDashboard && <Navbar />}
      <main className="flex-grow">
        {/* Main routes, using background location if present */}
        <AnimatePresence mode="wait">
          <Routes location={background || location} key={(background || location).pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/live-aqi" element={<LiveAQIPage />} />
            <Route path="/forecasting" element={<ForecastingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
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
  );
}

export default App;
