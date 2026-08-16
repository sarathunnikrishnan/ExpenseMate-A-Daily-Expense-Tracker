/**
 * @file CurrencyContext.tsx
 * @description React Context Provider for currency formatting symbols and localized date representation preferences.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

type CurrencyContextType = {
  currency: string;
  setCurrency: (currency: string) => void;
  dateFormat: string;
  setDateFormat: (format: string) => void;
  formatDate: (dateString: string | Date) => string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('currency') || '₹';
  });

  const [dateFormat, setDateFormatState] = useState(() => {
    return localStorage.getItem('dateFormat') || 'DD/MM/YYYY';
  });

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('dateFormat', dateFormat);
  }, [dateFormat]);

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
  };

  const setDateFormat = (newFormat: string) => {
    setDateFormatState(newFormat);
  };

  const formatDate = (dateInput: string | Date) => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '';

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const shortYear = String(year).slice(-2);
    const shortMonth = d.toLocaleString('default', { month: 'short' });
    const longMonth = d.toLocaleString('default', { month: 'long' });

    switch (dateFormat) {
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'DD MMM, YYYY':
        return `${day} ${shortMonth}, ${year}`;
      case 'MMM DD, YYYY':
        return `${shortMonth} ${day}, ${year}`;
      case 'DD MMMM YYYY':
        return `${day} ${longMonth} ${year}`;
      case 'MMMM DD, YYYY':
        return `${longMonth} ${day}, ${year}`;
      case 'DD-MM-YYYY':
        return `${day}-${month}-${year}`;
      case 'MM-DD-YYYY':
        return `${month}-${day}-${year}`;
      case 'YYYY/MM/DD':
        return `${year}/${month}/${day}`;
      case 'DD.MM.YYYY':
        return `${day}.${month}.${year}`;
      case 'YY/MM/DD':
        return `${shortYear}/${month}/${day}`;
      case 'DD/MM/YYYY':
      default:
        return `${day}/${month}/${year}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, dateFormat, setDateFormat, formatDate }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
