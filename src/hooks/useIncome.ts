import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Income } from '../types';
import { toast } from 'sonner';

export function useIncome() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchIncomes = useCallback(async (month?: number, year?: number) => {
    setLoading(true);
    try {
      let query = supabase.from('income').select('*').order('date', { ascending: false });
      
      if (month !== undefined && year !== undefined) {
        const startOfMonth = new Date(year, month - 1, 1).toISOString();
        const endOfMonth = new Date(year, month, 0, 23, 59, 59).toISOString();
        query = query.gte('date', startOfMonth).lte('date', endOfMonth);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setIncomes(data as Income[]);
    } catch (error: any) {
      toast.error('Lỗi tải dữ liệu thu nhập: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addIncome = async (income: Omit<Income, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase.from('income').insert([income]);
      if (error) throw error;
      
      toast.success('Đã thêm thu nhập thành công!');
      fetchIncomes(); // Refresh
      return true;
    } catch (error: any) {
      toast.error('Không thể thêm thu nhập: ' + error.message);
      return false;
    }
  };

  const updateIncome = async (id: string, updates: Partial<Income>) => {
    try {
      const { error } = await supabase.from('income').update(updates).eq('id', id);
      if (error) throw error;
      
      toast.success('Cập nhật thu nhập thành công!');
      fetchIncomes();
      return true;
    } catch (error: any) {
      toast.error('Lỗi khi cập nhật: ' + error.message);
      return false;
    }
  };

  const deleteIncome = async (id: string) => {
    try {
      const { error } = await supabase.from('income').delete().eq('id', id);
      if (error) throw error;
      
      toast.success('Đã xóa giao dịch.');
      fetchIncomes();
      return true;
    } catch (error: any) {
      toast.error('Gặp lỗi khi xóa: ' + error.message);
      return false;
    }
  };

  return {
    incomes,
    loading,
    fetchIncomes,
    addIncome,
    updateIncome,
    deleteIncome
  };
}
