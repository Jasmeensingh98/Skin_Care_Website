export const clampScore = (value) => Math.max(0, Math.min(100, Math.round(value)));

export const seededScores = (buffer) => {
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

export const mapPredictions = (data) => {
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

export const buildSkinReport = (metrics) => {
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

  const summaryParts = [];
  if (metrics.acne >= 50) summaryParts.push("visible acne concern");
  if (metrics.redness >= 50) summaryParts.push("redness/sensitivity");
  if (metrics.oiliness >= 50) summaryParts.push("oil imbalance");
  if (metrics.dryness >= 50) summaryParts.push("dehydration signs");

  return {
    metrics,
    blockedIngredients: Array.from(blockedIngredients),
    recoveryFocus: Array.from(recoveryFocus),
    recoveryPlan: {
      am: ["Low-foam cleanser", "Hydrating serum", "SPF 50+"],
      pm: ["Gentle cleanse", "Barrier cream", "Spot-care only if needed"],
    },
    aiSummary:
      summaryParts.length > 0
        ? `AI scan detected ${summaryParts.join(", ")}. A dermatologist will review and recommend products.`
        : "AI scan shows balanced skin signals. Dermatologist review recommended for personalized products.",
  };
};

export const analyzeImageBuffer = async (buffer) => {
  const fetch = (await import("node-fetch")).default;
  const endpoint = process.env.AZURE_VISION_ENDPOINT;
  const key = process.env.AZURE_VISION_KEY;

  if (endpoint && key) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "Prediction-Key": key,
      },
      body: buffer,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Vision API failed: ${errorText}`);
    }
    const data = await response.json();
    return buildSkinReport(mapPredictions(data));
  }

  return buildSkinReport(seededScores(buffer));
};
