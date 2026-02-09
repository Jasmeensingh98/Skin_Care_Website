import express from "express";
import multer from "multer";
import { analyzeSkin } from "../controller/skin.controller.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/analyze", upload.single("image"), analyzeSkin);

export default router;
