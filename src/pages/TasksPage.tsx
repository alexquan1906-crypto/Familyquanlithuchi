import { useState, useEffect } from 'react';
import { getLunarDateMock as getLunarDate } from '../lib/lunar';
import { ChevronLeft, ChevronRight, Star, CalendarDays, ListTodo } from 'lucide-react';
import TaskList from '../components/tasks/TaskList';
import { useTasks } from '../hooks/useTasks';

const SOLAR_HOLIDAYS = [
  { m: 1, d: 1, name: 'Tết Dương Lịch' },
  { m: 4, d: 30, name: 'Giải Phóng' },
  { m: 5, d: 1, name: 'Lao Động' },
  { m: 9, d: 2, name: 'Quốc Khánh' },
];

const LUNAR_HOLIDAYS = [
  { m: 1, d: 1, name: 'Tết Âm Lịch' },
  { m: 1, d: 2, name: 'Tết Âm Lịch' },
  { m: 1, d: 3, name: 'Tết Âm Lịch' },
  { m: 3, d: 10, name: 'Giỗ tổ Hùng Vương' },
  { m: 8, d: 15, name: 'Trung Thu' },
];

const VIETNAM_HOLIDAYS = [
  { name: 'Tết Dương Lịch', m: 1, d: 1, type: 'solar' },
  { name: 'Giải Phóng Miền Nam', m: 4, d: 30, type: 'solar' },
  { name: 'Quốc tế Lao động', m: 5, d: 1, type: 'solar' },
  { name: 'Quốc khánh 2/9', m: 9, d: 2, type: 'solar' },
];

export default function TasksPage() {
  const [today, setToday] = useState(new Date());
  
  const [displayedMonth, setDisplayedMonth] = useState(new Date().getMonth() + 1);
  const [displayedYear, setDisplayedYear] = useState(new Date().getFullYear());

  const { tasks, loading: loadingTasks, fetchTasks, addTask, toggleTaskCompletion, deleteTask } = useTasks();

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(() => setToday(new Date()), 60000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  const lunarToday = getLunarDate(today);
  
  // Tính đếm ngược ngày lễ
  const nextHolidays = VIETNAM_HOLIDAYS.map(h => {
    let hDate = new Date(today.getFullYear(), h.m - 1, h.d);
    if (hDate < today) hDate.setFullYear(today.getFullYear() + 1);
    
    const diffDays = Math.ceil((hDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)); 
    return { ...h, diffDays, nextDate: hDate };
  }).sort((a, b) => a.diffDays - b.diffDays);

  const prevMonth = () => {
    if (displayedMonth === 1) {
      setDisplayedMonth(12);
      setDisplayedYear((v: number) => v - 1);
    } else {
      setDisplayedMonth((v: number) => v - 1);
    }
  };

  const nextMonth = () => {
    if (displayedMonth === 12) {
      setDisplayedMonth(1);
      setDisplayedYear((v: number) => v + 1);
    } else {
      setDisplayedMonth((v: number) => v + 1);
    }
  };

  const getDaysInMonth = (m: number, y: number) => new Date(y, m, 0).getDate();
  const getFirstDayOfMonth = (m: number, y: number) => new Date(y, m - 1, 1).getDay();

  const daysInMonth = getDaysInMonth(displayedMonth, displayedYear);
  let firstDayIndex = getFirstDayOfMonth(displayedMonth, displayedYear) - 1;
  if (firstDayIndex === -1) firstDayIndex = 6;

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayIndex }, (_, i) => i);

  const isToday = (d: number) => 
    d === today.getDate() && 
    displayedMonth === (today.getMonth() + 1) && 
    displayedYear === today.getFullYear();

  const getHoliday = (solarDay: number, solarMonth: number, lunarDay: number, lunarMonth: number) => {
    const sH = SOLAR_HOLIDAYS.find(h => h.d === solarDay && h.m === solarMonth);
    if (sH) return sH.name;
    const lH = LUNAR_HOLIDAYS.find(h => h.d === lunarDay && h.m === lunarMonth);
    if (lH) return lH.name;
    return null;
  };

  const dayOfWeekName = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][today.getDay()];

  return (
    <div className="space-y-5 md:space-y-6 max-w-5xl mx-auto pb-10">
      {/* Hero Card Hôm Nay: Âm & Dương Lịch */}
      <div className="bg-gradient-to-br from-white via-slate-50 to-amber-50/40 rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} />
            <span className="text-xs md:text-sm font-black uppercase tracking-wider">
              Lịch Vạn Niên Gia Đình
            </span>
          </div>
          <span className="text-xs font-bold text-red-100">
            {today.toLocaleDateString('vi-VN')}
          </span>
        </div>

        <div className="p-5 md:p-7 flex flex-row items-center justify-center gap-6 md:gap-14">
          {/* Dương lịch */}
          <div className="text-center flex-1">
            <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Dương Lịch
            </span>
            <div className="text-5xl md:text-7xl font-black text-slate-800 tracking-tighter leading-none">
              {today.getDate()}
            </div>
            <p className="text-xs md:text-base font-bold text-slate-600 mt-2">
              {dayOfWeekName} · Thg {today.getMonth() + 1}
            </p>
          </div>

          <div className="w-[1px] h-16 md:h-20 bg-slate-200/70"></div>

          {/* Âm lịch */}
          <div className="text-center flex-1">
            <span className="text-[10px] md:text-xs font-bold text-amber-600 uppercase tracking-widest block mb-1">
              Âm Lịch
            </span>
            <div className="text-5xl md:text-7xl font-black text-amber-600 tracking-tighter leading-none">
              {lunarToday.day}
            </div>
            <p className="text-xs md:text-base font-bold text-amber-800 mt-2">
              Tháng {lunarToday.month} ÂL
            </p>
            <span className="inline-block text-[10px] md:text-xs font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full mt-1">
              Năm {lunarToday.canChi}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Lưới Lịch Tháng Âm Dương */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Header Tháng */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/70">
            <button 
              onClick={prevMonth} 
              className="p-2 hover:bg-white rounded-xl text-slate-600 hover:text-slate-900 transition-all shadow-sm"
              title="Tháng trước"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="text-center">
              <h3 className="font-black text-slate-800 text-sm md:text-base">
                Tháng {displayedMonth} / {displayedYear}
              </h3>
              <span className="text-[10px] md:text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 inline-block mt-0.5">
                {(() => {
                  const dStart = new Date(displayedYear, displayedMonth - 1, 1);
                  const lStart = getLunarDate(dStart);
                  const dEnd = new Date(displayedYear, displayedMonth - 1, getDaysInMonth(displayedMonth, displayedYear));
                  const lEnd = getLunarDate(dEnd);
                  return lStart.month === lEnd.month 
                    ? `Tháng ${lStart.month} ÂL · Năm ${lStart.canChi}` 
                    : `Tháng ${lStart.month} - ${lEnd.month} ÂL · Năm ${lStart.canChi}`;
                })()}
              </span>
            </div>
            <button 
              onClick={nextMonth} 
              className="p-2 hover:bg-white rounded-xl text-slate-600 hover:text-slate-900 transition-all shadow-sm"
              title="Tháng sau"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Grid */}
          <div className="p-2 md:p-3.5">
            <div className="grid grid-cols-7 mb-1.5">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d, i) => (
                <div key={d} className={`text-center text-[10px] md:text-xs font-bold uppercase tracking-wider py-1.5 ${i === 6 ? 'text-rose-500' : 'text-slate-400'}`}>
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-1.5">
              {blanks.map(b => <div key={`b-${b}`} className="aspect-square"></div>)}
              {days.map(d => {
                const dateObj = new Date(displayedYear, displayedMonth - 1, d);
                const lDate = getLunarDate(dateObj);
                const lDay = lDate.day;
                const lMonth = lDate.month;
                const holidayName = getHoliday(d, displayedMonth, lDay, lMonth);
                const isSun = dateObj.getDay() === 0;
                const isFirstOrFull = lDay === 1 || lDay === 15;

                return (
                  <div 
                    key={d} 
                    className={`relative aspect-square rounded-2xl border flex flex-col items-center justify-center p-0.5 transition-all ${
                      isToday(d) 
                        ? 'bg-sky-600 border-sky-600 text-white shadow-md shadow-sky-600/30 scale-105 z-10' 
                        : holidayName 
                          ? 'bg-rose-50 border-rose-200/80 hover:bg-rose-100' 
                          : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <span className={`text-xs md:text-sm font-black leading-none ${
                      isToday(d) ? 'text-white' : isSun || holidayName ? 'text-rose-600' : 'text-slate-800'
                    }`}>
                      {d}
                    </span>
                    <span className={`text-[8px] md:text-[10px] font-bold leading-none mt-1 ${
                      isToday(d) 
                        ? 'text-sky-100' 
                        : isFirstOrFull 
                          ? 'text-amber-700 font-black' 
                          : 'text-amber-600'
                    }`}>
                      {lDay === 1 ? `${lDay}/${lMonth}` : lDay}
                    </span>

                    {holidayName && (
                      <div className="absolute top-1 right-1">
                        <Star size={7} className="fill-rose-500 text-rose-500" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Danh sách Ngày Lễ Sắp Tới */}
        <div className="lg:col-span-1 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star className="text-amber-500 fill-amber-400" size={18} />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                Đếm Ngược Ngày Lễ
              </h3>
            </div>
            <div className="space-y-2.5">
              {nextHolidays.map((holiday, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50/70 rounded-2xl border border-slate-100 hover:bg-slate-100/70 transition-all">
                  <div className="min-w-0 pr-2">
                    <h4 className="font-bold text-slate-800 text-xs md:text-sm truncate">{holiday.name}</h4>
                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{holiday.nextDate.toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-base md:text-lg font-black text-sky-600 leading-none">{holiday.diffDays}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Ngày nữa</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 text-center font-medium">
            💡 Mùng 1 & Rằm 15 Âm lịch hàng tháng được làm nổi bật trên lịch
          </div>
        </div>
      </div>

      {/* Việc Cần Làm Gia Đình (Embedded TaskList) */}
      <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ListTodo size={18} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Việc Cần Làm & Nhắc Việc Gia Đình</h3>
            <p className="text-xs text-slate-400">Ghi nhớ lịch giỗ chạp, hẹn khám bệnh, tiền điện nước</p>
          </div>
        </div>

        <TaskList 
          tasks={tasks}
          loading={loadingTasks}
          onAdd={async (title, dueDate) => {
            return await addTask({
              title,
              due_date: dueDate,
              is_completed: false,
              priority: 'medium',
              category: 'task'
            });
          }}
          onToggle={toggleTaskCompletion}
          onDelete={deleteTask}
        />
      </div>
    </div>
  );
}
