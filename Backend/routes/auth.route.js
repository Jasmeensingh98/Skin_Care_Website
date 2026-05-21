import express from "express";
import { loginUser, logOut, registerUser, getMe } from "../controller/auth.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logOut);
router.get("/me", protect, getMe);

export default router;
