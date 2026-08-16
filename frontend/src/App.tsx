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

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}): React.ReactElement => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
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
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/accounts" element={<Accounts />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/budgets" element={<Budgets />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/categories" element={<TransactionCategories />} />
                  <Route path="/investment-types" element={<InvestmentTypes />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/investments" element={<Investments />} />
                  <Route path="/profile" element={<Profile />} />
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
