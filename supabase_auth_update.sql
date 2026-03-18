-- VUI LÒNG CHẠY ĐOẠN MÃ NÀY TRONG SQL EDITOR CỦA SUPABASE --

-- Bước 1: Xóa dữ liệu cũ (nếu có) vì các bảng cũ không có user_id
TRUNCATE TABLE public.income, public.expense, public.tasks, public.appointments;

-- Bước 2: Thêm cột user_id vào tất cả các bảng
ALTER TABLE public.income ADD COLUMN user_id uuid references auth.users(id) not null default auth.uid();
ALTER TABLE public.expense ADD COLUMN user_id uuid references auth.users(id) not null default auth.uid();
ALTER TABLE public.tasks ADD COLUMN user_id uuid references auth.users(id) not null default auth.uid();
ALTER TABLE public.appointments ADD COLUMN user_id uuid references auth.users(id) not null default auth.uid();

-- Bước 3: Cập nhật RLS Policy để mỗi tài khoản chỉ thấy dữ liệu của gia đình mình
-- INCOME
DROP POLICY IF EXISTS "Allow all" ON public.income;
CREATE POLICY "Biệt lập dữ liệu của người dùng" ON public.income 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- EXPENSE
DROP POLICY IF EXISTS "Allow all" ON public.expense;
CREATE POLICY "Biệt lập dữ liệu của người dùng" ON public.expense 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- TASKS
DROP POLICY IF EXISTS "Allow all" ON public.tasks;
CREATE POLICY "Biệt lập dữ liệu của người dùng" ON public.tasks 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- APPOINTMENTS
DROP POLICY IF EXISTS "Allow all" ON public.appointments;
CREATE POLICY "Biệt lập dữ liệu của người dùng" ON public.appointments 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Ghi chú: Kịch bản này sẽ trói buộc mọi giao dịch vào tài khoản đăng nhập hiện tại bằng Supabase Auth.
