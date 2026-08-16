/**
 * @file accountController.ts
 * @description Controller handling CRUD requests for user accounts.
 * Delegates data operations to AccountService.
 */

import { Response } from 'express';
import { accountService } from '../services';
import { AuthRequest } from '../types';
import { ACCOUNT_MESSAGES } from '../messages';

export const getAccounts = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const accountsWithBalance = await accountService.getAccountsWithBalance(req.user?._id);
    res.json(accountsWithBalance);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createAccount = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  const { name, type, initialBalance, interestRate, maturityDate, currentValue } = req.body;
  try {
    const createdAccount = await accountService.create({
      name,
      type,
      initialBalance: Number(initialBalance) || 0,
      interestRate: interestRate ? Number(interestRate) : undefined,
      maturityDate: maturityDate ? new Date(maturityDate) : undefined,
      currentValue: currentValue !== undefined ? Number(currentValue) : undefined,
      userId: req.user?._id,
    });
    res.status(201).json(createdAccount);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAccount = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const account = await accountService.findById(req.params.id);
    if (!account) return res.status(404).json({ message: ACCOUNT_MESSAGES.ACCOUNT_NOT_FOUND });
    if (account.userId.toString() !== req.user?._id?.toString()) {
      return res.status(401).json({ message: ACCOUNT_MESSAGES.USER_NOT_AUTHORIZED });
    }

    const { name, type, initialBalance, interestRate, maturityDate, currentValue } = req.body;
    account.name = name || account.name;
    account.type = type || account.type;
    if (initialBalance !== undefined) account.initialBalance = Number(initialBalance);
    if (interestRate !== undefined) account.interestRate = Number(interestRate);
    if (maturityDate !== undefined) account.maturityDate = new Date(maturityDate);
    if (currentValue !== undefined) account.currentValue = Number(currentValue);

    const updatedAccount = await account.save();
    res.json(updatedAccount);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const account = await accountService.findById(req.params.id);
    if (!account) return res.status(404).json({ message: ACCOUNT_MESSAGES.ACCOUNT_NOT_FOUND });
    if (account.userId.toString() !== req.user?._id?.toString()) {
      return res.status(401).json({ message: ACCOUNT_MESSAGES.USER_NOT_AUTHORIZED });
    }

    const txCount = await accountService.getTransactionCount(account._id);
    if (txCount > 0) {
      return res.status(400).json({ message: ACCOUNT_MESSAGES.CANNOT_DELETE_WITH_TRANSACTIONS });
    }

    await accountService.deleteById(account._id);
    res.json({ message: ACCOUNT_MESSAGES.ACCOUNT_REMOVED });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
