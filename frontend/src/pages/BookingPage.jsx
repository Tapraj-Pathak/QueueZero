import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import axios from "../lib/axios";

const BookingPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchHospitals() {
    try {
      const response = await axios.get("/hospitals");
      setHospitals(response.data);
    } catch {
      toast.error("Error fetching hospitals");
    }
  }

  async function fetchDepartments(hospitalId) {
    try {
      const response = await axios.get(`/departments/hospital/${hospitalId}`);
      setDepartments(response.data);
    } catch {
      toast.error("Error fetching departments");
    }
  }

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchHospitals();
  }, [user, navigate]);

  useEffect(() => {
    if (selectedHospital) {
      fetchDepartments(selectedHospital);
      setSelectedDepartment("");
      setSlots([]);
    }
  }, [selectedHospital]);

  useEffect(() => {
    const loadSlots = async () => {
      if (!selectedHospital || !selectedDepartment) return;

      try {
        const response = await axios.get(
          `/slots?hospital=${selectedHospital}&department=${selectedDepartment}`,
        );
        setSlots(response.data);
      } catch {
        toast.error("Error fetching slots");
      }
    };

    if (selectedDepartment) {
      loadSlots();
    }
  }, [selectedDepartment, selectedHospital]);

  const handleBooking = async () => {
    if (!selectedSlot) {
      toast.error("Please select a slot");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/appointments", {
        slot_id: selectedSlot,
      });

      toast.success("Appointment booked successfully!");
      navigate("/my-token");
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book Appointment</h1>

      <div className="max-w-md mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Hospital
          </label>
          <select
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a hospital</option>
            {hospitals.map((hospital) => (
              <option key={hospital._id} value={hospital._id}>
                {hospital.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Department
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            disabled={!selectedHospital}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">Choose a department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Slots
          </label>
          <div className="space-y-2">
            {slots.map((slot) => (
              <div
                key={slot._id}
                className={`p-3 border rounded-md cursor-pointer ${
                  selectedSlot === slot._id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => setSelectedSlot(slot._id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {new Date(slot.start_time).toLocaleDateString()}{" "}
                      {new Date(slot.start_time).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Available: {slot.capacity - slot.booked} / {slot.capacity}
                    </p>
                  </div>
                  <input
                    type="radio"
                    checked={selectedSlot === slot._id}
                    onChange={() => setSelectedSlot(slot._id)}
                    className="w-4 h-4 text-blue-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleBooking}
          disabled={loading || !selectedSlot}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
};

export default BookingPage;
