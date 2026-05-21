import asyncHandler from "express-async-handler";
import generateToken from "../util/generateToken.js";
import User from "../models/user.model.js";

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || "",
  role: user.role || "user",
});

// Register user — saves credentials in MongoDB (password hashed via user model)
// Route: POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email, and password");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const userExist = await User.findOne({ email: normalizedEmail });
  if (userExist) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    phone: phone?.trim() || "",
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json(userResponse(user));
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Login user
// Route: POST /api/v1/auth/login
// Access: Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json(userResponse(user));
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// Logout user
// Route: POST /api/v1/auth/logout
// Access: Public
const logOut = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "LogOut Successfully" });
});

// Get current logged-in user (from JWT cookie)
// Route: GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(userResponse(req.user));
});

export { logOut, loginUser, registerUser, getMe };
