import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Wallet, TrendingUp, PlusCircle, MinusCircle } from 'lucide-react';
import SummaryCard from '../components/stats/SummaryCard';
import { useDashboardStats } from '../hooks/useDashboardStats';
import FinanceDateFilter from '../components/finance/FinanceDateFilter';
import DailyBreakdown from '../components/stats/DailyBreakdown';
import TransactionModal from '../components/finance/TransactionModal';
import { useIncome } from '../hooks/useIncome';
import { useExpense } from '../hooks/useExpense';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});

  const { totalIncome, totalExpense, balance, incomeTrend, expenseTrend, rawTransactions, loading, error, fetchStats } = useDashboardStats(dateRange.start, dateRange.end);
  const { addIncome } = useIncome();
  const { addExpense } = useExpense();

  const [modalType, setModalType] = useState<'none' | 'income' | 'expense'>('none');

  const handleIncomeSubmit = async (data: any) => {
    const success = await addIncome(data);
    if (success) {
      setModalType('none');
      fetchStats(dateRange.start, dateRange.end);
    }
    return success;
  };

  const handleExpenseSubmit = async (data: any) => {
    const success = await addExpense(data);
    if (success) {
      setModalType('none');
      fetchStats(dateRange.start, dateRange.end);
    }
    return success;
  };

  const daysCount = Math.max(1, Math.round(
    ((new Date(dateRange.end || new Date()).getTime() -
      new Date(dateRange.start || new Date(new Date().getFullYear(), new Date().getMonth(), 1)).getTime())
      / (1000 * 3600 * 24))
  ));
  const dailyAverage = Math.round(totalExpense / daysCount) || 0;

  if (loading && totalIncome === 0 && totalExpense === 0) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-14 bg-slate-200/80 rounded-3xl"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl h-28 border border-slate-200"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-5xl mx-auto">
      {error && (
        <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          Không thể tải dữ liệu: {error}
          <button className="ml-3 font-bold underline" onClick={() => void fetchStats(dateRange.start, dateRange.end)}>Thử lại</button>
        </div>
      )}
      {/* Quick Action Gradient Buttons */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <button
          onClick={() => setModalType('income')}
          className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-[0.98] text-white rounded-3xl p-3.5 md:p-4 flex items-center justify-center gap-2.5 transition-all duration-200 glow-emerald shadow-lg min-h-[56px]"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PlusCircle size={20} className="text-white" />
          </div>
          <div className="text-left">
            <span className="block font-black text-sm md:text-base leading-tight">Thu Nhập</span>
            <span className="block text-[10px] md:text-xs text-emerald-100 font-medium"></span>
          </div>
        </button>

        <button
          onClick={() => setModalType('expense')}
          className="group relative overflow-hidden bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 active:scale-[0.98] text-white rounded-3xl p-3.5 md:p-4 flex items-center justify-center gap-2.5 transition-all duration-200 glow-rose shadow-lg min-h-[56px]"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MinusCircle size={20} className="text-white" />
          </div>
          <div className="text-left">
            <span className="block font-black text-sm md:text-base leading-tight">Chi Tiêu</span>
            <span className="block text-[10px] md:text-xs text-rose-100 font-medium"></span>
          </div>
        </button>
      </div>

      {/* Date Filter */}
      <FinanceDateFilter onFilterComplete={(start, end) => setDateRange({ start, end })} />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <SummaryCard
          title="Tổng Thu Nhập"
          amount={totalIncome}
          icon={<ArrowDownLeft size={18} />}
          trend={incomeTrend}
          variant="income"
        />
        <SummaryCard
          title="Tổng Chi Tiêu"
          amount={totalExpense}
          icon={<ArrowUpRight size={18} />}
          trend={expenseTrend}
          variant="expense"
        />
        <SummaryCard
          title="Dư Còn Lại"
          amount={balance}
          icon={<Wallet size={18} />}
          variant="balance"
        />
        <SummaryCard
          title="Trung Bình / Ngày"
          amount={dailyAverage}
          icon={<TrendingUp size={18} />}
          variant="average"
        />
      </div>

      {/* Daily Breakdown */}
      <div className="pt-2">
        <DailyBreakdown transactions={rawTransactions || []} />
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={modalType !== 'none'}
        onClose={() => setModalType('none')}
        defaultType={modalType === 'none' ? 'expense' : modalType}
        onIncomeSubmit={handleIncomeSubmit}
        onExpenseSubmit={handleExpenseSubmit}
      />
    </div>
  );
}
