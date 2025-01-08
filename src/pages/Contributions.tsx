// src/pages/Contributions.tsx

import React, { useState } from 'react';
import { useContributions } from '../hooks/useContributions';

interface ContributionFormData {
  amount: number;
  date: Date;
}

export default function Contributions() {
  const { 
    contributions, 
    addContribution, 
    getTotalContributions, 
    getMonthlyContributions,
    getBalance,
    loading, 
    error 
  } = useContributions();

  const [isAddingContribution, setIsAddingContribution] = useState(false);
  const [formData, setFormData] = useState<ContributionFormData>({
    amount: 0,
    date: new Date(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addContribution(formData);
      setFormData({
        amount: 0,
        date: new Date(),
      });
      setIsAddingContribution(false);
    } catch (err) {
      console.error('Failed to add contribution:', err);
    }
  };

  const monthlyContributions = getMonthlyContributions();
  const totalContributions = getTotalContributions();
  const currentBalance = getBalance();

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contributions Management</h1>
        <button
          onClick={() => setIsAddingContribution(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add Contribution
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Contributions</h3>
          <p className="text-2xl">₹{totalContributions.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Monthly Contributions</h3>
          <p className="text-2xl">
            ₹{monthlyContributions.reduce((sum, cont) => sum + cont.amount, 0).toFixed(2)}
          </p>
        </div>
        <div className={`bg-white p-4 rounded-lg shadow ${
          currentBalance < 0 ? 'text-red-600' : 'text-green-600'
        }`}>
          <h3 className="text-lg font-semibold mb-2">Current Balance</h3>
          <p className="text-2xl">₹{currentBalance.toFixed(2)}</p>
        </div>
      </div>

      {/* Add Contribution Modal */}
      {isAddingContribution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Contribution</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    amount: parseFloat(e.target.value) 
                  }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date.toISOString().split('T')[0]}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    date: new Date(e.target.value) 
                  }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingContribution(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contributions List */}
      <div className="bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold p-4 border-b">Contribution History</h2>
        <div className="divide-y">
          {contributions.map((contribution) => (
            <div key={contribution.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">₹{contribution.amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">
                    {contribution.date.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    contribution.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {contribution.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}