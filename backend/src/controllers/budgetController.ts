import { Request, Response } from 'express';
import Budget from '../models/Budget';
import { AuthRequest } from '../middleware/authMiddleware';

export const getBudgets = async (req: AuthRequest, res: Response) => {
  try {
    const budgets = await Budget.find({ userId: req.user?._id }).sort({ year: -1, month: -1 });
    res.json(budgets);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createBudget = async (req: AuthRequest, res: Response) => {
  const { month, year, budgetAmount } = req.body;

  try {
    const existingBudget = await Budget.findOne({ month, year, userId: req.user?._id });
    if (existingBudget) {
      return res.status(400).json({ message: 'Budget for this month already exists' });
    }

    const budget = new Budget({
      month,
      year,
      budgetAmount,
      spentAmount: 0,
      userId: req.user?._id,
    });

    const createdBudget = await budget.save();
    res.status(201).json(createdBudget);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBudget = async (req: AuthRequest, res: Response) => {
  const { budgetAmount, spentAmount } = req.body;

  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.user?._id?.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    if (budgetAmount !== undefined) budget.budgetAmount = budgetAmount;
    if (spentAmount !== undefined) budget.spentAmount = spentAmount;

    const updatedBudget = await budget.save();
    res.json(updatedBudget);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBudget = async (req: AuthRequest, res: Response) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.user?._id?.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await budget.deleteOne();
    res.json({ message: 'Budget removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
