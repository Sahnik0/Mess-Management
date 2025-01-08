// src/hooks/useMarketDuty.ts

import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, collection } from 'firebase/firestore';
import { auth, db, COLLECTIONS } from '../lib/firebase';
import { User } from '../types/models';

export const useMarketDuty = () => {
  const [dutyDays, setDutyDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDutyDays = async () => {
      if (!auth.currentUser) return;

      try {
        const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, auth.currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setDutyDays(userData.marketDutyDays || []);
        }
      } catch (err) {
        setError('Failed to fetch duty days');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDutyDays();
  }, []);

  const updateDutyDays = async (newDays: string[]) => {
    if (!auth.currentUser) return;

    try {
      setLoading(true);
      await setDoc(
        doc(db, COLLECTIONS.USERS, auth.currentUser.uid),
        { marketDutyDays: newDays },
        { merge: true }
      );
      setDutyDays(newDays);
    } catch (err) {
      setError('Failed to update duty days');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getNextDutyDate = (): Date | null => {
    if (!dutyDays.length) return null;

    const today = new Date();
    const currentDay = today.getDay();
    const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    const dutyDayIndices = dutyDays.map(day => weekDays.indexOf(day.toLowerCase()));
    const nextDutyIndex = dutyDayIndices.find(day => day > currentDay);
    
    if (nextDutyIndex !== undefined) {
      const daysUntilDuty = nextDutyIndex - currentDay;
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + daysUntilDuty);
      return nextDate;
    } else {
      // If no duty day found this week, get the first duty day of next week
      const firstDutyDay = Math.min(...dutyDayIndices);
      const daysUntilDuty = 7 - currentDay + firstDutyDay;
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + daysUntilDuty);
      return nextDate;
    }
  };

  return {
    dutyDays,
    updateDutyDays,
    getNextDutyDate,
    loading,
    error,
  };
};