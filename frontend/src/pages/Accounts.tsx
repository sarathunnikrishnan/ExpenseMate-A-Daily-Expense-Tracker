/**
 * @file Accounts.tsx
 * @description Page component for adding, listing, and removing bank accounts and cash wallets.
 */

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useCurrency } from '../context/CurrencyContext';
import { Account } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Trash2, Building2, Wallet, Coins } from 'lucide-react';
import { ACCOUNT_MESSAGES } from '../messages';
import { ACCOUNT_TYPE_ENUM, API_ROUTES } from '../constants';

const Accounts: React.FC = (): React.ReactElement => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [type, setType] = useState<string>(ACCOUNT_TYPE_ENUM.BANK);
  const [initialBalance, setInitialBalance] = useState<string>('');
  const { currency } = useCurrency();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async (): Promise<void> => {
    try {
      const res = await api.get(API_ROUTES.ACCOUNTS);
      const normalAccounts = res.data.filter(
        (a: Account) => a.type !== ACCOUNT_TYPE_ENUM.INVESTMENT && a.type !== ACCOUNT_TYPE_ENUM.FD
      );
      setAccounts(normalAccounts);
    } catch (error) {
      toast.error(ACCOUNT_MESSAGES.ACCOUNTS_LOAD_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post(API_ROUTES.ACCOUNTS, { name, type, initialBalance: Number(initialBalance) });
      setAccounts([...accounts, { ...res.data, balance: Number(initialBalance) }]);
      toast.success(ACCOUNT_MESSAGES.ACCOUNT_ADDED);
      setName('');
      setInitialBalance('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || ACCOUNT_MESSAGES.ACCOUNT_ADD_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm(ACCOUNT_MESSAGES.CONFIRM_DELETE)) return;
    try {
      await api.delete(`${API_ROUTES.ACCOUNTS}/${id}`);
      setAccounts(accounts.filter((a) => a._id !== id));
      toast.success(ACCOUNT_MESSAGES.ACCOUNT_DELETED);
    } catch (error: any) {
      toast.error(error.response?.data?.message || ACCOUNT_MESSAGES.ACCOUNT_DELETE_FAILED);
    }
  };

  const getIcon = (accType: string): React.ReactNode => {
    switch (accType) {
      case ACCOUNT_TYPE_ENUM.BANK:
        return <Building2 className="text-blue-500" />;
      case ACCOUNT_TYPE_ENUM.CASH:
        return <Wallet className="text-emerald-500" />;
      default:
        return <Coins className="text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Accounts</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Add New Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Account Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. HDFC Bank, Cash Wallet"
              />

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Account Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={SELECT_CLASS}
                >
                  <option value={ACCOUNT_TYPE_ENUM.BANK}>Bank Account</option>
                  <option value={ACCOUNT_TYPE_ENUM.CASH}>Cash / Wallet</option>
                  <option value={ACCOUNT_TYPE_ENUM.CREDIT}>Credit Card</option>
                  <option value={ACCOUNT_TYPE_ENUM.OTHER}>Other</option>
                </select>
              </div>

              <Input
                label={`Initial Balance (${currency})`}
                type="number"
                required
                step="0.01"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                placeholder="0.00"
              />

              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Add Account
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading...</p>
            ) : accounts.length === 0 ? (
              <p className="text-gray-500">No accounts created yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {accounts.map((acc) => (
                  <div key={acc._id} className={ITEM_CARD_CLASS}>
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
                      <button
                        onClick={() => handleDelete(acc._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mt-auto">
                      <p className="text-sm text-gray-500 mb-1">Current Balance</p>
                      <p className="text-2xl font-bold">
                        {currency}
                        {(acc.balance || 0).toLocaleString()}
                      </p>
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

const SELECT_CLASS = [
  'w-full px-4 py-2 border rounded-lg',
  'bg-background-light dark:bg-background-dark',
  'border-gray-300 dark:border-gray-700',
].join(' ');

const ITEM_CARD_CLASS = [
  'flex flex-col p-5 border rounded-xl',
  'dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50',
].join(' ');

export default Accounts;
