-- ==============================================================================
-- CẤU HÌNH DATABASE CHUẨN: MỌI TÀI KHOẢN ĐĂNG NHẬP ĐỀU TRUY CẬP ĐƯỢC
-- Hướng dẫn:
-- 1. Mở trang https://supabase.com/dashboard
-- 2. Chọn Project của bạn -> Bấm vào mục "SQL Editor" ở menu bên trái
-- 3. Bấm "New Query", dán toàn bộ đoạn mã bên dưới và bấm "Run"
-- ==============================================================================

-- 1. BẢNG THU NHẬP (income)
ALTER TABLE public.income ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.income ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.income ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Biệt lập dữ liệu của người dùng" ON public.income;
DROP POLICY IF EXISTS "Cho phép gia đình truy cập" ON public.income;
DROP POLICY IF EXISTS "Allow all" ON public.income;
CREATE POLICY "Cho phép người dùng đã đăng nhập" ON public.income FOR ALL USING (true) WITH CHECK (true);

-- 2. BẢNG CHI TIÊU (expense)
ALTER TABLE public.expense ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.expense ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.expense ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Biệt lập dữ liệu của người dùng" ON public.expense;
DROP POLICY IF EXISTS "Cho phép gia đình truy cập" ON public.expense;
DROP POLICY IF EXISTS "Allow all" ON public.expense;
CREATE POLICY "Cho phép người dùng đã đăng nhập" ON public.expense FOR ALL USING (true) WITH CHECK (true);

-- 3. BẢNG NHIỆM VỤ (tasks)
ALTER TABLE public.tasks ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.tasks ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Biệt lập dữ liệu của người dùng" ON public.tasks;
DROP POLICY IF EXISTS "Cho phép gia đình truy cập" ON public.tasks;
DROP POLICY IF EXISTS "Allow all" ON public.tasks;
CREATE POLICY "Cho phép người dùng đã đăng nhập" ON public.tasks FOR ALL USING (true) WITH CHECK (true);

-- 4. BẢNG LỊCH HẸN (appointments)
ALTER TABLE public.appointments ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.appointments ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Biệt lập dữ liệu của người dùng" ON public.appointments;
DROP POLICY IF EXISTS "Cho phép gia đình truy cập" ON public.appointments;
DROP POLICY IF EXISTS "Allow all" ON public.appointments;
CREATE POLICY "Cho phép người dùng đã đăng nhập" ON public.appointments FOR ALL USING (true) WITH CHECK (true);

-- 5. Cấp toàn quyền cho authenticated và anon
GRANT ALL ON TABLE public.income TO authenticated, anon;
GRANT ALL ON TABLE public.expense TO authenticated, anon;
GRANT ALL ON TABLE public.tasks TO authenticated, anon;
GRANT ALL ON TABLE public.appointments TO authenticated, anon;
