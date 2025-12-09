import express from 'express';
import {forgotPassword, getMe, loginUser, registerUser, resendOtp, resetPassword, verifyOtp } from '../controllers/authController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

router.get("/me",protect, getMe);

export default router;

