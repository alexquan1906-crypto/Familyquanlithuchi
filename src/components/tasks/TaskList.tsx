import { useState } from 'react';
import { Task } from '../../types';
import { CheckCircle2, Circle, Trash2, Calendar as CalendarIcon, Plus, CheckSquare } from 'lucide-react';

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
      <div className="space-y-3 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl h-16 border border-slate-200"></div>
        ))}
      </div>
    );
  }

  const pendingTasks = tasks.filter(t => !t.is_completed);
  const completedTasks = tasks.filter(t => t.is_completed);

  return (
    <div className="space-y-5">
      {/* Form Thêm Nhiệm Vụ */}
      <form onSubmit={handleAdd} className="bg-white p-3.5 md:p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-2.5">
        <input 
          type="text" 
          placeholder="Nhắc việc gia đình: Giỗ tổ tiên, đóng tiền điện, đi khám..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1 text-sm md:text-base px-4 py-2.5 border border-slate-200 rounded-2xl bg-slate-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
        />
        <div className="flex gap-2">
          <input 
            type="date"
            value={newTaskDate}
            onChange={(e) => setNewTaskDate(e.target.value)}
            className="w-36 text-xs md:text-sm px-3 py-2.5 border border-slate-200 rounded-2xl bg-slate-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 font-semibold"
          />
          <button 
            type="submit" 
            disabled={isAdding || !newTaskTitle.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold py-2.5 px-5 rounded-2xl transition-all shadow-md shadow-emerald-600/20 text-xs md:text-sm flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus size={16} />
            <span>{isAdding ? '...' : 'Thêm'}</span>
          </button>
        </div>
      </form>

      {/* Danh Sách Nhiệm Vụ */}
      <div className="space-y-5">
        {pendingTasks.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
              Việc Cần Làm ({pendingTasks.length})
            </h4>
            <div className="space-y-2">
              {pendingTasks.map(task => (
                <div 
                  key={task.id} 
                  className="bg-white rounded-3xl p-3.5 md:p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0 pr-3">
                    <button 
                      onClick={() => onToggle(task.id, task.is_completed)} 
                      className="text-slate-300 hover:text-emerald-500 transition-colors shrink-0"
                      title="Đánh dấu hoàn thành"
                    >
                      <Circle size={24} />
                    </button>
                    <div className="min-w-0">
                      <p className="font-extrabold text-slate-800 text-sm md:text-base truncate">{task.title}</p>
                      {task.due_date && (
                        <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold mt-0.5">
                          <CalendarIcon size={13} />
                          <span>Hạn: {new Date(task.due_date).toLocaleDateString('vi-VN')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => onDelete(task.id)} 
                    className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-white/70 rounded-3xl border border-slate-200/80 border-dashed text-slate-400">
            <CheckSquare size={32} className="mx-auto mb-2 text-emerald-400" />
            <p className="font-bold text-sm text-slate-600">Tuyệt vời! Không còn việc tồn đọng</p>
            <p className="text-xs text-slate-400 mt-0.5">Thêm việc cần làm gia đình để cùng nhắc nhở nhau</p>
          </div>
        )}

        {/* Đã Hoàn Thành */}
        {completedTasks.length > 0 && (
          <div className="space-y-2 opacity-75">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
              Đã Hoàn Thành ({completedTasks.length})
            </h4>
            <div className="space-y-2">
              {completedTasks.map(task => (
                <div 
                  key={task.id} 
                  className="bg-slate-50/80 rounded-3xl p-3 md:p-3.5 border border-slate-200/60 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0 pr-3">
                    <button 
                      onClick={() => onToggle(task.id, task.is_completed)} 
                      className="text-emerald-500 hover:text-slate-400 transition-colors shrink-0"
                      title="Bỏ đánh dấu"
                    >
                      <CheckCircle2 size={24} />
                    </button>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-400 line-through text-sm truncate">{task.title}</p>
                      {task.due_date && (
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                          Ngày: {new Date(task.due_date).toLocaleDateString('vi-VN')}
                        </p>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => onDelete(task.id)} 
                    className="p-1.5 text-slate-300 hover:text-rose-500 rounded-xl transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
