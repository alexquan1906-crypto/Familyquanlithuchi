import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Income, Expense } from '../types';

export function useStats() {
  const [loading, setLoading] = useState(false);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);

  const fetchStatsData = useCallback(async (startDate?: string, endDate?: string) => {
    setLoading(true);
    try {
      const qsIncome = supabase.from('income').select('*');
      const qsExpense = supabase.from('expense').select('*');
      
      const pIncome = (startDate && endDate) ? qsIncome.gte('date', startDate).lte('date', endDate) : qsIncome;
      const pExpense = (startDate && endDate) ? qsExpense.gte('date', startDate).lte('date', endDate) : qsExpense;

      const [incomeRes, expenseRes] = await Promise.all([pIncome, pExpense]);

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

  const fetchTrendData = useCallback(async (endDateStr?: string) => {
    try {
      const endD = endDateStr ? new Date(endDateStr) : new Date();
      // Lấy 11 tháng trước + tháng hiện tại = 12 tháng
      const startD = new Date(endD.getFullYear(), endD.getMonth() - 11, 1);
      startD.setHours(0,0,0,0);
      
      const startIso = startD.toISOString();
      const endIso = endD.toISOString();

      const [incomeRes, expenseRes] = await Promise.all([
        supabase.from('income').select('*').gte('date', startIso).lte('date', endIso),
        supabase.from('expense').select('*').gte('date', startIso).lte('date', endIso)
      ]);

      if (incomeRes.error) throw incomeRes.error;
      if (expenseRes.error) throw expenseRes.error;

      // Khởi tạo 12 tháng sẵn để biểu đồ không bị khuyết
      const grouped: Record<string, { income: number; expense: number }> = {};
      for(let i = 11; i >= 0; i--) {
        const d = new Date(endD.getFullYear(), endD.getMonth() - i, 1);
        const key = `T${d.getMonth()+1}/${d.getFullYear().toString().slice(-2)}`;
        grouped[key] = { income: 0, expense: 0 };
      }

      (incomeRes.data || []).forEach((item: any) => {
        const d = new Date(item.date);
        const key = `T${d.getMonth()+1}/${d.getFullYear().toString().slice(-2)}`;
        if (grouped[key]) {
          grouped[key].income += item.amount;
        }
      });

      (expenseRes.data || []).forEach((item: any) => {
        const d = new Date(item.date);
        const key = `T${d.getMonth()+1}/${d.getFullYear().toString().slice(-2)}`;
        if (grouped[key]) {
          grouped[key].expense += item.amount;
        }
      });

      setTrendData(
        Object.keys(grouped).map(name => ({
          name,
          'Thu Nhập': grouped[name].income,
          'Chi Tiêu': grouped[name].expense
        }))
      );
    } catch (e) {
      console.error(e);
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
    fetchStatsData,
    fetchTrendData,
    trendData,
    incomes,
    expenses,
    totalIncome,
    totalExpense,
    incomeByPerson,
    pieChartData,
  };
}
