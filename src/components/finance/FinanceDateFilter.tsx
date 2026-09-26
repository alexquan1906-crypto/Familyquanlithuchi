import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Filter, Calendar, X, Check } from 'lucide-react';
import { Lunar, Solar } from 'lunar-javascript';
import { FilterPeriodMode, getDateRangeForPeriod } from '../../lib/dateUtils';

interface FinanceDateFilterProps {
  onFilterComplete: (startDate: string, endDate: string) => void;
}

const PREDEFINED = [
  { id: 'this_lunar_month', label: 'Tháng Âm này', desc: 'Theo chu kỳ trăng' },
  { id: 'this_solar_month', label: 'Tháng Dương này', desc: 'Tháng lịch chuẩn' },
  { id: 'this_week', label: 'Tuần này', desc: '7 ngày gần nhất' },
  { id: 'this_quarter', label: 'Quý này', desc: '3 tháng hiện tại' },
  { id: 'this_half_year', label: 'Nửa năm', desc: '6 tháng' },
  { id: 'this_year', label: 'Cả năm', desc: '12 tháng năm nay' },
];

export default function FinanceDateFilter({ onFilterComplete }: FinanceDateFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [activeFilterId, setActiveFilterId] = useState<FilterPeriodMode>('this_lunar_month');
  const [currentRange, setCurrentRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

  const currentYear = new Date().getFullYear();
  const [specificMonth, setSpecificMonth] = useState(new Date().getMonth() + 1);
  const [specificYear, setSpecificYear] = useState(currentYear);

  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  useEffect(() => {
    const { start, end } = getDateRangeForPeriod('this_lunar_month', currentYear, specificMonth);
    setCurrentRange({ start, end });
    onFilterComplete(start, end);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const handleApply = (mode: FilterPeriodMode) => {
    setActiveFilterId(mode);
    setIsOpen(false);

    if (mode === 'custom') {
      if (!customStart || !customEnd) return;

      const startD = new Date(customStart);
      startD.setHours(0, 0, 0, 0);
      const endD = new Date(customEnd);
      endD.setHours(23, 59, 59, 999);
      setCurrentRange({ start: startD.toISOString(), end: endD.toISOString() });
      onFilterComplete(startD.toISOString(), endD.toISOString());
    } else {
      const { start, end } = getDateRangeForPeriod(mode, specificYear, specificMonth);
      setCurrentRange({ start, end });
      onFilterComplete(start, end);
    }
  };

  const getFilterLabel = () => {
    if (activeFilterId === 'custom') return `Tùy chọn khoảng ngày`;
    if (activeFilterId === 'this_lunar_month') {
      const todayLunar = Lunar.fromSolar(Solar.fromDate(new Date()));
      return `Tháng ${Math.abs(todayLunar.getMonth())} Âm Này`;
    }
    if (activeFilterId === 'specific_solar_month') {
      return `Tháng ${specificMonth}/${specificYear} (Dương)`;
    }
    if (activeFilterId === 'specific_lunar_month') {
      return `Tháng ${specificMonth}/${specificYear} (Âm)`;
    }
    return (PREDEFINED.find(p => p.id === activeFilterId) || { label: '' }).label;
  };

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(true)}
        className="flex justify-between items-center bg-white/90 backdrop-blur-md p-3 md:p-3.5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
            <Calendar size={19} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm md:text-base text-slate-800 leading-tight">
                {getFilterLabel()}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                Đang lọc
              </span>
            </div>
            {currentRange.start && currentRange.end && (
              <span className="text-xs font-semibold text-slate-400 mt-0.5 block">
                {new Date(currentRange.start).toLocaleDateString('vi-VN')} – {new Date(currentRange.end).toLocaleDateString('vi-VN')}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 group-hover:bg-slate-200/80 rounded-2xl text-slate-700 font-bold text-xs md:text-sm transition-colors"
        >
          <Filter size={15} />
          <span>Đổi mốc</span>
        </button>
      </div>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center items-center">
          <div 
            className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] max-h-[90dvh] animate-slide-up sm:animate-in-scale border border-slate-100 overflow-hidden">
            {/* Mobile Drag Handle */}
            <div
              className="pt-2.5 pb-1 sm:hidden flex justify-center items-center cursor-pointer select-none active:opacity-60"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </div>
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/80 shrink-0 rounded-t-3xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Filter size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base">Bộ Lọc Thời Gian</h3>
                    <p className="text-xs text-slate-400">Chọn khoảng thời gian tính toán thu chi</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200/70 text-slate-500 hover:bg-slate-300 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 overflow-y-auto min-h-0 flex-1 space-y-6 custom-scrollbar overscroll-contain">
                {/* Presets */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Mốc Nhanh Tiện Lợi
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {PREDEFINED.map(p => {
                      const isSelected = activeFilterId === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleApply(p.id as typeof activeFilterId)}
                          className={`p-3 rounded-2xl text-left border transition-all duration-200 relative touch-manipulation ${
                            isSelected 
                              ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 shadow-sm' 
                              : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-sm leading-tight block">{p.label}</span>
                            {isSelected && <Check size={16} className="text-emerald-600 shrink-0 ml-1" />}
                          </div>
                          <span className="text-[11px] text-slate-400 mt-0.5 block">{p.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Specific Month & Year */}
                <div className="bg-slate-50/80 p-4 rounded-3xl border border-slate-200/80 space-y-3">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Xem Lịch Sử Tháng Cụ Thể
                  </h4>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Tháng</label>
                      <select
                        value={specificMonth}
                        onChange={e => setSpecificMonth(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-2xl p-2.5 font-bold text-slate-700 outline-none text-sm shadow-sm"
                      >
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-32">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Năm</label>
                      <select
                        value={specificYear}
                        onChange={e => setSpecificYear(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-2xl p-2.5 font-bold text-slate-700 outline-none text-sm shadow-sm"
                      >
                        {[...Array(11)].map((_, i) => {
                          const y = currentYear - 5 + i;
                          return <option key={y} value={y}>{y}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button 
                      type="button"
                      onClick={() => handleApply('specific_solar_month')} 
                      className="py-2.5 bg-slate-800 hover:bg-slate-900 active:scale-98 text-white rounded-2xl font-bold text-xs md:text-sm transition-all shadow-sm touch-manipulation"
                    >
                      Xem Tháng Dương
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleApply('specific_lunar_month')} 
                      className="py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white rounded-2xl font-bold text-xs md:text-sm transition-all shadow-sm touch-manipulation"
                    >
                      Xem Tháng Âm
                    </button>
                  </div>
                </div>

                {/* Custom Date Range */}
                <div className="space-y-3 pb-4">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Tùy Chọn Khoảng Ngày Tự Do
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 mb-1 ml-1 uppercase">Từ ngày</label>
                      <input
                        type="date"
                        value={customStart}
                        onChange={e => setCustomStart(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 outline-none font-semibold text-xs md:text-sm"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 mb-1 ml-1 uppercase">Đến ngày</label>
                      <input
                        type="date"
                        value={customEnd}
                        min={customStart}
                        onChange={e => setCustomEnd(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 outline-none font-semibold text-xs md:text-sm"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApply('custom')}
                    disabled={!customStart || !customEnd}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-bold text-sm transition-all shadow-md shadow-emerald-600/20 touch-manipulation"
                  >
                    Áp Dụng Khoảng Ngày Tự Chọn
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
