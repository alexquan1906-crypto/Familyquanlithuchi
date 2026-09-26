import { useMemo } from 'react';
import { getLunarDateMock as getLunarDate } from '../../lib/lunar';
import { ArrowDownLeft, ArrowUpRight, Calendar } from 'lucide-react';

interface DailyBreakdownProps {
  transactions: any[];
}

export default function DailyBreakdown({ transactions }: DailyBreakdownProps) {
  const groupedData = useMemo(() => {
    const groups: Record<string, { dateStr: string; income: number; expense: number; transactions: any[] }> = {};
    
    transactions.forEach(tx => {
      const dateStr = tx.date.split('T')[0];
      if (!groups[dateStr]) {
        groups[dateStr] = { dateStr, income: 0, expense: 0, transactions: [] };
      }
      if (tx.type === 'income') {
        groups[dateStr].income += tx.amount;
      } else {
        groups[dateStr].expense += tx.amount;
      }
      groups[dateStr].transactions.push(tx);
    });

    return Object.values(groups).sort((a, b) => new Date(b.dateStr).getTime() - new Date(a.dateStr).getTime());
  }, [transactions]);

  if (groupedData.length === 0) {
    return (
      <div className="bg-white/80 rounded-3xl border border-slate-200/80 p-8 text-center text-slate-400 shadow-sm">
        <Calendar size={32} className="mx-auto mb-2 text-slate-300" />
        <p className="font-semibold text-slate-500">Chưa có giao dịch trong khoảng thời gian này</p>
        <p className="text-xs text-slate-400 mt-1">Chọn mốc thời gian khác hoặc thêm khoản thu/chi mới</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-extrabold text-slate-800 text-sm md:text-base tracking-tight">
          Chi Tiết Dòng Tiền Từng Ngày
        </h3>
        <span className="text-xs text-slate-400 font-semibold">
          {groupedData.length} ngày phát sinh
        </span>
      </div>

      <div className="grid gap-3">
        {groupedData.map((dayData) => {
          const solarDate = new Date(dayData.dateStr);
          const lunarDate = getLunarDate(solarDate);
          const dayOfWeek = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][solarDate.getDay()];
          const diff = dayData.income - dayData.expense;
          const isPositive = diff > 0;
          const isNegative = diff < 0;

          return (
            <div 
              key={dayData.dateStr} 
              className="bg-white rounded-3xl p-3.5 md:p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Header Ngày */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 flex flex-col items-center justify-center font-black text-slate-800 shadow-inner">
                    <span className="text-xs leading-none text-slate-400 font-bold uppercase">{dayOfWeek}</span>
                    <span className="text-base leading-tight mt-0.5">{solarDate.getDate()}</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm md:text-base">
                      {solarDate.toLocaleDateString('vi-VN')}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Tháng {solarDate.getMonth() + 1}, {solarDate.getFullYear()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/70 inline-block">
                    🌙 {lunarDate.day}/{lunarDate.month} ÂL · {lunarDate.canChi}
                  </span>
                </div>
              </div>

              {/* Dữ liệu 3 cột */}
              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div className="bg-emerald-50/60 p-2 rounded-2xl border border-emerald-100/50">
                  <p className="text-[10px] uppercase font-bold text-emerald-700/80 mb-0.5 flex items-center justify-center gap-0.5">
                    <ArrowDownLeft size={12} /> Thu vào
                  </p>
                  <p className="font-extrabold text-xs md:text-sm text-emerald-600 truncate">
                    {dayData.income > 0 ? `+${dayData.income.toLocaleString('vi-VN')}` : '0'} đ
                  </p>
                </div>
                
                <div className="bg-rose-50/60 p-2 rounded-2xl border border-rose-100/50">
                  <p className="text-[10px] uppercase font-bold text-rose-700/80 mb-0.5 flex items-center justify-center gap-0.5">
                    <ArrowUpRight size={12} /> Chi ra
                  </p>
                  <p className="font-extrabold text-xs md:text-sm text-rose-600 truncate">
                    {dayData.expense > 0 ? `-${dayData.expense.toLocaleString('vi-VN')}` : '0'} đ
                  </p>
                </div>

                <div className={`p-2 rounded-2xl border ${
                  isPositive 
                    ? 'bg-sky-50/60 border-sky-100/60' 
                    : isNegative 
                      ? 'bg-amber-50/60 border-amber-100/60' 
                      : 'bg-slate-50 border-slate-100'
                }`}>
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">
                    Chênh lệch
                  </p>
                  <p className={`font-extrabold text-xs md:text-sm truncate ${
                    isPositive ? 'text-sky-600' : isNegative ? 'text-rose-500' : 'text-slate-600'
                  }`}>
                    {diff > 0 ? `+${diff.toLocaleString('vi-VN')}` : diff < 0 ? `${diff.toLocaleString('vi-VN')}` : '0'} đ
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
