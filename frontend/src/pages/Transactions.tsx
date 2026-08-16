/**
 * @file Transactions.tsx
 * @description Page component for adding income, expense, saving, and other transactions and listing history.
 */

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useCurrency } from '../context/CurrencyContext';
import { Transaction, Category, Account } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { SHORT_MONTHS, TRANSACTION_TYPES_ENUM, API_ROUTES } from '../constants';
import { TRANSACTION_MESSAGES } from '../messages';
import { TransactionTable } from '../components/transactions/TransactionTable';

const Transactions: React.FC = (): React.ReactElement => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { currency, formatDate } = useCurrency();

  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<'income' | 'expense' | 'saving' | 'other'>(
    TRANSACTION_TYPES_ENUM.EXPENSE
  );
  const [categoryId, setCategoryId] = useState<string>('');
  const [accountId, setAccountId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');

  const currentDate = new Date();
  const [filterAccountId, setFilterAccountId] = useState<string>('');
  const [month, setMonth] = useState<number>(0);
  const [year, setYear] = useState<number>(currentDate.getFullYear());

  useEffect(() => {
    fetchData();
  }, [filterAccountId, month, year]);

  const fetchData = async (): Promise<void> => {
    try {
      const accountQuery = filterAccountId ? `&accountId=${filterAccountId}` : '';
      const [txRes, catRes, accRes] = await Promise.all([
        api.get(`${API_ROUTES.TRANSACTIONS}?month=${month}&year=${year}${accountQuery}`),
        api.get(API_ROUTES.CATEGORIES),
        api.get(API_ROUTES.ACCOUNTS),
      ]);
      setTransactions(txRes.data);
      setCategories(catRes.data);
      setAccounts(accRes.data);
      if (catRes.data.length > 0 && !categoryId) setCategoryId(catRes.data[0]._id);
      if (accRes.data.length > 0 && !accountId) setAccountId(accRes.data[0]._id);
    } catch (error) {
      toast.error(TRANSACTION_MESSAGES.TRANSACTIONS_LOAD_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post(API_ROUTES.TRANSACTIONS, {
        title,
        amount: Number(amount),
        type,
        categoryId,
        accountId,
        notes,
        date,
      });
      setTransactions([res.data, ...transactions]);
      toast.success(TRANSACTION_MESSAGES.TRANSACTION_ADDED);
      setTitle('');
      setAmount('');
      setNotes('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || TRANSACTION_MESSAGES.TRANSACTION_ADD_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm(TRANSACTION_MESSAGES.CONFIRM_DELETE)) return;
    try {
      await api.delete(`${API_ROUTES.TRANSACTIONS}/${id}`);
      setTransactions(transactions.filter((t) => t._id !== id));
      toast.success(TRANSACTION_MESSAGES.TRANSACTION_DELETED);
    } catch (error) {
      toast.error(TRANSACTION_MESSAGES.TRANSACTION_DELETE_FAILED);
    }
  };

  const filteredCategories = categories.filter((c) => c.type === type);

  const getAmountColor = (txType: string): string => {
    switch (txType) {
      case TRANSACTION_TYPES_ENUM.INCOME:
        return 'text-green-500';
      case TRANSACTION_TYPES_ENUM.SAVING:
        return 'text-blue-500';
      case TRANSACTION_TYPES_ENUM.OTHER:
        return 'text-gray-500';
      default:
        return 'text-red-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className={FILTER_SELECT_CLASS}
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
            value={filterAccountId}
            onChange={(e) => setFilterAccountId(e.target.value)}
            className={FILTER_SELECT_CLASS}
          >
            <option value="">All Accounts</option>
            {accounts.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Add Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Salary, Rent"
              />
              <Input
                label={`Amount (${currency})`}
                type="number"
                required
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1000"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Type</label>
                  <select
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value as any);
                      setCategoryId('');
                    }}
                    className={SELECT_CLASS}
                  >
                    <option value={TRANSACTION_TYPES_ENUM.EXPENSE}>Expense</option>
                    <option value={TRANSACTION_TYPES_ENUM.INCOME}>Income</option>
                    <option value={TRANSACTION_TYPES_ENUM.SAVING}>Saving</option>
                    <option value={TRANSACTION_TYPES_ENUM.OTHER}>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Category</label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className={SELECT_CLASS}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {filteredCategories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Account</label>
                <select
                  required
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className={SELECT_CLASS}
                >
                  <option value="" disabled>
                    Select Account
                  </option>
                  {accounts.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <div>
                <label className="block mb-1 text-sm font-medium">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className={TEXTAREA_CLASS}
                />
              </div>
              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Add
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionTable
              transactions={transactions}
              isLoading={isLoading}
              currency={currency}
              formatDate={formatDate}
              getAmountColor={getAmountColor}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const SELECT_CLASS = [
  'w-full px-4 py-2 border rounded-lg',
  'bg-background-light dark:bg-background-dark',
  'border-gray-300 dark:border-gray-700',
].join(' ');

const FILTER_SELECT_CLASS = [
  'px-3 py-2 border rounded-lg',
  'bg-background-light dark:bg-background-dark',
  'border-gray-300 dark:border-gray-700 font-medium',
].join(' ');

const YEAR_INPUT_CLASS = [
  'w-20 px-3 py-2 border rounded-lg',
  'bg-background-light dark:bg-background-dark',
  'text-center',
].join(' ');

const TEXTAREA_CLASS = [
  'w-full px-4 py-2 border rounded-lg',
  'bg-background-light dark:bg-background-dark',
  'border-gray-300 dark:border-gray-700',
  'focus:outline-none focus:ring-2 focus:ring-primary-light',
].join(' ');

export default Transactions;
