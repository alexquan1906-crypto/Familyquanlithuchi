import { useState, useEffect } from 'react';
import { Lunar } from 'lunar-javascript';
import { getLunarDateMock } from '../../lib/lunar';
import { Sun, Moon } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  focusColor?: 'green' | 'red';
}

export default function LunarSolarDatePicker({ value, onChange, error, focusColor = 'green' }: Props) {
  const [mode, setMode] = useState<'solar' | 'lunar'>('solar');

  const [lDay, setLDay] = useState(1);
  const [lMonth, setLMonth] = useState(1);
  const [lYear, setLYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (value && mode === 'solar') {
      try {
        const d = new Date(value);
        if (!isNaN(d.getTime())) {
          const lInfo = getLunarDateMock(d);
          setLDay(lInfo.day);
          setLMonth(lInfo.month);
          setLYear(lInfo.year);
        }
      } catch (e) {}
    }
  }, [value, mode]);

  const handleLunarChange = (d: number, m: number, y: number) => {
    setLDay(d);
    setLMonth(m);
    setLYear(y);
    try {
      if (d >= 1 && d <= 30 && m >= 1 && m <= 12) {
        const lunarDate = Lunar.fromYmd(y, m, d);
        const solarDate = lunarDate.getSolar();
        const iso = `${solarDate.getYear()}-${String(solarDate.getMonth()).padStart(2, '0')}-${String(solarDate.getDay()).padStart(2, '0')}`;
        onChange(iso);
      }
    } catch (e) {
      // Invalid date
    }
  };

  const dObj = value ? new Date(value) : new Date();
  const lInfo = getLunarDateMock(isNaN(dObj.getTime()) ? new Date() : dObj);
  
  const focusRing = focusColor === 'red' 
    ? 'focus:ring-2 focus:ring-rose-500 focus:border-rose-500' 
    : 'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500';

  return (
    <div className="space-y-2">
      {/* Mode Switcher */}
      <div className="flex bg-slate-100/80 p-1 rounded-2xl">
        <button 
          type="button" 
          onClick={() => setMode('solar')} 
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs md:text-sm py-2 rounded-xl font-bold transition-all duration-200 ${
            mode === 'solar' 
              ? 'bg-white text-sky-700 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Sun size={15} className={mode === 'solar' ? 'text-amber-500' : 'text-slate-400'} />
          Dương Lịch
        </button>
        <button 
          type="button" 
          onClick={() => setMode('lunar')} 
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs md:text-sm py-2 rounded-xl font-bold transition-all duration-200 ${
            mode === 'lunar' 
              ? 'bg-white text-amber-700 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Moon size={14} className={mode === 'lunar' ? 'text-amber-600' : 'text-slate-400'} />
          Âm Lịch
        </button>
      </div>

      {mode === 'solar' ? (
        <div>
          <input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full min-h-[50px] text-base font-semibold px-4 border border-slate-200 rounded-2xl bg-slate-50/50 outline-none transition-all ${focusRing}`}
          />
          <div className="mt-1.5 flex items-center gap-1 text-xs text-amber-700 bg-amber-50/80 px-2.5 py-1 rounded-xl border border-amber-200/50 w-fit">
            <Moon size={12} className="text-amber-600 shrink-0" />
            <span className="font-semibold">Ngày Âm:</span> {lInfo.day}/{lInfo.month}/{lInfo.year} ({lInfo.canChi})
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 mb-1 ml-1 uppercase">Ngày Âm</label>
              <input 
                type="number" 
                min={1} 
                max={30} 
                value={lDay || ''} 
                onChange={e => handleLunarChange(Number(e.target.value), lMonth, lYear)} 
                className={`w-full min-h-[50px] text-center text-base font-bold border border-slate-200 rounded-2xl bg-slate-50/50 outline-none transition-all ${focusRing}`} 
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 mb-1 ml-1 uppercase">Tháng Âm</label>
              <input 
                type="number" 
                min={1} 
                max={12} 
                value={lMonth || ''} 
                onChange={e => handleLunarChange(lDay, Number(e.target.value), lYear)} 
                className={`w-full min-h-[50px] text-center text-base font-bold border border-slate-200 rounded-2xl bg-slate-50/50 outline-none transition-all ${focusRing}`} 
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 mb-1 ml-1 uppercase">Năm Âm</label>
              <input 
                type="number" 
                value={lYear || ''} 
                onChange={e => handleLunarChange(lDay, lMonth, Number(e.target.value))} 
                className={`w-full min-h-[50px] text-center text-base font-bold border border-slate-200 rounded-2xl bg-slate-50/50 outline-none transition-all ${focusRing}`} 
              />
            </div>
          </div>
          {!isNaN(dObj.getTime()) && (
            <div className="flex items-center gap-1 text-xs text-sky-700 bg-sky-50/80 px-2.5 py-1 rounded-xl border border-sky-200/50 w-fit">
              <Sun size={12} className="text-amber-500 shrink-0" />
              <span className="font-semibold">Tương ứng Dương lịch:</span> {dObj.toLocaleDateString('vi-VN')}
            </div>
          )}
        </div>
      )}
      {error && <p className="text-rose-500 text-xs mt-1 font-semibold">{error}</p>}
    </div>
  );
}
