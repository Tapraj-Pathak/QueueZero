import express from "express";
import {
  getHospitals,
  createHospital,
} from "../controllers/hospitalController.js";

const router = express.Router();

router.get("/", getHospitals);
router.post("/", createHospital);

export default router;
