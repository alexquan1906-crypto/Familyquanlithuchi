import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Income, Expense } from '../types';

export interface CalendarDayData {
  dateStr: string;
  incomes: Income[];
  expenses: Expense[];
  hasIncome: boolean;
  hasExpense: boolean;
}

export function useCalendarTransactions() {
  const [loading, setLoading] = useState(false);
  const [transactionsByDate, setTransactionsByDate] = useState<Record<string, CalendarDayData>>({});

  const fetchMonthTransactions = useCallback(async (month: number, year: number) => {
    setLoading(true);
    try {
      const startOfMonth = new Date(year, month - 1, 1).toISOString();
      const endOfMonth = new Date(year, month, 0, 23, 59, 59).toISOString();

      const [incomeRes, expenseRes] = await Promise.all([
        supabase.from('income').select('*').gte('date', startOfMonth).lte('date', endOfMonth),
        supabase.from('expense').select('*').gte('date', startOfMonth).lte('date', endOfMonth)
      ]);

      if (incomeRes.error) throw incomeRes.error;
      if (expenseRes.error) throw expenseRes.error;

      const incomes = incomeRes.data as Income[];
      const expenses = expenseRes.data as Expense[];

      const grouped: Record<string, CalendarDayData> = {};

      incomes.forEach(inc => {
        const dateStr = inc.date.split('T')[0];
        if (!grouped[dateStr]) grouped[dateStr] = { dateStr, incomes: [], expenses: [], hasIncome: false, hasExpense: false };
        grouped[dateStr].incomes.push(inc);
        grouped[dateStr].hasIncome = true;
      });

      expenses.forEach(exp => {
        const dateStr = exp.date.split('T')[0];
        if (!grouped[dateStr]) grouped[dateStr] = { dateStr, incomes: [], expenses: [], hasIncome: false, hasExpense: false };
        grouped[dateStr].expenses.push(exp);
        grouped[dateStr].hasExpense = true;
      });

      setTransactionsByDate(grouped);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu lịch:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, transactionsByDate, fetchMonthTransactions };
}
