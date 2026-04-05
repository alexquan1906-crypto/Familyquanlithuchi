import { useState, useEffect } from 'react';
import { useStats } from '../hooks/useStats';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { getExpenseCategoryInfo } from '../components/expense/ExpenseForm';
import FinanceDateFilter from '../components/finance/FinanceDateFilter';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];

export default function StatsPage() {
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});

  const { loading, fetchStatsData, fetchTrendData, trendData, totalIncome, totalExpense, incomeByPerson, pieChartData } = useStats();

  useEffect(() => {
    fetchStatsData(dateRange.start, dateRange.end);
    fetchTrendData(dateRange.end);
  }, [dateRange.start, dateRange.end, fetchStatsData, fetchTrendData]);

  const formatCurrency = (value: number) => value.toLocaleString('vi-VN') + ' đ';

  // Format data for PieChart
  const formattedPieData = pieChartData.map(d => ({
    ...d,
    label: getExpenseCategoryInfo(d.name).label
  }));

  // Format data for Bo vs Me
  const personData = [
    { name: '👨 Bố', value: incomeByPerson.bo, fill: '#3b82f6' },
    { name: '👩 Mẹ', value: incomeByPerson.me, fill: '#ec4899' }
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-6">

      {/* Date Filter */}
      <FinanceDateFilter onFilterComplete={(start, end) => setDateRange({ start, end })} />

      {loading ? (
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-slate-200 rounded-2xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-80 bg-slate-200 rounded-2xl"></div>
            <div className="h-80 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-3 rounded-2xl border border-green-100 flex flex-col justify-center">
              <span className="text-green-700 font-semibold text-xs mb-1">Tổng Thu Nhập</span>
              <span className="text-lg md:text-2xl font-bold text-green-600">+{formatCurrency(totalIncome)}</span>
            </div>
            <div className="bg-red-50 p-3 rounded-2xl border border-red-100 flex flex-col justify-center">
              <span className="text-red-700 font-semibold text-xs mb-1">Tổng Chi Tiêu</span>
              <span className="text-lg md:text-2xl font-bold text-red-600">-{formatCurrency(totalExpense)}</span>
            </div>
            <div className={`${totalIncome - totalExpense >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'} p-3 rounded-2xl border flex flex-col justify-center`}>
              <span className={`${totalIncome - totalExpense >= 0 ? 'text-blue-700' : 'text-orange-700'} font-semibold text-xs mb-1`}>Còn Lại (Lợi nhuận)</span>
              <span className={`text-lg md:text-2xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {formatCurrency(totalIncome - totalExpense)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Pie Chart Chi Tiêu */}
            <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Cơ Cấu Chi Tiêu</h3>
              {formattedPieData.length > 0 ? (
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <Pie
                        data={formattedPieData}
                        cx="50%"
                        cy="45%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="label"
                        labelLine={true}
                        label={({ percent }: any) => `${((percent || 0) * 100).toFixed(0)}%`}
                      >
                        {formattedPieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[350px] flex items-center justify-center text-slate-400">Không có dữ liệu chi tiêu</div>
              )}
            </div>

            {/* Income vs Expense Trend Bar Chart */}
            <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Xu Hướng 1 Năm Gần Đây</h3>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} formatter={(value: any) => formatCurrency(Number(value))} />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', paddingBottom: '10px' }}/>
                    <Bar dataKey="Thu Nhập" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={25} />
                    <Bar dataKey="Chi Tiêu" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Income by Person */}
            <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 lg:col-span-2">
              <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Đóng Góp Thu Nhập</h3>
              <div className="h-40 w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={personData} margin={{ top: 0, right: 50, left: 50, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={80} style={{ fontWeight: 'bold' }} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} formatter={(value: any) => formatCurrency(Number(value))} />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]} maxBarSize={40}>
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
