import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Task } from '../types';
import { toast } from 'sonner';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('is_completed', { ascending: true })
        .order('due_date', { ascending: true, nullsFirst: false });

      if (error) throw error;
      setTasks(data as Task[]);
    } catch (error: any) {
      toast.error('Lỗi tải danh sách nhiệm vụ: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase.from('tasks').insert([task]);
      if (error) throw error;
      toast.success('Đã thêm nhiệm vụ mới!');
      fetchTasks();
      return true;
    } catch (error: any) {
      toast.error('Lỗi khi thêm nhiệm vụ: ' + error.message);
      return false;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase.from('tasks').update(updates).eq('id', id);
      if (error) throw error;
      fetchTasks();
      return true;
    } catch (error: any) {
      toast.error('Lỗi khi cập nhật nhiệm vụ: ' + error.message);
      return false;
    }
  };

  const toggleTaskCompletion = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from('tasks').update({ is_completed: !currentStatus }).eq('id', id);
      if (error) throw error;
      fetchTasks();
      return true;
    } catch (error: any) {
      toast.error('Lỗi khi cập nhật trạng thái: ' + error.message);
      return false;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      toast.success('Đã xóa nhiệm vụ.');
      fetchTasks();
      return true;
    } catch (error: any) {
      toast.error('Lỗi khi xóa nhiệm vụ: ' + error.message);
      return false;
    }
  };

  return { tasks, loading, fetchTasks, addTask, updateTask, toggleTaskCompletion, deleteTask };
}
