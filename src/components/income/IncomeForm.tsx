import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import LunarSolarDatePicker from '../finance/LunarSolarDatePicker';
import { Check } from 'lucide-react';

const incomeSchema = z.object({
  amount: z.coerce.number().min(1000, 'Số tiền phải lớn hơn 1,000 đ'),
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

const QUICK_INCOME_AMOUNTS = [500000, 1000000, 2000000, 5000000, 10000000, 20000000];

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
      setValue('amount', 0);
      setValue('note', '');
    }
  };

  const addAmount = (delta: number) => {
    const cur = Number(amount) || 0;
    setValue('amount', cur + delta, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 sm:space-y-5 pb-4">
      {/* Chọn Bố / Mẹ */}
      <div>
        <label className="block text-slate-700 font-bold text-xs uppercase tracking-wider mb-2">
          Người Nhận / Tạo Thu Nhập
        </label>
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => setValue('person', 'bo', { shouldValidate: true })}
            className={`p-3 sm:p-3.5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between relative active:scale-95 ${
              selectedPerson === 'bo' 
                ? 'border-emerald-500 bg-emerald-50/90 shadow-sm ring-2 ring-emerald-500/20' 
                : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-sky-100 flex items-center justify-center text-xl sm:text-2xl shadow-inner shrink-0">
                👨
              </div>
              <div className="text-left">
                <span className="block font-black text-slate-800 text-sm sm:text-base">Bố</span>
                <span className="block text-[10.5px] sm:text-[11px] text-slate-400 font-medium">Thu nhập của Bố</span>
              </div>
            </div>
            {selectedPerson === 'bo' && (
              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xs shrink-0">
                <Check size={12} strokeWidth={3} />
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setValue('person', 'me', { shouldValidate: true })}
            className={`p-3 sm:p-3.5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between relative active:scale-95 ${
              selectedPerson === 'me' 
                ? 'border-emerald-500 bg-emerald-50/90 shadow-sm ring-2 ring-emerald-500/20' 
                : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-pink-100 flex items-center justify-center text-xl sm:text-2xl shadow-inner shrink-0">
                👩
              </div>
              <div className="text-left">
                <span className="block font-black text-slate-800 text-sm sm:text-base">Mẹ</span>
                <span className="block text-[10.5px] sm:text-[11px] text-slate-400 font-medium">Thu nhập của Mẹ</span>
              </div>
            </div>
            {selectedPerson === 'me' && (
              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xs shrink-0">
                <Check size={12} strokeWidth={3} />
              </div>
            )}
          </button>
        </div>
        {errors.person && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.person.message}</p>}
      </div>

      {/* Số tiền */}
      <div>
        <label className="block text-slate-700 font-bold text-xs uppercase tracking-wider mb-2">
          Số Tiền Thu Nhập (VNĐ)
        </label>
        <div className="relative">
          <input
            type="number"
            inputMode="decimal"
            enterKeyHint="done"
            {...register('amount')}
            className={`w-full min-h-[52px] text-xl md:text-2xl font-black px-4 pr-10 border rounded-2xl bg-slate-50/50 focus:bg-white focus:outline-none transition-all ${
              errors.amount ? 'border-rose-500 focus:ring-2 focus:ring-rose-500' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
            }`}
            placeholder="0"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
            đ
          </span>
        </div>

        {/* Nút bấm chọn số tiền nhanh */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {QUICK_INCOME_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => addAmount(amt)}
              className="text-xs font-bold px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-xl transition-colors border border-slate-200/60 active:scale-95 shadow-xs"
            >
              +{amt >= 1000000 ? `${amt / 1000000}tr` : `${amt / 1000}k`}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setValue('amount', 0, { shouldValidate: true })}
            className="text-xs font-bold px-2.5 py-1.5 text-slate-400 hover:text-slate-600 rounded-xl transition-colors active:scale-95"
          >
            Đặt lại
          </button>
        </div>

        {amount > 0 && (
          <p className="text-emerald-600 font-bold mt-1 text-xs">
            Bằng số: {Number(amount).toLocaleString('vi-VN')} đ
          </p>
        )}
        {errors.amount && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.amount.message}</p>}
      </div>

      <div className="space-y-4">
        {/* Ngày tháng */}
        <div>
          <label className="block text-slate-700 font-bold text-xs uppercase tracking-wider mb-2">
            Ngày Nhận Tiền
          </label>
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
          <label className="block text-slate-700 font-bold text-xs uppercase tracking-wider mb-1.5">
            Ghi Chú Nguồn Thu
          </label>
          <input
            type="text"
            inputMode="text"
            enterKeyHint="done"
            {...register('note')}
            className="w-full min-h-[48px] px-4 text-sm border border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all"
            placeholder="Ví dụ: Lương cứng tháng này, thưởng doanh số, tiền làm thêm..."
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-3 pb-2 border-t border-slate-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 min-h-[50px] bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold rounded-2xl transition-all text-sm"
          >
            Hủy Bỏ
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={`flex-[2] min-h-[50px] bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-2xl transition-all text-sm shadow-md shadow-emerald-600/20 ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Đang lưu...' : '💾 Lưu Thu Nhập'}
        </button>
      </div>
    </form>
  );
}
