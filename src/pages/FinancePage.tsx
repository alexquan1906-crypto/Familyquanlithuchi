import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useIncome } from '../hooks/useIncome';
import { useExpense } from '../hooks/useExpense';
import IncomeForm from '../components/income/IncomeForm';
import IncomeList from '../components/income/IncomeList';
import ExpenseForm from '../components/expense/ExpenseForm';
import ExpenseList from '../components/expense/ExpenseList';
import { Income, Expense, ExpenseCategory } from '../types';

export default function FinancePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'income'; // 'income' | 'expense'
  
  const { incomes, loading: loadingIncome, fetchIncomes, addIncome, updateIncome, deleteIncome } = useIncome();
  const { expenses, loading: loadingExpense, fetchExpenses, addExpense, updateExpense, deleteExpense } = useExpense();
  
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [filterPerson, setFilterPerson] = useState<'all' | 'bo' | 'me'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    if (currentTab === 'income') {
      fetchIncomes();
    } else {
      fetchExpenses();
    }
    // Switch tab -> hide form
    setIsFormVisible(false);
    setEditingIncome(null);
    setEditingExpense(null);
  }, [currentTab, fetchIncomes, fetchExpenses]);

  const handleIncomeSubmit = async (data: any) => {
    if (editingIncome) {
      const success = await updateIncome(editingIncome.id, data);
      if (success) {
        setEditingIncome(null);
        setIsFormVisible(false);
      }
      return success;
    } else {
      const success = await addIncome(data);
      if (success) {
        setIsFormVisible(false);
      }
      return success;
    }
  };

  const handleExpenseSubmit = async (data: any) => {
    if (editingExpense) {
      const success = await updateExpense(editingExpense.id, data);
      if (success) {
        setEditingExpense(null);
        setIsFormVisible(false);
      }
      return success;
    } else {
      const success = await addExpense(data);
      if (success) {
        setIsFormVisible(false);
      }
      return success;
    }
  };

  const handleEditIncome = (inc: Income) => {
    setEditingIncome(inc);
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditExpense = (exp: Expense) => {
    setEditingExpense(exp);
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
      
      {/* Tabs */}
      <div className="flex bg-slate-200/50 p-1 rounded-2xl w-full">
        <button
          onClick={() => setSearchParams({ tab: 'income' })}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-sm transition-all ${
            currentTab === 'income' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500'
          }`}
        >
          💰 Thu Nhập
        </button>
        <button
          onClick={() => setSearchParams({ tab: 'expense' })}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-sm transition-all ${
            currentTab === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'
          }`}
        >
          💳 Chi Tiêu
        </button>
      </div>

      {currentTab === 'income' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Quản Lý Thu Nhập</h2>
            {!isFormVisible && (
              <button 
                onClick={() => {
                  setEditingIncome(null);
                  setIsFormVisible(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-xl transition-colors text-base md:text-lg hidden sm:block"
              >
                + Thêm Giao Dịch
              </button>
            )}
          </div>

          {/* Form Income */}
          {isFormVisible && (
            <div className="mb-8">
              <IncomeForm 
                onSubmit={handleIncomeSubmit} 
                initialData={editingIncome ? {
                  amount: editingIncome.amount,
                  person: editingIncome.person,
                  date: editingIncome.date.split('T')[0],
                  note: editingIncome.note || ''
                } : undefined}
                onCancel={() => {
                  setIsFormVisible(false);
                  setEditingIncome(null);
                }}
              />
            </div>
          )}

          {/* Filter */}
          <div className="flex flex-wrap gap-2 md:gap-4 items-center">
            <span className="text-slate-500 font-medium">Lọc theo:</span>
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'bo', label: '👨 Bố' },
                { id: 'me', label: '👩 Mẹ' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterPerson(f.id as any)}
                  className={`px-4 py-2 rounded-xl text-sm md:text-base font-semibold transition-colors border-2 ${
                    filterPerson === f.id
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
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

      {currentTab === 'expense' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Quản Lý Chi Tiêu</h2>
            {!isFormVisible && (
              <button 
                onClick={() => {
                  setEditingExpense(null);
                  setIsFormVisible(true);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-xl transition-colors text-base md:text-lg hidden sm:block"
              >
                + Thêm Chi Tiêu
              </button>
            )}
          </div>

          {/* Form Expense */}
          {isFormVisible && (
            <div className="mb-8">
              <ExpenseForm 
                onSubmit={handleExpenseSubmit} 
                initialData={editingExpense ? {
                  amount: editingExpense.amount,
                  category: editingExpense.category,
                  date: editingExpense.date.split('T')[0],
                  note: editingExpense.note || ''
                } : undefined}
                onCancel={() => {
                  setIsFormVisible(false);
                  setEditingExpense(null);
                }}
              />
            </div>
          )}

          {/* Filter Expense Categories */}
          <div className="flex flex-wrap gap-2 md:gap-4 items-center mb-2">
            <span className="text-slate-500 font-medium">Lọc danh mục:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 md:py-3 rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium min-w-[150px]"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="an_uong">🍜 Ăn uống</option>
              <option value="tien_dien">⚡ Tiền điện</option>
              <option value="tien_nuoc">💧 Tiền nước</option>
              <option value="tien_nha">🏠 Tiền nhà</option>
              <option value="tien_xang">⛽ Tiền xăng</option>
              <option value="mua_sam">🛍️ Mua sắm</option>
              <option value="hieu_hi_dam">🎊 Hiếu hỉ - Đám</option>
              <option value="xe_co">🚗 Xe cộ</option>
              <option value="vay_no">💳 Vay nợ</option>
              <option value="khac">📦 Khác</option>
            </select>
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

      {/* Mobile floating button */}
      {!isFormVisible && (
        <button
          onClick={() => {
            if (currentTab === 'income') setEditingIncome(null);
            else setEditingExpense(null);
            
            setIsFormVisible(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`sm:hidden fixed bottom-[5.5rem] right-4 w-12 h-12 text-white rounded-full flex items-center justify-center shadow-lg text-2xl pb-0.5 z-40 ${
            currentTab === 'income' ? 'bg-green-600 active:bg-green-800' : 'bg-red-600 active:bg-red-800'
          }`}
        >
          +
        </button>
      )}

    </div>
  );
}
