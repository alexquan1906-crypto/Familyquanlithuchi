import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { getLunarDateMock as getLunarDate } from '../../lib/lunar'; // Using the real implementation despite the 'Mock' name for now

interface FilterProps {
  onFilterChange: (startDate: string, endDate: string) => void;
}

export default function DashboardDateFilter({ onFilterChange }: FilterProps) {
  const now = new Date();
  
  const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  const startLunar = getLunarDate(new Date(startDate));
  const endLunar = getLunarDate(new Date(endDate));

  // Trigger whenever user changes
  useEffect(() => {
    // Only fetch if valid dates
    if (startDate && endDate) {
       // Expand to start of day and end of day locally
       const actualStart = new Date(startDate);
       actualStart.setHours(0, 0, 0, 0);
       const actualEnd = new Date(endDate);
       actualEnd.setHours(23, 59, 59, 999);
       
       onFilterChange(actualStart.toISOString(), actualEnd.toISOString());
    }
  }, [startDate, endDate]);

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={18} className="text-blue-500" />
        <h3 className="font-bold text-slate-800 text-sm">Khoảng Thời Gian Báo Cáo</h3>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Start Date */}
        <div className="flex-1 w-full bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Từ Ngày (Dương l.)</label>
            <input 
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full bg-white p-2 rounded-lg border border-slate-200 outline-none font-semibold text-slate-800"
            />
          </div>
          <div className="mt-2 pt-2 border-t border-orange-100 flex items-center justify-between">
             <span className="text-[10px] uppercase font-bold text-orange-500">Âm Lịch</span>
             <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">{startLunar.day}/{startLunar.month} {startLunar.canChi}</span>
          </div>
        </div>
        
        <span className="text-slate-400 font-bold hidden sm:block">→</span>
        
        {/* End Date */}
        <div className="flex-1 w-full bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Đến Ngày (Dương l.)</label>
            <input 
              type="date"
              value={endDate}
              min={startDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full bg-white p-2 rounded-lg border border-slate-200 outline-none font-semibold text-slate-800"
            />
          </div>
          <div className="mt-2 pt-2 border-t border-orange-100 flex items-center justify-between">
             <span className="text-[10px] uppercase font-bold text-orange-500">Âm Lịch</span>
             <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">{endLunar.day}/{endLunar.month} {endLunar.canChi}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
