import asyncHandler from "express-async-handler";
import { analyzeImageBuffer } from "../util/skinAnalysis.js";

const analyzeSkin = asyncHandler(async (req, res) => {
  if (!req.file?.buffer) {
    res.status(400);
    throw new Error("Image is required");
  }

  try {
    const analysis = await analyzeImageBuffer(req.file.buffer);
    res.status(200).json(analysis);
  } catch (err) {
    res.status(502);
    throw new Error(err.message || "Skin analysis failed");
  }
});

export { analyzeSkin };
