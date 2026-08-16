/**
 * @file TransactionTable.tsx
 * @description Table component for rendering transaction history list and item rows.
 */

import React from 'react';
import { Trash2 } from 'lucide-react';
import { Transaction } from '../../types';
import { TRANSACTION_TYPES_ENUM } from '../../constants';

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  currency: string;
  formatDate: (date: string) => string;
  getAmountColor: (txType: string) => string;
  onDelete: (id: string) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  isLoading,
  currency,
  formatDate,
  getAmountColor,
  onDelete,
}): React.ReactElement => {
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (transactions.length === 0) {
    return <p className="text-gray-500">No transactions found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b dark:border-gray-800 text-gray-500 text-sm">
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Account</th>
            <th className="px-4 py-3 text-right">Amount</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id} className={ROW_CLASS}>
              <td className="px-4 py-3">{formatDate(tx.date)}</td>
              <td className="px-4 py-3 font-medium">{tx.title}</td>
              <td className="px-4 py-3">
                <span
                  className="px-2 py-1 text-xs rounded-full"
                  style={{
                    backgroundColor: `${tx.categoryId?.color}20`,
                    color: tx.categoryId?.color,
                  }}
                >
                  {tx.categoryId?.name || 'Unknown'}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-gray-500">
                {tx.accountId?.name || 'Unknown'}
              </td>
              <td
                className={`px-4 py-3 text-right font-medium ${getAmountColor(
                  tx.type
                )}`}
              >
                {tx.type === TRANSACTION_TYPES_ENUM.INCOME ? '+' : '-'}
                {currency}
                {tx.amount.toLocaleString('en-IN')}
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onDelete(tx._id)}
                  className={DELETE_BTN_CLASS}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ROW_CLASS = [
  'border-b last:border-0 dark:border-gray-800',
  'hover:bg-gray-50 dark:hover:bg-gray-900/50',
].join(' ');

const DELETE_BTN_CLASS = [
  'text-gray-400 hover:text-red-500',
  'transition-colors',
].join(' ');
