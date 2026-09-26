import { useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Expense } from '../types';
import { toast } from 'sonner';

export function useExpense() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);
  const lastRange = useRef<{ start?: string; end?: string }>({});

  const fetchExpenses = useCallback(async (startDate?: string, endDate?: string) => {
    const currentRequest = ++requestId.current;
    lastRange.current = { start: startDate, end: endDate };
    setLoading(true);
    try {
      let query = supabase.from('expense').select('*').order('date', { ascending: false });
      
      if (startDate && endDate) {
        query = query.gte('date', startDate).lte('date', endDate);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      if (currentRequest === requestId.current) setExpenses(data as Expense[]);
    } catch (error: any) {
      if (currentRequest === requestId.current) toast.error('Lỗi tải dữ liệu chi tiêu: ' + error.message);
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, []);

  const addExpense = async (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase.from('expense').insert([expense]);
      if (error) throw error;
      
      toast.success('Đã lưu chi tiêu!');
      void fetchExpenses(lastRange.current.start, lastRange.current.end);
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
      void fetchExpenses(lastRange.current.start, lastRange.current.end);
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
      void fetchExpenses(lastRange.current.start, lastRange.current.end);
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
