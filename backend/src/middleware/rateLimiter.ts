/**
 * @file rateLimiter.ts
 * @description Rate limiting middleware for preventing brute-force login and OTP spamming attacks.
 */

import rateLimit from 'express-rate-limit';
import { RATE_LIMIT_CONSTANTS } from '../constants';
import { AUTH_MESSAGES } from '../messages';

export const authRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_CONSTANTS.WINDOW_MS,
  max: RATE_LIMIT_CONSTANTS.AUTH_MAX_ATTEMPTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: AUTH_MESSAGES.TOO_MANY_AUTH_ATTEMPTS,
  },
});

export const apiRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_CONSTANTS.WINDOW_MS,
  max: RATE_LIMIT_CONSTANTS.API_MAX_ATTEMPTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: AUTH_MESSAGES.TOO_MANY_REQUESTS,
  },
});
