import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, LayoutDashboard, Receipt, PieChart, Wallet, WalletCards, Settings, TrendingUp, Sliders, ChevronDown, ChevronUp, BarChart3, User } from 'lucide-react';
import { APP_NAME } from '../constants';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Sidebar for Desktop */}
      <aside className="hidden w-64 overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-card-light dark:bg-card-dark md:block">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b border-slate-700/50">
            <h1 className="text-xl font-bold text-white drop-shadow-md">{APP_NAME}</h1>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-light/10 text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </NavLink>

            <NavLink
              to="/accounts"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-light/10 text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              <WalletCards size={20} />
              <span className="font-medium">Accounts</span>
            </NavLink>

            <NavLink
              to="/investments"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-light/10 text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              <TrendingUp size={20} />
              <span className="font-medium">Investments</span>
            </NavLink>
            
            <NavLink
              to="/transactions"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-light/10 text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              <Receipt size={20} />
              <span className="font-medium">Transactions</span>
            </NavLink>
            
            <NavLink
              to="/budgets"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-light/10 text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              <PieChart size={20} />
              <span className="font-medium">Budgets</span>
            </NavLink>
            
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-light/10 text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              <BarChart3 size={20} />
              <span className="font-medium">Reports</span>
            </NavLink>


            {/* Accordion Menu */}
            <div>
              <button
                type="button"
                title="Toggle Configurations"
                onClick={() => setConfigOpen(!configOpen)}
                className="flex items-center justify-between w-full px-3 py-2 text-gray-700 transition-colors rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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
                    to="/categories"
                    className={`block px-3 py-2 text-sm text-gray-600 transition-colors rounded-lg dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${location.pathname === '/categories' ? 'font-medium text-primary-light dark:text-primary-dark' : ''}`}
                  >
                    Transaction Categories
                  </Link>
                  <Link
                    to="/investment-types"
                    className={`block px-3 py-2 text-sm text-gray-600 transition-colors rounded-lg dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${location.pathname === '/investment-types' ? 'font-medium text-primary-light dark:text-primary-dark' : ''}`}
                  >
                    Investment Types
                  </Link>
                </div>
              )}
            </div>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 transition-colors rounded-lg ${
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-800 text-primary-light dark:text-primary-dark font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              <Settings size={20} />
              <span>Settings</span>
            </NavLink>
          </nav>
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <Link to="/profile" className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User size={16} className="text-gray-500" />
                </div>
              )}
              <span className="text-sm font-medium truncate flex-1">{user?.name}</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-primary-light dark:bg-primary-dark hover:opacity-90"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar & Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 h-full bg-card-light dark:bg-card-dark">
             <div className="flex flex-col h-full">
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
                <h1 className="text-xl font-bold text-primary-light dark:text-primary-dark">{APP_NAME}</h1>
                <button type="button" title="Close Sidebar" onClick={() => setSidebarOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 px-4 py-4 space-y-2">
                <NavLink
                  to="/"
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 transition-colors rounded-lg ${
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-800 text-primary-light dark:text-primary-dark font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </NavLink>

                <NavLink
                  to="/accounts"
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 transition-colors rounded-lg ${
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-800 text-primary-light dark:text-primary-dark font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <WalletCards size={20} />
                  <span>Accounts</span>
                </NavLink>

                <NavLink
                  to="/investments"
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 transition-colors rounded-lg ${
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-800 text-primary-light dark:text-primary-dark font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <TrendingUp size={20} />
                  <span>Investments</span>
                </NavLink>
                
                <NavLink
                  to="/transactions"
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 transition-colors rounded-lg ${
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-800 text-primary-light dark:text-primary-dark font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <Receipt size={20} />
                  <span>Transactions</span>
                </NavLink>
                
                <NavLink
                  to="/budgets"
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 transition-colors rounded-lg ${
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-800 text-primary-light dark:text-primary-dark font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <PieChart size={20} />
                  <span>Budgets</span>
                </NavLink>
                
                <NavLink
                  to="/reports"
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 transition-colors rounded-lg ${
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-800 text-primary-light dark:text-primary-dark font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <BarChart3 size={20} />
                  <span>Reports</span>
                </NavLink>
                
                {/* Accordion Menu Mobile */}
                <div>
                  <button
                    type="button"
                    title="Toggle Configurations"
                    onClick={() => setConfigOpen(!configOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 text-gray-700 transition-colors rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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
                        to="/categories"
                        onClick={() => setSidebarOpen(false)}
                        className={`block px-3 py-2 text-sm text-gray-600 transition-colors rounded-lg dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${location.pathname === '/categories' ? 'font-medium text-primary-light dark:text-primary-dark' : ''}`}
                      >
                        Transaction Categories
                      </Link>
                      <Link
                        to="/investment-types"
                        onClick={() => setSidebarOpen(false)}
                        className={`block px-3 py-2 text-sm text-gray-600 transition-colors rounded-lg dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${location.pathname === '/investment-types' ? 'font-medium text-primary-light dark:text-primary-dark' : ''}`}
                      >
                        Investment Types
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <Link to="/profile" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity">
                  {user?.profilePhoto ? (
                    <img src={user.profilePhoto} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <User size={16} className="text-gray-500" />
                    </div>
                  )}
                  <span className="text-sm font-medium truncate flex-1">{user?.name}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-primary-light dark:bg-primary-dark hover:opacity-90"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800 md:hidden bg-card-light dark:bg-card-dark">
          <button type="button" title="Open Sidebar" onClick={() => setSidebarOpen(true)} className="text-white">
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-white drop-shadow-md">{APP_NAME}</h1>
          <div className="w-8"></div> {/* Spacer to keep title centered */}
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
