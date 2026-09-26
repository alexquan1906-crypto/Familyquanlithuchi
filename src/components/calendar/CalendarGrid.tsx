import { CalendarDayData } from '../../hooks/useCalendarTransactions';

interface Props {
  month: number;
  year: number;
  transactionsByDate: Record<string, CalendarDayData>;
  onDayClick: (dateStr: string, data: CalendarDayData | null) => void;
  selectedDateStr: string | null;
}

export default function CalendarGrid({ month, year, transactionsByDate, onDayClick, selectedDateStr }: Props) {
  const getDaysInMonth = (m: number, y: number) => new Date(y, m, 0).getDate();
  const getFirstDayOfMonth = (m: number, y: number) => new Date(y, m - 1, 1).getDay();

  const daysInMonth = getDaysInMonth(month, year);
  let firstDayIndex = getFirstDayOfMonth(month, year) - 1;
  if (firstDayIndex === -1) firstDayIndex = 6;

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayIndex }, (_, i) => i);

  const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const today = new Date();
  const isCurrentMonth = today.getMonth() + 1 === month && today.getFullYear() === year;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
      {/* Header Ngày Trong Tuần */}
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/70">
        {WEEKDAYS.map((day, idx) => (
          <div 
            key={day} 
            className={`py-3 text-center font-bold text-xs md:text-sm uppercase tracking-wider ${
              idx === 6 ? 'text-rose-500' : 'text-slate-400'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid Ngày */}
      <div className="grid grid-cols-7">
        {blanks.map(blank => (
          <div key={`blank-${blank}`} className="p-2 md:p-3 min-h-[64px] md:min-h-[88px] border-b border-r border-slate-100/70 bg-slate-50/30"></div>
        ))}
        
        {days.map(day => {
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const data = transactionsByDate[dateStr];
          const isSelected = selectedDateStr === dateStr;
          const isToday = isCurrentMonth && today.getDate() === day;
          
          return (
            <div 
              key={day} 
              onClick={() => onDayClick(dateStr, data || null)}
              className={`p-1.5 md:p-2.5 border-b border-r border-slate-100 min-h-[64px] md:min-h-[88px] relative cursor-pointer transition-all duration-200 flex flex-col items-center justify-between ${
                isSelected 
                  ? 'bg-emerald-50/80 border-emerald-400 z-10 shadow-sm' 
                  : 'hover:bg-slate-50/80'
              }`}
            >
              <div className={`text-xs md:text-sm font-extrabold w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-xl transition-all ${
                isSelected 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                  : isToday 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-700'
              }`}>
                {day}
              </div>

              {/* Dots indicating Income / Expense */}
              <div className="flex items-center justify-center gap-1.5 pb-1">
                {data?.hasIncome && (
                  <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-500 shadow-sm ring-1 ring-white" title="Có thu nhập"></span>
                )}
                {data?.hasExpense && (
                  <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-rose-500 shadow-sm ring-1 ring-white" title="Có chi tiêu"></span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
