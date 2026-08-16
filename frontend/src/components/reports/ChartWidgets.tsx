/**
 * @file ChartWidgets.tsx
 * @description Pie, Bar, Line, and Area chart widgets for the Reports analytics dashboard.
 */

import React from 'react';
import { Card, CardContent } from '../ui/Card';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { CHART_COLORS } from '../../constants';
import { CategoryReportItem } from '../../types';
import { WidgetHeader } from './SummaryWidgets';

export const ExpensePieChartWidget: React.FC<{
  categoryData: CategoryReportItem[];
  currency: string;
  index: number;
  maxIndex: number;
  onMove: (index: number, direction: 'up' | 'down') => void;
}> = ({ categoryData, currency, index, maxIndex, onMove }): React.ReactElement => (
  <Card>
    <WidgetHeader
      title="Expense Breakdown"
      index={index}
      maxIndex={maxIndex}
      onMove={onMove}
    />
    <CardContent>
      <div className="h-[300px]">
        {categoryData.length === 0 ? (
          <p className="text-center text-gray-500 py-20">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {categoryData.map((_, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={CHART_COLORS[idx % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) =>
                  `${currency}${Number(v).toLocaleString('en-IN')}`
                }
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </CardContent>
  </Card>
);

export const IncomeExpenseBarChartWidget: React.FC<{
  yearlyData: any[];
  year: number;
  currency: string;
  index: number;
  maxIndex: number;
  onMove: (index: number, direction: 'up' | 'down') => void;
}> = ({ yearlyData, year, currency, index, maxIndex, onMove }): React.ReactElement => (
  <Card>
    <WidgetHeader
      title={`Income vs Expenses (${year})`}
      index={index}
      maxIndex={maxIndex}
      onMove={onMove}
    />
    <CardContent>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={yearlyData}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(v) => `${currency}${v}`} />
            <Tooltip
              formatter={(v) =>
                `${currency}${Number(v).toLocaleString('en-IN')}`
              }
            />
            <Legend />
            <Bar dataKey="Income" fill="#10B981" />
            <Bar dataKey="Expense" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

export const SavingsLineChartWidget: React.FC<{
  savingsTrendData: any[];
  year: number;
  currency: string;
  index: number;
  maxIndex: number;
  onMove: (index: number, direction: 'up' | 'down') => void;
}> = ({ savingsTrendData, year, currency, index, maxIndex, onMove }): React.ReactElement => (
  <Card>
    <WidgetHeader
      title={`Monthly Savings Trend (${year})`}
      index={index}
      maxIndex={maxIndex}
      onMove={onMove}
    />
    <CardContent>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={savingsTrendData}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(v) => `${currency}${v}`} />
            <Tooltip
              formatter={(v) =>
                `${currency}${Number(v).toLocaleString('en-IN')}`
              }
            />
            <Line
              type="monotone"
              dataKey="NetSavings"
              stroke="#3B82F6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

export const CumulativeAreaChartWidget: React.FC<{
  cumulativeData: any[];
  year: number;
  currency: string;
  index: number;
  maxIndex: number;
  onMove: (index: number, direction: 'up' | 'down') => void;
}> = ({ cumulativeData, year, currency, index, maxIndex, onMove }): React.ReactElement => (
  <Card>
    <WidgetHeader
      title={`Cumulative Cash Flow (${year})`}
      index={index}
      maxIndex={maxIndex}
      onMove={onMove}
    />
    <CardContent>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={cumulativeData}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(v) => `${currency}${v}`} />
            <Tooltip
              formatter={(v) =>
                `${currency}${Number(v).toLocaleString('en-IN')}`
              }
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="CumulativeIncome"
              stackId="1"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="CumulativeExpense"
              stackId="2"
              stroke="#EF4444"
              fill="#EF4444"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);
