import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useCurrency } from '../context/CurrencyContext';
import { Account } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Trash2, Building2, Wallet, Coins } from 'lucide-react';

const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [type, setType] = useState('Bank');
  const [initialBalance, setInitialBalance] = useState('');
  const { currency } = useCurrency();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await api.get('/accounts');
      const normalAccounts = res.data.filter((a: Account) => a.type !== 'Investment' && a.type !== 'FD');
      setAccounts(normalAccounts);
    } catch (error) {
      toast.error('Failed to load accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post('/accounts', { name, type, initialBalance: Number(initialBalance) });
      // To get the correctly calculated balance, fetch again or manually add it
      setAccounts([...accounts, { ...res.data, balance: Number(initialBalance) }]);
      toast.success('Account added');
      setName('');
      setInitialBalance('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this account? Ensure no transactions are linked.')) return;
    try {
      await api.delete(`/accounts/${id}`);
      setAccounts(accounts.filter((a) => a._id !== id));
      toast.success('Account deleted');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    }
  };

  const getIcon = (accountType: string) => {
    switch (accountType.toLowerCase()) {
      case 'bank': return <Building2 className="text-blue-500" />;
      case 'wallet': return <Wallet className="text-purple-500" />;
      case 'cash': return <Coins className="text-yellow-500" />;
      default: return <Building2 className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Accounts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Add New Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Account Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. HDFC Bank, Cash Wallet" />
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Account Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700">
                  <option value="Bank">Bank Account</option>
                  <option value="Cash">Cash / Wallet</option>
                  <option value="Credit">Credit Card</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <Input label={`Initial Balance (${currency})`} type="number" required step="0.01" value={initialBalance} onChange={(e) => setInitialBalance(e.target.value)} placeholder="0.00" />
              
              <Button type="submit" className="w-full" isLoading={isSubmitting}>Add Account</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <p>Loading...</p> : accounts.length === 0 ? <p className="text-gray-500">No accounts found.</p> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {accounts.map((acc) => (
                  <div key={acc._id} className="flex flex-col p-5 border rounded-xl dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                          {getIcon(acc.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{acc.name}</h4>
                          <span className="text-xs text-gray-500 uppercase">{acc.type}</span>
                        </div>
                      </div>
                      <button onClick={() => handleDelete(acc._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mt-auto">
                      <p className="text-sm text-gray-500 mb-1">Current Balance</p>
                      <h3 className={`text-2xl font-bold ${acc.balance !== undefined && acc.balance < 0 ? 'text-red-600 dark:text-red-500' : 'text-green-600 dark:text-green-500'}`}>
                        {currency}{(acc.balance !== undefined ? acc.balance : acc.initialBalance).toLocaleString('en-IN')}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">Initial: {currency}{acc.initialBalance.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Accounts;
