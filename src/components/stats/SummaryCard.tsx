import { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
}

export default function SummaryCard({ 
  title, 
  amount, 
  icon, 
  trend, 
  colorClass = 'text-slate-800' 
}: SummaryCardProps) {
  const formattedAmount = amount.toLocaleString('vi-VN');

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-slate-500 font-medium text-xs">{title}</h3>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      
      <div>
        <div className={`text-xl font-bold ${colorClass} leading-tight`}>
          {formattedAmount} <span className="text-sm font-medium">đ</span>
        </div>
        
        {trend && (
          <div className={`mt-1 text-[11px] flex items-center gap-1 ${
            trend.isPositive ? 'text-green-600' : 'text-red-500'
          }`}>
            <span className="font-semibold">
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
            <span className="text-slate-400 font-normal">vs tháng trước</span>
          </div>
        )}
      </div>
    </div>
  );
}
