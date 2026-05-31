import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useCurrency } from '../context/CurrencyContext';
import { Account } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Trash2, TrendingUp, PiggyBank } from 'lucide-react';

const Investments = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [investmentTypes, setInvestmentTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [type, setType] = useState('FD');
  const [initialBalance, setInitialBalance] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [maturityDate, setMaturityDate] = useState('');
  
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [newValue, setNewValue] = useState('');
  
  const { currency, formatDate } = useCurrency();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const [accRes, catRes] = await Promise.all([
        api.get('/accounts'),
        api.get('/categories')
      ]);
      const invCats = catRes.data.filter((c: any) => c.type === 'investment');
      setInvestmentTypes(invCats);
      if (invCats.length > 0 && type === 'FD') setType(invCats[0].name);

      const investmentAccounts = accRes.data.filter((a: Account) => 
        invCats.some((c: any) => c.name === a.type) || a.type === 'Investment' || a.type === 'FD'
      );
      setAccounts(investmentAccounts);
    } catch (error) {
      toast.error('Failed to load investments');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategory = investmentTypes.find(c => c.name === type);
  const isFixed = selectedCategory?.investmentBehavior === 'fixed' || type === 'FD';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post('/accounts', { 
        name, 
        type, 
        initialBalance: Number(initialBalance),
        interestRate: isFixed && interestRate ? Number(interestRate) : undefined,
        maturityDate: isFixed && maturityDate ? maturityDate : undefined
      });
      setAccounts([...accounts, { ...res.data, balance: Number(initialBalance) }]);
      toast.success('Investment added');
      setName('');
      setInitialBalance('');
      setInterestRate('');
      setMaturityDate('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add investment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this investment account? Ensure no transactions are linked.')) return;
    try {
      await api.delete(`/accounts/${id}`);
      setAccounts(accounts.filter((a) => a._id !== id));
      toast.success('Investment deleted');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete investment');
    }
  };

  const handleUpdateValue = async (id: string) => {
    if (!newValue || isNaN(Number(newValue))) return;
    
    try {
      const res = await api.put(`/accounts/${id}`, { currentValue: Number(newValue) });
      setAccounts(accounts.map(acc => acc._id === id ? { ...acc, currentValue: res.data.currentValue, balance: res.data.currentValue } : acc));
      setUpdatingId(null);
      setNewValue('');
      toast.success('Value updated successfully');
    } catch (error) {
      toast.error('Failed to update value');
    }
  };

  const getIcon = (accountType: string) => {
    switch (accountType.toLowerCase()) {
      case 'fd': return <PiggyBank className="text-pink-500" />;
      case 'investment': return <TrendingUp className="text-green-500" />;
      default: return <TrendingUp className="text-gray-500" />;
    }
  };

  const totalInvestment = accounts.reduce((sum, acc) => sum + (acc.balance !== undefined ? acc.balance : acc.initialBalance), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">FDs & Investments</h1>
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-900 shadow-sm flex flex-col items-end">
          <span className="text-xs uppercase font-semibold opacity-80 mb-0.5">Total Portfolio Value</span>
          <span className="text-xl font-bold">{currency}{totalInvestment.toLocaleString('en-IN')}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Add New Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Investment Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. SBI Fixed Deposit, Mutual Fund" />
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Investment Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700">
                  {investmentTypes.length === 0 && <option value="FD">Fixed Deposit (FD)</option>}
                  {investmentTypes.length === 0 && <option value="Investment">Other Investment</option>}
                  {investmentTypes.map(c => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <Input label={`Amount Invested (${currency})`} type="number" required step="0.01" value={initialBalance} onChange={(e) => setInitialBalance(e.target.value)} placeholder="0.00" />
              
              {isFixed && (
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Interest Rate (%)" type="number" step="0.01" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="7.5" />
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Maturity Date</label>
                    <input type="date" value={maturityDate} onChange={(e) => setMaturityDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700" />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" isLoading={isSubmitting}>Add Investment</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <p>Loading...</p> : accounts.length === 0 ? <p className="text-gray-500">No investments found.</p> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {accounts.map((acc) => {
                  const currentValue = acc.balance !== undefined ? acc.balance : acc.initialBalance;
                  const profitLoss = currentValue - acc.initialBalance;
                  const roi = acc.initialBalance > 0 ? (profitLoss / acc.initialBalance) * 100 : 0;
                  const isProfit = profitLoss >= 0;
                  
                  const cat = investmentTypes.find(c => c.name === acc.type);
                  const isAccFixed = cat?.investmentBehavior === 'fixed' || acc.type === 'FD';
                  const isAccMarket = cat?.investmentBehavior === 'market' || acc.type === 'Investment';

                  return (
                    <div key={acc._id} className="flex flex-col p-5 border rounded-xl dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm" style={cat ? { color: cat.color } : {}}>
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

                      {isAccFixed && (acc.interestRate || acc.maturityDate) && (
                        <div className="flex gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-800 text-sm">
                          {acc.interestRate && (
                            <div>
                              <p className="text-gray-500 text-xs">Interest Rate</p>
                              <p className="font-medium text-green-600 dark:text-green-400">{acc.interestRate}%</p>
                            </div>
                          )}
                          {acc.maturityDate && (
                            <div>
                              <p className="text-gray-500 text-xs">Maturity Date</p>
                              <p className="font-medium">{formatDate(acc.maturityDate)}</p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-auto">
                        <p className="text-sm text-gray-500 mb-1">Current Value</p>
                        
                        {updatingId === acc._id ? (
                          <div className="flex items-center gap-2 mb-2">
                            <input 
                              type="number" 
                              className="w-full px-2 py-1 border rounded bg-white dark:bg-gray-800 text-sm" 
                              value={newValue} 
                              onChange={e => setNewValue(e.target.value)} 
                              placeholder="New Value"
                              autoFocus
                            />
                            <button onClick={() => handleUpdateValue(acc._id)} className="px-3 py-1 bg-primary-light dark:bg-primary-dark text-white rounded text-sm font-medium">Save</button>
                            <button onClick={() => setUpdatingId(null)} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-sm font-medium">Cancel</button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-2xl font-bold">
                              {currency}{currentValue.toLocaleString('en-IN')}
                            </h3>
                            {isAccMarket && (
                              <button onClick={() => { setUpdatingId(acc._id); setNewValue(currentValue.toString()); }} className="text-xs font-semibold text-primary-light dark:text-primary-dark hover:underline bg-primary-light/10 dark:bg-primary-dark/10 px-2 py-1 rounded">
                                Update
                              </button>
                            )}
                          </div>
                        )}

                        <div className="flex justify-between items-end mt-2">
                          <p className="text-xs text-gray-500">Invested: {currency}{acc.initialBalance.toLocaleString('en-IN')}</p>
                          
                          {isAccMarket && (
                            <div className={`text-xs font-semibold px-2 py-1 rounded-full ${isProfit ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                              {isProfit ? '+' : ''}{roi.toFixed(1)}% 
                              ({isProfit ? '+' : ''}{currency}{Math.abs(profitLoss).toLocaleString('en-IN')})
                            </div>
                          )}
                        </div>
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

export default Investments;
