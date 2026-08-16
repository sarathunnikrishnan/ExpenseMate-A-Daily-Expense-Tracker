/**
 * @file authMiddleware.ts
 * @description Authentication middleware for verifying JWT tokens and attaching current user context.
 */

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { config } from '../config/env.config';
import { AuthRequest } from '../types';
import { AUTH_MESSAGES } from '../messages';

export const getJwtSecret = (): string => {
  return config.jwtSecret;
};

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, getJwtSecret());
      req.user = (await User.findById(decoded.id).select('-password')) || undefined;

      if (!req.user) {
        return res.status(401).json({ message: AUTH_MESSAGES.UNAUTHENTICATED });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: AUTH_MESSAGES.TOKEN_FAILED });
    }
  }

  if (!token) {
    return res.status(401).json({ message: AUTH_MESSAGES.NO_TOKEN_PROVIDED });
  }
};
