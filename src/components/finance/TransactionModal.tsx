import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, PlusCircle, MinusCircle } from 'lucide-react';
import ExpenseForm from '../expense/ExpenseForm';
import IncomeForm from '../income/IncomeForm';
import { Income, Expense } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'income' | 'expense';
  editingIncome?: Income | null;
  editingExpense?: Expense | null;
  onIncomeSubmit: (data: any) => Promise<boolean>;
  onExpenseSubmit: (data: any) => Promise<boolean>;
  isLoading?: boolean;
}

export default function TransactionModal({
  isOpen,
  onClose,
  defaultType = 'expense',
  editingIncome,
  editingExpense,
  onIncomeSubmit,
  onExpenseSubmit,
  isLoading,
}: Props) {
  const isEditing = Boolean(editingIncome || editingExpense);
  const [activeType, setActiveType] = useState<'income' | 'expense'>(
    editingIncome ? 'income' : editingExpense ? 'expense' : defaultType
  );

  // Sync state whenever props change
  useEffect(() => {
    if (editingIncome) {
      setActiveType('income');
    } else if (editingExpense) {
      setActiveType('expense');
    } else if (isOpen) {
      setActiveType(defaultType);
    }
  }, [editingIncome, editingExpense, defaultType, isOpen]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center items-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm transition-opacity animate-in-fade"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Window (Bottom sheet on mobile, centered modal on desktop) */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] max-h-[90dvh] border border-slate-100/90 animate-slide-up sm:animate-in-scale overflow-hidden"
      >
        {/* Mobile Drag Handle Bar */}
        <div
          className="pt-2.5 pb-1 sm:hidden flex justify-center items-center cursor-pointer select-none active:opacity-60"
          onClick={onClose}
          title="Kéo hoặc chạm để đóng"
        >
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-100/80 shrink-0 bg-white">
          {isEditing ? (
            <div className="flex items-center gap-2.5">
              <div
                className={`w-3.5 h-3.5 rounded-full ${
                  activeType === 'income' ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
              <h2
                className={`text-base sm:text-lg font-black tracking-tight ${
                  activeType === 'income' ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {activeType === 'income' ? 'Chỉnh Sửa Khoản Thu Nhập' : 'Chỉnh Sửa Khoản Chi Tiêu'}
              </h2>
            </div>
          ) : (
            /* Quick Segmented Switcher for New Transactions */
            <div className="flex items-center bg-slate-100/90 p-1 rounded-2xl shadow-inner border border-slate-200/50">
              <button
                type="button"
                onClick={() => setActiveType('expense')}
                className={`flex items-center gap-1.5 py-1.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 active:scale-95 ${
                  activeType === 'expense'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MinusCircle size={15} />
                <span>Chi Tiêu</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveType('income')}
                className={`flex items-center gap-1.5 py-1.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 active:scale-95 ${
                  activeType === 'income'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PlusCircle size={15} />
                <span>Thu Nhập</span>
              </button>
            </div>
          )}

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors active:scale-90"
            aria-label="Đóng cửa sổ"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Modal Body: flex-1 min-h-0 with touch-pan-y allows smooth scrolling on mobile */}
        <div
          className="flex-1 min-h-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 custom-scrollbar touch-pan-y"
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorY: 'contain',
            touchAction: 'pan-y',
          }}
        >
          {activeType === 'income' ? (
            <IncomeForm
              onSubmit={onIncomeSubmit}
              initialData={
                editingIncome
                  ? {
                      amount: editingIncome.amount,
                      person: editingIncome.person,
                      date: editingIncome.date.split('T')[0],
                      note: editingIncome.note || '',
                    }
                  : undefined
              }
              onCancel={onClose}
              isLoading={isLoading}
            />
          ) : (
            <ExpenseForm
              onSubmit={onExpenseSubmit}
              initialData={
                editingExpense
                  ? {
                      amount: editingExpense.amount,
                      category: editingExpense.category,
                      date: editingExpense.date.split('T')[0],
                      note: editingExpense.note || '',
                    }
                  : undefined
              }
              onCancel={onClose}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
