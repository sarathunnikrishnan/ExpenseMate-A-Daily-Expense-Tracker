import mongoose, { Document, Schema } from 'mongoose';

export interface IBudget extends Document {
  month: number;
  year: number;
  budgetAmount: number;
  spentAmount: number;
  userId: mongoose.Types.ObjectId;
}

const budgetSchema = new Schema<IBudget>(
  {
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    budgetAmount: { type: Number, required: true },
    spentAmount: { type: Number, default: 0 },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBudget>('Budget', budgetSchema);
