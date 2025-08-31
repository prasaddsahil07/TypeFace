/**
 * Main Dashboard component - landing page after login
 * Shows overview of transactions and quick stats
 */
import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Calendar,
  CreditCard,
  Wallet,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { transactionAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext.jsx';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    categoryStats: [],
    paymentTypeStats: [],
    monthlyStats: [],
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Fetching dashboard data...');
      
      const [categoryRes, paymentRes, monthlyRes, transactionsRes] = await Promise.all([
        transactionAPI.getCategoryStats().catch(err => ({ data: { data: [] } })),
        transactionAPI.getPaymentTypeStats().catch(err => ({ data: { data: [] } })),
        transactionAPI.getMonthlyStats().catch(err => ({ data: { data: [] } })),
        transactionAPI.getAll(1, 5).catch(err => ({ data: { data: [] } })), // Get recent 5 transactions
      ]);

      setStats({
        categoryStats: categoryRes.data.data || [],
        paymentTypeStats: paymentRes.data.data || [],
        monthlyStats: monthlyRes.data.data || [],
      });
      setRecentTransactions(transactionsRes.data.data || []);
      console.log('Dashboard data fetched successfully');
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const totalExpenses = stats.categoryStats
    .filter(cat => cat._id === 'expense')
    .reduce((sum, cat) => sum + cat.totalAmount, 0);
  
  const totalSavings = stats.categoryStats
    .filter(cat => cat._id === 'saving')
    .reduce((sum, cat) => sum + cat.totalAmount, 0);
  
  const totalInvestments = stats.categoryStats
    .filter(cat => cat._id === 'investment')
    .reduce((sum, cat) => sum + cat.totalAmount, 0);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'expense': return 'bg-red-500';
      case 'saving': return 'bg-green-500';
      case 'investment': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentIcon = (paymentType) => {
    switch (paymentType) {
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'upi': return <Wallet className="h-4 w-4" />;
      case 'cash': return <DollarSign className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-400">
            Here's an overview of your financial activity
          </p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Expenses</p>
                <p className="text-2xl font-bold text-red-400">
                  ₹{totalExpenses.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Savings</p>
                <p className="text-2xl font-bold text-green-400">
                  ₹{totalSavings.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Investments</p>
                <p className="text-2xl font-bold text-blue-400">
                  ₹{totalInvestments.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Transactions</p>
                <p className="text-2xl font-bold text-white">
                  {stats.categoryStats.reduce((sum, cat) => sum + cat.count, 0)}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
                  <Link
                    to="/transactions"
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    View all
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {recentTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div
                        key={transaction._id}
                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getCategoryColor(transaction.category)}/20`}>
                            {getPaymentIcon(transaction.paymentType)}
                          </div>
                          <div>
                            <p className="font-medium text-white">{transaction.description}</p>
                            <p className="text-sm text-gray-400">
                              {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
                            </p>
                          </div>
                        </div>
                        <p className={`font-semibold ${
                          transaction.category === 'expense' ? 'text-red-400' : 
                          transaction.category === 'saving' ? 'text-green-400' : 'text-blue-400'
                        }`}>
                          {transaction.category === 'expense' ? '-' : '+'}₹{transaction.amount.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No transactions yet</p>
                    <Link
                      to="/transactions/add"
                      className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add your first transaction
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Category Breakdown */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/transactions/add"
                  className="flex items-center w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusCircle className="h-5 w-5 mr-3" />
                  Add Transaction
                </Link>
                <Link
                  to="/transactions"
                  className="flex items-center w-full p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  View History
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center w-full p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <DollarSign className="h-5 w-5 mr-3" />
                  Profile Settings
                </Link>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Category Breakdown</h3>
              <div className="space-y-3">
                {stats.categoryStats.map((category) => (
                  <div key={category._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`h-3 w-3 rounded-full ${getCategoryColor(category._id)}`}></div>
                      <span className="text-gray-300 capitalize">{category._id}</span>
                    </div>
                    <span className="text-white font-medium">
                      ₹{category.totalAmount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
