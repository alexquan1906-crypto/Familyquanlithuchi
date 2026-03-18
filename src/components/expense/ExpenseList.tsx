import { Expense } from '../../types';
import { Pencil, Trash2 } from 'lucide-react';
import { getExpenseCategoryInfo } from './ExpenseForm';

interface Props {
  expenses: Expense[];
  loading: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  filterCategory: string;
}

export default function ExpenseList({ expenses, loading, onEdit, onDelete, filterCategory }: Props) {
  
  const filteredExpenses = expenses.filter(exp => filterCategory === 'all' || exp.category === filterCategory);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl h-24 border border-slate-200"></div>
        ))}
      </div>
    );
  }

  if (filteredExpenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
        <p className="text-lg">Chưa có giao dịch chi tiêu nào</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="divide-y divide-slate-100">
        {filteredExpenses.map((exp) => {
          const catInfo = getExpenseCategoryInfo(exp.category);
          
          return (
            <div key={exp.id} className="p-4 md:p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3 md:gap-4 flex-1">
                {/* Category Icon */}
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-50 border border-red-100 text-2xl shrink-0">
                  {catInfo.icon}
                </div>
                <div className="truncate pr-2">
                  <p className="font-semibold text-slate-800 text-base md:text-lg truncate">
                    {exp.note || catInfo.label}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="font-medium text-red-600/80 bg-red-50 px-2 py-0.5 rounded-md hidden sm:inline-block">
                      {catInfo.label}
                    </span>
                    <span>{new Date(exp.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>

              {/* Số Tiền & Action */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="font-bold text-lg md:text-xl text-red-500">
                  -{exp.amount.toLocaleString('vi-VN')} đ
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    onClick={() => onEdit(exp)}
                    className="p-1.5 md:p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Pencil size={18} className="md:w-5 md:h-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Bạn có chắc chắn muốn xóa giao dịch này không?')) {
                        onDelete(exp.id);
                      }
                    }}
                    className="p-1.5 md:p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} className="md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
