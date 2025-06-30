import express from "express";
import {
  login,
  register,
  googleAuth,
  sendOtp,
  verifyOtp,
} from "../controllers/authController.js";

const router = express.Router();

// Authentication routes
router.post("/login", login);
router.post("/register", register);
router.post("/google", googleAuth);

// OTP-based 2FA routes
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

export default router;
