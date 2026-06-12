import asyncHandler from "express-async-handler";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import SkinReport from "../models/skinReport.model.js";
import Product from "../models/product.model.js";
import { analyzeImageBuffer } from "../util/skinAnalysis.js";

const normalizeText = (value) => String(value || "").toLowerCase();

const buildSuggestedProducts = (report, products) => {
  if (!report || !Array.isArray(products)) return [];

  const metrics = report.metrics || {};
  const recoveryFocus = (report.recoveryFocus || []).map(normalizeText);
  const blockedIngredients = (report.blockedIngredients || []).map(normalizeText);

  const scored = products.map((product) => {
    const text = normalizeText(
      [
        product.title,
        product.desc,
        product.Brand,
        product.categories?.join(" "),
        product.concern?.join(" "),
        product.skintype?.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
    );
    const skinTypes = (product.skintype || []).map(normalizeText);
    let score = 0;

    const acneHigh = (metrics.acne || 0) >= 40;
    const rednessHigh = (metrics.redness || 0) >= 40;
    const oilinessHigh = (metrics.oiliness || 0) >= 40;
    const drynessHigh = (metrics.dryness || 0) >= 40;

    if (acneHigh) {
      if (
        text.includes("salicylic") ||
        text.includes("niacinamide") ||
        text.includes("azelaic") ||
        text.includes("clarifying") ||
        text.includes("pore") ||
        text.includes("acne")
      ) {
        score += 6;
      }
      if (
        text.includes("cleanser") ||
        text.includes("moisturizer") ||
        text.includes("serum") ||
        text.includes("mask")
      ) {
        score += 2;
      }
      if (skinTypes.includes("oily") || skinTypes.includes("combination")) score += 3;
    }

    if (rednessHigh) {
      if (
        text.includes("calming") ||
        text.includes("soothing") ||
        text.includes("sensitive") ||
        text.includes("barrier") ||
        text.includes("centella") ||
        text.includes("aloe")
      ) {
        score += 7;
      }
      if (text.includes("azelaic") || text.includes("hydrating") || text.includes("repair")) {
        score += 3;
      }
      if (skinTypes.includes("sensitive") || skinTypes.includes("all")) score += 2;
    }

    if (oilinessHigh) {
      if (
        text.includes("niacinamide") ||
        text.includes("salicylic") ||
        text.includes("clarifying") ||
        text.includes("charcoal") ||
        text.includes("pore") ||
        text.includes("oil")
      ) {
        score += 7;
      }
      if (text.includes("gel") || text.includes("cleanser") || text.includes("spf")) score += 2;
      if (skinTypes.includes("oily") || skinTypes.includes("combination")) score += 3;
    }

    if (drynessHigh) {
      if (
        text.includes("hyaluronic") ||
        text.includes("hydrating") ||
        text.includes("moisturizer") ||
        text.includes("repair") ||
        text.includes("ceramide") ||
        text.includes("cream")
      ) {
        score += 7;
      }
      if (text.includes("barrier") || text.includes("soothing") || text.includes("probiotic")) {
        score += 3;
      }
      if (skinTypes.includes("dry") || skinTypes.includes("all")) score += 2;
    }

    if (recoveryFocus.some((focus) => text.includes(focus))) score += 4;
    if (blockedIngredients.some((ingredient) => text.includes(ingredient))) score -= 10;
    if (product.inStock === false) score -= 20;

    return { product, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((item) => item.product);
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, "../uploads/skin-reports");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const saveImage = (buffer, userId) => {
  const filename = `${userId}-${Date.now()}.jpg`;
  const filepath = path.join(UPLOAD_DIR, filename);
  fs.writeFileSync(filepath, buffer);
  return `/uploads/skin-reports/${filename}`;
};

// POST /api/skin/reports — analyze face image & save report for dermatologist review
const createSkinReport = asyncHandler(async (req, res) => {
  if (!req.file?.buffer) {
    res.status(400);
    throw new Error("Face image is required");
  }

  const analysis = await analyzeImageBuffer(req.file.buffer);
  const imageUrl = saveImage(req.file.buffer, req.user._id);

  const report = await SkinReport.create({
    user: req.user._id,
    userName: req.user.name,
    userEmail: req.user.email,
    imageUrl,
    metrics: analysis.metrics,
    skinType: analysis.skinType || 'unknown',
    blockedIngredients: analysis.blockedIngredients,
    recoveryFocus: analysis.recoveryFocus,
    recoveryPlan: analysis.recoveryPlan,
    aiSummary: analysis.aiSummary,
    status: "pending_review",
  });

  res.status(201).json(report);
});

// GET /api/skin/reports/my — customer's reports
const getMyReports = asyncHandler(async (req, res) => {
  const reports = await SkinReport.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate("dermatologist", "name email role")
    .populate("recommendedProducts.productId");
  res.json(reports);
});

// GET /api/skin/reports/:id — customer or dermatologist
const getReportById = asyncHandler(async (req, res) => {
  const report = await SkinReport.findById(req.params.id).populate(
    "dermatologist",
    "name email role"
  ).populate(
    "recommendedProducts.productId"
  );
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }

  const isOwner = report.user.toString() === req.user._id.toString();
  const isDerm =
    req.user.role === "dermatologist" || req.user.role === "admin";

  if (!isOwner && !isDerm) {
    res.status(403);
    throw new Error("Not authorized to view this report");
  }

  res.json(report);
});

// GET /api/skin/reports/derm/all — dermatologist panel
const getAllReportsForDerm = asyncHandler(async (req, res) => {
  const filter = req.query.status
    ? { status: req.query.status }
    : {};
  const reports = await SkinReport.find(filter)
    .sort({ createdAt: -1 })
    .populate("user", "name email phone");
  res.json(reports);
});

// PUT /api/skin/reports/:id/review — dermatologist recommends products
const reviewReport = asyncHandler(async (req, res) => {
  const { dermatologistNotes, recommendedProductIds } = req.body;

  const report = await SkinReport.findById(req.params.id);
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }

  const selectedProducts = recommendedProductIds?.length
    ? await Product.find({ _id: { $in: recommendedProductIds } })
    : [];

  const suggestedProducts = recommendedProductIds?.length
    ? []
    : buildSuggestedProducts(report, await Product.find({ inStock: true }));

  const finalProducts = selectedProducts.length > 0 ? selectedProducts : suggestedProducts;

  const recommendedProducts = finalProducts.map((p) => ({
    productId: p._id,
    title: p.title,
    img: p.img,
    discountedPrice: p.discountedPrice,
    reason:
      dermatologistNotes?.slice(0, 120) ||
      "Recommended based on your skin analysis",
  }));

  report.status = "reviewed";
  report.dermatologist = req.user._id;
  report.dermatologistNotes = dermatologistNotes || "";
  report.recommendedProducts = recommendedProducts;
  report.reviewedAt = new Date();
  await report.save();

  const updated = await SkinReport.findById(report._id).populate(
    "recommendedProducts.productId"
  );
  res.json(updated);
});

export {
  createSkinReport,
  getMyReports,
  getReportById,
  getAllReportsForDerm,
  reviewReport,
};
