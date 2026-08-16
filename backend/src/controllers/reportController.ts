/**
 * @file reportController.ts
 * @description Controller endpoint handlers for monthly, yearly, and category financial reporting.
 * Delegates analytics calculations to ReportService.
 */

import { Response } from 'express';
import { reportService } from '../services';
import { AuthRequest } from '../types';

export const getMonthlyReport = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  const { month, year, accountId } = req.query;
  try {
    const summary = await reportService.getMonthlySummary(
      req.user?._id,
      month as string,
      year as string,
      accountId as string
    );
    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getYearlyReport = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  const { year, accountId } = req.query;
  try {
    const summary = await reportService.getYearlySummary(
      req.user?._id,
      year as string,
      accountId as string
    );
    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryReport = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  const { month, year, accountId } = req.query;
  try {
    const summary = await reportService.getCategorySummary(
      req.user?._id,
      month as string,
      year as string,
      accountId as string
    );
    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
