// src/hooks/useContributions.ts

import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { auth, db, COLLECTIONS } from '../lib/firebase';
import { Contribution } from '../types/models';
import { useExpenses } from './useExpenses';

export const useContributions = () => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getTotalExpenses } = useExpenses();

  const fetchContributions = async () => {
    if (!auth.currentUser) return;

    try {
      setLoading(true);
      const contributionsQuery = query(
        collection(db, COLLECTIONS.CONTRIBUTIONS),
        where('userId', '==', auth.currentUser.uid),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(contributionsQuery);
      const contributionsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      })) as Contribution[];

      setContributions(contributionsList);
    } catch (err) {
      setError('Failed to fetch contributions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions();
  }, []);

  const addContribution = async (contributionData: Omit<Contribution, 'id' | 'userId'>) => {
    if (!auth.currentUser) return;

    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, COLLECTIONS.CONTRIBUTIONS), {
        ...contributionData,
        userId: auth.currentUser.uid,
        date: Timestamp.fromDate(contributionData.date),
        status: 'pending'
      });

      const newContribution: Contribution = {
        id: docRef.id,
        userId: auth.currentUser.uid,
        ...contributionData,
      };

      setContributions(prev => [newContribution, ...prev]);
      return docRef.id;
    } catch (err) {
      setError('Failed to add contribution');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTotalContributions = () => {
    return contributions.reduce((total, contribution) => total + contribution.amount, 0);
  };

  const getBalance = () => {
    const totalContributions = getTotalContributions();
    const totalExpenses = getTotalExpenses();
    return totalContributions - totalExpenses;
  };

  const getMonthlyContributions = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return contributions.filter(contribution => {
      const contributionDate = new Date(contribution.date);
      return contributionDate.getMonth() === currentMonth && 
             contributionDate.getFullYear() === currentYear;
    });
  };

  return {
    contributions,
    addContribution,
    getTotalContributions,
    getMonthlyContributions,
    getBalance,
    loading,
    error,
    refresh: fetchContributions,
  };
};