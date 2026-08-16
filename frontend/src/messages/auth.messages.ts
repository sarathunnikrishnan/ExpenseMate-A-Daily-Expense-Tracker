/**
 * @file auth.messages.ts
 * @description Centralized frontend domain messages for authentication and user profile operations.
 */

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGIN_FAILED: 'Login failed',
  OTP_SENT: 'OTP sent to your email',
  OTP_SENT_TO_EMAIL: (email: string): string => `OTP sent to ${email}`,
  OTP_SEND_FAILED: 'Failed to send OTP',
  REGISTRATION_SUCCESS: 'Account created successfully',
  REGISTRATION_FAILED: 'Registration failed',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  PROFILE_UPDATED: 'Profile updated successfully',
  PROFILE_UPDATE_FAILED: 'Failed to update profile',
  ACCOUNT_DELETED: 'Account deleted successfully',
  ACCOUNT_DELETE_FAILED: 'Failed to delete account',
  LAYOUT_SAVED: 'Layout saved successfully',
  LAYOUT_SAVE_FAILED: 'Failed to save layout',
} as const;
