import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Expense } from '../types';
import { toast } from 'sonner';

export function useExpense() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = useCallback(async (month?: number, year?: number) => {
    setLoading(true);
    try {
      let query = supabase.from('expense').select('*').order('date', { ascending: false });
      
      if (month !== undefined && year !== undefined) {
        const startOfMonth = new Date(year, month - 1, 1).toISOString();
        const endOfMonth = new Date(year, month, 0, 23, 59, 59).toISOString();
        query = query.gte('date', startOfMonth).lte('date', endOfMonth);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setExpenses(data as Expense[]);
    } catch (error: any) {
      toast.error('Lỗi tải dữ liệu chi tiêu: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addExpense = async (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase.from('expense').insert([expense]);
      if (error) throw error;
      
      toast.success('Đã lưu chi tiêu!');
      fetchExpenses(); // Refresh
      return true;
    } catch (error: any) {
      toast.error('Không thể lưu chi tiêu: ' + error.message);
      return false;
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      const { error } = await supabase.from('expense').update(updates).eq('id', id);
      if (error) throw error;
      
      toast.success('Cập nhật chi tiêu thành công!');
      fetchExpenses();
      return true;
    } catch (error: any) {
      toast.error('Lỗi khi cập nhật: ' + error.message);
      return false;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase.from('expense').delete().eq('id', id);
      if (error) throw error;
      
      toast.success('Đã xóa giao dịch chi tiêu.');
      fetchExpenses();
      return true;
    } catch (error: any) {
      toast.error('Gặp lỗi khi xóa: ' + error.message);
      return false;
    }
  };

  return {
    expenses,
    loading,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense
  };
}
