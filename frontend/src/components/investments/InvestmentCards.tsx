/**
 * @file InvestmentCards.tsx
 * @description Card components for portfolio metrics summary and individual investment asset cards.
 */

import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Trash2, TrendingUp, PiggyBank } from 'lucide-react';
import { Account, Category } from '../../types';
import { ACCOUNT_TYPE_ENUM, INVESTMENT_BEHAVIOR_ENUM } from '../../constants';

export const PortfolioMetricsCards: React.FC<{
  totalInvested: number;
  totalCurrentValue: number;
  totalProfitLoss: number;
  totalRoi: number;
  currency: string;
}> = ({
  totalInvested,
  totalCurrentValue,
  totalProfitLoss,
  totalRoi,
  currency,
}): React.ReactElement => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm font-medium text-gray-500">Total Invested</p>
        <h3 className="text-2xl font-bold mt-1">
          {currency}
          {totalInvested.toLocaleString('en-IN')}
        </h3>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm font-medium text-gray-500">Current Valuation</p>
        <h3 className="text-2xl font-bold mt-1">
          {currency}
          {totalCurrentValue.toLocaleString('en-IN')}
        </h3>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm font-medium text-gray-500">Total Returns</p>
        <h3
          className={`text-2xl font-bold mt-1 ${
            totalProfitLoss >= 0 ? 'text-emerald-500' : 'text-rose-500'
          }`}
        >
          {totalProfitLoss >= 0 ? '+' : ''}
          {currency}
          {totalProfitLoss.toLocaleString('en-IN')} ({totalRoi.toFixed(1)}%)
        </h3>
      </CardContent>
    </Card>
  </div>
);

export const InvestmentAssetCard: React.FC<{
  acc: Account;
  investmentTypes: Category[];
  updatingId: string | null;
  newValue: string;
  currency: string;
  formatDate: (date: string) => string;
  setNewValue: (val: string) => void;
  setUpdatingId: (id: string | null) => void;
  onUpdateValue: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({
  acc,
  investmentTypes,
  updatingId,
  newValue,
  currency,
  formatDate,
  setNewValue,
  setUpdatingId,
  onUpdateValue,
  onDelete,
}): React.ReactElement => {
  const cat = investmentTypes.find((c) => c.name === acc.type);
  const isAccFixed =
    cat?.investmentBehavior === INVESTMENT_BEHAVIOR_ENUM.FIXED ||
    acc.type === ACCOUNT_TYPE_ENUM.FD;
  const isAccMarket = !isAccFixed;
  const currentValue = acc.currentValue ?? acc.initialBalance;
  const profitLoss = currentValue - acc.initialBalance;
  const roi =
    acc.initialBalance > 0 ? (profitLoss / acc.initialBalance) * 100 : 0;
  const isProfit = profitLoss >= 0;

  return (
    <div className={ITEM_CARD_CLASS}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            {isAccFixed ? (
              <PiggyBank className="text-amber-500" />
            ) : (
              <TrendingUp className="text-emerald-500" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-lg">{acc.name}</h4>
            <span className="text-xs text-gray-500 uppercase">{acc.type}</span>
          </div>
        </div>
        <button
          onClick={() => onDelete(acc._id)}
          className="text-gray-400 hover:text-red-500"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {isAccFixed && (acc.interestRate || acc.maturityDate) && (
        <div className="flex gap-4 mb-4 pb-4 border-b text-sm">
          {acc.interestRate && (
            <div>
              <p className="text-gray-500 text-xs">Interest Rate</p>
              <p className="font-medium text-emerald-600">
                {acc.interestRate}%
              </p>
            </div>
          )}
          {acc.maturityDate && (
            <div>
              <p className="text-gray-500 text-xs">Maturity Date</p>
              <p className="font-medium">{formatDate(acc.maturityDate)}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-auto">
        <p className="text-sm text-gray-500 mb-1">Current Value</p>
        {updatingId === acc._id ? (
          <div className="flex items-center gap-2 mb-2">
            <input
              type="number"
              className="w-full px-2 py-1 border rounded text-sm"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              autoFocus
            />
            <button
              onClick={() => onUpdateValue(acc._id)}
              className={SAVE_BTN_CLASS}
            >
              Save
            </button>
            <button
              onClick={() => setUpdatingId(null)}
              className={CANCEL_BTN_CLASS}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-2xl font-bold">
              {currency}
              {currentValue.toLocaleString('en-IN')}
            </h3>
            {isAccMarket && (
              <button
                onClick={() => {
                  setUpdatingId(acc._id);
                  setNewValue(currentValue.toString());
                }}
                className={UPDATE_BTN_CLASS}
              >
                Update
              </button>
            )}
          </div>
        )}
        <div className="flex justify-between items-end mt-2 text-xs">
          <p className="text-gray-500">
            Invested: {currency}
            {acc.initialBalance.toLocaleString('en-IN')}
          </p>
          {isAccMarket && (
            <span
              className={`font-semibold px-2 py-1 rounded-full ${
                isProfit
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              {isProfit ? '+' : ''}
              {roi.toFixed(1)}% ({isProfit ? '+' : ''}
              {currency}
              {Math.abs(profitLoss).toLocaleString('en-IN')})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const ITEM_CARD_CLASS = [
  'flex flex-col p-5 border rounded-xl',
  'dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50',
].join(' ');

const SAVE_BTN_CLASS = [
  'px-3 py-1 text-sm rounded',
  'bg-primary-light text-white',
].join(' ');

const CANCEL_BTN_CLASS = [
  'px-3 py-1 text-sm rounded',
  'bg-gray-200 text-gray-800',
].join(' ');

const UPDATE_BTN_CLASS = [
  'text-xs font-semibold px-2 py-1 rounded',
  'text-primary-light hover:underline bg-primary-light/10',
].join(' ');
