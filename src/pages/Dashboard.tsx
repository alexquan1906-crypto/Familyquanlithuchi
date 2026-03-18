import { Link } from 'react-router-dom';
import { ArrowDownCircle, ArrowUpCircle, Wallet, TrendingUp, PlusCircle, MinusCircle } from 'lucide-react';
import SummaryCard from '../components/stats/SummaryCard';
import { useDashboardStats } from '../hooks/useDashboardStats';

export default function Dashboard() {
  const { totalIncome, totalExpense, balance, incomeTrend, expenseTrend, recentTransactions, loading } = useDashboardStats();

  if (loading) {
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
        <Link 
          to="/finance?tab=income" 
          className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-2xl p-3 flex items-center justify-center gap-2 transition-colors min-h-[56px]"
        >
          <PlusCircle size={22} />
          <span className="font-bold text-base">Thu Nhập</span>
        </Link>
        <Link 
          to="/finance?tab=expense" 
          className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-2xl p-3 flex items-center justify-center gap-2 transition-colors min-h-[56px]"
        >
          <MinusCircle size={22} />
          <span className="font-bold text-base">Chi Tiêu</span>
        </Link>
      </div>

      {/* Summary Cards — 2 cột trên mobile */}
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
          title="Số Dư" 
          amount={balance} 
          icon={<Wallet size={18} className="text-blue-500" />}
          colorClass="text-blue-600"
        />
        <SummaryCard 
          title="TB/Ngày" 
          amount={Math.round(totalExpense / new Date().getDate()) || 0} 
          icon={<TrendingUp size={18} className="text-orange-500" />}
          colorClass="text-slate-800"
        />
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-bold text-slate-800">Giao dịch gần đây</h2>
          <Link to="/finance" className="text-blue-600 text-sm font-medium">Xem tất cả</Link>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {recentTransactions.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="px-3 py-3 flex items-center justify-between active:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                      tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {tx.type === 'income' ? <ArrowDownCircle size={18} /> : <ArrowUpCircle size={18} />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">{tx.note || 'Không có ghi chú'}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(tx.date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className={`font-bold text-sm shrink-0 ml-2 ${
                    tx.type === 'income' ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')}đ
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 text-sm">
              Chưa có giao dịch nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
