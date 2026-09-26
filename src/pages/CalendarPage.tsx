import { useState, useEffect } from 'react';
import { useCalendarTransactions, CalendarDayData } from '../hooks/useCalendarTransactions';
import CalendarGrid from '../components/calendar/CalendarGrid';
import { ChevronLeft, ChevronRight, X, ArrowDownLeft, ArrowUpRight, Calendar as CalendarIcon } from 'lucide-react';
import { getExpenseCategoryInfo } from '../components/expense/ExpenseForm';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const { loading, error, transactionsByDate, fetchMonthTransactions } = useCalendarTransactions();

  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [selectedDayData, setSelectedDayData] = useState<CalendarDayData | null>(null);

  useEffect(() => {
    fetchMonthTransactions(month, year);
    setSelectedDateStr(null);
    setSelectedDayData(null);
  }, [month, year, fetchMonthTransactions]);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 2, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month, 1));

  const handleDayClick = (dateStr: string, data: CalendarDayData | null) => {
    setSelectedDateStr(dateStr);
    setSelectedDayData(data);
    if (window.innerWidth < 768) {
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  };

  const closeDetails = () => {
    setSelectedDateStr(null);
    setSelectedDayData(null);
  };

  const formatCurrency = (val: number) => val.toLocaleString('vi-VN') + ' đ';

  return (
    <div className="space-y-4 md:space-y-6 max-w-5xl mx-auto pb-10">
      {error && <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
        Không thể tải dữ liệu lịch: {error}
        <button className="ml-3 font-bold underline" onClick={() => void fetchMonthTransactions(month, year)}>Thử lại</button>
      </div>}
      {/* Header & Month Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 md:p-5 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-black text-slate-800 tracking-tight">
              Lịch Dòng Tiền Theo Ngày
            </h2>
            <p className="text-xs text-slate-400">Xem ngày nào phát sinh thu/chi trong tháng</p>
          </div>
        </div>
        
        {/* Navigation Selector */}
        <div className="flex items-center justify-between sm:justify-end gap-2 bg-slate-100/80 p-1.5 rounded-2xl">
          <button 
            type="button"
            onClick={handlePrevMonth} 
            className="p-2 hover:bg-white rounded-xl text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
            title="Tháng trước"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-extrabold text-sm md:text-base px-3 text-slate-800 min-w-[120px] text-center">
            Tháng {month} / {year}
          </span>
          <button 
            type="button"
            onClick={handleNextMonth} 
            className="p-2 hover:bg-white rounded-xl text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
            title="Tháng sau"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 justify-center bg-white/80 backdrop-blur-md py-2.5 px-4 rounded-2xl border border-slate-200/80 w-fit mx-auto text-xs font-bold">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></span>
          <span className="text-slate-600">Có Thu Nhập</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm"></span>
          <span className="text-slate-600">Có Chi Tiêu</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="animate-pulse bg-white h-[450px] rounded-3xl border border-slate-200"></div>
          ) : (
            <CalendarGrid 
              month={month} 
              year={year} 
              transactionsByDate={transactionsByDate} 
              onDayClick={handleDayClick}
              selectedDateStr={selectedDateStr}
            />
          )}
        </div>

        {/* Selected Day Details Panel */}
        <div className="lg:col-span-1">
          {selectedDateStr ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg overflow-hidden animate-in-scale">
              <div className="bg-slate-50/80 p-4 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-sm md:text-base text-slate-800">
                    Chi tiết: {new Date(selectedDateStr).toLocaleDateString('vi-VN')}
                  </h3>
                  <p className="text-[11px] text-slate-400">Các giao dịch trong ngày này</p>
                </div>
                <button 
                  onClick={closeDetails} 
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
              
              <div className="p-4 space-y-4 max-h-[450px] overflow-y-auto custom-scrollbar">
                {!selectedDayData || (selectedDayData.incomes.length === 0 && selectedDayData.expenses.length === 0) ? (
                  <div className="text-center text-slate-400 py-10">
                    <p className="font-bold text-sm">Không có phát sinh giao dịch</p>
                    <p className="text-xs text-slate-400 mt-1">Trong ngày đã chọn</p>
                  </div>
                ) : (
                  <>
                    {/* Incomes */}
                    {selectedDayData.incomes.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-emerald-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <ArrowDownLeft size={14} /> Thu Nhập ({selectedDayData.incomes.length})
                        </h4>
                        <div className="space-y-2">
                          {selectedDayData.incomes.map(inc => (
                            <div key={`inc-${inc.id}`} className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-xs text-slate-700">{inc.person === 'bo' ? '👨 Bố' : '👩 Mẹ'}</span>
                                <span className="font-black text-xs text-emerald-600">+{formatCurrency(inc.amount)}</span>
                              </div>
                              {inc.note && <p className="text-[11px] text-slate-500 mt-1">{inc.note}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Expenses */}
                    {selectedDayData.expenses.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-rose-600 text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <ArrowUpRight size={14} /> Chi Tiêu ({selectedDayData.expenses.length})
                        </h4>
                        <div className="space-y-2">
                          {selectedDayData.expenses.map(exp => {
                            const catInfo = getExpenseCategoryInfo(exp.category);
                            return (
                              <div key={`exp-${exp.id}`} className="bg-rose-50/60 p-3 rounded-2xl border border-rose-100">
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-xs text-slate-700 flex items-center gap-1">
                                    <span>{catInfo.icon}</span> {catInfo.label}
                                  </span>
                                  <span className="font-black text-xs text-rose-600">-{formatCurrency(exp.amount)}</span>
                                </div>
                                {exp.note && <p className="text-[11px] text-slate-500 mt-1">{exp.note}</p>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex flex-col items-center justify-center p-8 bg-white/70 rounded-3xl border border-slate-200/80 border-dashed text-slate-400 h-full min-h-[300px]">
              <CalendarIcon size={36} className="text-slate-300 mb-2" />
              <p className="font-bold text-sm text-slate-500">Chưa chọn ngày nào</p>
              <p className="text-xs text-slate-400 text-center mt-1">Bấm vào bất kỳ ô ngày nào trên lịch để xem danh sách thu chi chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
