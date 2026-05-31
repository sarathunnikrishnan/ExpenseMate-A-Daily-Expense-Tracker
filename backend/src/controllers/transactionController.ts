import { Request, Response } from 'express';
import Transaction from '../models/Transaction';
import { AuthRequest } from '../middleware/authMiddleware';

export const getTransactions = async (req: AuthRequest, res: Response) => {
  const { accountId, month, year } = req.query;
  try {
    const filter: any = { userId: req.user?._id };
    if (accountId) filter.accountId = accountId;
    
    if (month && year && month !== 'all' && month !== '0') {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const transactions = await Transaction.find(filter)
      .populate('categoryId')
      .populate('accountId')
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTransaction = async (req: AuthRequest, res: Response) => {
  const { title, amount, type, categoryId, accountId, notes, date } = req.body;

  try {
    const transaction = new Transaction({
      title,
      amount: Number(amount),
      type,
      categoryId,
      accountId,
      notes,
      date: date ? new Date(date) : new Date(),
      userId: req.user?._id,
    });

    const createdTransaction = await transaction.save();
    // Return populated category for immediate UI updates
    const populatedTx = await Transaction.findById(createdTransaction._id)
      .populate('categoryId')
      .populate('accountId');
    res.status(201).json(populatedTx);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
  const { title, amount, type, categoryId, accountId, notes, date } = req.body;

  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.userId.toString() !== req.user?._id?.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    transaction.title = title || transaction.title;
    transaction.amount = amount || transaction.amount;
    transaction.type = type || transaction.type;
    transaction.categoryId = categoryId || transaction.categoryId;
    transaction.accountId = accountId || transaction.accountId;
    transaction.notes = notes || transaction.notes;
    if (date) transaction.date = new Date(date);

    const updatedTransaction = await transaction.save();
    const populatedTx = await Transaction.findById(updatedTransaction._id)
      .populate('categoryId')
      .populate('accountId');
    res.json(populatedTx);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.userId.toString() !== req.user?._id?.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await transaction.deleteOne();
    res.json({ message: 'Transaction removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
