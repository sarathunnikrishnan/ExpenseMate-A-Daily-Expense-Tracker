/**
 * @file authRoutes.ts
 * @description API routes for user registration, authentication, OTP verification, and user profile management.
 */

import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  sendSignupOtp,
  sendEmailUpdateOtp,
  deleteUserProfile,
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import upload from '../config/cloudinary';

const router = express.Router();

router.post('/send-otp', sendSignupOtp);
router.post('/register', registerUser);
router.post('/login', loginUser);

router.post('/send-email-update-otp', protect, sendEmailUpdateOtp);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('profilePhoto'), updateUserProfile)
  .delete(protect, deleteUserProfile);

export default router;
