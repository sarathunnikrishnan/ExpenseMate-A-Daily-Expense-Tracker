import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  themePreference: 'light' | 'dark';
  profilePhoto?: string;
  reportWidgetOrder?: string[];
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    themePreference: { type: String, enum: ['light', 'dark'], default: 'dark' },
    profilePhoto: { type: String, default: '' },
    reportWidgetOrder: { 
      type: [String], 
      default: ['summaryCards', 'expensePieChart', 'incomeExpenseBarChart', 'savingsLineChart', 'topExpensesList', 'cumulativeAreaChart'] 
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);
