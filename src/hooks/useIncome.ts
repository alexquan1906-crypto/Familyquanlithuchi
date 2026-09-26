import { useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Income } from '../types';
import { toast } from 'sonner';

export function useIncome() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);
  const lastRange = useRef<{ start?: string; end?: string }>({});

  const fetchIncomes = useCallback(async (startDate?: string, endDate?: string) => {
    const currentRequest = ++requestId.current;
    lastRange.current = { start: startDate, end: endDate };
    setLoading(true);
    try {
      let query = supabase.from('income').select('*').order('date', { ascending: false });
      
      if (startDate && endDate) {
        query = query.gte('date', startDate).lte('date', endDate);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      if (currentRequest === requestId.current) setIncomes(data as Income[]);
    } catch (error: any) {
      if (currentRequest === requestId.current) toast.error('Lỗi tải dữ liệu thu nhập: ' + error.message);
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, []);

  const addIncome = async (income: Omit<Income, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase.from('income').insert([income]);
      if (error) throw error;
      
      toast.success('Đã thêm thu nhập thành công!');
      void fetchIncomes(lastRange.current.start, lastRange.current.end);
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
      void fetchIncomes(lastRange.current.start, lastRange.current.end);
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
      void fetchIncomes(lastRange.current.start, lastRange.current.end);
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
