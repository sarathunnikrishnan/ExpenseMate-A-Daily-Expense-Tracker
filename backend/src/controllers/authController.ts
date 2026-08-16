/**
 * @file authController.ts
 * @description Controller endpoints for user authentication, OTP verification, profile management, and account deletion.
 * Delegates business operations to AuthService and UserService.
 */

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { authService, userService } from '../services';
import { AuthRequest } from '../types';
import { AUTH_MESSAGES } from '../messages';
import { OTP_PURPOSE } from '../constants';

export const sendSignupOtp = async (req: Request, res: Response): Promise<Response | void> => {
  const { email } = req.body;
  try {
    const userExists = await userService.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: AUTH_MESSAGES.USER_EXISTS });
    }
    await authService.sendSignupOtp(email);
    res.status(200).json({ message: AUTH_MESSAGES.OTP_SENT_SUCCESS });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const registerUser = async (req: Request, res: Response): Promise<Response | void> => {
  const { name, email, password, otp } = req.body;
  try {
    if (!otp) return res.status(400).json({ message: AUTH_MESSAGES.OTP_REQUIRED });

    const validOtp = await authService.verifyOtp(email, otp, OTP_PURPOSE.SIGNUP);
    if (!validOtp) return res.status(400).json({ message: AUTH_MESSAGES.INVALID_OR_EXPIRED_OTP });

    const userExists = await userService.findByEmail(email);
    if (userExists) return res.status(400).json({ message: AUTH_MESSAGES.USER_EXISTS });

    const hashedPassword = await authService.hashPassword(password);
    const user = await userService.create({ name, email, password: hashedPassword });

    if (user) {
      await authService.createDefaultCategories(user._id);
      await authService.clearOtps(email, OTP_PURPOSE.SIGNUP);

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        themePreference: user.themePreference,
        profilePhoto: user.profilePhoto,
        reportWidgetOrder: user.reportWidgetOrder,
        token: authService.generateToken(user._id as unknown as string),
      });
    }
    res.status(400).json({ message: AUTH_MESSAGES.INVALID_USER_DATA });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<Response | void> => {
  const { email, password } = req.body;
  try {
    const user = await userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password as string))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        themePreference: user.themePreference,
        profilePhoto: user.profilePhoto,
        reportWidgetOrder: user.reportWidgetOrder,
        token: authService.generateToken(user._id as unknown as string),
      });
    }
    res.status(401).json({ message: AUTH_MESSAGES.INVALID_CREDENTIALS });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const user = await userService.findById(req.user?._id);
    if (user) {
      const userObj = user.toObject();
      delete (userObj as any).password;
      return res.json(userObj);
    }
    res.status(404).json({ message: AUTH_MESSAGES.USER_NOT_FOUND });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const sendEmailUpdateOtp = async (req: Request, res: Response): Promise<Response | void> => {
  const { newEmail } = req.body;
  try {
    const userExists = await userService.findByEmail(newEmail);
    if (userExists) {
      return res.status(400).json({ message: AUTH_MESSAGES.EMAIL_IN_USE });
    }
    await authService.sendSignupOtp(newEmail);
    res.status(200).json({ message: AUTH_MESSAGES.OTP_SENT_NEW_EMAIL });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const user = await userService.findById(req.user?._id);
    if (!user) return res.status(404).json({ message: AUTH_MESSAGES.USER_NOT_FOUND });

    user.name = req.body.name || user.name;

    if (req.body.email && req.body.email !== user.email) {
      if (!req.body.otp) return res.status(400).json({ message: AUTH_MESSAGES.OTP_REQUIRED_FOR_EMAIL_CHANGE });
      const valid = await authService.verifyOtp(req.body.email, req.body.otp, OTP_PURPOSE.EMAIL_UPDATE);
      if (!valid) return res.status(400).json({ message: AUTH_MESSAGES.INVALID_OR_EXPIRED_EMAIL_OTP });
      user.email = req.body.email;
      await authService.clearOtps(req.body.email, OTP_PURPOSE.EMAIL_UPDATE);
    }

    if (req.body.password) {
      if (!req.body.oldPassword) return res.status(400).json({ message: AUTH_MESSAGES.CURRENT_PASSWORD_REQUIRED });
      const isMatch = await bcrypt.compare(req.body.oldPassword, user.password as string);
      if (!isMatch) return res.status(400).json({ message: AUTH_MESSAGES.INCORRECT_OLD_PASSWORD });
      user.password = await authService.hashPassword(req.body.password);
    }

    if (req.body.reportWidgetOrder && Array.isArray(req.body.reportWidgetOrder)) {
      user.reportWidgetOrder = req.body.reportWidgetOrder;
    }

    if (req.file) {
      if (user.profilePhoto) await userService.removeProfilePhoto(user.profilePhoto);
      user.profilePhoto = (req.file as any).path;
    } else if (req.body.removeProfilePhoto === 'true') {
      if (user.profilePhoto) await userService.removeProfilePhoto(user.profilePhoto);
      user.profilePhoto = '';
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      themePreference: updatedUser.themePreference,
      profilePhoto: updatedUser.profilePhoto,
      reportWidgetOrder: updatedUser.reportWidgetOrder,
      token: authService.generateToken(updatedUser._id as unknown as string),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUserProfile = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const userId = req.user?._id;
    const user = await userService.findById(userId);
    if (!user) return res.status(404).json({ message: AUTH_MESSAGES.USER_NOT_FOUND });

    await userService.deleteUserData(userId, user.email);
    if (user.profilePhoto) await userService.removeProfilePhoto(user.profilePhoto);
    await userService.deleteById(userId);

    res.status(200).json({ message: AUTH_MESSAGES.USER_DELETED_SUCCESS });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
