import EmergencyAlert from "../models/EmergencyAlert.js";
import User from "../models/User.js";

export const createEmergencyAlert = async (req, res) => {
  try {
    const { level, location } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alert = new EmergencyAlert({
      user_id: user._id,
      level,
      location,
    });

    await alert.save();

    // Emit to admin dashboard via socket.io
    const io = req.app.get("io");
    io.emit("emergency-alert", {
      id: alert._id,
      user: user.name,
      level,
      location,
      createdAt: alert.createdAt,
    });

    res.status(201).json({ message: "Emergency alert created", alert });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getEmergencyAlerts = async (req, res) => {
  try {
    const alerts = await EmergencyAlert.find({ status: "active" })
      .populate("user_id")
      .sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const resolveAlert = async (req, res) => {
  try {
    const { alert_id } = req.params;
    const alert = await EmergencyAlert.findById(alert_id);
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    alert.status = "resolved";
    await alert.save();

    res.json({ message: "Alert resolved", alert });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
