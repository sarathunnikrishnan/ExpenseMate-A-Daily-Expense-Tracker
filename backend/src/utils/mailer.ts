import nodemailer from "nodemailer";

export const sendOTP = async (
  email: string,
  otp: string,
  purpose: "signup" | "email_update",
) => {
  // const isConfigured = process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_FROM;

  // if (!isConfigured) {
  //   console.log('\n=============================================');
  //   console.log(`[DEVELOPMENT MODE] OTP for ${email}`);
  //   console.log(`Purpose: ${purpose}`);
  //   console.log(`OTP: ${otp}`);
  //   console.log('=============================================\n');
  //   return;
  // }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const subject =
      purpose === "signup"
        ? "Verify your Expense Tracker Account"
        : "Verify your new Email Address";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #4F46E5; text-align: center;">Expense Tracker</h2>
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
      from: `"Expense Tracker" <${process.env.SMTP_FROM}>`,
      to: email,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send OTP email");
  }
};
