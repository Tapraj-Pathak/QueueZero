import express from "express";
import {
  getDepartments,
  getDepartmentsByHospital,
} from "../controllers/departmentController.js";

const router = express.Router();

router.get("/", getDepartments);
router.get("/hospital/:hospitalId", getDepartmentsByHospital);

export default router;
