import express from "express";
import { getSlots, createSlot } from "../controllers/slotController.js";

const router = express.Router();

router.get("/", getSlots);
router.post("/", createSlot);

export default router;
