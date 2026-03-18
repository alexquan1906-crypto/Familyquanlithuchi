import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExpenseCategory } from '../../types';

const expenseCategories: { id: ExpenseCategory; label: string; icon: string }[] = [
  { id: 'an_uong', label: 'Ăn uống', icon: '🍜' },
  { id: 'tien_dien', label: 'Tiền điện', icon: '⚡' },
  { id: 'tien_nuoc', label: 'Tiền nước', icon: '💧' },
  { id: 'tien_nha', label: 'Tiền nhà', icon: '🏠' },
  { id: 'tien_xang', label: 'Tiền xăng', icon: '⛽' },
  { id: 'mua_sam', label: 'Mua sắm', icon: '🛍️' },
  { id: 'hieu_hi_dam', label: 'Hiếu hỉ - Đám', icon: '🎊' },
  { id: 'xe_co', label: 'Xe cộ', icon: '🚗' },
  { id: 'vay_no', label: 'Vay nợ', icon: '💳' },
  { id: 'khac', label: 'Khác', icon: '📦' },
];

export const getExpenseCategoryInfo = (id: string) => {
  return expenseCategories.find(c => c.id === id) || { id: 'khac', label: 'Khác', icon: '📦' };
};

const expenseSchema = z.object({
  amount: z.coerce.number().min(1000, 'Số tiền phải lớn hơn 1000đ'),
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
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ExpenseFormValues>({
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

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-xl font-bold text-slate-800">
        {initialData ? '✏️ Cập Nhật Chi Tiêu' : '💸 Thêm Chi Tiêu Mới'}
      </h3>
      
      {/* Danh mục */}
      <div>
        <label className="block text-slate-700 font-medium mb-3">Danh Mục</label>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {expenseCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setValue('category', cat.id, { shouldValidate: true })}
              className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all gap-1 ${
                selectedCategory === cat.id 
                  ? 'border-red-500 bg-red-50 text-red-700 font-bold shadow-sm scale-105' 
                  : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:border-slate-200'
              }`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-[12px] md:text-sm text-center leading-tight">{cat.label}</span>
            </button>
          ))}
        </div>
        {errors.category && <p className="text-red-500 mt-2">{errors.category.message}</p>}
      </div>

      {/* Số tiền */}
      <div>
        <label className="block text-slate-700 font-medium mb-2">Số Tiền (VNĐ)</label>
        <div className="relative">
          <input
            type="number"
            {...register('amount')}
            className={`w-full min-h-[56px] text-xl font-medium px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none transition-colors ${
              errors.amount ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Ví dụ: 500000"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">đ</span>
        </div>
        {amount > 0 && (
          <p className="text-red-600 font-bold mt-2 text-[15px]">
            Đọc là: {Number(amount).toLocaleString('vi-VN')} đ
          </p>
        )}
        {errors.amount && <p className="text-red-500 mt-1">{errors.amount.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ngày tháng */}
        <div>
          <label className="block text-slate-700 font-medium mb-2">Ngày Chi</label>
          <input
            type="date"
            {...register('date')}
            className="w-full min-h-[56px] text-lg px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          {errors.date && <p className="text-red-500 mt-1">{errors.date.message}</p>}
        </div>

        {/* Ghi chú */}
        <div>
          <label className="block text-slate-700 font-medium mb-2">Ghi Chú</label>
          <input
            type="text"
            {...register('note')}
            className="w-full min-h-[56px] px-4 text-lg border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
            placeholder="VD: Mua thức ăn siêu thị..."
          />
        </div>
      </div>

      {/* Nút hành động */}
      <div className="flex gap-4 pt-4 border-t border-slate-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 min-h-[56px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-lg"
          >
            Hủy Bỏ
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={`flex-[2] min-h-[56px] bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors text-lg ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Đang lưu...' : '💾 Lưu Chi Tiêu'}
        </button>
      </div>
    </form>
  );
}
