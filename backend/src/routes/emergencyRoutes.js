import express from "express";
import {
  createEmergencyAlert,
  getEmergencyAlerts,
  resolveAlert,
} from "../controllers/emergencyController.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", authenticateToken, createEmergencyAlert);
router.get("/", getEmergencyAlerts);
router.put("/:alert_id/resolve", resolveAlert);

export default router;
