import Slot from "../models/Slot.js";

export const getSlots = async (req, res) => {
  try {
    const { hospital, department } = req.query;
    const query = {};
    if (hospital) query.hospital_id = hospital;
    if (department) query.department_id = department;

    const slots = await Slot.find(query).populate("hospital_id department_id");
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createSlot = async (req, res) => {
  try {
    const { hospital_id, department_id, start_time, end_time, capacity } =
      req.body;
    const slot = new Slot({
      hospital_id,
      department_id,
      start_time,
      end_time,
      capacity,
    });
    await slot.save();
    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
