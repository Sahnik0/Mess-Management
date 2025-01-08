// src/lib/firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBAcm8OdB4deO1A6xTePic4ckMn8bJIPbw",
  authDomain: "mess-2b1a9.firebaseapp.com",
  projectId: "mess-2b1a9",
  storageBucket: "mess-2b1a9.firebasestorage.app",
  messagingSenderId: "274367283722",
  appId: "1:274367283722:web:6348b6105e6c37e0cd95f3",
  measurementId: "G-40XTEJ196X"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Collection references
export const COLLECTIONS = {
  USERS: 'users',
  EXPENSES: 'expenses',
  CONTRIBUTIONS: 'contributions',
} as const;

// Firestore converter utilities
export const timestampToDate = (timestamp: any): Date => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

export const dateToTimestamp = (date: Date) => {
  return date;
};