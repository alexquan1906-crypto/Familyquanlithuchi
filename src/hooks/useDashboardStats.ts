import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useDashboardStats(initialStartDate?: string, initialEndDate?: string) {
  const [loading, setLoading] = useState(true);
  
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [incomeTrend, setIncomeTrend] = useState({ value: 0, isPositive: true });
  const [expenseTrend, setExpenseTrend] = useState({ value: 0, isPositive: true });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [rawTransactions, setRawTransactions] = useState<any[]>([]);

  const fetchStats = useCallback(async (startDate?: string, endDate?: string) => {
    try {
      setLoading(true);
      const now = new Date();
      
      // Default to Current month bounds if not provided
      const finalStart = startDate || new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const finalEnd = endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
      
      // Previous bounds for trend (only makes perfect sense if it's default month, but we'll try to estimate for custom ranges too, or just skip trend if custom)
      const rangeMs = new Date(finalEnd).getTime() - new Date(finalStart).getTime();
      const prevStart = new Date(new Date(finalStart).getTime() - rangeMs).toISOString();
      const prevEnd = new Date(new Date(finalStart).getTime() - 1).toISOString();

      // Fetch Income
      const { data: currentIncomes } = await supabase.from('income').select('amount, date, note, person, id').gte('date', finalStart).lte('date', finalEnd);
      const { data: prevIncomes } = await supabase.from('income').select('amount').gte('date', prevStart).lte('date', prevEnd);
      
      // Fetch Expense
      const { data: currentExpenses } = await supabase.from('expense').select('amount, date, note, category, id').gte('date', finalStart).lte('date', finalEnd);
      const { data: prevExpenses } = await supabase.from('expense').select('amount').gte('date', prevStart).lte('date', prevEnd);

      const currIncTotal = (currentIncomes || []).reduce((sum, item) => sum + item.amount, 0);
      const prevIncTotal = (prevIncomes || []).reduce((sum, item) => sum + item.amount, 0);
      
      const currExpTotal = (currentExpenses || []).reduce((sum, item) => sum + item.amount, 0);
      const prevExpTotal = (prevExpenses || []).reduce((sum, item) => sum + item.amount, 0);

      setTotalIncome(currIncTotal);
      setTotalExpense(currExpTotal);
      setBalance(currIncTotal - currExpTotal);

      // Trends
      const incDiff = prevIncTotal === 0 ? 100 : Math.round(((currIncTotal - prevIncTotal) / prevIncTotal) * 100);
      setIncomeTrend({ value: Math.abs(incDiff), isPositive: incDiff >= 0 });

      const expDiff = prevExpTotal === 0 ? 100 : Math.round(((currExpTotal - prevExpTotal) / prevExpTotal) * 100);
      setExpenseTrend({ value: Math.abs(expDiff), isPositive: expDiff >= 0 });

      // Recent Transactions
      const mappedIncomes = (currentIncomes || []).map(i => ({ ...i, type: 'income' as const }));
      const mappedExpenses = (currentExpenses || []).map(e => ({ ...e, type: 'expense' as const }));
      
      const combined = [...mappedIncomes, ...mappedExpenses]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
      setRawTransactions(combined);
      setRecentTransactions(combined.slice(0, 5));

    } catch (error) {
      console.error('Lỗi khi fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(initialStartDate, initialEndDate);
  }, [fetchStats, initialStartDate, initialEndDate]);

  return {
    totalIncome,
    totalExpense,
    balance,
    incomeTrend,
    expenseTrend,
    recentTransactions,
    rawTransactions,
    loading,
    fetchStats
  };
}
