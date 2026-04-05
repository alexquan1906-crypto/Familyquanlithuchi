import { useState, useEffect } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Wallet, TrendingUp, PlusCircle, MinusCircle, X } from 'lucide-react';
import SummaryCard from '../components/stats/SummaryCard';
import { useDashboardStats } from '../hooks/useDashboardStats';
import DashboardDateFilter from '../components/stats/DashboardDateFilter';
import DailyBreakdown from '../components/stats/DailyBreakdown';
import IncomeForm from '../components/income/IncomeForm';
import ExpenseForm from '../components/expense/ExpenseForm';
import { useIncome } from '../hooks/useIncome';
import { useExpense } from '../hooks/useExpense';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});

  const { totalIncome, totalExpense, balance, incomeTrend, expenseTrend, rawTransactions, loading, fetchStats } = useDashboardStats(dateRange.start, dateRange.end);
  const { addIncome } = useIncome();
  const { addExpense } = useExpense();

  const [modalType, setModalType] = useState<'none' | 'income' | 'expense'>('none');

  // When date changes, refresh stats
  useEffect(() => {
    fetchStats(dateRange.start, dateRange.end);
  }, [dateRange.start, dateRange.end, fetchStats]);

  const handleIncomeSubmit = async (data: any) => {
    const success = await addIncome(data);
    if (success) {
      setModalType('none');
      fetchStats(dateRange.start, dateRange.end); // Refresh
    }
    return success;
  };

  const handleExpenseSubmit = async (data: any) => {
    const success = await addExpense(data);
    if (success) {
      setModalType('none');
      fetchStats(dateRange.start, dateRange.end); // Refresh
    }
    return success;
  };

  if (loading && totalIncome === 0) {
    return (
      <div className="grid grid-cols-2 gap-3 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl h-24 border border-slate-200"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quick Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setModalType('income')}
          className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-2xl p-3 flex items-center justify-center gap-2 transition-colors min-h-[56px]"
        >
          <PlusCircle size={22} />
          <span className="font-bold text-base">Thu Nhập</span>
        </button>
        <button
          onClick={() => setModalType('expense')}
          className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-2xl p-3 flex items-center justify-center gap-2 transition-colors min-h-[56px]"
        >
          <MinusCircle size={22} />
          <span className="font-bold text-base">Chi Tiêu</span>
        </button>
      </div>

      {/* Date Filter */}
      <DashboardDateFilter onFilterChange={(start, end) => setDateRange({ start, end })} />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <SummaryCard
          title="Tổng Thu"
          amount={totalIncome}
          icon={<ArrowDownCircle size={18} className="text-green-500" />}
          trend={incomeTrend}
          colorClass="text-green-600"
        />
        <SummaryCard
          title="Tổng Chi"
          amount={totalExpense}
          icon={<ArrowUpCircle size={18} className="text-red-500" />}
          trend={expenseTrend}
          colorClass="text-red-500"
        />
        <SummaryCard
          title="Lợi nhuận"
          amount={balance}
          icon={<Wallet size={18} className="text-blue-500" />}
          colorClass="text-blue-600"
        />
        <SummaryCard
          title="TB/Ngày"
          amount={Math.round(totalExpense / ((new Date(dateRange.end || new Date()).getTime() - new Date(dateRange.start || new Date(new Date().getFullYear(), new Date().getMonth(), 1)).getTime()) / (1000 * 3600 * 24)) || 1) || 0}
          icon={<TrendingUp size={18} className="text-orange-500" />}
          colorClass="text-slate-800"
        />
      </div>

      {/* Daily Breakdown */}
      <div className="pt-4">
        <DailyBreakdown transactions={rawTransactions || []} />
      </div>

      {/* Modals Overlay */}
      {modalType !== 'none' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 shrink-0">
              <h2 className={`text-xl font-black ${modalType === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {modalType === 'income' ? 'Thêm Thu Nhập Mới' : 'Nhập Khoản Chi Tiêu'}
              </h2>
              <button
                onClick={() => setModalType('none')}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto grow">
              {modalType === 'income' && <IncomeForm onSubmit={handleIncomeSubmit} onCancel={() => setModalType('none')} />}
              {modalType === 'expense' && <ExpenseForm onSubmit={handleExpenseSubmit} onCancel={() => setModalType('none')} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
