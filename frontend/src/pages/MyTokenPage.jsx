import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import ReactQRCode from "react-qr-code";
import toast from "react-hot-toast";
import axios from "../lib/axios";

const MyTokenPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    fetchAppointments();
  }, [user, navigate]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("/appointments/user");
      setAppointments(response.data);
    } catch {
      toast.error("Error fetching appointments");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Token</h1>
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            You don't have any appointments yet.
          </p>
          <Link
            to="/booking"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Book an Appointment
          </Link>
        </div>
      </div>
    );
  }

  const latestAppointment = appointments[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Token</h1>

      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">
            Token #{latestAppointment.token_id}
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              latestAppointment.status === "confirmed"
                ? "bg-green-100 text-green-800"
                : latestAppointment.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
            }`}
          >
            {latestAppointment.status.charAt(0).toUpperCase() +
              latestAppointment.status.slice(1)}
          </span>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Appointment Details</h3>
          <p>
            <strong>Hospital:</strong>{" "}
            {latestAppointment.slot_id?.hospital_id?.name}
          </p>
          <p>
            <strong>Department:</strong>{" "}
            {latestAppointment.slot_id?.department_id?.name}
          </p>
          <p>
            <strong>Date & Time:</strong>{" "}
            {new Date(latestAppointment.slot_id?.start_time).toLocaleString()}
          </p>
        </div>

        <div className="text-center">
          <h3 className="font-semibold mb-4">QR Code</h3>
          <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded">
            <ReactQRCode value={latestAppointment.token_id} size={200} />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Show this QR code at the hospital
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Appointment History</h2>
        <div className="space-y-4">
          {appointments.slice(1).map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white p-4 rounded-lg shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Token #{appointment.token_id}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(appointment.slot_id?.start_time).toLocaleString()}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyTokenPage;
