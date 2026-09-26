import { Expense } from '../../types';
import { Pencil, Trash2, ShoppingBag } from 'lucide-react';
import { getExpenseCategoryInfo } from './ExpenseForm';
import { getLunarDateMock as getLunarDate } from '../../lib/lunar';

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
      <div className="space-y-3 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl h-20 border border-slate-200/80"></div>
        ))}
      </div>
    );
  }

  if (filteredExpenses.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center text-slate-400 shadow-sm">
        <ShoppingBag size={32} className="mx-auto mb-2 text-slate-300" />
        <p className="font-bold text-slate-600 text-base">Chưa có giao dịch chi tiêu nào</p>
        <p className="text-xs text-slate-400 mt-1">Các khoản chi tiêu của bạn sẽ hiển thị tại đây</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {filteredExpenses.map((exp) => {
        const catInfo = getExpenseCategoryInfo(exp.category);
        const dateObj = new Date(exp.date);
        const lunarInfo = getLunarDate(dateObj);
        
        return (
          <div 
            key={exp.id} 
            className="bg-white rounded-3xl p-3.5 md:p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0 pr-3">
              {/* Category Icon */}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br ${catInfo.color} text-white shadow-sm shrink-0`}>
                {catInfo.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-extrabold text-slate-800 text-sm md:text-base truncate">
                    {exp.note || catInfo.label}
                  </p>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100 hidden sm:inline-block shrink-0">
                    {catInfo.label}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 inline-flex items-center gap-1">
                    🌙 {lunarInfo.day}/{lunarInfo.month} ÂL · {lunarInfo.canChi}
                  </span>
                  <span className="text-slate-400 font-medium">
                    · {dateObj.toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Số Tiền & Action */}
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="font-black text-base md:text-lg text-rose-600 tracking-tight">
                -{exp.amount.toLocaleString('vi-VN')} đ
              </span>
              
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(exp)}
                  className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
                  title="Chỉnh sửa"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Bạn có chắc chắn muốn xóa giao dịch này không?')) {
                      onDelete(exp.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Xóa"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
