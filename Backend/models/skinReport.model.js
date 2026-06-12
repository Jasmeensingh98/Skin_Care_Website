import mongoose from "mongoose";

const recommendedProductSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  title: String,
  img: String,
  discountedPrice: Number,
  reason: String,
});

const skinReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: String,
    userEmail: String,
    imageUrl: String,
    metrics: {
      acne: { type: Number, default: 0 },
      redness: { type: Number, default: 0 },
      oiliness: { type: Number, default: 0 },
      dryness: { type: Number, default: 0 },
    },
    blockedIngredients: [String],
    recoveryFocus: [String],
    recoveryPlan: {
      am: [String],
      pm: [String],
    },
    aiSummary: String,
    skinType: {
      type: String,
      enum: ["oily", "dry", "combination", "sensitive", "normal", "unknown"],
      default: "unknown",
    },
    status: {
      type: String,
      enum: ["pending_review", "reviewed"],
      default: "pending_review",
    },
    dermatologist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dermatologistNotes: String,
    recommendedProducts: [recommendedProductSchema],
    reviewedAt: Date,
  },
  { timestamps: true }
);

const SkinReport = mongoose.model("SkinReport", skinReportSchema);
export default SkinReport;
