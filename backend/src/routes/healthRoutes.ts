/**
 * @file healthRoutes.ts
 * @description API endpoint for system health checks and database connectivity diagnostics.
 */

import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { getLogs, clearLogs, addLog } from '../utils/statusLogger';
import { connectDB } from '../app';
import { config } from '../config/env.config';

const router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }

  const dbState = mongoose.connection.readyState;
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  const hasEmail = Boolean(config.email.user && config.email.pass);
  const hasCloudinary = Boolean(config.cloudinary.cloudName);

  res.json({
    status: dbState === 1 ? 'OK' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    connectionStatus: dbState === 1 ? 'Connected & Active' : 'Disconnected',
    database: {
      status: states[dbState] || 'Unknown',
      host: mongoose.connection.host || 'Atlas Cluster',
      name: mongoose.connection.name || 'expense_tracker',
    },
    services: {
      email: hasEmail ? 'Configured' : 'Missing Credentials',
      cloudinary: hasCloudinary ? 'Configured' : 'Not Configured',
    },
    logs: getLogs(),
  });
});

router.post('/retry', async (req: Request, res: Response): Promise<void> => {
  addLog('info', 'SYSTEM', 'Manual database reconnection initiated...');
  await connectDB();
  res.json({
    message: 'Reconnection attempted',
    readyState: mongoose.connection.readyState,
  });
});

router.post('/clear-logs', (req: Request, res: Response): void => {
  clearLogs();
  addLog('info', 'SYSTEM', 'Diagnostic log history cleared manually.');
  res.json({ message: 'Logs cleared successfully' });
});

export default router;
