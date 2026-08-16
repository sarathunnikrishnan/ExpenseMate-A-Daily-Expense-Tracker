/**
 * @file server.ts
 * @description Application entry point. Initializes database connection and launches HTTP server listener.
 */

import app, { connectDB } from './app';
import { addLog } from './utils/statusLogger';
import { config } from './config/env.config';

// Initialize Database Connection
connectDB();

addLog('info', 'SERVER', `ExpenseMate API engine initialized in ${config.nodeEnv} mode.`);

if (config.nodeEnv !== 'production') {
  app.listen(config.port, () => {
    addLog('info', 'SERVER', `Server listening on port ${config.port}`);
    console.log(`Server is running on port ${config.port}`);
  });
}

export default app;
