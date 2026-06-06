import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useCurrency } from '../context/CurrencyContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Transaction, Account } from '../types';
import { ArrowDownRight, ArrowUpRight, Wallet, PiggyBank, ArrowRight, Building2, Coins } from 'lucide-react';
import { MONTHS } from '../constants';

const Dashboard = () => {
  const [report, setReport] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currency, formatDate } = useCurrency();
  
  const currentDate = new Date();
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [month, setMonth] = useState(0); // 0 = All Time
  const [year, setYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [txRes, accRes, reportRes] = await Promise.all([
          api.get(`/transactions?month=${month}&year=${year}${selectedAccountId ? `&accountId=${selectedAccountId}` : ''}`),
          api.get('/accounts'),
          api.get(`/reports/monthly?month=${month}&year=${year}${selectedAccountId ? `&accountId=${selectedAccountId}` : ''}`)
        ]);

        const allAccounts = accRes.data;
        const normalAccounts = allAccounts.filter((a: Account) => a.type !== 'Investment' && a.type !== 'FD');
        setAccounts(normalAccounts);
        setRecentTransactions(txRes.data.slice(0, 10));
        setReport(reportRes.data);
      } catch (error: any) {
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

  const currentAccount = accounts.find(a => a._id === selectedAccountId);
  const displayBalance = selectedAccountId && currentAccount 
    ? currentAccount.balance || 0 
    : accounts.reduce((sum, a) => sum + (a.balance || 0), 0);

  const cards = [
    { title: selectedAccountId ? `${currentAccount?.name} Balance` : 'Total Balance', amount: displayBalance, icon: <Wallet size={24} />, color: 'bg-blue-500', tooltip: 'Your overall current balance' },
    { title: 'Income', amount: report?.totalIncome || 0, icon: <ArrowUpRight size={24} />, color: 'bg-green-500', tooltip: 'Total money received' },
    { title: 'Expense', amount: report?.totalExpense || 0, icon: <ArrowDownRight size={24} />, color: 'bg-red-500', tooltip: 'Total money spent' },
    { title: 'Budget', amount: report?.budget || 0, icon: <PiggyBank size={24} />, color: 'bg-purple-500', tooltip: 'Your spending limit' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={month} 
            onChange={(e) => setMonth(Number(e.target.value))}
            className="px-3 py-2 border rounded-lg bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700 font-medium"
          >
            <option value={0}>All Time</option>
            {MONTHS.map((m, idx) => (
              <option key={idx} value={idx + 1}>{m}</option>
            ))}
          </select>
          {month !== 0 && (
            <input 
              type="number" 
              min="2000" 
              max="2100" 
              value={year} 
              onChange={(e) => setYear(Number(e.target.value))} 
              className="w-20 px-3 py-2 border rounded-lg bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700 font-medium text-center" 
            />
          )}
          <select 
            value={selectedAccountId} 
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700 font-medium"
          >
            <option value="">All Accounts</option>
            {accounts.map(acc => (
              <option key={acc._id} value={acc._id}>{acc.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, idx) => (
          <div key={idx} title={card.tooltip} className="flex items-center p-4 shadow-sm rounded-xl bg-card-light dark:bg-card-dark border border-gray-100 dark:border-gray-800 transition-transform hover:scale-105 cursor-default">
            <div className={`p-3 rounded-full text-white ${card.color} mr-4`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
              <h3 className="text-xl font-bold">{currency}{card.amount.toLocaleString('en-IN')}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Budget Status */}
          {report?.budget > 0 && (
            <div title="Visual breakdown of your budget usage" className="p-6 shadow-sm rounded-xl bg-card-light dark:bg-card-dark border border-gray-100 dark:border-gray-800 cursor-default">
              <h2 className="mb-4 text-lg font-semibold">Budget Status</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Spent: {currency}{report.totalExpense.toLocaleString('en-IN')}</span>
                  <span className="text-gray-500">Budget: {currency}{report.budget.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-3 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      (report.totalExpense / report.budget) > 0.9 ? 'bg-red-500' : 
                      (report.totalExpense / report.budget) > 0.75 ? 'bg-yellow-500' : 'bg-primary-light dark:bg-primary-dark'
                    }`}
                    style={{ width: `${Math.min((report.totalExpense / report.budget) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-right text-gray-500 dark:text-gray-400">
                  {((report.totalExpense / report.budget) * 100).toFixed(1)}% Used
                </p>
              </div>
            </div>
          )}

          {/* Recent Transactions */}
          <div title="Your latest financial activities" className="p-6 shadow-sm rounded-xl bg-card-light dark:bg-card-dark border border-gray-100 dark:border-gray-800 cursor-default">
            <h2 className="mb-4 text-lg font-semibold">Recent Transactions</h2>
            {recentTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase border-b dark:text-gray-400 dark:border-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Title</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Account</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((tx) => (
                      <tr key={tx._id} className="border-b last:border-0 dark:border-gray-800">
                        <td className="px-4 py-3 text-sm">{formatDate(tx.date)}</td>
                        <td className="px-4 py-3 font-medium">{tx.title}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: `${tx.categoryId?.color}20`, color: tx.categoryId?.color }}>
                            {tx.categoryId?.name || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {tx.accountId?.name || 'Unknown'}
                        </td>
                        <td className={`px-4 py-3 text-right font-medium ${tx.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                          {tx.type === 'income' ? '+' : '-'}{currency}{tx.amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">No recent transactions found.</p>
            )}
          </div>
        </div>

        {/* Right Column: Accounts & Summary */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="cursor-default" title="Quick view of your active accounts">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">My Accounts</CardTitle>
              <Link to="/accounts" className="text-sm text-primary-light hover:underline flex items-center gap-1">
                Manage <ArrowRight size={14} />
              </Link>
            </CardHeader>
            <CardContent>
              {accounts.length === 0 ? (
                <p className="text-gray-500 text-sm">No accounts found.</p>
              ) : (
                <div className="space-y-3">
                  {accounts.map(acc => (
                    <div 
                      key={acc._id} 
                      onClick={() => setSelectedAccountId(acc._id === selectedAccountId ? '' : acc._id)}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                        acc._id === selectedAccountId 
                          ? 'border-primary-light bg-primary-light/10 dark:border-primary-dark dark:bg-primary-dark/20' 
                          : 'dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-md ${acc._id === selectedAccountId ? 'bg-primary-light/20 text-primary-light dark:bg-primary-dark/30 dark:text-primary-dark' : 'bg-gray-100 dark:bg-gray-800'}`}>
                          {acc.type.toLowerCase() === 'cash' ? <Coins size={16} /> : <Building2 size={16} />}
                        </div>
                        <div>
                          <p className="font-medium">{acc.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{acc.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${acc.balance && acc.balance < 0 ? 'text-red-500' : ''}`}>{currency}{acc.balance?.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
