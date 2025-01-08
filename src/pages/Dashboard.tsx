// src/pages/Dashboard.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketDuty } from '../hooks/useMarketDuty';
import { useExpenses } from '../hooks/useExpenses';
import { useContributions } from '../hooks/useContributions';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Wallet, ShoppingCart, ArrowUpRight } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { dutyDays, getNextDutyDate } = useMarketDuty();
  const { expenses, getMonthlyExpenses, getTotalExpenses } = useExpenses();
  const { getTotalContributions, getBalance, contributions } = useContributions();

  const nextDutyDate = getNextDutyDate();
  const monthlyExpenses = getMonthlyExpenses();
  const currentBalance = getBalance();
  
  // Prepare data for expense trend chart
  const expenseTrendData = expenses.slice(0, 10).reverse().map(expense => ({
    date: new Date(expense.date).toLocaleDateString(),
    amount: expense.amount
  }));

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mess Management Dashboard</h1>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Balance Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Current Balance</h3>
            <Wallet className="text-blue-500" size={24} />
          </div>
          <p className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{currentBalance.toFixed(2)}
          </p>
          <button 
            onClick={() => navigate('/contributions')}
            className="mt-2 text-sm text-blue-500 flex items-center"
          >
            View Details <ArrowUpRight size={16} className="ml-1" />
          </button>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Total Expenses</h3>
            <ShoppingCart className="text-blue-500" size={24} />
          </div>
          <p className="text-2xl font-bold">₹{getTotalExpenses().toFixed(2)}</p>
          <button 
            onClick={() => navigate('/expenses')}
            className="mt-2 text-sm text-blue-500 flex items-center"
          >
            View Details <ArrowUpRight size={16} className="ml-1" />
          </button>
        </div>

        {/* Market Duty Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Next Market Duty</h3>
            <Calendar className="text-blue-500" size={24} />
          </div>
          <p className="text-2xl font-bold">
            {nextDutyDate ? nextDutyDate.toLocaleDateString() : 'Not Set'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Duty Days: {dutyDays.join(', ') || 'None set'}
          </p>
        </div>

        {/* Contributions Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Total Contributions</h3>
            <Wallet className="text-blue-500" size={24} />
          </div>
          <p className="text-2xl font-bold">₹{getTotalContributions().toFixed(2)}</p>
          <button 
            onClick={() => navigate('/contributions')}
            className="mt-2 text-sm text-blue-500 flex items-center"
          >
            View Details <ArrowUpRight size={16} className="ml-1" />
          </button>
        </div>
      </div>

      {/* Charts and Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Expense Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={expenseTrendData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[...expenses, ...contributions]
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .slice(0, 5)
              .map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">
                      {'items' in item ? 'Expense' : 'Contribution'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.date.toLocaleDateString()}
                    </p>
                  </div>
                  <p className={`font-medium ${
                    'items' in item ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {('items' in item ? '-' : '+') + '₹' + item.amount.toFixed(2)}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/market-duty')}
          className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Update Market Duty Schedule
        </button>
        <button
          onClick={() => navigate('/expenses')}
          className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Record New Expense
        </button>
        <button
          onClick={() => navigate('/contributions')}
          className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Add Contribution
        </button>
      </div>
    </div>
  );
}