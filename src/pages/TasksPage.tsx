import { useState, useEffect } from 'react';
import { getLunarDateMock as getLunarDate } from '../lib/lunar';

const VIETNAM_HOLIDAYS = [
  { name: 'Tết Dương Lịch', date: '2024-01-01', type: 'solar' },
  { name: 'Ngày Quốc tế Lao động', date: '2024-05-01', type: 'solar' },
  { name: 'Quốc khánh', date: '2024-09-02', type: 'solar' },
  { name: 'Ngày Nhà giáo Việt Nam', date: '2024-11-20', type: 'solar' },
];

export default function CalendarPage() {
  const [today, setToday] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setToday(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const lunarToday = getLunarDate(today);
  
  // Tính đếm ngược
  const nextHolidays = VIETNAM_HOLIDAYS.map(h => {
    // Điều chỉnh năm của ngày lễ theo năm nay hoặc năm sau
    let hDate = new Date(h.date);
    hDate.setFullYear(today.getFullYear());
    
    if (hDate.getTime() < today.getTime()) {
      hDate.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = Math.abs(hDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    return { ...h, diffDays, nextDate: hDate };
  }).sort((a, b) => a.diffDays - b.diffDays);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-6">
      
      {/* Lịch Hôm Nay */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:col-span-2">
        <div className="bg-red-600 text-white text-center py-3">
          <h2 className="text-lg font-bold uppercase tracking-wider">
            Tháng {today.getMonth() + 1} - Năm {today.getFullYear()}
          </h2>
        </div>
        <div className="p-5 flex flex-row items-center justify-center gap-6">
          <div className="text-center">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Dương Lịch</p>
            <div className="text-[72px] leading-none font-bold text-slate-800 tracking-tighter">
              {today.getDate()}
            </div>
            <p className="text-lg font-bold text-slate-600 mt-2">
              {['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][today.getDay()]}
            </p>
          </div>

          <div className="w-[2px] h-24 bg-slate-200"></div>

          <div className="text-center">
            <p className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-1">Âm Lịch</p>
            <div className="text-[60px] leading-none font-bold text-orange-600 tracking-tighter">
              {lunarToday.day}
            </div>
            <p className="text-lg font-bold text-orange-700 mt-2">
              Tháng {lunarToday.month}
            </p>
            <p className="text-xs font-medium text-slate-500 mt-1">Năm {lunarToday.canChi}</p>
          </div>
        </div>
      </div>

      {/* Sắp Tới */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm md:col-span-2 space-y-6">
        <h3 className="text-xl font-bold text-slate-800">🎉 Đếm Ngược Ngày Lễ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nextHolidays.map((holiday, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <h4 className="font-bold text-slate-800 text-lg">{holiday.name}</h4>
                <p className="text-slate-500">{holiday.nextDate.toLocaleDateString('vi-VN')}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-blue-600">{holiday.diffDays}</span>
                <span className="text-sm text-slate-500 block">ngày nữa</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
