import asyncHandler from "express-async-handler";
import Appointment from "../models/appointment.model.js";
import SkinReport from "../models/skinReport.model.js";

const getDermAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find()
    .sort({ appointmentDate: 1, createdAt: -1 })
    .populate("user", "name email phone")
    .populate("report", "aiSummary status imageUrl")
    .populate("dermatologist", "name email");

  res.json(appointments);
});

const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate("user", "name email phone")
    .populate("report", "aiSummary status imageUrl metrics")
    .populate("dermatologist", "name email");

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  res.json(appointment);
});

const createAppointment = asyncHandler(async (req, res) => {
  const { reportId, appointmentDate, reason, notes } = req.body;

  if (!reportId || !appointmentDate) {
    res.status(400);
    throw new Error("Report and appointment date are required");
  }

  const report = await SkinReport.findById(reportId).populate(
    "user",
    "name email phone"
  );

  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }

  const appointment = await Appointment.create({
    report: report._id,
    user: report.user._id,
    dermatologist: req.user._id,
    patientName: report.userName || report.user?.name || "Customer",
    patientEmail: report.userEmail || report.user?.email || "",
    patientPhone: report.user?.phone || "",
    appointmentDate,
    reason: reason || "Skin review follow-up",
    notes: notes || "",
    status: "scheduled",
  });

  const created = await Appointment.findById(appointment._id)
    .populate("user", "name email phone")
    .populate("report", "aiSummary status imageUrl metrics")
    .populate("dermatologist", "name email");

  res.status(201).json(created);
});

const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  const { appointmentDate, reason, notes, status } = req.body;
  if (appointmentDate !== undefined) appointment.appointmentDate = appointmentDate;
  if (reason !== undefined) appointment.reason = reason;
  if (notes !== undefined) appointment.notes = notes;
  if (status !== undefined) appointment.status = status;

  await appointment.save();

  const updated = await Appointment.findById(appointment._id)
    .populate("user", "name email phone")
    .populate("report", "aiSummary status imageUrl metrics")
    .populate("dermatologist", "name email");

  res.json(updated);
});

export {
  getDermAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
};