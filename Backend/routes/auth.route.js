import express from "express";
import { loginUser, logOut, registerUser } from "../controller/auth.controller.js";
const router = express.Router();

//register user router
router.post("/register", registerUser);

//login user router
router.post("/login", loginUser);

//logout user
router.get("/logout", logOut);

export default router;
