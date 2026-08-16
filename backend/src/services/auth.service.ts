/**
 * @file auth.service.ts
 * @description AuthService handling signup/login OTP generation, registration, password hashing,
 * token signing, and default user category initialization.
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Category from '../models/Category';
import OTP from '../models/OTP';
import { config } from '../config/env.config';
import { sendOTP } from '../utils/mailer';
import { OTP_PURPOSE, DEFAULT_CATEGORIES } from '../constants';

export class AuthService {
  generateToken(id: string): string {
    return jwt.sign({ id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as any,
    });
  }

  async sendSignupOtp(email: string): Promise<void> {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteMany({ email, type: OTP_PURPOSE.SIGNUP });
    await OTP.create({ email, otp: otpCode, type: OTP_PURPOSE.SIGNUP });
    await sendOTP(email, otpCode, OTP_PURPOSE.SIGNUP);
  }

  async verifyOtp(
    email: string,
    otp: string,
    type: typeof OTP_PURPOSE[keyof typeof OTP_PURPOSE]
  ): Promise<boolean> {
    const validOtp = await OTP.findOne({ email, otp, type });
    return !!validOtp;
  }

  async clearOtps(
    email: string,
    type: typeof OTP_PURPOSE[keyof typeof OTP_PURPOSE]
  ): Promise<void> {
    await OTP.deleteMany({ email, type });
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async createDefaultCategories(userId: any): Promise<void> {
    const defaultCategories = DEFAULT_CATEGORIES.map((c) => ({
      ...c,
      userId,
    }));
    await Category.insertMany(defaultCategories);
  }
}

export const authService = new AuthService();
