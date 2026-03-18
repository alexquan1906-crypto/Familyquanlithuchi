import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Appointment } from '../types';
import { toast } from 'sonner';

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      // Get future appointments
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;
      setAppointments(data as Appointment[]);
    } catch (error: any) {
      toast.error('Lỗi tải danh sách lịch hẹn: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addAppointment = async (appt: Omit<Appointment, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase.from('appointments').insert([appt]);
      if (error) throw error;
      toast.success('Đã thêm lịch hẹn mới!');
      fetchAppointments();
      return true;
    } catch (error: any) {
      toast.error('Lỗi khi thêm lịch hẹn: ' + error.message);
      return false;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase.from('appointments').delete().eq('id', id);
      if (error) throw error;
      toast.success('Đã xóa lịch hẹn.');
      fetchAppointments();
      return true;
    } catch (error: any) {
      toast.error('Lỗi khi xóa lịch hẹn: ' + error.message);
      return false;
    }
  };

  return { appointments, loading, fetchAppointments, addAppointment, deleteAppointment };
}
