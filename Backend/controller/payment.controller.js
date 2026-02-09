import asyncHandler from "express-async-handler";
import Razorpay from "razorpay";
import Order from "../models/order.model.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
const createPaymentOrder = asyncHandler(async (req, res) => {
  const { amount, currency = "INR", orderId } = req.body;

  const options = {
    amount: amount * 100, // Amount in paise
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
    res.status(500);
    throw new Error("Failed to create payment order");
  }
});

// Verify Payment
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = req.body;

  const hmac = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
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

  try {
    const payment = await razorpayInstance.payments.fetch(paymentId);
    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to fetch payment details");
  }
});

export { createPaymentOrder, verifyPayment, getPaymentStatus };
