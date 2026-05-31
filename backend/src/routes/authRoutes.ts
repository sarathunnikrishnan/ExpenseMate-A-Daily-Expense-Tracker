import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, sendSignupOtp, sendEmailUpdateOtp, deleteUserProfile } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../config/cloudinary';

const router = express.Router();

router.post('/register', registerUser as any);
router.post('/login', loginUser as any);
router.post('/send-signup-otp', sendSignupOtp as any);
router.post('/send-email-update-otp', protect as any, sendEmailUpdateOtp as any);
router.get('/profile', protect as any, getUserProfile as any);
router.put('/profile', protect as any, upload.single('profilePhoto') as any, updateUserProfile as any);
router.delete('/profile', protect as any, deleteUserProfile as any);

export default router;
