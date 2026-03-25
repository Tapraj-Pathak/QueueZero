import express from "express";
import {
  createAppointment,
  getUserAppointments,
  validateToken,
  completeAppointment,
  getAllAppointments,
} from "../controllers/appointmentController.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", authenticateToken, createAppointment);
router.get("/user", authenticateToken, getUserAppointments);
router.post("/validate-token", validateToken);
router.put("/:appointment_id/complete", completeAppointment);
router.get("/", getAllAppointments);

export default router;
