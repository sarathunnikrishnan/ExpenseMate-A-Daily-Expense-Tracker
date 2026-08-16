/**
 * @file app.ts
 * @description Decoupled Express application instance setup, middleware registration, API routing,
 * rate limiting, helmet security headers, mongo sanitization, and root dashboard UI configuration.
 */

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import transactionRoutes from './routes/transactionRoutes';
import budgetRoutes from './routes/budgetRoutes';
import reportRoutes from './routes/reportRoutes';
import accountRoutes from './routes/accountRoutes';
import healthRoutes from './routes/healthRoutes';
import { getDashboardHtml } from './utils/dashboardHtml';
import { addLog } from './utils/statusLogger';
import { config } from './config/env.config';
import { authRateLimiter, apiRateLimiter } from './middleware/rateLimiter';

const app = express();

app.use(helmet());
app.use(mongoSanitize());

app.use(
  cors({
    origin: config.clientUrl || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

app.use(async (req, res, next) => {
  if (req.path.startsWith('/api/') && !req.path.startsWith('/api/health')) {
    addLog('info', 'API', `${req.method} ${req.path}`);
  }
  if (
    req.path.startsWith('/api/') &&
    mongoose.connection.readyState === 0 &&
    config.mongoUri
  ) {
    await connectDB();
  }
  next();
});

app.use('/api/', apiRateLimiter);
app.use('/api/auth', authRateLimiter, authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/health', healthRoutes);

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(getDashboardHtml());
});

export async function connectDB() {
  if (!config.mongoUri) {
    addLog(
      'error',
      'DATABASE',
      'MONGO_URI environment variable is missing!',
      'Configure MONGO_URI in .env or Vercel Environment Variables.'
    );
    return;
  }

  try {
    addLog('info', 'DATABASE', 'Connecting to MongoDB database...');
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    } as mongoose.ConnectOptions);
    addLog(
      'success',
      'DATABASE',
      `MongoDB Connected successfully to host: ${
        mongoose.connection.host || 'Database'
      }`
    );
  } catch (error: any) {
    const errDetails = error?.stack || error?.message || String(error);
    addLog('error', 'DATABASE', 'Failed to connect to MongoDB', errDetails);
  }
}

export default app;
