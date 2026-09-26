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
          const dayIndex = solarDate.getDay();
          const dayOfWeekBadge = dayIndex === 0 ? 'CN' : `Thứ ${dayIndex + 1}`;
          const dayOfWeekFull = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][dayIndex];
          const diff = dayData.income - dayData.expense;
          const isPositive = diff > 0;
          const isNegative = diff < 0;

          return (
            <div 
              key={dayData.dateStr} 
              className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Header Ngày */}
              <div className="flex justify-between items-center pb-2.5 md:pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2.5 md:gap-3 min-w-0 flex-1">
                  {/* Badge Thứ & Ngày: Cả 2 đều nhỏ gọn, chữ Thứ không bị gãy dòng, số ngày vừa vặn */}
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-slate-100 flex flex-col items-center justify-center font-black text-slate-800 shadow-inner shrink-0 p-1">
                    <span className="text-[8px] md:text-[9px] leading-tight text-slate-400 font-extrabold uppercase tracking-tight whitespace-nowrap">
                      {dayOfWeekBadge}
                    </span>
                    <span className="text-xs md:text-sm font-black leading-none mt-0.5 text-slate-800">
                      {solarDate.getDate()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800 text-xs md:text-sm truncate">
                      {dayOfWeekFull}, {solarDate.getDate()} thg {solarDate.getMonth() + 1}
                    </p>
                    <p className="text-[10px] md:text-[11px] text-slate-400 font-medium truncate">
                      Năm {solarDate.getFullYear()}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] md:text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/70 inline-block whitespace-nowrap">
                    🌙 {lunarDate.day}/{lunarDate.month} ÂL <span className="hidden sm:inline">· {lunarDate.canChi}</span>
                  </span>
                </div>
              </div>

              {/* Dữ liệu 3 cột */}
              <div className="grid grid-cols-3 gap-1.5 md:gap-2 mt-2.5 md:mt-3 text-center">
                <div className="bg-emerald-50/60 p-1.5 md:p-2 rounded-xl md:rounded-2xl border border-emerald-100/50">
                  <p className="text-[9px] md:text-[10px] uppercase font-bold text-emerald-700/80 mb-0.5 flex items-center justify-center gap-0.5">
                    <ArrowDownLeft size={11} /> Thu vào
                  </p>
                  <p className="font-extrabold text-[11px] sm:text-xs md:text-sm text-emerald-600 truncate">
                    {dayData.income > 0 ? `+${dayData.income.toLocaleString('vi-VN')}` : '0'}đ
                  </p>
                </div>
                
                <div className="bg-rose-50/60 p-1.5 md:p-2 rounded-xl md:rounded-2xl border border-rose-100/50">
                  <p className="text-[9px] md:text-[10px] uppercase font-bold text-rose-700/80 mb-0.5 flex items-center justify-center gap-0.5">
                    <ArrowUpRight size={11} /> Chi ra
                  </p>
                  <p className="font-extrabold text-[11px] sm:text-xs md:text-sm text-rose-600 truncate">
                    {dayData.expense > 0 ? `-${dayData.expense.toLocaleString('vi-VN')}` : '0'}đ
                  </p>
                </div>

                <div className={`p-1.5 md:p-2 rounded-xl md:rounded-2xl border ${
                  isPositive 
                    ? 'bg-sky-50/60 border-sky-100/60' 
                    : isNegative 
                      ? 'bg-amber-50/60 border-amber-100/60' 
                      : 'bg-slate-50 border-slate-100'
                }`}>
                  <p className="text-[9px] md:text-[10px] uppercase font-bold text-slate-500 mb-0.5">
                    Chênh lệch
                  </p>
                  <p className={`font-extrabold text-[11px] sm:text-xs md:text-sm truncate ${
                    isPositive ? 'text-sky-600' : isNegative ? 'text-rose-500' : 'text-slate-600'
                  }`}>
                    {diff > 0 ? `+${diff.toLocaleString('vi-VN')}` : diff < 0 ? `${diff.toLocaleString('vi-VN')}` : '0'}đ
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
