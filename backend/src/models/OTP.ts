import mongoose, { Document, Schema } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string;
  type: 'signup' | 'email_update';
  createdAt: Date;
}

const otpSchema = new Schema<IOTP>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  type: { type: String, enum: ['signup', 'email_update'], required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 } // Document expires in 600s (10 minutes)
});

const OTP = mongoose.model<IOTP>('OTP', otpSchema);

export default OTP;
