/**
 * Statistics page component
 * Displays charts and analytics for transaction data
 */
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  CreditCard,
  Wallet,
  BarChart3,
  Calendar,
  PieChart
} from 'lucide-react';
import { transactionAPI } from '../utils/api';

const Statistics = () => {
  const [stats, setStats] = useState({
    categoryStats: [],
    paymentTypeStats: [],
    monthlyStats: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const [categoryRes, paymentRes, monthlyRes] = await Promise.all([
        transactionAPI.getCategoryStats(),
        transactionAPI.getPaymentTypeStats(),
        transactionAPI.getMonthlyStats(),
      ]);

      setStats({
        categoryStats: categoryRes.data.data || [],
        paymentTypeStats: paymentRes.data.data || [],
        monthlyStats: monthlyRes.data.data || [],
      });
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'expense': return <TrendingDown className="h-5 w-5" />;
      case 'saving': return <TrendingUp className="h-5 w-5" />;
      case 'investment': return <Target className="h-5 w-5" />;
      default: return <DollarSign className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'expense': return { bg: 'bg-red-500', text: 'text-red-400', light: 'bg-red-500/20' };
      case 'saving': return { bg: 'bg-green-500', text: 'text-green-400', light: 'bg-green-500/20' };
      case 'investment': return { bg: 'bg-blue-500', text: 'text-blue-400', light: 'bg-blue-500/20' };
      default: return { bg: 'bg-gray-500', text: 'text-gray-400', light: 'bg-gray-500/20' };
    }
  };

  const getPaymentIcon = (paymentType) => {
    switch (paymentType) {
      case 'card': return <CreditCard className="h-5 w-5" />;
      case 'upi': return <Wallet className="h-5 w-5" />;
      case 'cash': return <DollarSign className="h-5 w-5" />;
      default: return <DollarSign className="h-5 w-5" />;
    }
  };

  const getMonthName = (month) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[month - 1];
  };

  // Calculate totals
  const totalAmount = stats.categoryStats.reduce((sum, cat) => sum + cat.totalAmount, 0);
  const totalTransactions = stats.categoryStats.reduce((sum, cat) => sum + cat.count, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Statistics</h1>
          <p className="text-gray-400">Analyze your spending patterns and financial insights</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Amount</p>
                <p className="text-2xl font-bold text-white">
                  ₹{totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Transactions</p>
                <p className="text-2xl font-bold text-white">{totalTransactions}</p>
              </div>
              <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Avg Transaction</p>
                <p className="text-2xl font-bold text-white">
                  ₹{totalTransactions > 0 ? Math.round(totalAmount / totalTransactions).toLocaleString() : 0}
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
                <p className="text-sm font-medium text-gray-400">Categories</p>
                <p className="text-2xl font-bold text-white">{stats.categoryStats.length}</p>
              </div>
              <div className="h-12 w-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <PieChart className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Statistics */}
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Category Breakdown</h2>
            </div>
            <div className="p-6">
              {stats.categoryStats.length > 0 ? (
                <div className="space-y-4">
                  {stats.categoryStats.map((category) => {
                    const colors = getCategoryColor(category._id);
                    const percentage = totalAmount > 0 ? ((category.totalAmount / totalAmount) * 100).toFixed(1) : 0;
                    
                    return (
                      <div key={category._id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${colors.light}`}>
                              <div className={colors.text}>
                                {getCategoryIcon(category._id)}
                              </div>
                            </div>
                            <div>
                              <p className="font-medium text-white capitalize">{category._id}</p>
                              <p className="text-sm text-gray-400">{category.count} transactions</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${colors.text}`}>
                              ₹{category.totalAmount.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-400">{percentage}%</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className={`${colors.bg} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <PieChart className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No category data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Type Statistics */}
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Payment Methods</h2>
            </div>
            <div className="p-6">
              {stats.paymentTypeStats.length > 0 ? (
                <div className="space-y-4">
                  {stats.paymentTypeStats.map((payment, index) => {
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500'];
                    const textColors = ['text-blue-400', 'text-green-400', 'text-purple-400'];
                    const lightColors = ['bg-blue-500/20', 'bg-green-500/20', 'bg-purple-500/20'];
                    
                    const colorIndex = index % colors.length;
                    const percentage = totalAmount > 0 ? ((payment.totalAmount / totalAmount) * 100).toFixed(1) : 0;
                    
                    return (
                      <div key={payment._id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${lightColors[colorIndex]}`}>
                              <div className={textColors[colorIndex]}>
                                {getPaymentIcon(payment._id)}
                              </div>
                            </div>
                            <div>
                              <p className="font-medium text-white capitalize">{payment._id}</p>
                              <p className="text-sm text-gray-400">{payment.count} transactions</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${textColors[colorIndex]}`}>
                              ₹{payment.totalAmount.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-400">{percentage}%</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className={`${colors[colorIndex]} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No payment data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Monthly Trends</h2>
          </div>
          <div className="p-6">
            {stats.monthlyStats.length > 0 ? (
              <div className="space-y-4">
                {stats.monthlyStats.slice(0, 6).map((month) => {
                  const maxAmount = Math.max(...stats.monthlyStats.map(m => m.totalAmount));
                  const percentage = maxAmount > 0 ? (month.totalAmount / maxAmount) * 100 : 0;
                  
                  return (
                    <div key={`${month._id.year}-${month._id.month}`} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-indigo-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {getMonthName(month._id.month)} {month._id.year}
                            </p>
                            <p className="text-sm text-gray-400">{month.count} transactions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-indigo-400">
                            ₹{month.totalAmount.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-400">
                            Avg: ₹{Math.round(month.totalAmount / month.count).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No monthly data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
