/**
 * @file user.service.ts
 * @description UserService encapsulating user account management, profile updates, and cascade deletion.
 * Extends BaseService.
 */

import { Types } from 'mongoose';
import { BaseService } from './base.service';
import User, { IUser } from '../models/User';
import Category from '../models/Category';
import Account from '../models/Account';
import Transaction from '../models/Transaction';
import Budget from '../models/Budget';
import OTP from '../models/OTP';
import { deleteImage } from '../config/cloudinary';

export class UserService extends BaseService<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email });
  }

  async deleteUserData(userId: string | Types.ObjectId, email: string): Promise<void> {
    await Promise.all([
      Category.deleteMany({ userId }),
      Account.deleteMany({ userId }),
      Transaction.deleteMany({ userId }),
      Budget.deleteMany({ userId }),
      OTP.deleteMany({ email }),
    ]);
  }

  async removeProfilePhoto(photoUrl: string): Promise<void> {
    if (photoUrl) {
      await deleteImage(photoUrl);
    }
  }
}

export const userService = new UserService();
