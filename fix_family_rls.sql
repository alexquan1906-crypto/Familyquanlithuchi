-- ==============================================================================
-- FIX QUYỀN TRUY CẬP (RLS) DÙNG CHUNG CHO CẢ GIA ĐÌNH (GỒM dangthinga@gmail.com)
-- Hướng dẫn: Mở Supabase Dashboard -> Vào mục SQL Editor -> Dán toàn bộ mã này -> Bấm RUN
-- ==============================================================================

-- 1. BẢNG INCOME (Thu nhập)
DROP POLICY IF EXISTS "Biệt lập dữ liệu của người dùng" ON public.income;
DROP POLICY IF EXISTS "Allow all" ON public.income;
DROP POLICY IF EXISTS "Cho phép gia đình truy cập" ON public.income;
CREATE POLICY "Cho phép gia đình truy cập" ON public.income 
FOR ALL TO authenticated 
USING (true) 
WITH CHECK (true);

-- 2. BẢNG EXPENSE (Chi tiêu)
DROP POLICY IF EXISTS "Biệt lập dữ liệu của người dùng" ON public.expense;
DROP POLICY IF EXISTS "Allow all" ON public.expense;
DROP POLICY IF EXISTS "Cho phép gia đình truy cập" ON public.expense 
FOR ALL TO authenticated 
USING (true) 
WITH CHECK (true);

-- 3. BẢNG TASKS (Nhiệm vụ)
DROP POLICY IF EXISTS "Biệt lập dữ liệu của người dùng" ON public.tasks;
DROP POLICY IF EXISTS "Allow all" ON public.tasks;
DROP POLICY IF EXISTS "Cho phép gia đình truy cập" ON public.tasks 
FOR ALL TO authenticated 
USING (true) 
WITH CHECK (true);

-- 4. BẢNG APPOINTMENTS (Lịch hẹn)
DROP POLICY IF EXISTS "Biệt lập dữ liệu của người dùng" ON public.appointments;
DROP POLICY IF EXISTS "Allow all" ON public.appointments;
DROP POLICY IF EXISTS "Cho phép gia đình truy cập" ON public.appointments 
FOR ALL TO authenticated 
USING (true) 
WITH CHECK (true);

-- 5. Cấp quyền đầy đủ cho tất cả tài khoản đã đăng nhập
GRANT ALL ON TABLE public.income TO authenticated;
GRANT ALL ON TABLE public.expense TO authenticated;
GRANT ALL ON TABLE public.tasks TO authenticated;
GRANT ALL ON TABLE public.appointments TO authenticated;
