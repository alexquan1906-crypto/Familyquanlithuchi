import { useState, useEffect } from 'react';
import { Filter, Calendar, X } from 'lucide-react';
import { FilterPeriodMode, getDateRangeForPeriod } from '../../lib/dateUtils';

interface FinanceDateFilterProps {
  onFilterComplete: (startDate: string, endDate: string) => void;
}

const PREDEFINED = [
  { id: 'this_solar_month', label: 'Tháng Dương này' },
  { id: 'this_lunar_month', label: 'Tháng Âm này' },
  { id: 'this_week', label: 'Tuần này' },
  { id: 'this_quarter', label: 'Quý này (3 tháng)' },
  { id: 'this_half_year', label: 'Nửa năm nay (6 tháng)' },
  { id: 'this_year', label: 'Cả năm nay' },
];

export default function FinanceDateFilter({ onFilterComplete }: FinanceDateFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [activeFilterId, setActiveFilterId] = useState<FilterPeriodMode>('this_solar_month');

  const currentYear = new Date().getFullYear();
  const [specificMonth, setSpecificMonth] = useState(new Date().getMonth() + 1);
  const [specificYear, setSpecificYear] = useState(currentYear);

  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  // Bắn dữ liệu mặc định lần đầu tiên Component Mount
  useEffect(() => {
    // Prevent strictly executing if already fired or if they just didn't want it, but actually we WANT it
    const { start, end } = getDateRangeForPeriod('this_solar_month', currentYear, specificMonth);
    onFilterComplete(start, end);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApply = (mode: FilterPeriodMode) => {
    setActiveFilterId(mode);
    setIsOpen(false);

    if (mode === 'custom') {
      if (!customStart || !customEnd) return;

      const startD = new Date(customStart);
      startD.setHours(0, 0, 0, 0);
      const endD = new Date(customEnd);
      endD.setHours(23, 59, 59, 999);
      onFilterComplete(startD.toISOString(), endD.toISOString());
    } else {
      const { start, end } = getDateRangeForPeriod(mode, specificYear, specificMonth);
      onFilterComplete(start, end);
    }
  };

  // Click outside can close it or just keep it modal
  return (
    <div className="mb-4 relative">
      <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <Calendar size={18} className="text-blue-500" />
          <span className="font-semibold text-sm">
            {activeFilterId === 'custom'
              ? `Từ ${new Date(customStart).toLocaleDateString()} - ${new Date(customEnd).toLocaleDateString()}`
              : (PREDEFINED.find(p => p.id === activeFilterId) || { label: '' }).label ||
              (activeFilterId === 'specific_solar_month' ? `Tháng ${specificMonth}/${specificYear} (Dương)` : `Tháng ${specificMonth}/${specificYear} (Âm)`)
            }
          </span>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition"
        >
          <Filter size={18} />
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85dvh] sm:max-h-[90vh] animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50 shrink-0 rounded-t-3xl sm:rounded-3xl">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-blue-600" />
                <h3 className="font-bold text-slate-800 text-lg">Bộ Lọc Thời Gian</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto min-h-0 flex-1 space-y-6">

              {/* Quick Preset */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Mốc Mặc Định</h4>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {PREDEFINED.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleApply(p.id as typeof activeFilterId)}
                      className={`py-3 px-3 rounded-xl text-sm font-semibold border-2 transition ${activeFilterId === p.id ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific Lunar/Solar Month */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Chọn Tháng Cụ Thể (Lịch Sử)</h4>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <select
                      value={specificMonth}
                      onChange={e => setSpecificMonth(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-700 outline-none appearance-none"
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-28 relative">
                    <select
                      value={specificYear}
                      onChange={e => setSpecificYear(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-700 outline-none appearance-none"
                    >
                      {[...Array(11)].map((_, i) => {
                        const y = currentYear - 5 + i;
                        return <option key={y} value={y}>{y}</option>
                      })}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleApply('specific_solar_month')} className="flex-1 py-3 bg-slate-800 hover:bg-slate-900 active:bg-black text-white rounded-xl font-bold text-sm transition-colors shadow-sm">Tháng Dương</button>
                  <button onClick={() => handleApply('specific_lunar_month')} className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-xl font-bold text-sm transition-colors shadow-sm">Tháng Âm</button>
                </div>
              </div>

              {/* Custom Date Array */}
              <div className="pb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tùy Chọn Khoảng Ngày Tự Do</h4>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1 flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1 ml-1">Từ ngày</label>
                    <input
                      type="date"
                      value={customStart}
                      onChange={e => setCustomStart(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-semibold text-sm w-full"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1 ml-1">Đến ngày</label>
                    <input
                      type="date"
                      value={customEnd}
                      min={customStart}
                      onChange={e => setCustomEnd(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-semibold text-sm w-full"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleApply('custom')}
                  disabled={!customStart || !customEnd}
                  className="w-full mt-4 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-xl font-bold transition-colors shadow-sm"
                >
                  Áp Dụng Khoảng Ngày Này
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
