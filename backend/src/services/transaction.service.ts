/**
 * @file transaction.service.ts
 * @description TransactionService managing transaction creation, updates, populated queries, and filtering.
 * Extends BaseService.
 */

import { Types } from 'mongoose';
import { BaseService } from './base.service';
import Transaction, { ITransaction } from '../models/Transaction';

export class TransactionService extends BaseService<ITransaction> {
  constructor() {
    super(Transaction);
  }

  async getFilteredTransactions(
    userId: string | Types.ObjectId,
    accountId?: string,
    month?: string,
    year?: string
  ): Promise<ITransaction[]> {
    const filter: any = { userId };
    if (accountId) filter.accountId = accountId;

    if (month && year && month !== 'all' && month !== '0') {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    return this.model.find(filter).populate('categoryId').populate('accountId').sort({ date: -1 });
  }

  async findPopulatedById(id: string | Types.ObjectId): Promise<ITransaction | null> {
    return this.model.findById(id).populate('categoryId').populate('accountId');
  }
}

export const transactionService = new TransactionService();
