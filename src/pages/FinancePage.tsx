import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useIncome } from '../hooks/useIncome';
import { useExpense } from '../hooks/useExpense';
import IncomeList from '../components/income/IncomeList';
import ExpenseList from '../components/expense/ExpenseList';
import FinanceDateFilter from '../components/finance/FinanceDateFilter';
import TransactionModal from '../components/finance/TransactionModal';
import { Income, Expense } from '../types';
import { Plus, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function FinancePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'income';
  
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});
  
  const { incomes, loading: loadingIncome, fetchIncomes, addIncome, updateIncome, deleteIncome } = useIncome();
  const { expenses, loading: loadingExpense, fetchExpenses, addExpense, updateExpense, deleteExpense } = useExpense();
  
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterPerson, setFilterPerson] = useState<'all' | 'bo' | 'me'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    if (currentTab === 'income') {
      fetchIncomes(dateRange.start, dateRange.end);
    } else {
      fetchExpenses(dateRange.start, dateRange.end);
    }
  }, [currentTab, fetchIncomes, fetchExpenses, dateRange.start, dateRange.end]);

  useEffect(() => {
    setIsModalOpen(false);
    setEditingIncome(null);
    setEditingExpense(null);
  }, [currentTab]);

  const handleIncomeSubmit = async (data: any) => {
    if (editingIncome) {
      const success = await updateIncome(editingIncome.id, data);
      if (success) {
        setEditingIncome(null);
        setIsModalOpen(false);
      }
      return success;
    } else {
      const success = await addIncome(data);
      if (success) {
        setIsModalOpen(false);
      }
      return success;
    }
  };

  const handleExpenseSubmit = async (data: any) => {
    if (editingExpense) {
      const success = await updateExpense(editingExpense.id, data);
      if (success) {
        setEditingExpense(null);
        setIsModalOpen(false);
      }
      return success;
    } else {
      const success = await addExpense(data);
      if (success) {
        setIsModalOpen(false);
      }
      return success;
    }
  };

  const handleEditIncome = (inc: Income) => {
    setEditingIncome(inc);
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleEditExpense = (exp: Expense) => {
    setEditingExpense(exp);
    setEditingIncome(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto pb-10">
      {/* Date Filter */}
      <FinanceDateFilter onFilterComplete={(start, end) => setDateRange({ start, end })} />

      {/* Segmented Tab Switcher */}
      <div className="bg-slate-200/70 p-1.5 rounded-3xl flex items-center shadow-inner">
        <button
          onClick={() => setSearchParams({ tab: 'income' })}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-extrabold text-sm md:text-base transition-all duration-200 ${
            currentTab === 'income' 
              ? 'bg-white text-emerald-700 shadow-md scale-[1.01]' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ArrowDownLeft size={18} className={currentTab === 'income' ? 'text-emerald-600' : 'text-slate-400'} />
          <span>Sổ Thu Nhập</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ml-1 ${
            currentTab === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-300/50 text-slate-500'
          }`}>
            {incomes.length}
          </span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'expense' })}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-extrabold text-sm md:text-base transition-all duration-200 ${
            currentTab === 'expense' 
              ? 'bg-white text-rose-600 shadow-md scale-[1.01]' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ArrowUpRight size={18} className={currentTab === 'expense' ? 'text-rose-600' : 'text-slate-400'} />
          <span>Sổ Chi Tiêu</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ml-1 ${
            currentTab === 'expense' ? 'bg-rose-100 text-rose-800' : 'bg-slate-300/50 text-slate-500'
          }`}>
            {expenses.length}
          </span>
        </button>
      </div>

      {/* Tab: Thu Nhập */}
      {currentTab === 'income' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Lọc theo:</span>
              <div className="flex gap-1.5">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'bo', label: '👨 Bố' },
                  { id: 'me', label: '👩 Mẹ' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilterPerson(f.id as any)}
                    className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all ${
                      filterPerson === f.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => {
                setEditingIncome(null);
                setEditingExpense(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs md:text-sm py-2 px-3.5 sm:py-2.5 sm:px-4 rounded-2xl transition-all shadow-md shadow-emerald-600/20 active:scale-95"
            >
              <Plus size={16} /> Thêm Thu Nhập
            </button>
          </div>

          <IncomeList 
            incomes={incomes} 
            loading={loadingIncome}
            filterPerson={filterPerson}
            onEdit={handleEditIncome}
            onDelete={deleteIncome}
          />
        </div>
      )}

      {/* Tab: Chi Tiêu */}
      {currentTab === 'expense' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Danh mục:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold text-xs shadow-sm outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="all">Tất cả danh mục</option>
                <option value="an_uong">🍜 Ăn uống</option>
                <option value="tien_dien">⚡ Tiền điện</option>
                <option value="tien_nuoc">💧 Tiền nước</option>
                <option value="tien_nha">🏠 Tiền nhà</option>
                <option value="tien_xang">⛽ Tiền xăng</option>
                <option value="mua_sam">🛍️ Mua sắm</option>
                <option value="hieu_hi_dam">🎊 Hiếu hỉ</option>
                <option value="xe_co">🚗 Xe cộ</option>
                <option value="vay_no">💳 Vay nợ</option>
                <option value="khac">📦 Khác</option>
              </select>
            </div>

            <button 
              onClick={() => {
                setEditingIncome(null);
                setEditingExpense(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs md:text-sm py-2 px-3.5 sm:py-2.5 sm:px-4 rounded-2xl transition-all shadow-md shadow-rose-600/20 active:scale-95"
            >
              <Plus size={16} /> Thêm Chi Tiêu
            </button>
          </div>

          <ExpenseList 
            expenses={expenses} 
            loading={loadingExpense}
            filterCategory={filterCategory}
            onEdit={handleEditExpense}
            onDelete={deleteExpense}
          />
        </div>
      )}

      {/* Floating Action Button on Mobile */}
      <button
        onClick={() => {
          setEditingIncome(null);
          setEditingExpense(null);
          setIsModalOpen(true);
        }}
        className={`sm:hidden fixed bottom-24 right-4 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl z-40 active:scale-90 transition-all touch-manipulation ${
          currentTab === 'income' 
            ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 glow-emerald' 
            : 'bg-gradient-to-tr from-rose-600 to-red-500 glow-rose'
        }`}
        title="Thêm Giao Dịch"
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>

      {/* Transaction Modal (Popup Bottom Sheet on Mobile, Centered Modal on Desktop) */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingIncome(null);
          setEditingExpense(null);
        }}
        defaultType={currentTab === 'expense' ? 'expense' : 'income'}
        editingIncome={editingIncome}
        editingExpense={editingExpense}
        onIncomeSubmit={handleIncomeSubmit}
        onExpenseSubmit={handleExpenseSubmit}
      />
    </div>
  );
}
