import { Income } from '../../types';
import { Pencil, Trash2, ArrowDownCircle } from 'lucide-react';
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
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl h-24 border border-slate-200"></div>
        ))}
      </div>
    );
  }

  if (filteredIncomes.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
        <p className="text-lg">Chưa có giao dịch thu nhập nào</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="divide-y divide-slate-100">
        {filteredIncomes.map((inc) => {
          const dateObj = new Date(inc.date);
          const lunarInfo = getLunarDate(dateObj);
          
          return (
          <div key={inc.id} className="p-4 md:p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 flex-1">
              {/* Avatar Icon */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-green-700 text-xl font-bold">
                  {inc.person === 'bo' ? '👨' : '👩'}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-lg md:text-xl">
                    {inc.note || 'Không có ghi chú'}
                  </p>
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="text-[13px] md:text-sm font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 w-fit">
                      🌙 {lunarInfo.day}/{lunarInfo.month} ÂL ({lunarInfo.canChi})
                    </span>
                    <span className="text-xs md:text-sm text-slate-500 font-medium pl-1">
                      🌞 {dateObj.toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Số Tiền & Action */}
            <div className="flex flex-col items-end gap-2 ml-4">
              <div className="font-bold text-lg md:text-xl text-green-600 flex items-center gap-1">
                <ArrowDownCircle size={18} />
                +{inc.amount.toLocaleString('vi-VN')} đ
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(inc)}
                  className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Sửa"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Bạn có chắc chắn muốn xóa giao dịch này không?')) {
                      onDelete(inc.id);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Xóa"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}
