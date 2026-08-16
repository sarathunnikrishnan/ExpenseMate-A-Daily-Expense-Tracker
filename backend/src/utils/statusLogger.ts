/**
 * @file statusLogger.ts
 * @description Centralized logging buffer and system diagnostics health status utility.
 */

import mongoose from 'mongoose';

export type LogCategory = 'DATABASE' | 'SERVER' | 'CLOUDINARY' | 'SMTP' | 'API' | 'SYSTEM';
export type LogLevel = 'info' | 'warn' | 'error' | 'success';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  details?: string;
}

const MAX_LOGS = 100;
const logsBuffer: LogEntry[] = [];
let dbLastError: string | null = null;

export const addLog = (
  level: LogLevel,
  category: LogCategory,
  message: string,
  details?: string
): void => {
  const entry: LogEntry = {
    id: Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    level,
    category,
    message,
    details,
  };

  if (level === 'error' && category === 'DATABASE') {
    dbLastError = message + (details ? `: ${details}` : '');
  } else if (level === 'success' && category === 'DATABASE') {
    dbLastError = null;
  }

  logsBuffer.unshift(entry);
  if (logsBuffer.length > MAX_LOGS) {
    logsBuffer.pop();
  }

  const prefix = `[${entry.timestamp}] [${entry.category}] [${entry.level.toUpperCase()}]:`;
  if (level === 'error') {
    console.error(prefix, message, details || '');
  } else if (level === 'warn') {
    console.warn(prefix, message, details || '');
  } else {
    console.log(prefix, message, details || '');
  }
};

export const getLogs = (): LogEntry[] => logsBuffer;

export const getDbLastError = (): string | null => dbLastError;

export const clearLogs = (): void => {
  logsBuffer.length = 0;
};

export const checkMongoDBStatus = (): { status: string; label: string; code: number; color: string } => {
  const state = mongoose.connection.readyState;
  switch (state) {
    case 1:
      return { status: 'connected', label: 'Connected', code: 1, color: 'green' };
    case 2:
      return { status: 'connecting', label: 'Connecting...', code: 2, color: 'yellow' };
    case 3:
      return { status: 'disconnecting', label: 'Disconnecting...', code: 3, color: 'yellow' };
    case 0:
    default:
      return {
        status: dbLastError ? 'error' : 'disconnected',
        label: dbLastError ? 'Error / Disconnected' : 'Disconnected',
        code: 0,
        color: 'red',
      };
  }
};

export const checkCloudinaryStatus = (): { configured: boolean; status: string; label: string; details: string; color: string } => {
  const cloudName = process.env.CLOUD_NAME;
  const apiKey = process.env.CLOUD_API_KEY;
  const apiSecret = process.env.CLOUD_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    return {
      configured: true,
      status: 'configured',
      label: 'Configured',
      details: `Cloud: ${cloudName}`,
      color: 'green',
    };
  }
  return {
    configured: false,
    status: 'missing_config',
    label: 'Not Configured',
    details: 'Missing CLOUD_NAME / API_KEY / API_SECRET',
    color: 'amber',
  };
};

export const checkSMTPStatus = (): { configured: boolean; status: string; label: string; details: string; color: string } => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && port && user && pass) {
    return {
      configured: true,
      status: 'configured',
      label: 'Configured',
      details: `Host: ${host}:${port}`,
      color: 'green',
    };
  }
  return {
    configured: false,
    status: 'dev_mode',
    label: 'Dev Mode (Console Only)',
    details: 'SMTP credentials not provided; OTP logs to console',
    color: 'amber',
  };
};

export const getSystemHealth = (): any => {
  const dbStatus = checkMongoDBStatus();
  const cloudinaryStatus = checkCloudinaryStatus();
  const smtpStatus = checkSMTPStatus();

  let overallStatus: 'operational' | 'degraded' | 'error' = 'operational';
  if (dbStatus.code === 0) {
    overallStatus = 'error';
  } else if (!cloudinaryStatus.configured || !smtpStatus.configured) {
    overallStatus = 'degraded';
  }

  return {
    overallStatus,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    database: {
      ...dbStatus,
      lastError: dbLastError,
      host: mongoose.connection.host || 'N/A',
      name: mongoose.connection.name || 'N/A',
    },
    services: {
      cloudinary: cloudinaryStatus,
      smtp: smtpStatus,
    },
    logsCount: logsBuffer.length,
    errorLogsCount: logsBuffer.filter((l) => l.level === 'error').length,
  };
};
