import express from "express";
import protect from "../middleware/auth.middleware.js";
import { dermatologistOnly } from "../middleware/dermatologist.middleware.js";
import {
  getDermAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
} from "../controller/appointment.controller.js";

const router = express.Router();

router.use(protect, dermatologistOnly);

router.get("/", getDermAppointments);
router.post("/", createAppointment);
router.get("/:id", getAppointmentById);
router.put("/:id", updateAppointment);

export default router;