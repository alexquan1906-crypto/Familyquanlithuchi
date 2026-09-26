import { Income } from '../../types';
import { Pencil, Trash2, ArrowDownLeft, Coins } from 'lucide-react';
import { getLunarDateMock as getLunarDate } from '../../lib/lunar';

interface Props {
  incomes: Income[];
  loading: boolean;
  onEdit: (income: Income) => void;
  onDelete: (id: string) => void;
  filterPerson: 'all' | 'bo' | 'me';
}

export default function IncomeList({ incomes, loading, onEdit, onDelete, filterPerson }: Props) {
  const filteredIncomes = incomes.filter(inc => filterPerson === 'all' || inc.person === filterPerson);

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl h-20 border border-slate-200/80"></div>
        ))}
      </div>
    );
  }

  if (filteredIncomes.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center text-slate-400 shadow-sm">
        <Coins size={32} className="mx-auto mb-2 text-slate-300" />
        <p className="font-bold text-slate-600 text-base">Chưa có giao dịch thu nhập nào</p>
        <p className="text-xs text-slate-400 mt-1">Các khoản thu của Bố & Mẹ sẽ xuất hiện tại đây</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {filteredIncomes.map((inc) => {
        const dateObj = new Date(inc.date);
        const lunarInfo = getLunarDate(dateObj);
        const isBo = inc.person === 'bo';
        
        return (
          <div 
            key={inc.id} 
            className="bg-white rounded-3xl p-3.5 md:p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0 pr-3">
              {/* Avatar Icon */}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 ${
                isBo ? 'bg-sky-100 text-sky-700' : 'bg-pink-100 text-pink-700'
              }`}>
                {isBo ? '👨' : '👩'}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-extrabold text-slate-800 text-sm md:text-base truncate">
                    {inc.note || (isBo ? 'Thu nhập của Bố' : 'Thu nhập của Mẹ')}
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border hidden sm:inline-block shrink-0 ${
                    isBo ? 'bg-sky-50 text-sky-700 border-sky-100' : 'bg-pink-50 text-pink-700 border-pink-100'
                  }`}>
                    {isBo ? 'Bố' : 'Mẹ'}
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
              <span className="font-black text-base md:text-lg text-emerald-600 tracking-tight flex items-center gap-0.5">
                <ArrowDownLeft size={16} />
                +{inc.amount.toLocaleString('vi-VN')} đ
              </span>
              
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(inc)}
                  className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
                  title="Chỉnh sửa"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Bạn có chắc chắn muốn xóa khoản thu nhập này?')) {
                      onDelete(inc.id);
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
