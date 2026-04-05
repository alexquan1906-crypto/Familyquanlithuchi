import { useState, useEffect } from 'react';
import { getLunarDateMock as getLunarDate } from '../lib/lunar';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

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
  { name: 'Quốc khánh', m: 9, d: 2, type: 'solar' },
];

export default function TasksPage() {
  const [today, setToday] = useState(new Date());
  
  const [displayedMonth, setDisplayedMonth] = useState(new Date().getMonth() + 1);
  const [displayedYear, setDisplayedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const interval = setInterval(() => setToday(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

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
  if (firstDayIndex === -1) firstDayIndex = 6; // Sunday

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

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-6">
      {/* Thẻ Hôm Nay */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="bg-red-600 text-white text-center py-2.5">
          <h2 className="text-sm font-bold uppercase tracking-widest opacity-90">
             Hôm nay: {today.toLocaleDateString('vi-VN')}
          </h2>
        </div>
        <div className="p-4 md:p-6 flex flex-row items-center justify-center gap-4 md:gap-10">
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Dương Lịch</p>
            <div className="text-5xl md:text-7xl leading-none font-black text-slate-800 tracking-tighter">
              {today.getDate()}
            </div>
            <p className="text-sm md:text-lg font-bold text-slate-600 mt-2">
              {['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][today.getDay()]}
            </p>
          </div>

          <div className="w-[1px] h-16 md:h-24 bg-slate-100"></div>

          <div className="text-center">
            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">Âm Lịch</p>
            <div className="text-4xl md:text-6xl leading-none font-black text-orange-600 tracking-tighter">
              {lunarToday.day}
            </div>
            <p className="text-sm md:text-lg font-bold text-orange-700 mt-2">
              Tháng {lunarToday.month}
            </p>
            <p className="text-[10px] md:text-xs font-bold text-slate-500 mt-1 uppercase opacity-80">{lunarToday.canChi}</p>
          </div>
        </div>
      </div>

      {/* Lưới Lịch Tháng */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Lịch Header Navigation */}
        <div className="flex items-center justify-between p-4 border-b border-slate-50 bg-slate-50/50">
          <button onClick={prevMonth} className="p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200 transition-all">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <div className="text-center">
            <h3 className="font-black text-slate-800 text-lg">Tháng {displayedMonth} / {displayedYear}</h3>
            <div className="flex items-center justify-center gap-2 mt-0.5">
              <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 uppercase tracking-tight">
                {(() => {
                  const dStart = new Date(displayedYear, displayedMonth - 1, 1);
                  const lStart = getLunarDate(dStart);
                  const dEnd = new Date(displayedYear, displayedMonth - 1, getDaysInMonth(displayedMonth, displayedYear));
                  const lEnd = getLunarDate(dEnd);
                  
                  const mStart = lStart.month;
                  const mEnd = lEnd.month;
                  
                  const yearCanChi = lStart.canChi;
                  
                  if (mStart === mEnd) {
                    return `Tháng ${mStart} Âm - Năm ${yearCanChi}`;
                  }
                  return `Tháng ${mStart} - ${mEnd} Âm - Năm ${yearCanChi}`;
                })()}
              </span>
            </div>
          </div>
          <button onClick={nextMonth} className="p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200 transition-all">
            <ChevronRight size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-2 md:p-4">
          <div className="grid grid-cols-7 mb-2">
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d, i) => (
              <div key={d} className={`text-center text-[10px] md:text-xs font-black uppercase tracking-widest py-2 ${i === 6 ? 'text-red-500' : 'text-slate-400'}`}>
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {blanks.map(b => <div key={`b-${b}`} className="aspect-square"></div>)}
            {days.map(d => {
              const dateObj = new Date(displayedYear, displayedMonth - 1, d);
              const lDate = getLunarDate(dateObj);
              const lDay = lDate.day;
              const lMonth = lDate.month;
              const holidayName = getHoliday(d, displayedMonth, lDay, lMonth);
              const isSun = dateObj.getDay() === 0;

              return (
                <div 
                  key={d} 
                  className={`relative aspect-square rounded-xl border flex flex-col items-center justify-center transition-all ${
                    isToday(d) 
                      ? 'bg-blue-600 border-blue-600 shadow-blue-200 shadow-lg scale-105 z-10' 
                      : holidayName 
                        ? 'bg-red-50 border-red-100 hover:bg-red-100' 
                        : 'bg-white border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span className={`text-sm md:text-xl font-black ${
                    isToday(d) ? 'text-white' : isSun || holidayName ? 'text-red-500' : 'text-slate-800'
                  }`}>
                    {d}
                  </span>
                  <span className={`text-[8px] md:text-xs font-bold leading-none mt-0.5 md:mt-1 ${
                    isToday(d) ? 'text-blue-100' : 'text-orange-500'
                  }`}>
                    {lDay === 1 ? `${lDay}/${lMonth}` : lDay}
                  </span>

                  {holidayName && (
                    <div className="absolute top-1 right-1">
                       <Star size={8} className="fill-red-500 text-red-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Danh sách Ngày Lễ Sắp Tới */}
      <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2">
           <Star className="text-yellow-500 fill-yellow-500" size={20} />
           <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Sự Kiện Sắp Tới</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {nextHolidays.map((holiday, idx) => (
            <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
              <div className="min-w-0">
                <h4 className="font-bold text-slate-800 text-sm md:text-base truncate">{holiday.name}</h4>
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">{holiday.nextDate.toLocaleDateString('vi-VN')}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xl md:text-2xl font-black text-blue-600 group-hover:scale-110 transition-transform block leading-none">{holiday.diffDays}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Ngày</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
