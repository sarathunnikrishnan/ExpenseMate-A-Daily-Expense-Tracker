/**
 * @file healthRoutes.ts
 * @description API endpoint for system health checks and database connectivity diagnostics.
 */

import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { getLogs, clearLogs, addLog } from '../utils/statusLogger';

const router = express.Router();

router.get('/', (req: Request, res: Response): void => {
  const dbState = mongoose.connection.readyState;
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];

  res.json({
    status: dbState === 1 ? 'OK' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    database: {
      status: states[dbState] || 'Unknown',
      host: mongoose.connection.host || 'N/A',
      name: mongoose.connection.name || 'N/A',
    },
    logs: getLogs(),
  });
});

router.post('/clear-logs', (req: Request, res: Response): void => {
  clearLogs();
  addLog('info', 'SYSTEM', 'Diagnostic log history cleared manually.');
  res.json({ message: 'Logs cleared successfully' });
});

export default router;
