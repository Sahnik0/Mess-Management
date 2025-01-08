// src/types/models.ts

export interface User {
    id: string;
    email: string;
    name: string;
    marketDutyDays: string[];
    lastNotified?: Date;
  }
  
  export interface Expense {
    id: string;
    userId: string;
    date: Date;
    amount: number;
    items: string[];
    description?: string;
  }
  
  export interface Contribution {
    id: string;
    userId: string;
    date: Date;
    amount: number;
    status: 'pending' | 'completed';
  }
  
  // Custom hook for market duty management
  export interface MarketDutyHook {
    dutyDays: string[];
    updateDutyDays: (days: string[]) => Promise<void>;
    nextDutyDate: Date | null;
  }
  
  // Custom hook for expense management
  export interface ExpenseHook {
    expenses: Expense[];
    addExpense: (expense: Omit<Expense, 'id' | 'userId'>) => Promise<void>;
    totalExpenses: number;
  }
  
  // Custom hook for contribution management
  export interface ContributionHook {
    contributions: Contribution[];
    addContribution: (contribution: Omit<Contribution, 'id' | 'userId'>) => Promise<void>;
    totalContributions: number;
    balance: number;
  }