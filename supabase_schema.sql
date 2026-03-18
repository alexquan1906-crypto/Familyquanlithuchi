-- BẢNG THU NHẬP
create table income (
  id uuid default gen_random_uuid() primary key,
  amount numeric(12,0) not null,
  person text not null check (person in ('bo', 'me')),
  note text,
  date date not null default current_date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_income_date on income(date);
alter table income enable row level security;
create policy "Allow all" on income for all using (true);

-- BẢNG CHI TIÊU
create type expense_category as enum (
  'an_uong', 'tien_dien', 'tien_nuoc', 'tien_nha',
  'tien_xang', 'mua_sam', 'hieu_hi_dam', 'xe_co',
  'vay_no', 'khac'
);
create table expense (
  id uuid default gen_random_uuid() primary key,
  amount numeric(12,0) not null,
  category expense_category not null,
  note text,
  date date not null default current_date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_expense_date on expense(date);
create index idx_expense_category on expense(category);
alter table expense enable row level security;
create policy "Allow all" on expense for all using (true);

-- BẢNG NHIỆM VỤ
create table tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  due_date date,
  is_completed boolean default false,
  priority text default 'medium' check (priority in ('low', 'medium', 'high')),
  category text default 'task' check (category in ('task', 'goal', 'appointment')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table tasks enable row level security;
create policy "Allow all" on tasks for all using (true);

-- BẢNG LỊCH HẸN
create table appointments (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  date date not null,
  lunar_date text,
  time time,
  reminder_days int default 1,
  created_at timestamptz default now()
);
alter table appointments enable row level security;
create policy "Allow all" on appointments for all using (true);

-- CẤP QUYỀN TRUY CẬP CHO API (Khắc phục lỗi Permission Denied)
GRANT ALL ON TABLE public.income TO anon, authenticated;
GRANT ALL ON TABLE public.expense TO anon, authenticated;
GRANT ALL ON TABLE public.tasks TO anon, authenticated;
GRANT ALL ON TABLE public.appointments TO anon, authenticated;

-- ĐẢM BẢO RLS CHO PHÉP TẤT CẢ (Đọc, Thêm, Sửa, Xóa)
DROP POLICY IF EXISTS "Allow all" ON public.income;
CREATE POLICY "Allow all" ON public.income FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all" ON public.expense;
CREATE POLICY "Allow all" ON public.expense FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all" ON public.tasks;
CREATE POLICY "Allow all" ON public.tasks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all" ON public.appointments;
CREATE POLICY "Allow all" ON public.appointments FOR ALL USING (true) WITH CHECK (true);

-- TRIGGER CẬP NHẬT UPDATED_AT
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

DROP TRIGGER IF EXISTS trg_income_updated ON income;
DROP TRIGGER IF EXISTS trg_expense_updated ON expense;
DROP TRIGGER IF EXISTS trg_tasks_updated ON tasks;

create trigger trg_income_updated before update on income for each row execute function update_updated_at();
create trigger trg_expense_updated before update on expense for each row execute function update_updated_at();
create trigger trg_tasks_updated before update on tasks for each row execute function update_updated_at();
