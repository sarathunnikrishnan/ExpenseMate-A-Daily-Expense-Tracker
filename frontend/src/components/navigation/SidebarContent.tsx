/**
 * @file SidebarContent.tsx
 * @description Sidebar navigation links and configuration sub-menu for MainLayout.
 */

import React from 'react';
import { NavLink, Link, Location } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  WalletCards,
  Settings,
  TrendingUp,
  Sliders,
  ChevronDown,
  ChevronUp,
  BarChart3,
  User,
  LogOut,
} from 'lucide-react';
import { User as UserType } from '../../types';
import { APP_ROUTES } from '../../constants';

interface SidebarNavProps {
  location: Location;
  configOpen: boolean;
  user: UserType | null;
  setConfigOpen: (open: boolean) => void;
  onLogout: () => void;
  onLinkClick?: () => void;
}

export const SidebarNavItems: React.FC<SidebarNavProps> = ({
  location,
  configOpen,
  user,
  setConfigOpen,
  onLogout,
  onLinkClick,
}): React.ReactElement => (
  <div className="flex flex-col h-full">
    <nav className="flex-1 px-4 py-4 space-y-2">
      <NavLink
        to={APP_ROUTES.HOME}
        onClick={onLinkClick}
        className={({ isActive }) => getNavLinkClass(isActive)}
      >
        <LayoutDashboard size={20} />
        <span className="font-medium">Dashboard</span>
      </NavLink>

      <NavLink
        to={APP_ROUTES.ACCOUNTS}
        onClick={onLinkClick}
        className={({ isActive }) => getNavLinkClass(isActive)}
      >
        <WalletCards size={20} />
        <span className="font-medium">Accounts</span>
      </NavLink>

      <NavLink
        to={APP_ROUTES.INVESTMENTS}
        onClick={onLinkClick}
        className={({ isActive }) => getNavLinkClass(isActive)}
      >
        <TrendingUp size={20} />
        <span className="font-medium">Investments</span>
      </NavLink>

      <NavLink
        to={APP_ROUTES.TRANSACTIONS}
        onClick={onLinkClick}
        className={({ isActive }) => getNavLinkClass(isActive)}
      >
        <Receipt size={20} />
        <span className="font-medium">Transactions</span>
      </NavLink>

      <NavLink
        to={APP_ROUTES.BUDGETS}
        onClick={onLinkClick}
        className={({ isActive }) => getNavLinkClass(isActive)}
      >
        <PieChart size={20} />
        <span className="font-medium">Budgets</span>
      </NavLink>

      <NavLink
        to={APP_ROUTES.REPORTS}
        onClick={onLinkClick}
        className={({ isActive }) => getNavLinkClass(isActive)}
      >
        <BarChart3 size={20} />
        <span className="font-medium">Reports</span>
      </NavLink>

      <div>
        <button
          type="button"
          title="Toggle Configurations"
          onClick={() => setConfigOpen(!configOpen)}
          className={CONFIG_TOGGLE_BTN_CLASS}
        >
          <div className="flex items-center gap-3">
            <Sliders size={20} />
            <span>Configurations</span>
          </div>
          {configOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {configOpen && (
          <div className="pl-10 pr-3 mt-1 space-y-1">
            <Link
              to={APP_ROUTES.CATEGORIES}
              onClick={onLinkClick}
              className={`block px-3 py-2 text-sm text-gray-600 transition-colors rounded-lg dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                location.pathname === APP_ROUTES.CATEGORIES
                  ? 'font-medium text-primary-light dark:text-primary-dark'
                  : ''
              }`}
            >
              Transaction Categories
            </Link>
            <Link
              to={APP_ROUTES.INVESTMENT_TYPES}
              onClick={onLinkClick}
              className={`block px-3 py-2 text-sm text-gray-600 transition-colors rounded-lg dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                location.pathname === APP_ROUTES.INVESTMENT_TYPES
                  ? 'font-medium text-primary-light dark:text-primary-dark'
                  : ''
              }`}
            >
              Investment Types
            </Link>
          </div>
        )}
      </div>

      <NavLink
        to="/settings"
        onClick={onLinkClick}
        className={({ isActive }) => getNavLinkClass(isActive)}
      >
        <Settings size={20} />
        <span>Settings</span>
      </NavLink>
    </nav>

    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
      <Link
        to={APP_ROUTES.PROFILE}
        onClick={onLinkClick}
        className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity"
      >
        {user?.profilePhoto ? (
          <img
            src={user.profilePhoto}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <User size={16} className="text-gray-500" />
          </div>
        )}
        <span className="text-sm font-medium truncate flex-1">{user?.name}</span>
      </Link>
      <button
        type="button"
        onClick={onLogout}
        className={LOGOUT_BTN_CLASS}
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  </div>
);

const getNavLinkClass = (isActive: boolean): string =>
  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
    isActive
      ? 'bg-primary-light/10 text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark font-medium'
      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
  }`;

const CONFIG_TOGGLE_BTN_CLASS = [
  'flex items-center justify-between w-full px-3 py-2 text-gray-700',
  'transition-colors rounded-lg dark:text-gray-300',
  'hover:bg-gray-100 dark:hover:bg-gray-800',
].join(' ');

const LOGOUT_BTN_CLASS = [
  'flex items-center justify-center w-full gap-2 px-4 py-2',
  'text-sm font-medium text-white transition-colors rounded-lg',
  'bg-primary-light dark:bg-primary-dark hover:opacity-90',
].join(' ');
