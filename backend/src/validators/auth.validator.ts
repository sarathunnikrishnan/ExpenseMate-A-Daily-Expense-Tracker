/**
 * @file auth.validator.ts
 * @description Input validation functions for authentication and profile management API calls.
 */

export const validateRegisterInput = (data: { name?: string; email?: string; password?: string; otp?: string }) => {
  if (!data.name || !data.email || !data.password) {
    return { valid: false, message: 'Name, email, and password are required' };
  }
  if (!data.otp) {
    return { valid: false, message: 'OTP is required' };
  }
  if (data.password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }
  return { valid: true };
};

export const validateLoginInput = (data: { email?: string; password?: string }) => {
  if (!data.email || !data.password) {
    return { valid: false, message: 'Email and password are required' };
  }
  return { valid: true };
};
