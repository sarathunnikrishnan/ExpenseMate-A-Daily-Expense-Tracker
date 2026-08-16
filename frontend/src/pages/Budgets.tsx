/**
 * @file Budgets.tsx
 * @description Page component for setting and viewing monthly budget targets and tracking real-time usage percentages.
 */

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Budget } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Trash2 } from 'lucide-react';
import { MONTHS, API_ROUTES } from '../constants';

import { BUDGET_MESSAGES } from '../messages';

const Budgets: React.FC = (): React.ReactElement => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { currency } = useCurrency();

  const currentDate = new Date();
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [amount, setAmount] = useState<string>('');

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async (): Promise<void> => {
    try {
      const res = await api.get(API_ROUTES.BUDGETS);
      setBudgets(res.data);
    } catch (error) {
      toast.error(BUDGET_MESSAGES.BUDGETS_LOAD_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post(API_ROUTES.BUDGETS, {
        month: Number(month),
        year: Number(year),
        budgetAmount: Number(amount),
      });
      setBudgets([res.data, ...budgets].sort((a, b) => b.year - a.year || b.month - a.month));
      toast.success(BUDGET_MESSAGES.BUDGET_SET_SUCCESS);
      setAmount('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || BUDGET_MESSAGES.BUDGET_SET_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm(BUDGET_MESSAGES.CONFIRM_DELETE)) return;
    try {
      await api.delete(`${API_ROUTES.BUDGETS}/${id}`);
      setBudgets(budgets.filter((b) => b._id !== id));
      toast.success(BUDGET_MESSAGES.BUDGET_DELETED);
    } catch (error) {
      toast.error(BUDGET_MESSAGES.BUDGET_DELETE_FAILED);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Monthly Budgets</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Set New Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Month
                  </label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className={INPUT_CLASS}
                  >
                    {MONTHS.map((m, idx) => (
                      <option key={idx} value={idx + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Year
                  </label>
                  <input
                    type="number"
                    required
                    min="2000"
                    max="2100"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>
              <Input
                label={`Budget Amount (${currency})`}
                type="number"
                required
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="25000"
              />
              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Set Budget
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Budget History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading...</p>
            ) : budgets.length === 0 ? (
              <p className="text-gray-500">No budgets set yet.</p>
            ) : (
              <div className="space-y-4">
                {budgets.map((budget) => {
                  const percentUsed =
                    budget.budgetAmount > 0
                      ? (budget.spentAmount / budget.budgetAmount) * 100
                      : 0;
                  const isOverBudget = percentUsed >= 100;
                  const isWarning = percentUsed >= 75 && !isOverBudget;
                  const progressColorClass = isOverBudget
                    ? 'bg-red-500'
                    : isWarning
                    ? 'bg-yellow-500'
                    : 'bg-primary-light dark:bg-primary-dark';

                  return (
                    <div key={budget._id} className={ITEM_CARD_CLASS}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-lg">
                          {MONTHS[budget.month - 1]} {budget.year}
                        </h4>
                        <button
                          onClick={() => handleDelete(budget._id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          Spent: {currency}
                          {budget.spentAmount.toLocaleString('en-IN')}
                        </span>
                        <span className="font-medium">
                          Total: {currency}
                          {budget.budgetAmount.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className={PROGRESS_BAR_CONTAINER}>
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${progressColorClass}`}
                          style={{ width: `${Math.min(percentUsed, 100)}%` }}
                        />
                      </div>
                      <div className="text-xs text-right mt-1 text-gray-500">
                        {percentUsed.toFixed(1)}% Used
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const INPUT_CLASS = [
  'w-full px-4 py-2 border rounded-lg',
  'bg-background-light dark:bg-background-dark',
  'border-gray-300 dark:border-gray-700',
].join(' ');

const ITEM_CARD_CLASS = [
  'p-4 border rounded-lg dark:border-gray-800',
  'bg-gray-50 dark:bg-gray-900/50',
].join(' ');

const PROGRESS_BAR_CONTAINER = [
  'w-full h-2 rounded-full overflow-hidden',
  'bg-gray-200 dark:bg-gray-700',
].join(' ');

export default Budgets;
