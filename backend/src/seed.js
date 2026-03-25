import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import Hospital from "./models/Hospital.js";
import Department from "./models/Department.js";
import Slot from "./models/Slot.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Hospital.deleteMany();
    await Department.deleteMany();
    await Slot.deleteMany();

    // Create hospitals
    const hospitals = await Hospital.insertMany([
      { name: "City General Hospital", address: "123 Main St, City Center" },
      { name: "Metro Medical Center", address: "456 Health Ave, Downtown" },
      { name: "Regional Hospital", address: "789 Care Blvd, Suburb" },
    ]);

    // Create departments
    const departments = [];
    for (const hospital of hospitals) {
      const depts = await Department.insertMany([
        { hospital_id: hospital._id, name: "Cardiology" },
        { hospital_id: hospital._id, name: "Neurology" },
        { hospital_id: hospital._id, name: "Orthopedics" },
        { hospital_id: hospital._id, name: "Emergency" },
      ]);
      departments.push(...depts);
    }

    // Create slots
    const slots = [];
    const now = new Date();
    for (const dept of departments) {
      for (let i = 1; i <= 5; i++) {
        const startTime = new Date(now);
        startTime.setDate(now.getDate() + i);
        startTime.setHours(9, 0, 0, 0);

        const endTime = new Date(startTime);
        endTime.setHours(17, 0, 0, 0);

        slots.push({
          hospital_id: dept.hospital_id,
          department_id: dept._id,
          start_time: startTime,
          end_time: endTime,
          capacity: 10,
        });
      }
    }

    await Slot.insertMany(slots);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();
