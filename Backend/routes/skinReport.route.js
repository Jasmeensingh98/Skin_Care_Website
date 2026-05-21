import express from "express";
import multer from "multer";
import protect from "../middleware/auth.middleware.js";
import { dermatologistOnly } from "../middleware/dermatologist.middleware.js";
import {
  createSkinReport,
  getMyReports,
  getReportById,
  getAllReportsForDerm,
  reviewReport,
} from "../controller/skinReport.controller.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/reports", protect, upload.single("image"), createSkinReport);
router.get("/reports/my", protect, getMyReports);
router.get("/reports/derm/all", protect, dermatologistOnly, getAllReportsForDerm);
router.get("/reports/:id", protect, getReportById);
router.put("/reports/:id/review", protect, dermatologistOnly, reviewReport);

export default router;
