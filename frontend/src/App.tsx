/**
 * @file App.tsx
 * @description Main application routing component, protected route wrappers, and global provider tree.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';

import MainLayout from './layouts/MainLayout';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import TransactionCategories from './pages/TransactionCategories';
import InvestmentTypes from './pages/InvestmentTypes';
import Investments from './pages/Investments';
import Profile from './pages/Profile';
import { APP_ROUTES } from './constants';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}): React.ReactElement => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }
  return <>{children}</>;
};

function App(): React.ReactElement {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CurrencyProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="min-h-screen transition-colors duration-200">
              <Toaster position="top-right" />
              <Routes>
                <Route path={APP_ROUTES.LOGIN} element={<Login />} />
                <Route path={APP_ROUTES.REGISTER} element={<Register />} />

                <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                  <Route path={APP_ROUTES.HOME} element={<Dashboard />} />
                  <Route path={APP_ROUTES.ACCOUNTS} element={<Accounts />} />
                  <Route path={APP_ROUTES.TRANSACTIONS} element={<Transactions />} />
                  <Route path={APP_ROUTES.BUDGETS} element={<Budgets />} />
                  <Route path={APP_ROUTES.REPORTS} element={<Reports />} />
                  <Route path={APP_ROUTES.CATEGORIES} element={<TransactionCategories />} />
                  <Route path={APP_ROUTES.INVESTMENT_TYPES} element={<InvestmentTypes />} />
                  <Route path={APP_ROUTES.INVESTMENT_TYPES_ALIAS} element={<InvestmentTypes />} />
                  <Route path={APP_ROUTES.SETTINGS} element={<Settings />} />
                  <Route path={APP_ROUTES.INVESTMENTS} element={<Investments />} />
                  <Route path={APP_ROUTES.PROFILE} element={<Profile />} />
                  <Route path="*" element={<Navigate to={APP_ROUTES.HOME} replace />} />
                </Route>
              </Routes>
            </div>
          </Router>
        </CurrencyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
