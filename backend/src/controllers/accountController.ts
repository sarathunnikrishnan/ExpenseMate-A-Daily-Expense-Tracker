import { Request, Response } from 'express';
import Account from '../models/Account';
import Transaction from '../models/Transaction';
import { AuthRequest } from '../middleware/authMiddleware';

export const getAccounts = async (req: AuthRequest, res: Response) => {
  try {
    const accounts = await Account.find({ userId: req.user?._id });
    
    // Seed default Cash account if user has none
    if (accounts.length === 0 && req.user) {
      const defaultAccount = new Account({
        name: 'Cash',
        type: 'Cash',
        initialBalance: 0,
        userId: req.user._id,
      });
      await defaultAccount.save();
      accounts.push(defaultAccount);
    }

    // Calculate real-time balance for each account
    const accountsWithBalance = await Promise.all(accounts.map(async (acc) => {
      const txs = await Transaction.find({ accountId: acc._id });
      const balanceChange = txs.reduce((sum, tx) => {
        return tx.type === 'income' ? sum + tx.amount : sum - tx.amount;
      }, 0);
      
      let balance = acc.initialBalance + balanceChange;
      if ((acc.type === 'Investment' || acc.type === 'FD') && acc.currentValue !== undefined) {
        balance = acc.currentValue;
      }
      
      return {
        ...acc.toObject(),
        balance
      };
    }));

    res.json(accountsWithBalance);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createAccount = async (req: AuthRequest, res: Response) => {
  const { name, type, initialBalance, interestRate, maturityDate, currentValue } = req.body;

  try {
    const account = new Account({
      name,
      type,
      initialBalance: Number(initialBalance) || 0,
      interestRate: interestRate ? Number(interestRate) : undefined,
      maturityDate: maturityDate ? new Date(maturityDate) : undefined,
      currentValue: currentValue !== undefined ? Number(currentValue) : undefined,
      userId: req.user?._id,
    });

    const createdAccount = await account.save();
    res.status(201).json(createdAccount);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAccount = async (req: AuthRequest, res: Response) => {
  const { name, type, initialBalance } = req.body;

  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (account.userId.toString() !== req.user?._id?.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
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

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (account.userId.toString() !== req.user?._id?.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Check if account has transactions
    const txCount = await Transaction.countDocuments({ accountId: account._id });
    if (txCount > 0) {
      return res.status(400).json({ message: 'Cannot delete account with existing transactions' });
    }

    await account.deleteOne();
    res.json({ message: 'Account removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
