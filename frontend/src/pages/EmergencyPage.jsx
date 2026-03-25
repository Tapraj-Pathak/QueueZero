import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../lib/axios";

const EmergencyPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [level, setLevel] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!level || !location) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/emergency", {
        level,
        location,
      });

      toast.success("Emergency alert sent successfully!");
      setLevel("");
      setLocation("");
    } catch {
      toast.error("Failed to send emergency alert");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Emergency Alert</h1>

      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Select level</option>
              <option value="Risky">Risky</option>
              <option value="Very Risky">Very Risky</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your current location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "Sending Alert..." : "Send Emergency Alert"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="font-semibold text-red-800 mb-2">Emergency Levels:</h3>
          <ul className="text-sm text-red-700 space-y-1">
            <li>
              <strong>Risky:</strong> Minor emergency, needs attention soon
            </li>
            <li>
              <strong>Very Risky:</strong> Serious condition, requires immediate
              care
            </li>
            <li>
              <strong>Critical:</strong> Life-threatening situation, emergency
              response needed
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;
