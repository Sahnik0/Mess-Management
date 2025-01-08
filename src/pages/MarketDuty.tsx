// src/pages/MarketDuty.tsx

import React, { useState } from 'react';
import { useMarketDuty } from '../hooks/useMarketDuty';

const WEEK_DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export default function MarketDuty() {
  const { dutyDays, updateDutyDays, getNextDutyDate, loading, error } = useMarketDuty();
  const [selectedDays, setSelectedDays] = useState<string[]>(dutyDays);

  const handleDayToggle = (day: string) => {
    const updatedDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];

    if (updatedDays.length <= 2) {
      setSelectedDays(updatedDays);
    }
  };

  const handleSave = async () => {
    await updateDutyDays(selectedDays);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  const nextDutyDate = getNextDutyDate();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Market Duty Schedule</h1>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Select Your Duty Days</h2>
        <p className="text-gray-600 mb-4">Choose up to 2 days per week for market duty</p>
        
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {WEEK_DAYS.map((day) => (
            <button
              key={day}
              onClick={() => handleDayToggle(day)}
              className={`p-3 rounded-lg transition-colors ${
                selectedDays.includes(day)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {nextDutyDate && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold">Next Duty Date</h3>
          <p>{nextDutyDate.toLocaleDateString()}</p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Save Schedule
        </button>
      </div>
    </div>
  );
}