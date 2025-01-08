// src/pages/Expenses.tsx

import React, { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';

interface ExpenseFormData {
  amount: number;
  items: string[];
  description: string;
  date: Date;
}

export default function Expenses() {
  const { expenses, addExpense, getTotalExpenses, getMonthlyExpenses, loading, error } = useExpenses();
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: 0,
    items: [],
    description: '',
    date: new Date(),
  });
  const [itemInput, setItemInput] = useState('');

  const handleAddItem = () => {
    if (itemInput.trim()) {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, itemInput.trim()],
      }));
      setItemInput('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addExpense(formData);
      setFormData({
        amount: 0,
        items: [],
        description: '',
        date: new Date(),
      });
      setIsAddingExpense(false);
    } catch (err) {
      console.error('Failed to add expense:', err);
    }
  };

  const monthlyExpenses = getMonthlyExpenses();
  const totalExpenses = getTotalExpenses();

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Expense Tracking</h1>
        <button
          onClick={() => setIsAddingExpense(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
          <p className="text-2xl">₹{totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Monthly Expenses</h3>
          <p className="text-2xl">₹{monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Add Expense Form */}
      {isAddingExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Items</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={itemInput}
                    onChange={(e) => setItemInput(e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Add item"
                  />
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Add
                  </button>
                </div>
                <ul className="space-y-2">
                  {formData.items.map((item, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingExpense(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold p-4 border-b">Recent Expenses</h2>
        <div className="divide-y">
          {expenses.map((expense) => (
            <div key={expense.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">₹{expense.amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">
                    {expense.date.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{expense.items.join(', ')}</p>
                  {expense.description && (
                    <p className="text-sm text-gray-500">{expense.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}