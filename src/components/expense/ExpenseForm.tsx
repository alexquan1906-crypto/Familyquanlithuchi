import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExpenseCategory } from '../../types';
import LunarSolarDatePicker from '../finance/LunarSolarDatePicker';
import { Check } from 'lucide-react';

const expenseCategories: { id: ExpenseCategory; label: string; icon: string; color: string }[] = [
  { id: 'an_uong', label: 'Ăn uống', icon: '🍜', color: 'from-amber-400 to-orange-500' },
  { id: 'tien_dien', label: 'Tiền điện', icon: '⚡', color: 'from-yellow-400 to-amber-500' },
  { id: 'tien_nuoc', label: 'Tiền nước', icon: '💧', color: 'from-sky-400 to-blue-500' },
  { id: 'tien_nha', label: 'Tiền nhà', icon: '🏠', color: 'from-emerald-400 to-teal-500' },
  { id: 'tien_xang', label: 'Tiền xăng', icon: '⛽', color: 'from-purple-400 to-indigo-500' },
  { id: 'mua_sam', label: 'Mua sắm', icon: '🛍️', color: 'from-pink-400 to-rose-500' },
  { id: 'hieu_hi_dam', label: 'Hiếu hỉ', icon: '🎊', color: 'from-red-400 to-rose-500' },
  { id: 'xe_co', label: 'Xe cộ', icon: '🚗', color: 'from-cyan-400 to-blue-500' },
  { id: 'vay_no', label: 'Vay nợ', icon: '💳', color: 'from-slate-500 to-zinc-700' },
  { id: 'khac', label: 'Khác', icon: '📦', color: 'from-slate-400 to-slate-600' },
];

export const getExpenseCategoryInfo = (id: string) => {
  return expenseCategories.find(c => c.id === id) || { id: 'khac', label: 'Khác', icon: '📦', color: 'from-slate-400 to-slate-600' };
};

const QUICK_AMOUNTS = [50000, 100000, 200000, 500000, 1000000, 2000000];

const expenseSchema = z.object({
  amount: z.coerce.number().min(1000, 'Số tiền phải lớn hơn 1,000 đ'),
  category: z.enum([
    'an_uong', 'tien_dien', 'tien_nuoc', 'tien_nha',
    'tien_xang', 'mua_sam', 'hieu_hi_dam', 'xe_co',
    'vay_no', 'khac'
  ], { message: 'Vui lòng chọn danh mục' }),
  date: z.string().min(1, 'Vui lòng chọn ngày'),
  note: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface Props {
  onSubmit: (data: ExpenseFormValues) => Promise<boolean>;
  initialData?: ExpenseFormValues;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function ExpenseForm({ onSubmit, initialData, onCancel, isLoading }: Props) {
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema) as any,
    defaultValues: initialData || {
      amount: 0,
      category: 'an_uong',
      date: new Date().toISOString().split('T')[0],
      note: ''
    }
  });

  const selectedCategory = watch('category');
  const amount = watch('amount');

  const handleFormSubmit = async (data: ExpenseFormValues) => {
    const success = await onSubmit(data);
    if (success && !initialData) {
      setValue('amount', 0);
      setValue('note', '');
    }
  };

  const addAmount = (delta: number) => {
    const cur = Number(amount) || 0;
    setValue('amount', cur + delta, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Danh mục */}
      <div>
        <label className="block text-slate-700 font-bold text-xs uppercase tracking-wider mb-2">
          Chọn Danh Mục
        </label>
        <div className="grid grid-cols-5 gap-2">
          {expenseCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setValue('category', cat.id, { shouldValidate: true })}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all duration-200 relative group ${
                  isSelected 
                    ? 'border-rose-500 bg-rose-50/80 shadow-md shadow-rose-500/10 scale-105 z-10' 
                    : 'border-slate-200/70 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${cat.color} text-white shadow-sm mb-1`}>
                  {cat.icon}
                </div>
                <span className={`text-[11px] text-center leading-tight ${isSelected ? 'font-black text-rose-700' : 'font-medium text-slate-600'}`}>
                  {cat.label}
                </span>
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-white">
                    <Check size={10} strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {errors.category && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.category.message}</p>}
      </div>

      {/* Số tiền */}
      <div>
        <label className="block text-slate-700 font-bold text-xs uppercase tracking-wider mb-2">
          Số Tiền Chi Tiêu (VNĐ)
        </label>
        <div className="relative">
          <input
            type="number"
            {...register('amount')}
            className={`w-full min-h-[54px] text-xl md:text-2xl font-black px-4 pr-10 border rounded-2xl bg-slate-50/50 focus:bg-white focus:outline-none transition-all ${
              errors.amount ? 'border-rose-500 focus:ring-2 focus:ring-rose-500' : 'border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
            }`}
            placeholder="0"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
            đ
          </span>
        </div>

        {/* Nút bấm chọn số tiền nhanh */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => addAmount(amt)}
              className="text-[11px] font-bold px-2.5 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-xl transition-colors border border-slate-200/60 active:scale-95"
            >
              +{amt >= 1000000 ? `${amt / 1000000}tr` : `${amt / 1000}k`}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setValue('amount', 0, { shouldValidate: true })}
            className="text-[11px] font-bold px-2 py-1 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"
          >
            Đặt lại
          </button>
        </div>

        {amount > 0 && (
          <p className="text-rose-600 font-bold mt-1 text-xs">
            Bằng số: {Number(amount).toLocaleString('vi-VN')} đ
          </p>
        )}
        {errors.amount && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.amount.message}</p>}
      </div>

      <div className="space-y-4">
        {/* Ngày tháng */}
        <div>
          <label className="block text-slate-700 font-bold text-xs uppercase tracking-wider mb-2">
            Ngày Chi Tiêu
          </label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <LunarSolarDatePicker
                value={field.value}
                onChange={field.onChange}
                error={errors.date?.message as string | undefined}
                focusColor="red"
              />
            )}
          />
        </div>

        {/* Ghi chú */}
        <div>
          <label className="block text-slate-700 font-bold text-xs uppercase tracking-wider mb-1.5">
            Ghi Chú Chi Tiết
          </label>
          <input
            type="text"
            {...register('note')}
            className="w-full min-h-[48px] px-4 text-sm border border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:outline-none transition-all"
            placeholder="Ví dụ: Mua thức ăn ở siêu thị, bảo dưỡng xe..."
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-3 border-t border-slate-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 min-h-[50px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors text-sm"
          >
            Hủy Bỏ
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={`flex-[2] min-h-[50px] bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-all text-sm shadow-md shadow-rose-600/20 active:scale-98 ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Đang lưu...' : '💾 Lưu Chi Tiêu'}
        </button>
      </div>
    </form>
  );
}
