import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import BookingPage from "./pages/BookingPage";
import MyTokenPage from "./pages/MyTokenPage";
import EmergencyPage from "./pages/EmergencyPage";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/my-token" element={<MyTokenPage />} />
        <Route path="/emergency" element={<EmergencyPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
