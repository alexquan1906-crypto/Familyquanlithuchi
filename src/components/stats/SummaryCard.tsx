import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'income' | 'expense' | 'balance' | 'average' | 'default';
  colorClass?: string;
}

export default function SummaryCard({ 
  title, 
  amount, 
  icon, 
  trend, 
  variant = 'default',
}: SummaryCardProps) {
  const formattedAmount = amount.toLocaleString('vi-VN');

  // Variant styles
  const variantStyles = {
    income: {
      bg: 'bg-gradient-to-br from-emerald-500/10 via-white to-emerald-500/5',
      border: 'border-emerald-200/80',
      text: 'text-emerald-700',
      iconBg: 'bg-emerald-100/80 text-emerald-600',
    },
    expense: {
      bg: 'bg-gradient-to-br from-rose-500/10 via-white to-rose-500/5',
      border: 'border-rose-200/80',
      text: 'text-rose-600',
      iconBg: 'bg-rose-100/80 text-rose-600',
    },
    balance: {
      bg: 'bg-gradient-to-br from-sky-500/10 via-white to-sky-500/5',
      border: 'border-sky-200/80',
      text: amount >= 0 ? 'text-sky-700' : 'text-rose-600',
      iconBg: 'bg-sky-100/80 text-sky-600',
    },
    average: {
      bg: 'bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5',
      border: 'border-amber-200/80',
      text: 'text-slate-800',
      iconBg: 'bg-amber-100/80 text-amber-600',
    },
    default: {
      bg: 'bg-white',
      border: 'border-slate-200/80',
      text: 'text-slate-800',
      iconBg: 'bg-slate-100 text-slate-600',
    }
  }[variant];

  return (
    <div className={`rounded-3xl p-4 md:p-5 border ${variantStyles.border} ${variantStyles.bg} shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group`}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-slate-500 font-semibold text-xs md:text-sm tracking-tight">{title}</span>
        {icon && (
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${variantStyles.iconBg} transition-transform group-hover:scale-110 duration-200`}>
            {icon}
          </div>
        )}
      </div>
      
      <div>
        <div className={`text-lg md:text-2xl font-black ${variantStyles.text} tracking-tight leading-none`}>
          {formattedAmount} <span className="text-xs md:text-sm font-semibold text-slate-400">đ</span>
        </div>
        
        {trend ? (
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
              trend.isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              {trend.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
            <span className="text-slate-400 font-normal text-[10px]">so kỳ trước</span>
          </div>
        ) : (
          <div className="h-5"></div>
        )}
      </div>
    </div>
  );
}
