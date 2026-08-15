import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Category from "../models/Category";
import OTP from "../models/OTP";
import Account from "../models/Account";
import Transaction from "../models/Transaction";
import Budget from "../models/Budget";
import { deleteImage } from "../config/cloudinary";
import { sendOTP } from "../utils/mailer";
import { getJwtSecret } from "../middleware/authMiddleware";

const generateToken = (id: string) => {
  return jwt.sign({ id }, getJwtSecret(), {
    expiresIn: (process.env.JWT_EXPIRES_IN || "30d") as any,
  });
};

export const sendSignupOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({ email, type: "signup" }); // Clear old OTPs
    await OTP.create({ email, otp: otpCode, type: "signup" });

    await sendOTP(email, otpCode, "signup");
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, otp } = req.body;

  try {
    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const validOtp = await OTP.findOne({ email, otp, type: "signup" });
    if (!validOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      // Create default categories for the new user
      const defaultCategories = [
        {
          name: "Food",
          icon: "utensils",
          color: "#EF4444",
          type: "expense",
          userId: user._id,
          isDefault: true,
        },
        {
          name: "Travel",
          icon: "plane",
          color: "#3B82F6",
          type: "expense",
          userId: user._id,
          isDefault: true,
        },
        {
          name: "Shopping",
          icon: "shopping-bag",
          color: "#8B5CF6",
          type: "expense",
          userId: user._id,
          isDefault: true,
        },
        {
          name: "Bills",
          icon: "file-text",
          color: "#F59E0B",
          type: "expense",
          userId: user._id,
          isDefault: true,
        },
        {
          name: "Entertainment",
          icon: "film",
          color: "#EC4899",
          type: "expense",
          userId: user._id,
          isDefault: true,
        },
        {
          name: "Health",
          icon: "heart",
          color: "#10B981",
          type: "expense",
          userId: user._id,
          isDefault: true,
        },
        {
          name: "Salary",
          icon: "dollar-sign",
          color: "#10B981",
          type: "income",
          userId: user._id,
          isDefault: true,
        },
        {
          name: "Others",
          icon: "more-horizontal",
          color: "#6B7280",
          type: "expense",
          userId: user._id,
          isDefault: true,
        },
      ];
      await Category.insertMany(defaultCategories);

      await OTP.deleteMany({ email, type: "signup" }); // Cleanup

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        themePreference: user.themePreference,
        profilePhoto: user.profilePhoto,
        reportWidgetOrder: user.reportWidgetOrder,
        token: generateToken(user._id as unknown as string),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password as string))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        themePreference: user.themePreference,
        profilePhoto: user.profilePhoto,
        reportWidgetOrder: user.reportWidgetOrder,
        token: generateToken(user._id as unknown as string),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    // req.user is set in authMiddleware
    const user = await User.findById((req as any).user._id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const sendEmailUpdateOtp = async (req: Request, res: Response) => {
  const { newEmail } = req.body;
  try {
    const userExists = await User.findOne({ email: newEmail });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Email is already in use by another account" });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({ email: newEmail, type: "email_update" });
    await OTP.create({ email: newEmail, otp: otpCode, type: "email_update" });

    await sendOTP(newEmail, otpCode, "email_update");
    res.status(200).json({ message: "OTP sent to new email" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user._id);

    if (user) {
      user.name = req.body.name || user.name;

      if (req.body.email && req.body.email !== user.email) {
        if (!req.body.otp) {
          return res
            .status(400)
            .json({ message: "OTP is required to change email" });
        }
        const validOtp = await OTP.findOne({
          email: req.body.email,
          otp: req.body.otp,
          type: "email_update",
        });
        if (!validOtp) {
          return res
            .status(400)
            .json({ message: "Invalid or expired OTP for email update" });
        }
        user.email = req.body.email;
        await OTP.deleteMany({ email: req.body.email, type: "email_update" });
      }

      if (req.body.password) {
        if (!req.body.oldPassword) {
          return res.status(400).json({
            message: "Please provide your current password to set a new one.",
          });
        }

        const isMatch = await bcrypt.compare(
          req.body.oldPassword,
          user.password as string,
        );
        if (!isMatch) {
          return res.status(400).json({ message: "Incorrect old password." });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      if (
        req.body.reportWidgetOrder &&
        Array.isArray(req.body.reportWidgetOrder)
      ) {
        user.reportWidgetOrder = req.body.reportWidgetOrder;
      }

      if (req.file) {
        if (user.profilePhoto) {
          await deleteImage(user.profilePhoto);
        }
        user.profilePhoto = (req.file as any).path;
      } else if (req.body.removeProfilePhoto === "true") {
        if (user.profilePhoto) {
          await deleteImage(user.profilePhoto);
        }
        user.profilePhoto = "";
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        themePreference: updatedUser.themePreference,
        profilePhoto: updatedUser.profilePhoto,
        reportWidgetOrder: updatedUser.reportWidgetOrder,
        token: generateToken(updatedUser._id as unknown as string),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete associated data
    await Promise.all([
      Category.deleteMany({ userId }),
      Account.deleteMany({ userId }),
      Transaction.deleteMany({ userId }),
      Budget.deleteMany({ userId }),
      OTP.deleteMany({ email: user.email }),
    ]);

    if (user.profilePhoto) {
      await deleteImage(user.profilePhoto);
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
