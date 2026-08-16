/**
 * @file auth.types.ts
 * @description Type definitions for authentication requests, responses, and user contexts.
 */

import { Request } from 'express';
import { IUser } from '../models/User';

export interface AuthenticatedUser {
  _id: string;
  name: string;
  email: string;
  themePreference?: string;
  profilePhoto?: string;
  reportWidgetOrder?: string[];
}

export interface AuthRequest extends Request {
  user?: IUser & { _id: any };
}

export interface AuthResponseData {
  _id: string;
  name: string;
  email: string;
  themePreference?: string;
  profilePhoto?: string;
  reportWidgetOrder?: string[];
  token: string;
}
