import { useState, useEffect } from 'react';
import { useStats } from '../hooks/useStats';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getExpenseCategoryInfo } from '../components/expense/ExpenseForm';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];

export default function StatsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const { loading, fetchMonthData, totalIncome, totalExpense, incomeByPerson, pieChartData } = useStats();

  useEffect(() => {
    fetchMonthData(month, year);
  }, [month, year, fetchMonthData]);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 2, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month, 1));

  const formatCurrency = (value: number) => value.toLocaleString('vi-VN') + ' đ';

  // Format data for PieChart
  const formattedPieData = pieChartData.map(d => ({
    ...d,
    label: getExpenseCategoryInfo(d.name).label
  }));

  // Format data for Income vs Expense
  const overallData = [
    { name: 'Thu Nhập', value: totalIncome, fill: '#16a34a' },
    { name: 'Chi Tiêu', value: totalExpense, fill: '#dc2626' }
  ];

  // Format data for Bo vs Me
  const personData = [
    { name: '👨 Bố', value: incomeByPerson.bo, fill: '#3b82f6' },
    { name: '👩 Mẹ', value: incomeByPerson.me, fill: '#ec4899' }
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-6">
      
      {/* Header & Date Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 md:p-5 rounded-2xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800">📊 Thống Kê</h2>
        
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
              <span className={`${totalIncome - totalExpense >= 0 ? 'text-blue-700' : 'text-orange-700'} font-semibold text-xs mb-1`}>Còn Lại (Số Dư)</span>
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
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={formattedPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="label"
                        label={({ label, percent }) => `${label} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {formattedPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-72 flex items-center justify-center text-slate-400">Không có dữ liệu chi tiêu</div>
              )}
            </div>

            {/* Income vs Expense Bar Chart */}
            <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Tổng Quan Thu Chi</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overallData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="value" radius={[8, 8, 8, 8]} maxBarSize={60}>
                      {overallData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
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
                    <Tooltip cursor={{ fill: '#f1f5f9' }} formatter={(value: number) => formatCurrency(value)} />
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
