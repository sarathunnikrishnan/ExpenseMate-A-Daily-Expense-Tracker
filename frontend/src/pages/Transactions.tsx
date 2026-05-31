import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useCurrency } from '../context/CurrencyContext';
import { Transaction, Category, Account } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Trash2 } from 'lucide-react';
import { SHORT_MONTHS } from '../constants';

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currency, formatDate } = useCurrency();

  // Form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense' | 'saving' | 'other'>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Filter state
  const currentDate = new Date();
  const [filterAccountId, setFilterAccountId] = useState<string>('');
  const [month, setMonth] = useState(0); // 0 = All Time
  const [year, setYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    fetchData();
  }, [filterAccountId, month, year]);

  const fetchData = async () => {
    try {
      const accountQuery = filterAccountId ? `&accountId=${filterAccountId}` : '';
      const [txRes, catRes, accRes] = await Promise.all([
        api.get(`/transactions?month=${month}&year=${year}${accountQuery}`),
        api.get('/categories'),
        api.get('/accounts')
      ]);
      setTransactions(txRes.data);
      setCategories(catRes.data);
      setAccounts(accRes.data);
      if (catRes.data.length > 0) {
        setCategoryId(catRes.data[0]._id);
      }
      if (accRes.data.length > 0) {
        setAccountId(accRes.data[0]._id);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) return toast.error('Please select a category');
    if (!accountId) return toast.error('Please select an account');
    
    setIsSubmitting(true);
    try {
      const res = await api.post('/transactions', {
        title,
        amount: Number(amount),
        type,
        categoryId,
        accountId,
        date,
        notes
      });
      // Add to beginning of array
      setTransactions([res.data, ...transactions]);
      toast.success('Transaction added successfully');
      setTitle('');
      setAmount('');
      setNotes('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions(transactions.filter((t) => t._id !== id));
      toast.success('Transaction deleted');
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        
        <div className="flex flex-wrap items-center gap-2">
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="px-3 py-2 border rounded-lg bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700 font-medium">
            <option value={0}>All Time</option>
            {SHORT_MONTHS.map((m, idx) => (
              <option key={idx} value={idx + 1}>{m}</option>
            ))}
          </select>
          {month !== 0 && (
            <input type="number" min="2000" max="2100" value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-20 px-3 py-2 border rounded-lg bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700 font-medium text-center" />
          )}
          <select 
            value={filterAccountId} 
            onChange={(e) => setFilterAccountId(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700 font-medium"
          >
            <option value="">All Accounts</option>
            {accounts.map(acc => (
              <option key={acc._id} value={acc._id}>{acc.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Add Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Salary, Rent" />
              <Input label={`Amount (${currency})`} type="number" required min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1000" />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                  <select value={type} onChange={(e) => { setType(e.target.value as any); setCategoryId(''); }} className="w-full px-4 py-2 border rounded-lg bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                    <option value="saving">Saving</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                  <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700">
                    <option value="" disabled>Select</option>
                    {filteredCategories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Account</label>
                <select required value={accountId} onChange={(e) => setAccountId(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700">
                  <option value="" disabled>Select Account</option>
                  {accounts.map(a => (
                    <option key={a._id} value={a._id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <Input label="Date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Notes (Optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full px-4 py-2 border rounded-lg bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-light" />
              </div>

              <Button type="submit" className="w-full" isLoading={isSubmitting}>Add</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Transactions List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <p>Loading...</p> : transactions.length === 0 ? <p className="text-gray-500">No transactions found.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="text-xs text-gray-500 uppercase border-b dark:text-gray-400 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <tr>
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
                      <tr key={tx._id} className="border-b last:border-0 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                        <td className="px-4 py-3">{formatDate(tx.date)}</td>
                        <td className="px-4 py-3 font-medium">{tx.title}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: `${tx.categoryId?.color}20`, color: tx.categoryId?.color }}>
                            {tx.categoryId?.name || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {tx.accountId?.name || 'Unknown'}
                        </td>
                        <td className={`px-4 py-3 text-right font-medium ${tx.type === 'income' ? 'text-green-500' : tx.type === 'saving' ? 'text-blue-500' : tx.type === 'other' ? 'text-gray-500' : 'text-red-500'}`}>
                          {tx.type === 'income' ? '+' : '-'}{currency}{tx.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => handleDelete(tx._id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Transactions;
