/**
 * Transactions page component
 * Displays transaction history with search, filter, and CRUD operations
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  CreditCard,
  Wallet,
  MapPin,
  TrendingDown,
  TrendingUp,
  Target,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPaymentType, setSelectedPaymentType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState('');
  const [deleteLoading, setDeleteLoading] = useState('');

  const itemsPerPage = 10;

  // ✅ axios instance
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
    withCredentials: true, // send cookies
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    fetchTransactions();
  }, [currentPage]);

  // ✅ Fetch Transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/transaction?page=${currentPage}&limit=${itemsPerPage}`);
      setTransactions(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      setMessage({ type: 'error', text: 'Failed to load transactions' });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Transaction
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    try {
      setDeleteLoading(id);
      await api.delete(`/transaction/${id}`);
      setMessage({ type: "success", text: "Transaction deleted successfully" });
      fetchTransactions();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete transaction";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setDeleteLoading('');
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || transaction.category === selectedCategory;
    const matchesPaymentType = !selectedPaymentType || transaction.paymentType === selectedPaymentType;
    return matchesSearch && matchesCategory && matchesPaymentType;
  });

  // Category & Payment helpers
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'expense': return <TrendingDown className="h-4 w-4" />;
      case 'saving': return <TrendingUp className="h-4 w-4" />;
      case 'investment': return <Target className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

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

  const getAmountColor = (category) => {
    switch (category) {
      case 'expense': return 'text-red-400';
      case 'saving': return 'text-green-400';
      case 'investment': return 'text-blue-400';
      default: return 'text-white';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Transactions</h1>
            <p className="text-gray-400">Manage your financial transactions</p>
          </div>
          <Link
            to="/transactions/add"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Link>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success'
            ? 'bg-green-900/50 border-green-700 text-green-200'
            : 'bg-red-900/50 border-red-700 text-red-200'
            }`}>
            {message.text}
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-700 placeholder-gray-400 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-700 placeholder-gray-400 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">All Categories</option>
                <option value="expense">Expense</option>
                <option value="saving">Saving</option>
                <option value="investment">Investment</option>
              </select>
            </div>

            {/* Payment Type Filter */}
            <div>
              <select
                value={selectedPaymentType}
                onChange={(e) => setSelectedPaymentType(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-700 placeholder-gray-400 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">All Payment Types</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          {filteredTransactions.length > 0 ? (
            <div className="divide-y divide-gray-700">
              {filteredTransactions.map((transaction) => (
                <div key={transaction._id} className="p-6 hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Category Icon */}
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${getCategoryColor(transaction.category)}/20`}>
                        <div className={`h-6 w-6 ${getCategoryColor(transaction.category).replace('bg-', 'text-')}`}>
                          {getCategoryIcon(transaction.category)}
                        </div>
                      </div>

                      {/* Transaction Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-white truncate">
                            {transaction.description}
                          </h3>
                          <p className={`text-xl font-bold ${getAmountColor(transaction.category)}`}>
                            {transaction.category === 'expense' ? '-' : '+'}₹{transaction.amount.toLocaleString()}
                          </p>
                        </div>

                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(new Date(transaction.date), 'MMM dd, yyyy')}
                          </div>

                          <div className="flex items-center">
                            {getPaymentIcon(transaction.paymentType)}
                            <span className="ml-1 capitalize">{transaction.paymentType}</span>
                          </div>

                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${transaction.category === 'expense' ? 'bg-red-900/50 text-red-200' :
                              transaction.category === 'saving' ? 'bg-green-900/50 text-green-200' :
                                'bg-blue-900/50 text-blue-200'
                              }`}>
                              {getCategoryIcon(transaction.category)}
                              <span className="ml-1 capitalize">{transaction.category}</span>
                            </span>
                          </div>

                          {transaction.location && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {transaction.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        to={`/transactions/edit/${transaction._id}`}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit transaction"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>

                      <button
                        onClick={() => handleDelete(transaction._id)}
                        disabled={deleteLoading === transaction._id}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete transaction"
                      >
                        {deleteLoading === transaction._id ? (
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No transactions found</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm || selectedCategory || selectedPaymentType
                  ? 'Try adjusting your filters'
                  : 'Start by adding your first transaction'}
              </p>
              <Link
                to="/transactions/add"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {
          transactions.length >= itemsPerPage && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Showing page {currentPage}
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="px-3 py-1 bg-gray-800 text-white rounded-lg">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={transactions.length < itemsPerPage}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )
        }
      </div >
    </div >
  );
};

export default Transactions;
