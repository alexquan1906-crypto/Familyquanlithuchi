import { useMemo } from 'react';
import { getLunarDateMock as getLunarDate } from '../../lib/lunar';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

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
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
        Không có dữ liệu trong khoảng thời gian này
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-800 text-base mb-2">Thống Kê Chi Tiết Từng Ngày</h3>
      <div className="grid gap-4">
        {groupedData.map((dayData) => {
          const solarDate = new Date(dayData.dateStr);
          const lunarDate = getLunarDate(solarDate);
          const dayOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][solarDate.getDay()];
          const diff = dayData.income - dayData.expense;

          return (
            <div key={dayData.dateStr} className="bg-white border text-sm border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 text-slate-700 font-black text-lg w-12 h-12 flex items-center justify-center rounded-xl">
                    {solarDate.getDate()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{dayOfWeek}</p>
                    <p className="text-xs text-slate-500 font-medium">Tháng {solarDate.getMonth() + 1}, {solarDate.getFullYear()}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider block mb-[2px]">Âm Lịch</span>
                  <p className="font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                    {lunarDate.day}/{lunarDate.month} <span className="font-medium">({lunarDate.canChi})</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center items-center">
                <div className="bg-green-50/50 p-2 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-green-600/70 mb-1 flex items-center justify-center gap-1">
                    <ArrowDownCircle size={12}/> Thu vào
                  </p>
                  <p className="font-bold text-green-600">{dayData.income > 0 ? dayData.income.toLocaleString() : '-'}</p>
                </div>
                
                <div className="bg-red-50/50 p-2 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-red-600/70 mb-1 flex items-center justify-center gap-1">
                    <ArrowUpCircle size={12}/> Bán ra/Chi
                  </p>
                  <p className="font-bold text-red-500">{dayData.expense > 0 ? dayData.expense.toLocaleString() : '-'}</p>
                </div>

                <div className="bg-slate-50 p-2 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Chênh Lệch</p>
                  <p className={`font-bold ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-500' : 'text-slate-600'}`}>
                    {diff > 0 ? '+' : ''}{diff !== 0 ? diff.toLocaleString() : '-'}
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
