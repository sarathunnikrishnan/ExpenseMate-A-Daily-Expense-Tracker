/**
 * @file account.service.ts
 * @description AccountService for account CRUD operations and real-time balance calculations.
 * Extends BaseService.
 */

import { Types } from 'mongoose';
import { BaseService } from './base.service';
import Account, { IAccount } from '../models/Account';
import Transaction from '../models/Transaction';

export class AccountService extends BaseService<IAccount> {
  constructor() {
    super(Account);
  }

  async getAccountsWithBalance(userId: string | Types.ObjectId): Promise<any[]> {
    let accounts = await this.model.find({ userId });

    if (accounts.length === 0) {
      const defaultAccount = await this.model.create({
        name: 'Cash',
        type: 'Cash',
        initialBalance: 0,
        userId,
      });
      accounts = [defaultAccount];
    }

    return Promise.all(
      accounts.map(async (acc) => {
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
          balance,
        };
      })
    );
  }

  async getTransactionCount(accountId: string | Types.ObjectId): Promise<number> {
    return Transaction.countDocuments({ accountId });
  }
}

export const accountService = new AccountService();
