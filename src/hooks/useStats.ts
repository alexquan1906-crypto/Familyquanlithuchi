import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Income, Expense } from '../types';

export function useStats() {
  const [loading, setLoading] = useState(false);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchMonthData = useCallback(async (month: number, year: number) => {
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

      setIncomes(incomeRes.data as Income[]);
      setExpenses(expenseRes.data as Expense[]);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu thống kê:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const incomeByPerson = incomes.reduce((acc, curr) => {
    acc[curr.person] = (acc[curr.person] || 0) + curr.amount;
    return acc;
  }, { bo: 0, me: 0 } as Record<string, number>);

  const expenseByCategory = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(expenseByCategory)
    .map(([cat, amount]) => ({ name: cat, value: amount }))
    .sort((a, b) => b.value - a.value);

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  return {
    loading,
    fetchMonthData,
    incomes,
    expenses,
    totalIncome,
    totalExpense,
    incomeByPerson,
    pieChartData,
  };
}
