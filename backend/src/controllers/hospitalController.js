import Hospital from "../models/Hospital.js";

export const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createHospital = async (req, res) => {
  try {
    const { name, address } = req.body;
    const hospital = new Hospital({ name, address });
    await hospital.save();
    res.status(201).json(hospital);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
