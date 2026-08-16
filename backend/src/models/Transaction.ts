/**
 * @file Transaction.ts
 * @description Mongoose schema and TypeScript interface for Transaction entity.
 */

import mongoose, { Document, Schema } from 'mongoose';
import { TRANSACTION_TYPES } from '../constants';

export interface ITransaction extends Document {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'saving' | 'other';
  categoryId: mongoose.Types.ObjectId;
  accountId: mongoose.Types.ObjectId;
  notes?: string;
  date: Date;
  userId: mongoose.Types.ObjectId;
}

const transactionSchema = new Schema<ITransaction>(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: Object.values(TRANSACTION_TYPES), required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    accountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    notes: { type: String },
    date: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
