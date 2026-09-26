import { useState, useEffect } from 'react';
import { useStats } from '../hooks/useStats';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { getExpenseCategoryInfo } from '../components/expense/ExpenseForm';
import FinanceDateFilter from '../components/finance/FinanceDateFilter';
import { ArrowDownLeft, ArrowUpRight, Wallet, PieChart as PieIcon, BarChart3, Users } from 'lucide-react';

const COLORS = [
  '#f43f5e', // rose
  '#f97316', // orange
  '#eab308', // amber
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#d946ef', // fuchsia
  '#ec4899', // pink
  '#64748b', // slate
];

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2.5 rounded-2xl shadow-xl border border-slate-700/60 text-xs">
        {label && <p className="font-bold text-slate-300 mb-1">{label}</p>}
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 py-0.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></span>
            <span className="font-medium text-slate-300">{entry.name}:</span>
            <span className="font-black text-white">{Number(entry.value).toLocaleString('vi-VN')} đ</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function StatsPage() {
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});

  const { loading, error, fetchStatsData, fetchTrendData, trendData, totalIncome, totalExpense, incomeByPerson, pieChartData } = useStats();

  useEffect(() => {
    fetchStatsData(dateRange.start, dateRange.end);
    fetchTrendData(dateRange.end);
  }, [dateRange.start, dateRange.end, fetchStatsData, fetchTrendData]);

  const formatCurrency = (value: number) => value.toLocaleString('vi-VN') + ' đ';

  const formattedPieData = pieChartData.map(d => ({
    ...d,
    label: getExpenseCategoryInfo(d.name).label
  }));

  const personData = [
    { name: '👨 Bố', value: incomeByPerson.bo, fill: '#0284c7' },
    { name: '👩 Mẹ', value: incomeByPerson.me, fill: '#ec4899' }
  ];

  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-4 md:space-y-6 max-w-5xl mx-auto pb-10">
      {/* Date Filter */}
      <FinanceDateFilter onFilterComplete={(start, end) => setDateRange({ start, end })} />

      {error && <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
        Không thể tải dữ liệu thống kê: {error}
        <button className="ml-3 font-bold underline" onClick={() => void fetchStatsData(dateRange.start, dateRange.end)}>Thử lại</button>
      </div>}

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 bg-white rounded-3xl border border-slate-200"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-80 bg-white rounded-3xl border border-slate-200"></div>
            <div className="h-80 bg-white rounded-3xl border border-slate-200"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <div className="bg-gradient-to-br from-emerald-500/10 via-white to-emerald-500/5 p-4 md:p-5 rounded-3xl border border-emerald-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-slate-500 font-semibold text-xs uppercase tracking-wider block mb-1">Tổng Thu Nhập</span>
                <span className="text-lg md:text-2xl font-black text-emerald-600">+{formatCurrency(totalIncome)}</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center">
                <ArrowDownLeft size={20} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-500/10 via-white to-rose-500/5 p-4 md:p-5 rounded-3xl border border-rose-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-slate-500 font-semibold text-xs uppercase tracking-wider block mb-1">Tổng Chi Tiêu</span>
                <span className="text-lg md:text-2xl font-black text-rose-600">-{formatCurrency(totalExpense)}</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-rose-100/80 text-rose-600 flex items-center justify-center">
                <ArrowUpRight size={20} />
              </div>
            </div>

            <div className={`p-4 md:p-5 rounded-3xl border shadow-sm flex items-center justify-between ${
              balance >= 0 
                ? 'bg-gradient-to-br from-sky-500/10 via-white to-sky-500/5 border-sky-200/80' 
                : 'bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 border-amber-200/80'
            }`}>
              <div>
                <span className="text-slate-500 font-semibold text-xs uppercase tracking-wider block mb-1">
                  {balance >= 0 ? 'Dư Tiết Kiệm' : 'Thiếu Hụt'}
                </span>
                <span className={`text-lg md:text-2xl font-black ${balance >= 0 ? 'text-sky-700' : 'text-rose-600'}`}>
                  {formatCurrency(balance)}
                </span>
              </div>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                balance >= 0 ? 'bg-sky-100/80 text-sky-600' : 'bg-amber-100/80 text-amber-600'
              }`}>
                <Wallet size={20} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pie Chart Cơ Cấu Chi Tiêu */}
            <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <PieIcon size={18} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">Cơ Cấu Chi Tiêu</h3>
                  <p className="text-xs text-slate-400">Tỷ lệ theo từng nhóm chi phí</p>
                </div>
              </div>

              {formattedPieData.length > 0 ? (
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={formattedPieData}
                        cx="50%"
                        cy="45%"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="label"
                        labelLine={false}
                        label={({ percent }: any) => ((percent || 0) > 0.05 ? `${((percent || 0) * 100).toFixed(0)}%` : '')}
                      >
                        {formattedPieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        verticalAlign="bottom" 
                        height={40} 
                        iconType="circle" 
                        wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[320px] flex items-center justify-center text-slate-400 font-semibold">
                  Chưa có dữ liệu chi tiêu trong kỳ
                </div>
              )}
            </div>

            {/* Bar Chart Xu Hướng 1 Năm */}
            <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BarChart3 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">Xu Hướng 1 Năm Gần Đây</h3>
                  <p className="text-xs text-slate-400">So sánh Thu nhập và Chi tiêu các tháng</p>
                </div>
              </div>

              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} 
                      dy={8} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#94a3b8' }} 
                      tickFormatter={(val) => `${val / 1000000}tr`} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="top" 
                      align="right" 
                      height={36} 
                      iconType="circle" 
                      wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} 
                    />
                    <Bar dataKey="Thu Nhập" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={22} />
                    <Bar dataKey="Chi Tiêu" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={22} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Income by Person Bố vs Mẹ */}
            <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200/80 shadow-sm lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users size={18} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">Đóng Góp Thu Nhập (Bố vs Mẹ)</h3>
                  <p className="text-xs text-slate-400">Tỷ lệ đóng góp vào ngân sách gia đình</p>
                </div>
              </div>

              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={personData} margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      width={80} 
                      tick={{ fontWeight: 800, fill: '#334155' }} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[0, 10, 10, 0]} maxBarSize={32}>
                      {personData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
