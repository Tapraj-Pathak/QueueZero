import Appointment from "../models/Appointment.js";
import Slot from "../models/Slot.js";
import User from "../models/User.js";
import QRCode from "qrcode";

export const createAppointment = async (req, res) => {
  try {
    const { slot_id } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const slot = await Slot.findById(slot_id);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slot.booked >= slot.capacity) {
      return res.status(400).json({ message: "Slot is full" });
    }

    const token_id = `TOKEN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const qrCodeDataURL = await QRCode.toDataURL(token_id);

    const appointment = new Appointment({
      user_id: user._id,
      slot_id,
      token_id,
      qr_code: qrCodeDataURL,
    });

    await appointment.save();

    slot.booked += 1;
    await slot.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: {
        ...appointment.toObject(),
        qr_code: qrCodeDataURL,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const appointments = await Appointment.find({ user_id: user._id })
      .populate({
        path: "slot_id",
        populate: [
          { path: "hospital_id", model: "Hospital" },
          { path: "department_id", model: "Department" },
        ],
      })
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const validateToken = async (req, res) => {
  try {
    const { token_id } = req.body;
    const appointment = await Appointment.findOne({ token_id });
    if (!appointment) {
      return res.status(404).json({ message: "Token not found" });
    }

    appointment.status = "confirmed";
    await appointment.save();

    res.json({ message: "Token validated successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const completeAppointment = async (req, res) => {
  try {
    const { appointment_id } = req.params;
    const appointment = await Appointment.findById(appointment_id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = "completed";
    await appointment.save();

    res.json({ message: "Appointment completed", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("user_id")
      .populate({
        path: "slot_id",
        populate: [
          { path: "hospital_id", model: "Hospital" },
          { path: "department_id", model: "Department" },
        ],
      })
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
