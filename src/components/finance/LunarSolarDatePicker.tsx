import { useState, useEffect } from 'react';
import { Lunar } from 'lunar-javascript';
import { getLunarDateMock } from '../../lib/lunar';

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  focusColor?: 'green' | 'red';
}

export default function LunarSolarDatePicker({ value, onChange, error, focusColor = 'green' }: Props) {
  const [mode, setMode] = useState<'solar' | 'lunar'>('solar');

  // Lunar states
  const [lDay, setLDay] = useState(1);
  const [lMonth, setLMonth] = useState(1);
  const [lYear, setLYear] = useState(new Date().getFullYear());

  // Sync internal lunar state when value (solar date) changes from outside
  // Only sync if mode is solar to avoid overriding user's typing in lunar mode
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
      // Invalid date, do not sync back to solar
    }
  };

  const dObj = value ? new Date(value) : new Date();
  const lInfo = getLunarDateMock(isNaN(dObj.getTime()) ? new Date() : dObj);
  
  const focusClass = focusColor === 'red' ? 'focus:ring-red-500' : 'focus:ring-green-500';

  return (
    <div>
      <div className="flex gap-3 mb-2">
        <button 
            type="button" 
            onClick={() => setMode('solar')} 
            className={`flex-1 text-sm py-2 rounded-xl font-bold transition-colors ${mode === 'solar' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
        >
            🌞 Dương Lịch
        </button>
        <button 
            type="button" 
            onClick={() => setMode('lunar')} 
            className={`flex-1 text-sm py-2 rounded-xl font-bold transition-colors ${mode === 'lunar' ? 'bg-amber-100 text-amber-700 shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
        >
            🌙 Âm Lịch
        </button>
      </div>

      {mode === 'solar' ? (
        <div>
          <input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full min-h-[56px] text-lg px-4 border border-slate-300 rounded-xl focus:ring-2 focus:outline-none transition-colors ${focusClass}`}
          />
          <p className="text-sm text-amber-600 mt-2 font-semibold">
            ↳ Ngày Âm: {lInfo.day}/{lInfo.month}/{lInfo.year} ({lInfo.canChi})
          </p>
        </div>
      ) : (
        <div>
            <div className="flex gap-2">
            <div className="flex-[0.8] flex flex-col">
                <label className="text-[10px] font-bold text-slate-500 mb-1 ml-1 uppercase">Ngày Âm</label>
                <input 
                    type="number" 
                    min={1} 
                    max={30} 
                    value={lDay || ''} 
                    onChange={e => handleLunarChange(Number(e.target.value), lMonth, lYear)} 
                    className={`w-full min-h-[56px] text-center text-lg font-bold px-2 border border-slate-300 rounded-xl focus:ring-2 focus:outline-none transition-colors ${focusClass}`} 
                />
            </div>
            <div className="flex-[0.8] flex flex-col">
                <label className="text-[10px] font-bold text-slate-500 mb-1 ml-1 uppercase">Tháng Âm</label>
                <input 
                    type="number" 
                    min={1} 
                    max={12} 
                    value={lMonth || ''} 
                    onChange={e => handleLunarChange(lDay, Number(e.target.value), lYear)} 
                    className={`w-full min-h-[56px] text-center text-lg font-bold px-2 border border-slate-300 rounded-xl focus:ring-2 focus:outline-none transition-colors ${focusClass}`} 
                />
            </div>
            <div className="flex-1 flex flex-col">
                <label className="text-[10px] font-bold text-slate-500 mb-1 ml-1 uppercase">Năm Âm</label>
                <input 
                    type="number" 
                    value={lYear || ''} 
                    onChange={e => handleLunarChange(lDay, lMonth, Number(e.target.value))} 
                    className={`w-full min-h-[56px] text-center text-lg font-bold px-2 border border-slate-300 rounded-xl focus:ring-2 focus:outline-none transition-colors ${focusClass}`} 
                />
            </div>
            </div>
            {!isNaN(dObj.getTime()) && (
                <p className="text-sm text-blue-600 mt-2 font-semibold">
                ↳ Ngày Dương: {dObj.toLocaleDateString('vi-VN')}
                </p>
            )}
        </div>
      )}
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
}
