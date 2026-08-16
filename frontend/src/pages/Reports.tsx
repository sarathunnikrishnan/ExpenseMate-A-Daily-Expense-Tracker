/**
 * @file Reports.tsx
 * @description Analytics dashboard displaying financial charts and metrics with re-orderable widgets.
 */

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { SHORT_MONTHS, API_ROUTES } from '../constants';
import { Account, CategoryReportItem } from '../types';
import { ACCOUNT_MESSAGES, AUTH_MESSAGES } from '../messages';
import {
  SummaryCardsWidget,
  TopExpensesWidget,
} from '../components/reports/SummaryWidgets';
import {
  ExpensePieChartWidget,
  IncomeExpenseBarChartWidget,
  SavingsLineChartWidget,
  CumulativeAreaChartWidget,
} from '../components/reports/ChartWidgets';

const Reports: React.FC = (): React.ReactElement => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { currency } = useCurrency();
  const currentDate = new Date();
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [month, setMonth] = useState<number>(0);
  const [year, setYear] = useState<number>(currentDate.getFullYear());

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryReportItem[]>([]);
  const [yearlyData, setYearlyData] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, savings: 0 });
  const [cumulativeData, setCumulativeData] = useState<any[]>([]);
  const [savingsTrendData, setSavingsTrendData] = useState<any[]>([]);

  const widgetOrder =
    user?.reportWidgetOrder && user.reportWidgetOrder.length > 0
      ? user.reportWidgetOrder
      : DEFAULT_WIDGET_ORDER;

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [month, year, selectedAccountId]);

  const fetchAccounts = async (): Promise<void> => {
    try {
      const res = await api.get(API_ROUTES.ACCOUNTS);
      setAccounts(res.data);
    } catch (error) {
      toast.error(ACCOUNT_MESSAGES.ACCOUNTS_LOAD_FAILED);
    }
  };

  const fetchReports = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const accQuery = selectedAccountId ? `&accountId=${selectedAccountId}` : '';
      const query = `month=${month}&year=${year}${accQuery}`;
      const [mRes, yRes, cRes] = await Promise.all([
        api.get(`${API_ROUTES.REPORTS.MONTHLY}?${query}`),
        api.get(`${API_ROUTES.REPORTS.YEARLY}?year=${year}${accQuery}`),
        api.get(`${API_ROUTES.REPORTS.CATEGORY}?${query}`),
      ]);

      setSummary(mRes.data);
      setCategoryData(cRes.data);

      const formattedYearly = (yRes.data || []).map((item: any) => ({
        name: SHORT_MONTHS[item.month - 1],
        Income: item.income,
        Expense: item.expense,
      }));
      setYearlyData(formattedYearly);

      let runIncome = 0;
      let runExpense = 0;
      const cum = (yRes.data || []).map((item: any) => {
        runIncome += item.income;
        runExpense += item.expense;
        return {
          name: SHORT_MONTHS[item.month - 1],
          CumulativeIncome: runIncome,
          CumulativeExpense: runExpense,
        };
      });
      setCumulativeData(cum);

      const savings = (yRes.data || []).map((item: any) => ({
        name: SHORT_MONTHS[item.month - 1],
        NetSavings: item.income - item.expense,
      }));
      setSavingsTrendData(savings);
    } catch (error) {
      toast.error('Failed to load report data');
    } finally {
      setIsLoading(false);
    }
  };

  const moveWidget = async (index: number, direction: 'up' | 'down'): Promise<void> => {
    const newOrder = [...widgetOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;
    updateUser({ ...user, reportWidgetOrder: newOrder } as any);
    try {
      await api.put(API_ROUTES.AUTH.PROFILE, { reportWidgetOrder: newOrder });
    } catch (error) {
      toast.error(AUTH_MESSAGES.LAYOUT_SAVE_FAILED);
    }
  };

  const renderWidget = (widgetId: string, index: number): React.ReactNode => {
    const maxIdx = widgetOrder.length - 1;
    switch (widgetId) {
      case 'summaryCards':
        return (
          <SummaryCardsWidget
            key={widgetId}
            summary={summary}
            currency={currency}
            index={index}
            maxIndex={maxIdx}
            onMove={moveWidget}
          />
        );
      case 'expensePieChart':
        return (
          <ExpensePieChartWidget
            key={widgetId}
            categoryData={categoryData}
            currency={currency}
            index={index}
            maxIndex={maxIdx}
            onMove={moveWidget}
          />
        );
      case 'incomeExpenseBarChart':
        return (
          <IncomeExpenseBarChartWidget
            key={widgetId}
            yearlyData={yearlyData}
            year={year}
            currency={currency}
            index={index}
            maxIndex={maxIdx}
            onMove={moveWidget}
          />
        );
      case 'savingsLineChart':
        return (
          <SavingsLineChartWidget
            key={widgetId}
            savingsTrendData={savingsTrendData}
            year={year}
            currency={currency}
            index={index}
            maxIndex={maxIdx}
            onMove={moveWidget}
          />
        );
      case 'cumulativeAreaChart':
        return (
          <CumulativeAreaChartWidget
            key={widgetId}
            cumulativeData={cumulativeData}
            year={year}
            currency={currency}
            index={index}
            maxIndex={maxIdx}
            onMove={moveWidget}
          />
        );
      case 'topExpensesList':
        return (
          <TopExpensesWidget
            key={widgetId}
            categoryData={categoryData}
            month={month}
            year={year}
            currency={currency}
            index={index}
            maxIndex={maxIdx}
            onMove={moveWidget}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className={SELECT_CLASS}
          >
            <option value={0}>All Time</option>
            {SHORT_MONTHS.map((m, idx) => (
              <option key={idx} value={idx + 1}>
                {m}
              </option>
            ))}
          </select>
          {month !== 0 && (
            <input
              type="number"
              min="2000"
              max="2100"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className={YEAR_INPUT_CLASS}
            />
          )}
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className={SELECT_CLASS}
          >
            <option value="">All Accounts</option>
            {accounts.map((acc) => (
              <option key={acc._id} value={acc._id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <p>Loading charts...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {widgetOrder.map((widgetId, index) => renderWidget(widgetId, index))}
        </div>
      )}
    </div>
  );
};

const DEFAULT_WIDGET_ORDER = [
  'summaryCards',
  'expensePieChart',
  'incomeExpenseBarChart',
  'savingsLineChart',
  'topExpensesList',
  'cumulativeAreaChart',
];

const SELECT_CLASS = [
  'px-3 py-2 border rounded-lg',
  'bg-background-light dark:bg-background-dark',
  'border-gray-300 dark:border-gray-700 font-medium',
].join(' ');

const YEAR_INPUT_CLASS = [
  'w-20 px-3 py-2 border rounded-lg',
  'bg-background-light dark:bg-background-dark',
  'text-center',
].join(' ');

export default Reports;
