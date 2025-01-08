// src/hooks/useExpenses.ts

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
import { Expense } from '../types/models';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    if (!auth.currentUser) return;

    try {
      setLoading(true);
      const expensesQuery = query(
        collection(db, COLLECTIONS.EXPENSES),
        where('userId', '==', auth.currentUser.uid),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(expensesQuery);
      const expensesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      })) as Expense[];

      setExpenses(expensesList);
    } catch (err) {
      setError('Failed to fetch expenses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'userId'>) => {
    if (!auth.currentUser) return;

    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, COLLECTIONS.EXPENSES), {
        ...expenseData,
        userId: auth.currentUser.uid,
        date: Timestamp.fromDate(expenseData.date),
      });

      const newExpense: Expense = {
        id: docRef.id,
        userId: auth.currentUser.uid,
        ...expenseData,
      };

      setExpenses(prev => [newExpense, ...prev]);
      return docRef.id;
    } catch (err) {
      setError('Failed to add expense');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getMonthlyExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear;
    });
  };

  return {
    expenses,
    addExpense,
    getTotalExpenses,
    getMonthlyExpenses,
    loading,
    error,
    refresh: fetchExpenses,
  };
};