/**
 * @file transactionController.ts
 * @description Controller handling API routes for adding, reading, updating, and deleting transactions.
 * Delegates database queries and mutations to TransactionService.
 */

import { Response } from 'express';
import { transactionService } from '../services';
import { AuthRequest } from '../types';
import { TRANSACTION_MESSAGES } from '../messages';

export const getTransactions = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  const { accountId, month, year } = req.query;
  try {
    const transactions = await transactionService.getFilteredTransactions(
      req.user?._id,
      accountId as string,
      month as string,
      year as string
    );
    res.json(transactions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTransaction = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  const { title, amount, type, categoryId, accountId, notes, date } = req.body;
  try {
    const createdTx = await transactionService.create({
      title,
      amount: Number(amount),
      type,
      categoryId,
      accountId,
      notes,
      date: date ? new Date(date) : new Date(),
      userId: req.user?._id,
    });

    const populatedTx = await transactionService.findPopulatedById(createdTx._id);
    res.status(201).json(populatedTx);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  const { title, amount, type, categoryId, accountId, notes, date } = req.body;
  try {
    const transaction = await transactionService.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: TRANSACTION_MESSAGES.TRANSACTION_NOT_FOUND });
    if (transaction.userId.toString() !== req.user?._id?.toString()) {
      return res.status(401).json({ message: TRANSACTION_MESSAGES.USER_NOT_AUTHORIZED });
    }

    transaction.title = title || transaction.title;
    transaction.amount = amount || transaction.amount;
    transaction.type = type || transaction.type;
    transaction.categoryId = categoryId || transaction.categoryId;
    transaction.accountId = accountId || transaction.accountId;
    transaction.notes = notes || transaction.notes;
    if (date) transaction.date = new Date(date);

    const updatedTx = await transaction.save();
    const populatedTx = await transactionService.findPopulatedById(updatedTx._id);
    res.json(populatedTx);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const transaction = await transactionService.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: TRANSACTION_MESSAGES.TRANSACTION_NOT_FOUND });
    if (transaction.userId.toString() !== req.user?._id?.toString()) {
      return res.status(401).json({ message: TRANSACTION_MESSAGES.USER_NOT_AUTHORIZED });
    }

    await transactionService.deleteById(transaction._id);
    res.json({ message: TRANSACTION_MESSAGES.TRANSACTION_REMOVED });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
