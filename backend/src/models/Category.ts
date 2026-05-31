import mongoose, { Document, Schema } from 'mongoose';
import { CATEGORY_TYPES, INVESTMENT_BEHAVIORS } from '../constants';

export interface ICategory extends Document {
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense' | 'investment' | 'saving' | 'other';
  investmentBehavior?: 'fixed' | 'market';
  userId: mongoose.Types.ObjectId;
  isDefault: boolean;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true },
    type: { type: String, enum: Object.values(CATEGORY_TYPES), required: true },
    investmentBehavior: { type: String, enum: Object.values(INVESTMENT_BEHAVIORS) },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>('Category', categorySchema);
