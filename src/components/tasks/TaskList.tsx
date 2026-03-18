import { useState } from 'react';
import { Task } from '../../types';
import { CheckCircle2, Circle, Trash2, Calendar as CalendarIcon } from 'lucide-react';

interface Props {
  tasks: Task[];
  loading: boolean;
  onAdd: (title: string, dueDate: string) => Promise<boolean>;
  onToggle: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, loading, onAdd, onToggle, onDelete }: Props) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    setIsAdding(true);
    const success = await onAdd(newTaskTitle, newTaskDate || new Date().toISOString().split('T')[0]);
    setIsAdding(false);
    
    if (success) {
      setNewTaskTitle('');
      setNewTaskDate('');
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl h-16 border border-slate-200"></div>
        ))}
      </div>
    );
  }

  const pendingTasks = tasks.filter(t => !t.is_completed);
  const completedTasks = tasks.filter(t => t.is_completed);

  return (
    <div className="space-y-8">
      
      {/* Thêm Nhiệm vụ Form */}
      <form onSubmit={handleAdd} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <input 
          type="text" 
          placeholder="Ví dụ: Đi tái khám, Mua thuốc..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1 text-lg px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <div className="flex gap-4">
          <input 
            type="date"
            value={newTaskDate}
            onChange={(e) => setNewTaskDate(e.target.value)}
            className="flex-[2] md:w-48 text-base px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button 
            type="submit" 
            disabled={isAdding || !newTaskTitle.trim()}
            className="flex-1 md:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap"
          >
            {isAdding ? 'Đang thêm...' : 'Thêm'}
          </button>
        </div>
      </form>

      {/* Danh sách công việc */}
      <div className="space-y-6">
        {pendingTasks.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-bold text-slate-700 ml-1">Cần làm</h3>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="divide-y divide-slate-100">
                {pendingTasks.map(task => (
                  <div key={task.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <button onClick={() => onToggle(task.id, task.is_completed)} className="text-slate-300 hover:text-green-500 transition-colors shrink-0">
                        <Circle size={28} />
                      </button>
                      <div>
                        <p className="font-semibold text-slate-800 text-lg md:text-xl line-clamp-1">{task.title}</p>
                        {task.due_date && (
                          <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium mt-1">
                            <CalendarIcon size={14} />
                            <span>{new Date(task.due_date).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button onClick={() => onDelete(task.id)} className="p-2 ml-4 text-slate-400 hover:text-red-500 rounded-lg transition-colors shrink-0">
                      <Trash2 size={24} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
            <p className="text-xl mb-1">🎉</p>
            <p className="font-medium text-lg">Không có nhiệm vụ nào cần làm!</p>
          </div>
        )}

        {/* Đã hoàn thành */}
        {completedTasks.length > 0 && (
          <div className="space-y-3 opacity-70">
            <h3 className="font-bold text-slate-500 ml-1">Đã hoàn thành</h3>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="divide-y divide-slate-100">
                {completedTasks.map(task => (
                  <div key={task.id} className="p-4 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-4 flex-1">
                      <button onClick={() => onToggle(task.id, task.is_completed)} className="text-green-500 transition-colors shrink-0">
                        <CheckCircle2 size={28} />
                      </button>
                      <div>
                        <p className="font-semibold text-slate-500 text-lg md:text-xl line-through line-clamp-1">{task.title}</p>
                        {task.due_date && (
                          <div className="flex items-center gap-1.5 text-sm text-slate-400 font-medium mt-1">
                            <CalendarIcon size={14} />
                            <span>{new Date(task.due_date).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button onClick={() => onDelete(task.id)} className="p-2 ml-4 text-slate-300 hover:text-red-500 rounded-lg transition-colors shrink-0">
                      <Trash2 size={24} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
