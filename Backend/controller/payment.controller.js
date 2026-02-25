import asyncHandler from "express-async-handler";
import Razorpay from "razorpay";
import Order from "../models/order.model.js";
import crypto from "crypto";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env"), override: true });

const getRazorpayConfig = () => {
  const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

  if (!keyId || !keySecret) {
    const error = new Error(
      "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Backend/.env"
    );
    error.statusCode = 500;
    throw error;
  }

  if (!keyId.startsWith("rzp_test_") && !keyId.startsWith("rzp_live_")) {
    const error = new Error(
      "Invalid RAZORPAY_KEY_ID format. It should start with rzp_test_ or rzp_live_"
    );
    error.statusCode = 500;
    throw error;
  }

  return { keyId, keySecret };
};

const getRazorpayInstance = () => {
  const { keyId, keySecret } = getRazorpayConfig();
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

const getPaymentConfig = asyncHandler(async (req, res) => {
  const { keyId } = getRazorpayConfig();
  res.status(200).json({
    success: true,
    key: keyId,
  });
});

// Create Razorpay Order
const createPaymentOrder = asyncHandler(async (req, res) => {
  const { amount, currency = "INR", orderId } = req.body;

  const razorpayInstance = getRazorpayInstance();

  const parsedAmount = Number(amount);

  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    res.status(400);
    throw new Error("Invalid amount for payment order");
  }

  const options = {
    amount: Math.round(parsedAmount * 100), // Amount in paise
    currency,
    receipt: `order_${orderId}`,
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    const details =
      error?.error?.description ||
      error?.description ||
      error?.message ||
      "Unknown Razorpay error";

    res.status(error?.statusCode || 500).json({
      success: false,
      message: "Failed to create payment order",
      details,
    });
  }
});

// Verify Payment
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = req.body;
  const { keySecret } = getRazorpayConfig();

  const hmac = crypto
    .createHmac("sha256", keySecret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (hmac === razorpay_signature) {
    // Payment verified, update order status
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: 1 }, // 1 = payment confirmed
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } else {
    res.status(400);
    throw new Error("Payment verification failed");
  }
});

// Get payment status
const getPaymentStatus = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const razorpayInstance = getRazorpayInstance();

  try {
    const payment = await razorpayInstance.payments.fetch(paymentId);
    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    const details =
      error?.error?.description ||
      error?.description ||
      error?.message ||
      "Unknown Razorpay error";

    res.status(error?.statusCode || 500).json({
      success: false,
      message: "Failed to fetch payment details",
      details,
    });
  }
});

export { getPaymentConfig, createPaymentOrder, verifyPayment, getPaymentStatus };
