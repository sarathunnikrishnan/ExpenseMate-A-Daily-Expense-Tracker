import nodemailer from "nodemailer";
import { APP_NAME } from "../constants";
import { addLog } from "./statusLogger";

export const sendOTP = async (
  email: string,
  otp: string,
  purpose: "signup" | "email_update"
) => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user || "no-reply@expensemate.com";

  const isConfigured = Boolean(host && user && pass);

  if (!isConfigured) {
    addLog(
      "warn",
      "SMTP",
      `SMTP credentials not configured. OTP for [${email}] is: ${otp}`,
      `Purpose: ${purpose}. Set SMTP_HOST, SMTP_USER, SMTP_PASS in environment variables to send live emails.`
    );
    console.log(`[OTP VERIFICATION MODE] ${purpose} OTP for ${email}: ${otp}`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const subject =
      purpose === "signup"
        ? `Verify your ${APP_NAME} Account`
        : "Verify your new Email Address";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #4F46E5; text-align: center;">${APP_NAME}</h2>
        <p style="color: #374151; font-size: 16px;">Hello,</p>
        <p style="color: #374151; font-size: 16px;">
          ${
            purpose === "signup"
              ? "Thank you for signing up! Please use the following One-Time Password (OTP) to verify your account."
              : "You requested to update your email address. Please use the following One-Time Password (OTP) to confirm this change."
          }
        </p>
        <div style="background-color: #F3F4F6; padding: 16px; text-align: center; border-radius: 4px; margin: 24px 0;">
          <h1 style="color: #111827; letter-spacing: 4px; margin: 0;">${otp}</h1>
        </div>
        <p style="color: #6B7280; font-size: 14px; text-align: center;">This code will expire in 10 minutes.</p>
        <p style="color: #374151; font-size: 16px;">If you did not request this, please ignore this email.</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"${APP_NAME}" <${from}>`,
      to: email,
      subject,
      html,
    });

    addLog("success", "SMTP", `OTP email successfully sent to ${email}`);
  } catch (error: any) {
    const errorDetails = error?.message || String(error);
    addLog(
      "error",
      "SMTP",
      `Failed to send OTP email to ${email}`,
      `Error: ${errorDetails}. Fallback OTP code is: ${otp}`
    );
    console.error(`[SMTP ERROR] Could not send email. Fallback OTP for ${email}: ${otp}`, errorDetails);

    // If sending fails (e.g. wrong password or port), log fallback OTP so registration is not permanently blocked
    addLog("warn", "SMTP", `[FALLBACK] Use OTP: ${otp} for ${email} to proceed.`);
  }
};
