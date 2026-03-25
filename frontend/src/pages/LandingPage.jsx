import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import axios from "../lib/axios";

const LandingPage = () => {
  const { user, signOut } = useAuthStore();
  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);

  async function fetchHospitals() {
    try {
      const response = await axios.get("/hospitals");
      setHospitals(response.data);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  }

  async function fetchDepartments() {
    try {
      const response = await axios.get("/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }

  useEffect(() => {
    fetchHospitals();
    fetchDepartments();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">QueueZero</h1>
        <div className="flex gap-4">
          {user ? (
            <>
              <Link
                to="/booking"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Book Appointment
              </Link>
              <Link
                to="/my-token"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                My Token
              </Link>
              <Link
                to="/emergency"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Emergency
              </Link>
              <button
                onClick={signOut}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      <main>
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Smart Hospital Appointment System
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Book appointments, manage tokens, and handle emergencies
            efficiently.
          </p>
          {!user && (
            <Link
              to="/auth"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600"
            >
              Get Started
            </Link>
          )}
        </section>

        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Our Hospitals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hospital) => (
              <div
                key={hospital._id}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h4 className="text-xl font-semibold mb-2">{hospital.name}</h4>
                <p className="text-gray-600">{hospital.address}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold mb-6">Departments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {departments.map((dept) => (
              <div key={dept._id} className="bg-white p-4 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold">{dept.name}</h4>
                <p className="text-sm text-gray-600">
                  {dept.hospital_id?.name}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
