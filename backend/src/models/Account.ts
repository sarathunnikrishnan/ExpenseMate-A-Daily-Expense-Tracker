/**
 * @file Account.ts
 * @description Mongoose schema and TypeScript interface for Account entity.
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IAccount extends Document {
  name: string;
  type: string;
  initialBalance: number;
  interestRate?: number;
  maturityDate?: Date;
  currentValue?: number;
  userId: mongoose.Types.ObjectId;
}

const accountSchema = new Schema<IAccount>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true, default: 'Bank' },
    initialBalance: { type: Number, default: 0 },
    interestRate: { type: Number },
    maturityDate: { type: Date },
    currentValue: { type: Number },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IAccount>('Account', accountSchema);
