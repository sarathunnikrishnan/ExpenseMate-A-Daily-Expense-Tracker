import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { Sun, Moon, AlertCircle } from 'lucide-react';
import { DATE_FORMATS, CURRENCIES } from '../constants';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency, dateFormat, setDateFormat } = useCurrency();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <div className="grid gap-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Appearance & Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-800">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between Light and Dark mode</p>
              </div>
              <button 
                onClick={toggleTheme} 
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'light' ? (
                  <><Moon size={18} /> <span>Dark Mode</span></>
                ) : (
                  <><Sun size={18} /> <span>Light Mode</span></>
                )}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Currency Symbol</label>
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full sm:w-1/2 px-4 py-2 border rounded-lg bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700 font-medium"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.symbol} value={c.symbol}>
                      {c.symbol} - {c.name}
                    </option>
                  ))}
                </select>
                <div className="mt-3 flex gap-2 p-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-300 rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>
                    <strong>Important Note:</strong> Changing the currency symbol only changes how values are visually displayed. It does not perform any automatic currency conversion on your historical transaction data.
                  </p>
                </div>
              </div>
              
              <div className="pt-2">
                <label className="block mb-2 font-medium">Date Format</label>
                <select 
                  value={dateFormat} 
                  onChange={(e) => setDateFormat(e.target.value)}
                  className="w-full sm:w-1/2 px-4 py-2 border rounded-lg bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700 font-medium"
                >
                  {DATE_FORMATS.map(f => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Settings;
