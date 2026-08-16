/**
 * @file MainLayout.tsx
 * @description Master navigation layout containing responsive sidebar, navigation links, and content outlet.
 */

import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Wallet } from 'lucide-react';
import { APP_NAME, APP_ROUTES } from '../constants';
import { SidebarNavItems } from '../components/navigation/SidebarContent';

const MainLayout: React.FC = (): React.ReactElement => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [configOpen, setConfigOpen] = useState<boolean>(false);

  const handleLogout = (): void => {
    logout();
    navigate(APP_ROUTES.LOGIN);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Sidebar for Desktop */}
      <aside className={DESKTOP_SIDEBAR_CLASS}>
        <div className="flex items-center justify-center gap-2 h-16 border-b border-gray-200 dark:border-gray-800">
          <Wallet className="w-6 h-6 text-primary-light dark:text-primary-dark" />
          <h1 className="text-xl font-bold text-primary-light dark:text-primary-dark">
            {APP_NAME}
          </h1>
        </div>
        <SidebarNavItems
          location={location}
          configOpen={configOpen}
          user={user}
          setConfigOpen={setConfigOpen}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 h-full bg-card-light dark:bg-card-dark">
            <div className="flex flex-col h-full">
              <div className={MOBILE_HEADER_CLASS}>
                <div className="flex items-center gap-2">
                  <Wallet className="w-6 h-6 text-primary-light dark:text-primary-dark" />
                  <h1 className="text-xl font-bold text-primary-light dark:text-primary-dark">
                    {APP_NAME}
                  </h1>
                </div>
                <button
                  type="button"
                  title="Close Sidebar"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>
              <SidebarNavItems
                location={location}
                configOpen={configOpen}
                user={user}
                setConfigOpen={setConfigOpen}
                onLogout={handleLogout}
                onLinkClick={() => setSidebarOpen(false)}
              />
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className={MOBILE_TOPBAR_CLASS}>
          <button
            type="button"
            title="Open Sidebar"
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 dark:text-gray-300"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6 text-primary-light dark:text-primary-dark" />
            <h1 className="text-xl font-bold text-primary-light dark:text-primary-dark">
              {APP_NAME}
            </h1>
          </div>
          <div className="w-8"></div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const DESKTOP_SIDEBAR_CLASS = [
  'hidden w-64 overflow-y-auto border-r border-gray-200 dark:border-gray-800',
  'bg-card-light dark:bg-card-dark md:block',
].join(' ');

const MOBILE_HEADER_CLASS = [
  'flex items-center justify-between h-16 px-4 border-b border-gray-200',
  'dark:border-gray-800',
].join(' ');

const MOBILE_TOPBAR_CLASS = [
  'flex items-center justify-between h-16 px-4 border-b border-gray-200',
  'dark:border-gray-800 md:hidden bg-card-light dark:bg-card-dark',
].join(' ');

export default MainLayout;
