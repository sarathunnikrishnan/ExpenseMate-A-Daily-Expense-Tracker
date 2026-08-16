/**
 * @file budgetController.ts
 * @description Controller handling CRUD requests for monthly budgets.
 * Delegates data operations to BudgetService.
 */

import { Response } from 'express';
import { budgetService } from '../services';
import { AuthRequest } from '../types';
import { BUDGET_MESSAGES } from '../messages';

export const getBudgets = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const budgetsWithSpent = await budgetService.getBudgetsWithSpent(req.user?._id);
    res.json(budgetsWithSpent);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createBudget = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  const { month, year, budgetAmount } = req.body;
  try {
    const existingBudget = await budgetService.findOne({ month, year, userId: req.user?._id });
    if (existingBudget) {
      return res.status(400).json({ message: BUDGET_MESSAGES.BUDGET_EXISTS });
    }

    const initialSpent = await budgetService.calculateInitialSpent(req.user?._id, Number(month), Number(year));
    const createdBudget = await budgetService.create({
      month,
      year,
      budgetAmount,
      spentAmount: initialSpent,
      userId: req.user?._id,
    });
    res.status(201).json(createdBudget);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBudget = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  const { budgetAmount, spentAmount } = req.body;
  try {
    const budget = await budgetService.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: BUDGET_MESSAGES.BUDGET_NOT_FOUND });
    if (budget.userId.toString() !== req.user?._id?.toString()) {
      return res.status(401).json({ message: BUDGET_MESSAGES.USER_NOT_AUTHORIZED });
    }

    if (budgetAmount !== undefined) budget.budgetAmount = budgetAmount;
    if (spentAmount !== undefined) budget.spentAmount = spentAmount;

    const updatedBudget = await budget.save();
    res.json(updatedBudget);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBudget = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const budget = await budgetService.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: BUDGET_MESSAGES.BUDGET_NOT_FOUND });
    if (budget.userId.toString() !== req.user?._id?.toString()) {
      return res.status(401).json({ message: BUDGET_MESSAGES.USER_NOT_AUTHORIZED });
    }

    await budgetService.deleteById(budget._id);
    res.json({ message: BUDGET_MESSAGES.BUDGET_REMOVED });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
