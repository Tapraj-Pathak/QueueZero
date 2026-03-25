import Department from "../models/Department.js";

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate("hospital_id");
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getDepartmentsByHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const departments = await Department.find({ hospital_id: hospitalId });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
