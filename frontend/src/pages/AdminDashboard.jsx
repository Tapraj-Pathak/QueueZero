import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import axios from "../lib/axios";

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchAppointments() {
    try {
      const response = await axios.get("/appointments");
      setAppointments(response.data);
    } catch {
      toast.error("Error fetching appointments");
    }
  }

  async function fetchAlerts() {
    try {
      const response = await axios.get("/emergency");
      setAlerts(response.data);
      setLoading(false);
    } catch {
      toast.error("Error fetching alerts");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAppointments();
    fetchAlerts();

    // Connect to socket.io
    const newSocket = io("http://localhost:3000");

    newSocket.on("emergency-alert", (alert) => {
      setAlerts((prev) => [alert, ...prev]);
      toast.error(`Emergency Alert: ${alert.level} - ${alert.location}`);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const validateToken = async (tokenId) => {
    try {
      await axios.post("/appointments/validate-token", { token_id: tokenId });
      toast.success("Token validated successfully");
      fetchAppointments();
    } catch {
      toast.error("Failed to validate token");
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      await axios.put(`/appointments/${appointmentId}/complete`);
      toast.success("Appointment completed");
      fetchAppointments();
    } catch {
      toast.error("Failed to complete appointment");
    }
  };

  const resolveAlert = async (alertId) => {
    try {
      await axios.put(`/emergency/${alertId}/resolve`);
      toast.success("Alert resolved");
      fetchAlerts();
    } catch {
      toast.error("Failed to resolve alert");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appointments */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Appointments</h2>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">
                      Token: {appointment.token_id}
                    </p>
                    <p className="text-sm text-gray-600">
                      Patient: {appointment.user_id?.name} (
                      {appointment.user_id?.email})
                    </p>
                    <p className="text-sm text-gray-600">
                      {appointment.slot_id?.hospital_id?.name} -{" "}
                      {appointment.slot_id?.department_id?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(
                        appointment.slot_id?.start_time,
                      ).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      appointment.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : appointment.status === "confirmed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  {appointment.status === "pending" && (
                    <button
                      onClick={() => validateToken(appointment.token_id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Validate
                    </button>
                  )}
                  {appointment.status === "confirmed" && (
                    <button
                      onClick={() => completeAppointment(appointment._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Alerts */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Emergency Alerts</h2>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert._id || alert.id}
                className="bg-red-50 border border-red-200 p-4 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-red-800">
                      Level: {alert.level}
                    </p>
                    <p className="text-sm text-red-700">
                      Location: {alert.location}
                    </p>
                    <p className="text-sm text-red-700">
                      User: {alert.user || "Unknown"}
                    </p>
                    <p className="text-sm text-red-700">
                      Time:{" "}
                      {new Date(
                        alert.createdAt || alert.created_at,
                      ).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      alert.status === "resolved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {alert.status || "active"}
                  </span>
                </div>
                {alert.status !== "resolved" && (
                  <button
                    onClick={() => resolveAlert(alert._id || alert.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 mt-2"
                  >
                    Resolve
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
