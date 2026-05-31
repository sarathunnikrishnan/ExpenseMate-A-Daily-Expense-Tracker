import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Budget } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Trash2 } from 'lucide-react';
import { MONTHS } from '../constants';

const Budgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currency } = useCurrency();

  // Form state
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await api.get('/budgets');
      setBudgets(res.data);
    } catch (error) {
      toast.error('Failed to load budgets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post('/budgets', {
        month: Number(month),
        year: Number(year),
        budgetAmount: Number(amount),
      });
      setBudgets([res.data, ...budgets].sort((a, b) => b.year - a.year || b.month - a.month));
      toast.success('Budget set successfully');
      setAmount('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to set budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    try {
      await api.delete(`/budgets/${id}`);
      setBudgets(budgets.filter((b) => b._id !== id));
      toast.success('Budget deleted');
    } catch (error) {
      toast.error('Failed to delete budget');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Budgets</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Set New Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Month</label>
                  <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700">
                    {MONTHS.map((m, idx) => (
                      <option key={idx} value={idx + 1}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
                  <input type="number" required min="2000" max="2100" value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700" />
                </div>
              </div>
              <Input label={`Budget Amount (${currency})`} type="number" required min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="25000" />
              <Button type="submit" className="w-full" isLoading={isSubmitting}>Set Budget</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Budget History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <p>Loading...</p> : budgets.length === 0 ? <p className="text-gray-500">No budgets set yet.</p> : (
              <div className="space-y-4">
                {budgets.map((budget) => {
                  const percentUsed = budget.budgetAmount > 0 ? (budget.spentAmount / budget.budgetAmount) * 100 : 0;
                  const isOverBudget = percentUsed >= 100;
                  const isWarning = percentUsed >= 75 && !isOverBudget;
                  
                  return (
                    <div key={budget._id} className="p-4 border rounded-lg dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-lg">{MONTHS[budget.month - 1]} {budget.year}</h4>
                        <button onClick={() => handleDelete(budget._id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                      </div>
                      
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Spent: {currency}{budget.spentAmount.toLocaleString('en-IN')}</span>
                        <span className="font-medium">Total: {currency}{budget.budgetAmount.toLocaleString('en-IN')}</span>
                      </div>
                      
                      <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-primary-light dark:bg-primary-dark'}`}
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

export default Budgets;
