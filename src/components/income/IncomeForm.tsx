import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import LunarSolarDatePicker from '../finance/LunarSolarDatePicker';

const incomeSchema = z.object({
  amount: z.coerce.number().min(1000, 'Số tiền phải lớn hơn 1000đ'),
  person: z.enum(['bo', 'me'], { message: 'Vui lòng chọn Bố hoặc Mẹ' }),
  date: z.string().min(1, 'Vui lòng chọn ngày'),
  note: z.string().optional(),
});

type IncomeFormValues = z.infer<typeof incomeSchema>;

interface Props {
  onSubmit: (data: IncomeFormValues) => Promise<boolean>;
  initialData?: IncomeFormValues;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function IncomeForm({ onSubmit, initialData, onCancel, isLoading }: Props) {
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeSchema) as any,
    defaultValues: initialData || {
      amount: 0,
      person: 'bo',
      date: new Date().toISOString().split('T')[0],
      note: ''
    }
  });

  const selectedPerson = watch('person');
  const amount = watch('amount');

  const handleFormSubmit = async (data: IncomeFormValues) => {
    const success = await onSubmit(data);
    if (success && !initialData) {
      // Reset form if it's a new entry
      setValue('amount', 0);
      setValue('note', '');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 bg-white p-5 md:p-6 rounded-2xl border border-slate-200">
      
      {/* Chọn Bố / Mẹ */}
      <div>
        <label className="block text-slate-700 font-medium mb-3">Nguồn Thu</label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setValue('person', 'bo')}
            className={`flex-1 min-h-[56px] rounded-xl border-2 transition-colors font-bold text-lg ${
              selectedPerson === 'bo' ? 'border-green-600 bg-green-50 text-green-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            👨 Bố
          </button>
          <button
            type="button"
            onClick={() => setValue('person', 'me')}
            className={`flex-1 min-h-[56px] rounded-xl border-2 transition-colors font-bold text-lg ${
              selectedPerson === 'me' ? 'border-green-600 bg-green-50 text-green-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            👩 Mẹ
          </button>
        </div>
        {errors.person && <p className="text-red-500 mt-1">{errors.person.message}</p>}
      </div>

      {/* Số tiền */}
      <div>
        <label className="block text-slate-700 font-medium mb-2">Số Tiền (VNĐ)</label>
        <div className="relative">
          <input
            type="number"
            {...register('amount')}
            className={`w-full min-h-[56px] text-xl font-medium px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors ${
              errors.amount ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Ví dụ: 15000000"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">đ</span>
        </div>
        {amount > 0 && (
          <p className="text-green-600 font-bold mt-2 text-[15px]">
            Đọc là: {Number(amount).toLocaleString('vi-VN')} đ
          </p>
        )}
        {errors.amount && <p className="text-red-500 mt-1">{errors.amount.message}</p>}
      </div>

      {/* Ngày tháng */}
      <div>
        <label className="block text-slate-700 font-medium mb-2">Ngày Nhận</label>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <LunarSolarDatePicker
              value={field.value}
              onChange={field.onChange}
              error={errors.date?.message as string | undefined}
              focusColor="green"
            />
          )}
        />
      </div>

      {/* Ghi chú */}
      <div>
        <label className="block text-slate-700 font-medium mb-2">Ghi Chú</label>
        <textarea
          {...register('note')}
          rows={3}
          className="w-full px-4 py-3 text-lg border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
          placeholder="VD: Lương tháng 6, tiền thưởng..."
        />
      </div>

      {/* Nút hành động */}
      <div className="flex gap-4 pt-2">
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
          className={`flex-[2] min-h-[56px] bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors text-lg ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Đang lưu...' : '💾 Lưu Thu Nhập'}
        </button>
      </div>
    </form>
  );
}
