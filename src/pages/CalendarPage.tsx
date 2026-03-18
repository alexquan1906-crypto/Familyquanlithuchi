import { useState, useEffect } from 'react';
import { useCalendarTransactions, CalendarDayData } from '../hooks/useCalendarTransactions';
import CalendarGrid from '../components/calendar/CalendarGrid';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getExpenseCategoryInfo } from '../components/expense/ExpenseForm';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const { loading, transactionsByDate, fetchMonthTransactions } = useCalendarTransactions();

  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [selectedDayData, setSelectedDayData] = useState<CalendarDayData | null>(null);

  useEffect(() => {
    fetchMonthTransactions(month, year);
    // Reset selection when month changes
    setSelectedDateStr(null);
    setSelectedDayData(null);
  }, [month, year, fetchMonthTransactions]);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 2, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month, 1));

  const handleDayClick = (dateStr: string, data: CalendarDayData | null) => {
    setSelectedDateStr(dateStr);
    setSelectedDayData(data);
    // On mobile, scroll to details
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
    <div className="space-y-4 max-w-5xl mx-auto pb-6">
      
      {/* Header & Month Selector */}
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 md:p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">📅 Lịch Thu Chi</h2>
        
        <div className="flex items-center justify-between w-full md:w-auto gap-4 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
            <ChevronLeft size={24} className="text-slate-600" />
          </button>
          <span className="font-bold text-lg w-32 text-center text-slate-700">
            Tháng {month}/{year}
          </span>
          <button onClick={handleNextMonth} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
            <ChevronRight size={24} className="text-slate-600" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6 justify-center bg-white py-3 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-slate-600 font-medium text-sm md:text-base">Có Thu Nhập</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-slate-600 font-medium text-sm md:text-base">Có Chi Tiêu</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar Full Width or Left */}
        <div className={`lg:col-span-2 transition-all`}>
          {loading ? (
            <div className="animate-pulse bg-slate-200 h-[500px] rounded-2xl"></div>
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
        {selectedDateStr && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg lg:col-span-1 h-fit overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">
                Chi tiết: <span className="text-green-600">{new Date(selectedDateStr).toLocaleDateString('vi-VN')}</span>
              </h3>
              <button onClick={closeDetails} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-6 max-h-[500px] overflow-y-auto">
              {!selectedDayData ? (
                <div className="text-center text-slate-500 py-10">
                  <p className="text-lg">Không có giao dịch nào</p>
                  <p className="text-sm">Vào ngày này</p>
                </div>
              ) : (
                <>
                  {/* Incomes */}
                  {selectedDayData.incomes.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-green-700 flex items-center gap-2 uppercase text-sm border-b border-green-100 pb-2">
                        💰 Thu Nhập
                      </h4>
                      <div className="space-y-3">
                        {selectedDayData.incomes.map(inc => (
                          <div key={`inc-${inc.id}`} className="bg-green-50 p-3 rounded-xl border border-green-100">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-semibold text-slate-800">{inc.person === 'bo' ? '👨 Bố' : '👩 Mẹ'}</span>
                              <span className="font-bold text-green-600">+{formatCurrency(inc.amount)}</span>
                            </div>
                            {inc.note && <p className="text-sm text-slate-600">{inc.note}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expenses */}
                  {selectedDayData.expenses.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-red-700 flex items-center gap-2 uppercase text-sm border-b border-red-100 pb-2">
                        💳 Chi Nút
                      </h4>
                      <div className="space-y-3">
                        {selectedDayData.expenses.map(exp => {
                          const catInfo = getExpenseCategoryInfo(exp.category);
                          return (
                            <div key={`exp-${exp.id}`} className="bg-red-50 p-3 rounded-xl border border-red-100">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-semibold text-slate-800 flex items-center gap-1">
                                  <span>{catInfo.icon}</span> {catInfo.label}
                                </span>
                                <span className="font-bold text-red-600">-{formatCurrency(exp.amount)}</span>
                              </div>
                              {exp.note && <p className="text-sm text-slate-600">{exp.note}</p>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
