import asyncHandler from "express-async-handler";
import fetch from "node-fetch";

const clampScore = (value) => Math.max(0, Math.min(100, Math.round(value)));

const seededScores = (buffer) => {
  let hash = 0;
  for (let i = 0; i < buffer.length; i += 1) {
    hash = (hash + buffer[i] * (i + 1)) % 10000;
  }
  return {
    acne: clampScore((hash % 100) + 10),
    redness: clampScore(((hash * 3) % 100) + 5),
    oiliness: clampScore(((hash * 7) % 100) + 5),
    dryness: clampScore(((hash * 11) % 100) + 5),
  };
};

const mapPredictions = (data) => {
  const metrics = { acne: 0, redness: 0, oiliness: 0, dryness: 0 };
  const predictions = Array.isArray(data?.predictions) ? data.predictions : [];
  predictions.forEach((prediction) => {
    const tag = String(prediction.tagName || "").toLowerCase();
    const score = clampScore((prediction.probability || 0) * 100);
    if (tag.includes("acne")) metrics.acne = score;
    if (tag.includes("red")) metrics.redness = score;
    if (tag.includes("oil")) metrics.oiliness = score;
    if (tag.includes("dry")) metrics.dryness = score;
  });
  return metrics;
};

const buildSkinReport = (metrics) => {
  const blockedIngredients = new Set();
  const recoveryFocus = new Set();

  if (metrics.acne >= 40) {
    blockedIngredients.add("Isopropyl myristate");
    blockedIngredients.add("Coconut oil");
    recoveryFocus.add("Gentle acne care");
  }
  if (metrics.redness >= 40) {
    blockedIngredients.add("Fragrance");
    blockedIngredients.add("Denatured alcohol");
    recoveryFocus.add("Calming + barrier repair");
  }
  if (metrics.oiliness >= 40) {
    blockedIngredients.add("Heavy occlusives");
    recoveryFocus.add("Oil balance");
  }
  if (metrics.dryness >= 40) {
    blockedIngredients.add("Strong exfoliants");
    recoveryFocus.add("Deep hydration");
  }

  return {
    blockedIngredients: Array.from(blockedIngredients),
    recoveryFocus: Array.from(recoveryFocus),
    recoveryPlan: {
      am: ["Low-foam cleanser", "Hydrating serum", "SPF 50+"],
      pm: ["Gentle cleanse", "Barrier cream", "Spot-care only if needed"],
    },
  };
};

const analyzeSkin = asyncHandler(async (req, res) => {
  if (!req.file?.buffer) {
    res.status(400);
    throw new Error("Image is required");
  }

  const endpoint = process.env.AZURE_VISION_ENDPOINT;
  const key = process.env.AZURE_VISION_KEY;
  let metrics = null;

  if (endpoint && key) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "Prediction-Key": key,
      },
      body: req.file.buffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      res.status(502);
      throw new Error(`Azure Vision request failed: ${errorText}`);
    }

    const data = await response.json();
    metrics = mapPredictions(data);
  } else {
    metrics = seededScores(req.file.buffer);
  }

  const report = buildSkinReport(metrics);
  res.status(200).json({ metrics, ...report });
});

export { analyzeSkin };
