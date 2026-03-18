export type Person = 'bo' | 'me';

export type ExpenseCategory = 
  | 'an_uong' 
  | 'tien_dien' 
  | 'tien_nuoc' 
  | 'tien_nha'
  | 'tien_xang' 
  | 'mua_sam' 
  | 'hieu_hi_dam' 
  | 'xe_co'
  | 'vay_no' 
  | 'khac';

export type Priority = 'low' | 'medium' | 'high';
export type TaskCategory = 'task' | 'goal' | 'appointment';

export interface Income {
  id: string;
  amount: number;
  person: Person;
  note: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  note: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date: string | null;
  is_completed: boolean;
  priority: Priority;
  category: TaskCategory;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  title: string;
  description: string | null;
  date: string;
  lunar_date: string | null;
  time: string | null;
  reminder_days: number;
  created_at: string;
}
