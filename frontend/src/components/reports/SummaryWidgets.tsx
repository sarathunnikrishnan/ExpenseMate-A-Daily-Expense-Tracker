/**
 * @file SummaryWidgets.tsx
 * @description Summary cards and top expenses widget for the Reports analytics dashboard.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { SHORT_MONTHS, CHART_COLORS } from '../../constants';
import { CategoryReportItem } from '../../types';

interface WidgetHeaderProps {
  title: string;
  index: number;
  maxIndex: number;
  onMove: (index: number, direction: 'up' | 'down') => void;
}

export const WidgetHeader: React.FC<WidgetHeaderProps> = ({
  title,
  index,
  maxIndex,
  onMove,
}): React.ReactElement => (
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <CardTitle className="text-base font-semibold">{title}</CardTitle>
    <div className="flex items-center gap-1">
      <button
        disabled={index === 0}
        onClick={() => onMove(index, 'up')}
        className={BTN_ICON_CLASS}
      >
        <ArrowUp size={16} />
      </button>
      <button
        disabled={index === maxIndex}
        onClick={() => onMove(index, 'down')}
        className={BTN_ICON_CLASS}
      >
        <ArrowDown size={16} />
      </button>
    </div>
  </CardHeader>
);

export const SummaryCardsWidget: React.FC<{
  summary: { totalIncome: number; totalExpense: number; savings: number };
  currency: string;
  index: number;
  maxIndex: number;
  onMove: (index: number, direction: 'up' | 'down') => void;
}> = ({ summary, currency, index, maxIndex, onMove }): React.ReactElement => (
  <Card className="col-span-full">
    <WidgetHeader
      title="Summary"
      index={index}
      maxIndex={maxIndex}
      onMove={onMove}
    />
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
          <p className="text-sm font-medium text-emerald-600">Total Income</p>
          <p className="text-2xl font-bold">
            {currency}
            {summary.totalIncome.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="p-4 bg-rose-500/10 rounded-lg border border-rose-500/20">
          <p className="text-sm font-medium text-rose-600">Total Expenses</p>
          <p className="text-2xl font-bold">
            {currency}
            {summary.totalExpense.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <p className="text-sm font-medium text-blue-600">Net Savings</p>
          <p className="text-2xl font-bold">
            {currency}
            {summary.savings.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const TopExpensesWidget: React.FC<{
  categoryData: CategoryReportItem[];
  month: number;
  year: number;
  currency: string;
  index: number;
  maxIndex: number;
  onMove: (index: number, direction: 'up' | 'down') => void;
}> = ({
  categoryData,
  month,
  year,
  currency,
  index,
  maxIndex,
  onMove,
}): React.ReactElement => {
  const periodTitle =
    month === 0 ? '(All Time)' : `(${SHORT_MONTHS[month - 1]} ${year})`;
  return (
    <Card>
      <WidgetHeader
        title={`Top Expenses ${periodTitle}`}
        index={index}
        maxIndex={maxIndex}
        onMove={onMove}
      />
      <CardContent>
        {categoryData.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No expenses found</p>
        ) : (
          <div className="space-y-4">
            {categoryData.slice(0, 5).map((cat, idx) => (
              <div key={idx} className={LIST_ROW_CLASS}>
                <div className="flex items-center gap-3">
                  <div
                    className={INDEX_BADGE_CLASS}
                    style={{
                      backgroundColor:
                        CHART_COLORS[idx % CHART_COLORS.length],
                    }}
                  >
                    {idx + 1}
                  </div>
                  <span className="font-medium">{cat.name}</span>
                </div>
                <span className="font-bold text-red-500">
                  {currency}
                  {cat.amount.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const BTN_ICON_CLASS = [
  'p-1 rounded hover:bg-gray-100',
  'dark:hover:bg-gray-800 disabled:opacity-30',
].join(' ');

const LIST_ROW_CLASS = [
  'flex justify-between items-center p-3',
  'bg-gray-50 dark:bg-gray-800/50 rounded-lg',
].join(' ');

const INDEX_BADGE_CLASS = [
  'w-8 h-8 rounded-full flex items-center',
  'justify-center text-white text-xs font-bold',
].join(' ');
