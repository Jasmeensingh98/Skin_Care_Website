import express from "express";
import {
  getPaymentConfig,
  createPaymentOrder,
  verifyPayment,
  getPaymentStatus,
} from "../controller/payment.controller.js";

const router = express.Router();

// Create payment order
router.post("/create-order", createPaymentOrder);

// Get Razorpay public config
router.get("/config", getPaymentConfig);

// Verify payment
router.post("/verify", verifyPayment);

// Get payment status
router.get("/status/:paymentId", getPaymentStatus);

export default router;
