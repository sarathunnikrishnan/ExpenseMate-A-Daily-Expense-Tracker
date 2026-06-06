import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { SHORT_MONTHS } from '../constants';
import { ArrowUp, ArrowDown } from 'lucide-react';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

const DEFAULT_WIDGET_ORDER = ['summaryCards', 'expensePieChart', 'incomeExpenseBarChart', 'savingsLineChart', 'topExpensesList', 'cumulativeAreaChart'];

const Reports = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const { currency } = useCurrency();
  
  const currentDate = new Date();
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [month, setMonth] = useState(0); // Default to All Time
  const [year, setYear] = useState(currentDate.getFullYear());

  const [accounts, setAccounts] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [yearlyData, setYearlyData] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, savings: 0 });
  const [cumulativeData, setCumulativeData] = useState<any[]>([]);
  const [savingsTrendData, setSavingsTrendData] = useState<any[]>([]);

  // Local state for widget order to allow optimistic UI updates
  const [widgetOrder, setWidgetOrder] = useState<string[]>(user?.reportWidgetOrder || DEFAULT_WIDGET_ORDER);

  useEffect(() => {
    fetchData();
  }, [month, year, selectedAccountId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const accountQuery = selectedAccountId ? `&accountId=${selectedAccountId}` : '';
      const [catRes, yearlyRes, monthlyRes, accRes] = await Promise.all([
        api.get(`/reports/category?month=${month}&year=${year}${accountQuery}`),
        api.get(`/reports/yearly?year=${year}${accountQuery}`),
        api.get(`/reports/monthly?month=${month}&year=${year}${accountQuery}`),
        api.get('/accounts')
      ]);
      
      const sortedCatData = [...catRes.data].sort((a, b) => b.amount - a.amount);
      setCategoryData(sortedCatData);
      setAccounts(accRes.data);
      
      // Map yearly data numbers to month names and calculate cumulative & savings trend
      let cumulativeIncome = 0;
      let cumulativeExpense = 0;
      
      const mappedYearly = yearlyRes.data.map((item: any) => {
        cumulativeIncome += item.income;
        cumulativeExpense += item.expense;
        return {
          name: SHORT_MONTHS[item.month - 1],
          Income: item.income,
          Expense: item.expense,
          CumulativeIncome: cumulativeIncome,
          CumulativeExpense: cumulativeExpense,
          NetSavings: item.income - item.expense
        };
      });
      
      setYearlyData(mappedYearly);
      setCumulativeData(mappedYearly);
      setSavingsTrendData(mappedYearly);
      
      setSummary({
        totalIncome: monthlyRes.data.totalIncome,
        totalExpense: monthlyRes.data.totalExpense,
        savings: monthlyRes.data.savings
      });
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  const moveWidget = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === widgetOrder.length - 1)) return;
    
    const newOrder = [...widgetOrder];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    [newOrder[index], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[index]];
    
    setWidgetOrder(newOrder); // Optimistic UI update

    try {
      const res = await api.put('/auth/profile', { reportWidgetOrder: newOrder });
      updateUser(res.data);
    } catch (error) {
      toast.error('Failed to save widget layout');
      // Revert on failure
      setWidgetOrder(widgetOrder);
    }
  };

  const WidgetHeader = ({ title, index }: { title: string, index: number }) => (
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle>{title}</CardTitle>
      <div className="flex gap-1">
        <button 
          onClick={() => moveWidget(index, 'up')} 
          disabled={index === 0}
          className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowUp size={16} />
        </button>
        <button 
          onClick={() => moveWidget(index, 'down')} 
          disabled={index === widgetOrder.length - 1}
          className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowDown size={16} />
        </button>
      </div>
    </CardHeader>
  );

  const renderWidget = (widgetId: string, index: number) => {
    switch (widgetId) {
      case 'summaryCards':
        return (
          <div key={widgetId} className="w-full lg:col-span-2 space-y-2 relative group">
            <div className="flex justify-between items-center mb-2 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-sm font-semibold text-gray-500 uppercase">Summary Cards Layout</span>
               <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-md shadow-sm p-1 border dark:border-gray-700">
                  <button onClick={() => moveWidget(index, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-30"><ArrowUp size={14} /></button>
                  <button onClick={() => moveWidget(index, 'down')} disabled={index === widgetOrder.length - 1} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-30"><ArrowDown size={14} /></button>
               </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card title="Total money received in the selected period" className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900 transition-transform hover:scale-105 cursor-default">
                <CardContent className="py-4">
                  <p className="text-sm text-green-600 dark:text-green-400">Total Income</p>
                  <h3 className="text-2xl font-bold text-green-700 dark:text-green-500">{currency}{summary.totalIncome.toLocaleString('en-IN')}</h3>
                </CardContent>
              </Card>
              <Card title="Total money spent in the selected period" className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900 transition-transform hover:scale-105 cursor-default">
                <CardContent className="py-4">
                  <p className="text-sm text-red-600 dark:text-red-400">Total Expense</p>
                  <h3 className="text-2xl font-bold text-red-700 dark:text-red-500">{currency}{summary.totalExpense.toLocaleString('en-IN')}</h3>
                </CardContent>
              </Card>
              <Card title="Your net savings (Income minus Expense)" className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900 transition-transform hover:scale-105 cursor-default">
                <CardContent className="py-4">
                  <p className="text-sm text-blue-600 dark:text-blue-400">Net Savings</p>
                  <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-500">{currency}{summary.savings.toLocaleString('en-IN')}</h3>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      case 'expensePieChart':
        return (
          <Card key={widgetId}>
            <WidgetHeader title={`Expense by Category ${month === 0 ? '(All Time)' : `(${SHORT_MONTHS[month - 1]} ${year})`}`} index={index} />
            <CardContent>
              {categoryData.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No expenses found</p>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="amount"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((_, idx) => (
                          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${currency}${Number(value).toLocaleString('en-IN')}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        );
        
      case 'incomeExpenseBarChart':
        return (
          <Card key={widgetId}>
            <WidgetHeader title={`Income vs Expense Trend (${year})`} index={index} />
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${currency}${value}`} />
                    <Tooltip formatter={(value) => `${currency}${Number(value).toLocaleString('en-IN')}`} />
                    <Legend />
                    <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );

      case 'savingsLineChart':
        return (
          <Card key={widgetId}>
            <WidgetHeader title={`Net Savings Trend (${year})`} index={index} />
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={savingsTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${currency}${value}`} />
                    <Tooltip formatter={(value) => `${currency}${Number(value).toLocaleString('en-IN')}`} />
                    <Line type="monotone" dataKey="NetSavings" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );

      case 'cumulativeAreaChart':
        return (
          <Card key={widgetId}>
            <WidgetHeader title={`Cumulative Cash Flow (${year})`} index={index} />
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cumulativeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${currency}${value}`} />
                    <Tooltip formatter={(value) => `${currency}${Number(value).toLocaleString('en-IN')}`} />
                    <Legend />
                    <Area type="monotone" dataKey="CumulativeIncome" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="CumulativeExpense" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );

      case 'topExpensesList':
        return (
          <Card key={widgetId}>
            <WidgetHeader title={`Top Expenses ${month === 0 ? '(All Time)' : `(${SHORT_MONTHS[month - 1]} ${year})`}`} index={index} />
            <CardContent>
              {categoryData.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No expenses found</p>
              ) : (
                <div className="space-y-4">
                  {categoryData.slice(0, 5).map((cat, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: COLORS[idx % COLORS.length] }}>
                          {idx + 1}
                        </div>
                        <span className="font-medium">{cat.name}</span>
                      </div>
                      <span className="font-bold text-red-500">{currency}{cat.amount.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
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
      
      {isLoading ? <p>Loading charts...</p> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {widgetOrder.map((widgetId, index) => renderWidget(widgetId, index))}
        </div>
      )}
    </div>
  );
};

export default Reports;
