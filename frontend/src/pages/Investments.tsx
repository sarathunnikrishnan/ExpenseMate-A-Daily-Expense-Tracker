/**
 * @file Investments.tsx
 * @description Page component for tracking fixed deposits (FDs), mutual funds, and market investments portfolio.
 */

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useCurrency } from '../context/CurrencyContext';
import { Account, Category } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ACCOUNT_MESSAGES } from '../messages';
import {
  ACCOUNT_TYPE_ENUM,
  CATEGORY_TYPES_ENUM,
  INVESTMENT_BEHAVIOR_ENUM,
  API_ROUTES,
} from '../constants';
import {
  PortfolioMetricsCards,
  InvestmentAssetCard,
} from '../components/investments/InvestmentCards';

const Investments: React.FC = (): React.ReactElement => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [investmentTypes, setInvestmentTypes] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [type, setType] = useState<string>(ACCOUNT_TYPE_ENUM.FD);
  const [initialBalance, setInitialBalance] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [maturityDate, setMaturityDate] = useState<string>('');

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [newValue, setNewValue] = useState<string>('');

  const { currency, formatDate } = useCurrency();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async (): Promise<void> => {
    try {
      const [accRes, catRes] = await Promise.all([
        api.get(API_ROUTES.ACCOUNTS),
        api.get(API_ROUTES.CATEGORIES),
      ]);
      const invCats = catRes.data.filter(
        (c: Category) => c.type === CATEGORY_TYPES_ENUM.INVESTMENT
      );
      setInvestmentTypes(invCats);
      if (invCats.length > 0 && type === ACCOUNT_TYPE_ENUM.FD) setType(invCats[0].name);

      const investmentAccounts = accRes.data.filter(
        (a: Account) =>
          invCats.some((c: Category) => c.name === a.type) ||
          a.type === ACCOUNT_TYPE_ENUM.INVESTMENT ||
          a.type === ACCOUNT_TYPE_ENUM.FD
      );
      setAccounts(investmentAccounts);
    } catch (error) {
      toast.error(ACCOUNT_MESSAGES.ACCOUNTS_LOAD_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategory = investmentTypes.find((c) => c.name === type);
  const isFixed =
    selectedCategory?.investmentBehavior === INVESTMENT_BEHAVIOR_ENUM.FIXED ||
    type === ACCOUNT_TYPE_ENUM.FD;

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: any = {
        name,
        type,
        initialBalance: Number(initialBalance),
        currentValue: Number(initialBalance),
      };
      if (isFixed) {
        if (interestRate) payload.interestRate = Number(interestRate);
        if (maturityDate) payload.maturityDate = maturityDate;
      }
      const res = await api.post(API_ROUTES.ACCOUNTS, payload);
      setAccounts([...accounts, res.data]);
      toast.success(ACCOUNT_MESSAGES.INVESTMENT_CREATED);
      setName('');
      setInitialBalance('');
      setInterestRate('');
      setMaturityDate('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || ACCOUNT_MESSAGES.ACCOUNT_ADD_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateValue = async (id: string): Promise<void> => {
    try {
      const val = Number(newValue);
      const res = await api.put(`${API_ROUTES.ACCOUNTS}/${id}`, { currentValue: val });
      setAccounts(accounts.map((a) => (a._id === id ? res.data : a)));
      toast.success(ACCOUNT_MESSAGES.VALUE_UPDATED);
      setUpdatingId(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || ACCOUNT_MESSAGES.VALUE_UPDATE_FAILED);
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

  const totalInvested = accounts.reduce((acc, a) => acc + (a.initialBalance || 0), 0);
  const totalCurrentValue = accounts.reduce(
    (acc, a) => acc + (a.currentValue ?? a.initialBalance ?? 0),
    0
  );
  const totalProfitLoss = totalCurrentValue - totalInvested;
  const totalRoi = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Investments & Assets</h1>
          <p className="text-gray-500 text-sm">Track FDs, Mutual Funds, and Market Returns</p>
        </div>
      </div>

      <PortfolioMetricsCards
        totalInvested={totalInvested}
        totalCurrentValue={totalCurrentValue}
        totalProfitLoss={totalProfitLoss}
        totalRoi={totalRoi}
        currency={currency}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Add Asset</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Asset Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. HDFC Nifty 50"
              />
              <div>
                <label className="block mb-1 text-sm font-medium">Asset Class</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={SELECT_CLASS}
                >
                  {investmentTypes.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                  <option value={ACCOUNT_TYPE_ENUM.FD}>Fixed Deposit (FD)</option>
                  <option value={ACCOUNT_TYPE_ENUM.INVESTMENT}>Other Investment</option>
                </select>
              </div>
              <Input
                label={`Invested Amount (${currency})`}
                type="number"
                required
                min="1"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                placeholder="50000"
              />
              {isFixed && (
                <>
                  <Input
                    label="Interest Rate (%)"
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="7.5"
                  />
                  <Input
                    label="Maturity Date"
                    type="date"
                    value={maturityDate}
                    onChange={(e) => setMaturityDate(e.target.value)}
                  />
                </>
              )}
              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Add Asset
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading...</p>
            ) : accounts.length === 0 ? (
              <p className="text-gray-500">No investment accounts added.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {accounts.map((acc) => (
                  <InvestmentAssetCard
                    key={acc._id}
                    acc={acc}
                    investmentTypes={investmentTypes}
                    updatingId={updatingId}
                    newValue={newValue}
                    currency={currency}
                    formatDate={formatDate}
                    setNewValue={setNewValue}
                    setUpdatingId={setUpdatingId}
                    onUpdateValue={handleUpdateValue}
                    onDelete={handleDelete}
                  />
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

export default Investments;
