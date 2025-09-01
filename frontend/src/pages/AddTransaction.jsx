/**
 * Add Transaction page component
 * Form for creating new transactions with proper validation
 */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Plus,
  DollarSign,
  Calendar,
  MapPin,
  CreditCard,
  Wallet,
  Target,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

const AddTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0], // today's date
    }
  });

  const watchCategory = watch('category');

  // ✅ axios instance
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage('');

    try {
      await api.post("/transaction", {
        ...data,
        amount: parseFloat(data.amount),
        date: new Date(data.date).toISOString(),
      });

      setMessage({ type: 'success', text: 'Transaction added successfully!' });
      reset();

      // Redirect after 2s
      setTimeout(() => {
        navigate('/transactions');
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add transaction';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'expense': return 'text-red-400 border-red-500 bg-red-900/20';
      case 'saving': return 'text-green-400 border-green-500 bg-green-900/20';
      case 'investment': return 'text-blue-400 border-blue-500 bg-blue-900/20';
      default: return 'text-gray-400 border-gray-500 bg-gray-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Add New Transaction</h1>
          <p className="text-gray-400">Record your income, expenses, and investments</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-900/50 border-green-700 text-green-200'
              : 'bg-red-900/50 border-red-700 text-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <input
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 3,
                    message: 'Description must be at least 3 characters',
                  },
                })}
                type="text"
                className="w-full px-3 py-3 border border-gray-700 placeholder-gray-400 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter transaction description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'expense', label: 'Expense', icon: TrendingDown },
                  { value: 'saving', label: 'Saving', icon: TrendingUp },
                  { value: 'investment', label: 'Investment', icon: Target },
                ].map((category) => (
                  <label key={category.value} className="cursor-pointer">
                    <input
                      {...register('category', { required: 'Category is required' })}
                      type="radio"
                      value={category.value}
                      className="sr-only"
                    />
                    <div className={`border-2 rounded-lg p-4 text-center transition-all ${
                      watchCategory === category.value
                        ? getCategoryColor(category.value)
                        : 'border-gray-600 text-gray-400 hover:border-gray-500'
                    }`}>
                      <category.icon className="h-6 w-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">{category.label}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.category && (
                <p className="mt-1 text-sm text-red-400">{errors.category.message}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">₹</span>
                </div>
                <input
                  {...register('amount', {
                    required: 'Amount is required',
                    min: { value: 0.01, message: 'Amount must be greater than 0' },
                    pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Enter a valid amount' },
                  })}
                  type="number"
                  step="0.01"
                  className="w-full pl-8 pr-3 py-3 border border-gray-700 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-400">{errors.amount.message}</p>
              )}
            </div>

            {/* Payment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Payment Method *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'cash', label: 'Cash', icon: DollarSign },
                  { value: 'card', label: 'Card', icon: CreditCard },
                  { value: 'upi', label: 'UPI', icon: Wallet },
                ].map((payment) => (
                  <label key={payment.value} className="cursor-pointer">
                    <input
                      {...register('paymentType', { required: 'Payment method is required' })}
                      type="radio"
                      value={payment.value}
                      className="sr-only"
                    />
                    <div className={`border-2 rounded-lg p-4 text-center transition-all ${
                      watch('paymentType') === payment.value
                        ? 'border-blue-500 text-blue-400 bg-blue-900/20'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500'
                    }`}>
                      <payment.icon className="h-6 w-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">{payment.label}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.paymentType && (
                <p className="mt-1 text-sm text-red-400">{errors.paymentType.message}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  {...register('date', { required: 'Date is required' })}
                  type="date"
                  className="w-full pl-10 pr-3 py-3 border border-gray-700 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.date && (
                <p className="mt-1 text-sm text-red-400">{errors.date.message}</p>
              )}
            </div>

            {/* Location (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location <span className="text-gray-500">(optional)</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  {...register('location')}
                  type="text"
                  className="w-full pl-10 pr-3 py-3 border border-gray-700 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter location (optional)"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Add Transaction
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/transactions')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;
