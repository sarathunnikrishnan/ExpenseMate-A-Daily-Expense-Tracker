/**
 * @file auth.messages.ts
 * @description Centralized domain messages for authentication, registration, OTP, and user profile operations.
 */

export const AUTH_MESSAGES = {
  USER_EXISTS: 'User already exists',
  OTP_SENT_SUCCESS: 'OTP sent successfully',
  OTP_SENT_NEW_EMAIL: 'OTP sent to new email',
  OTP_REQUIRED: 'OTP is required',
  INVALID_OR_EXPIRED_OTP: 'Invalid or expired OTP',
  INVALID_OR_EXPIRED_EMAIL_OTP: 'Invalid or expired OTP for email update',
  INVALID_USER_DATA: 'Invalid user data',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  EMAIL_IN_USE: 'Email is already in use by another account',
  OTP_REQUIRED_FOR_EMAIL_CHANGE: 'OTP is required to change email',
  CURRENT_PASSWORD_REQUIRED: 'Current password required',
  INCORRECT_OLD_PASSWORD: 'Incorrect old password.',
  USER_DELETED_SUCCESS: 'User deleted successfully',
  USER_NOT_AUTHORIZED: 'User not authorized',
  TOKEN_FAILED: 'Not authorized, token failed',
  NO_TOKEN_PROVIDED: 'Not authorized, no token provided',
  UNAUTHENTICATED: 'User not found or unauthenticated',
  TOO_MANY_AUTH_ATTEMPTS: 'Too many authentication attempts, please try again after 15 minutes.',
  TOO_MANY_REQUESTS: 'Too many requests, please try again later.',
} as const;
