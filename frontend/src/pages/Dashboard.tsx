/**
 * @file Dashboard.tsx
 * @description Main dashboard page component displaying account balance overview and recent transactions.
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useCurrency } from '../context/CurrencyContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Transaction, Account, MonthlyReportData } from '../types';
import { ArrowDownRight, ArrowUpRight, Wallet, PiggyBank, ArrowRight, Building2, Coins } from 'lucide-react';
import { MONTHS, ACCOUNT_TYPE_ENUM, TRANSACTION_TYPES_ENUM, UI_LABELS, API_ROUTES } from '../constants';

const Dashboard: React.FC = (): React.ReactElement => {
  const [report, setReport] = useState<MonthlyReportData | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { currency, formatDate } = useCurrency();

  const currentDate = new Date();
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [month, setMonth] = useState<number>(0);
  const [year, setYear] = useState<number>(currentDate.getFullYear());

  useEffect(() => {
    const fetchDashboardData = async (): Promise<void> => {
      try {
        const accParam = selectedAccountId ? `&accountId=${selectedAccountId}` : '';
        const [txRes, accRes, reportRes] = await Promise.all([
          api.get(`${API_ROUTES.TRANSACTIONS}?month=${month}&year=${year}${accParam}`),
          api.get(API_ROUTES.ACCOUNTS),
          api.get(`${API_ROUTES.REPORTS.MONTHLY}?month=${month}&year=${year}${accParam}`),
        ]);

        const allAccounts: Account[] = accRes.data;
        const normalAccounts = allAccounts.filter(
          (a: Account) => a.type !== ACCOUNT_TYPE_ENUM.INVESTMENT && a.type !== ACCOUNT_TYPE_ENUM.FD
        );
        setAccounts(normalAccounts);
        setRecentTransactions(txRes.data.slice(0, 10));
        setReport(reportRes.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedAccountId, month, year]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  const currentAccount = accounts.find((a) => a._id === selectedAccountId);
  const totalBalance = currentAccount
    ? currentAccount.balance || 0
    : accounts.reduce((acc, a) => acc + (a.balance || 0), 0);

  const getAmountColor = (type: string): string => {
    switch (type) {
      case TRANSACTION_TYPES_ENUM.INCOME:
        return 'text-emerald-500';
      case TRANSACTION_TYPES_ENUM.SAVING:
        return 'text-blue-500';
      default:
        return 'text-rose-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back to your financial overview</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className={SELECT_CLASS}
          >
            <option value={0}>{UI_LABELS.ALL_TIME}</option>
            {MONTHS.map((m, idx) => (
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
            <option value="">{UI_LABELS.ALL_ACCOUNTS}</option>
            {accounts.map((acc) => (
              <option key={acc._id} value={acc._id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {selectedAccountId ? UI_LABELS.ACCOUNT_BALANCE : UI_LABELS.TOTAL_BALANCE}
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {currency}
                  {totalBalance.toLocaleString('en-IN')}
                </h3>
              </div>
              <div className={ICON_BOX_BLUE}>
                <Wallet size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{UI_LABELS.INCOME}</p>
                <h3 className="text-2xl font-bold mt-1 text-emerald-500">
                  +{currency}
                  {(report?.totalIncome || 0).toLocaleString('en-IN')}
                </h3>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                <ArrowUpRight size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{UI_LABELS.EXPENSES}</p>
                <h3 className="text-2xl font-bold mt-1 text-rose-500">
                  -{currency}
                  {(report?.totalExpense || 0).toLocaleString('en-IN')}
                </h3>
              </div>
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
                <ArrowDownRight size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{UI_LABELS.SAVINGS}</p>
                <h3 className="text-2xl font-bold mt-1 text-blue-500">
                  {currency}
                  {(report?.savings || 0).toLocaleString('en-IN')}
                </h3>
              </div>
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                <PiggyBank size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">{UI_LABELS.RECENT_TRANSACTIONS}</h2>
            <Link to="/transactions" className={LINK_CLASS}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <Card key={tx._id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold opacity-80"
                      style={{
                        backgroundColor: `${tx.categoryId?.color}20`,
                        color: tx.categoryId?.color,
                      }}
                    >
                      {tx.title.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium">{tx.title}</h4>
                      <p className="text-xs text-gray-500">
                        {formatDate(tx.date)} • {tx.categoryId?.name}
                      </p>
                    </div>
                  </div>
                  <span className={`font-bold ${getAmountColor(tx.type)}`}>
                    {tx.type === TRANSACTION_TYPES_ENUM.INCOME ? '+' : '-'}
                    {currency}
                    {tx.amount.toLocaleString('en-IN')}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">{UI_LABELS.MY_ACCOUNTS}</CardTitle>
              <Link to="/accounts" className={LINK_CLASS}>
                Manage <ArrowRight size={14} />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {accounts.map((acc) => {
                  const isSelected = acc._id === selectedAccountId;
                  return (
                    <div
                      key={acc._id}
                      onClick={() => setSelectedAccountId(isSelected ? '' : acc._id)}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                        isSelected ? 'border-primary-light bg-primary-light/10' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-md">
                          {acc.type.toLowerCase() === ACCOUNT_TYPE_ENUM.CASH.toLowerCase() ? (
                            <Coins size={16} />
                          ) : (
                            <Building2 size={16} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{acc.name}</p>
                          <p className="text-sm text-gray-500">{acc.type}</p>
                        </div>
                      </div>
                      <span className="font-bold">
                        {currency}
                        {acc.balance?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

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

const ICON_BOX_BLUE = [
  'p-3 rounded-xl',
  'bg-primary-light/10 dark:bg-primary-dark/20',
  'text-primary-light dark:text-primary-dark',
].join(' ');

const LINK_CLASS = [
  'text-sm text-primary-light hover:underline',
  'flex items-center gap-1',
].join(' ');

export default Dashboard;
