/**
 * Main Layout component with navigation and sidebar
 * Provides consistent layout for all authenticated pages
 */
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  CreditCard, 
  User, 
  LogOut, 
  Menu, 
  X,
  PlusCircle,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Transactions', href: '/transactions', icon: CreditCard },
    { name: 'Add Transaction', href: '/transactions/add', icon: PlusCircle },
    { name: 'Statistics', href: '/statistics', icon: BarChart3 },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const NavItem = ({ item, mobile = false }) => (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:text-white hover:bg-gray-700'
        } ${mobile ? 'mx-4' : ''}`
      }
      onClick={() => mobile && setSidebarOpen(false)}
    >
      <item.icon className="mr-3 h-5 w-5" />
      {item.name}
    </NavLink>
  );

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-gray-800 border-r border-gray-700">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-6 py-6">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-white">ExpenseTracker</span>
          </div>

          {/* Navigation */}
          <nav className="mt-8 flex-1 space-y-2 px-4">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>

          {/* User section */}
          <div className="flex-shrink-0 p-4 border-t border-gray-700">
            <div className="flex items-center p-3 bg-gray-700 rounded-lg">
              <img
                className="h-8 w-8 rounded-full"
                src={user?.profilePicture || 'https://avatar.iran.liara.run/public/46'}
                alt="Profile"
              />
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 p-1 text-gray-400 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col flex-1 w-64 bg-gray-800">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Mobile logo */}
            <div className="flex items-center flex-shrink-0 px-6 py-6">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-white">ExpenseTracker</span>
            </div>

            {/* Mobile navigation */}
            <nav className="mt-8 flex-1 space-y-2">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} mobile />
              ))}
            </nav>

            {/* Mobile user section */}
            <div className="flex-shrink-0 p-4 border-t border-gray-700">
              <div className="flex items-center p-3 bg-gray-700 rounded-lg mx-4">
                <img
                  className="h-8 w-8 rounded-full"
                  src={user?.profilePicture || 'https://avatar.iran.liara.run/public/46'}
                  alt="Profile"
                />
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 p-1 text-gray-400 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden bg-gray-800 border-b border-gray-700">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="ml-4 flex items-center">
                <div className="h-6 w-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                  <CreditCard className="h-3 w-3 text-white" />
                </div>
                <span className="ml-2 text-lg font-bold text-white">ExpenseTracker</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
