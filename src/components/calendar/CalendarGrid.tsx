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
  const getFirstDayOfMonth = (m: number, y: number) => new Date(y, m - 1, 1).getDay(); // 0 is Sunday

  const daysInMonth = getDaysInMonth(month, year);
  // Adjust to make Monday the first day of the week (0 = Monday, 6 = Sunday)
  let firstDayIndex = getFirstDayOfMonth(month, year) - 1;
  if (firstDayIndex === -1) firstDayIndex = 6; // Sunday becomes 6

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayIndex }, (_, i) => i);

  const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header Ngày Trong Tuần */}
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
        {WEEKDAYS.map(day => (
          <div key={day} className="py-3 text-center text-slate-500 font-bold text-sm md:text-base">
            {day}
          </div>
        ))}
      </div>

      {/* Grid Ngày */}
      <div className="grid grid-cols-7">
        {blanks.map(blank => (
          <div key={`blank-${blank}`} className="p-2 md:p-4 min-h-[80px] md:min-h-[100px] border-b border-r border-slate-100 bg-slate-50/50"></div>
        ))}
        
        {days.map(day => {
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const data = transactionsByDate[dateStr];
          const isSelected = selectedDateStr === dateStr;
          
          return (
            <div 
              key={day} 
              onClick={() => onDayClick(dateStr, data || null)}
              className={`p-2 border-b border-r border-slate-100 min-h-[80px] md:min-h-[100px] relative cursor-pointer hover:bg-green-50/30 transition-colors ${
                isSelected ? 'bg-green-50 border-green-200' : ''
              }`}
            >
              <div className={`text-base md:text-lg font-semibold w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full ${
                isSelected ? 'bg-green-600 text-white' : 'text-slate-700'
              }`}>
                {day}
              </div>

              {/* Dots */}
              {(data?.hasIncome || data?.hasExpense) && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                  {data.hasIncome && <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500 shadow-sm"></div>}
                  {data.hasExpense && <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500 shadow-sm"></div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
