# 🏠 Family Finance Manager — Quản Lý Thu Chi Gia Đình

> **Stack:** React + TypeScript + Supabase + Gemini AI + Tailwind CSS  
> **Công cụ:** Antigravity (Vibecoding)  
> **Mục tiêu:** Ứng dụng đơn giản, trực quan cho bố mẹ dùng hàng ngày

---

## 📁 Cấu Trúc Dự Án

```
family-finance/
├── src/
│   ├── components/
│   │   ├── layout/          # Sidebar, Header, BottomNav
│   │   ├── income/          # Form nhập thu nhập
│   │   ├── expense/         # Form nhập chi tiêu
│   │   ├── stats/           # Biểu đồ thống kê
│   │   ├── calendar/        # Lịch thu chi + Lịch âm dương
│   │   ├── tasks/           # TodoList + Lịch hẹn
│   │   ├── holidays/        # Đếm ngược ngày lễ VN
│   │   └── ai-chat/         # Chat box AI Gemini
│   ├── lib/
│   │   ├── supabase.ts      # Supabase client
│   │   ├── gemini.ts        # Gemini API client
│   │   └── lunar.ts         # Tính lịch âm dương VN
│   ├── hooks/               # Custom hooks
│   ├── types/               # TypeScript interfaces
│   ├── pages/               # Route pages
│   └── utils/               # Helpers, formatters
├── supabase/
│   └── migrations/          # SQL schema migrations
└── .env.local
```

---

## 🗄️ DATABASE SCHEMA — Supabase SQL

> **Bước 1:** Vào Supabase Dashboard → SQL Editor → chạy lần lượt từng block

### Block 1 — Bảng Thu Nhập

```sql
create table income (
  id uuid default gen_random_uuid() primary key,
  amount numeric(12,0) not null,
  person text not null check (person in ('bo', 'me')),
  note text,
  date date not null default current_date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index tăng tốc query theo tháng/năm
create index idx_income_date on income(date);

-- Enable Row Level Security
alter table income enable row level security;
create policy "Allow all" on income for all using (true);
```

### Block 2 — Bảng Chi Tiêu

```sql
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
```

### Block 3 — Bảng Tasks & Nhiệm Vụ

```sql
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
```

### Block 4 — Bảng Lịch Hẹn (Âm Dương)

```sql
create table appointments (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  date date not null,
  lunar_date text,          -- VD: "15/7 Giáp Thìn"
  time time,
  reminder_days int default 1,
  created_at timestamptz default now()
);

alter table appointments enable row level security;
create policy "Allow all" on appointments for all using (true);
```

### Block 5 — Trigger tự động cập nhật updated_at

```sql
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_income_updated before update on income
  for each row execute function update_updated_at();

create trigger trg_expense_updated before update on expense
  for each row execute function update_updated_at();

create trigger trg_tasks_updated before update on tasks
  for each row execute function update_updated_at();
```

---

## ⚙️ ENV Variables

```env
# .env.local
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_GEMINI_API_KEY=AIza...
```

---

## 📋 RULES — Quy Tắc Dự Án

> Dán vào đầu mỗi prompt khi vibecode trong Antigravity

```
### PROJECT RULES — FAMILY FINANCE APP

TECH STACK:
- React 18 + TypeScript (strict mode)
- Supabase (PostgreSQL) cho toàn bộ database
- Tailwind CSS cho styling
- Recharts cho biểu đồ
- Gemini 1.5 Flash cho AI Chat
- React Router v6 cho điều hướng
- date-fns cho xử lý ngày tháng
- React Hook Form + Zod cho form validation

CODE RULES:
- Luôn dùng TypeScript interfaces, không dùng any
- Mọi call Supabase đều phải có try/catch và hiển thị lỗi thân thiện
- Tất cả số tiền format theo VNĐ: 1.500.000 đ
- Component nhỏ, tái sử dụng, không quá 200 dòng/file
- Custom hooks cho logic nghiệp vụ (useIncome, useExpense, useTasks...)
- Loading state và empty state cho mọi danh sách
- Toast notification cho mọi action thành công/thất bại

UI/UX RULES:
- Mobile-first, responsive hoàn toàn
- Font: Be Vietnam Pro (Google Fonts) — phù hợp tiếng Việt
- Màu chủ đạo: Xanh lá (#16a34a) cho thu nhập, Đỏ (#dc2626) cho chi tiêu
- Nút bấm to, rõ ràng (min-height: 48px) — dễ bấm cho người lớn tuổi
- Text size tối thiểu 16px
- Icon dùng Lucide React
- Confirm dialog trước khi xóa

FINANCIAL RULES:
- Số tiền lưu dạng integer (VNĐ, không có số thập phân)
- Không xóa dữ liệu cũ — chỉ soft-delete nếu cần
- Mỗi giao dịch phải có ngày, số tiền, loại
```

---

## 🚀 CÁC BƯỚC PHÁT TRIỂN — Step by Step

---

### **BƯỚC 0 — Khởi tạo dự án**

```
Tạo dự án React + TypeScript + Vite với Tailwind CSS. 
Cài đặt các thư viện: @supabase/supabase-js, recharts, 
react-router-dom, react-hook-form, zod, date-fns, 
lucide-react, @hookform/resolvers, sonner (toast).
Tạo file src/lib/supabase.ts kết nối Supabase dùng biến môi trường.
Tạo file src/types/index.ts định nghĩa đầy đủ TypeScript interfaces 
cho Income, Expense, Task, Appointment.
```

---

### **BƯỚC 1 — Layout & Navigation**

```
Tạo layout chính cho ứng dụng quản lý thu chi gia đình với React Router v6.
Sidebar desktop + Bottom navigation mobile với 5 tab:
  1. 🏠 Tổng quan (Dashboard)
  2. 💰 Thu Chi (Income/Expense)
  3. 📊 Thống kê (Stats)
  4. 📅 Lịch & Nhiệm vụ (Calendar & Tasks)
  5. 🤖 Trợ lý AI

Font: Be Vietnam Pro. Màu sidebar: trắng với border phải nhẹ.
Active tab highlight màu xanh lá #16a34a.
Header hiển thị tháng/năm hiện tại và tổng số dư tháng này.
Giao diện sạch, chữ to, dễ đọc cho người cao tuổi.
```

---

### **BƯỚC 2 — Trang Tổng Quan (Dashboard)**

```
Tạo trang Dashboard hiển thị tổng quan tài chính tháng hiện tại.

Gồm các card:
  - 💚 Tổng thu nhập tháng (Bố + Mẹ tách riêng)
  - 🔴 Tổng chi tiêu tháng
  - 💰 Số dư còn lại (thu - chi)
  - 📈 So sánh với tháng trước (% tăng/giảm)

Phía dưới: danh sách 5 giao dịch gần nhất (thu + chi xen kẽ).
Mỗi giao dịch hiển thị: icon loại, tên, số tiền màu xanh/đỏ, ngày.
Nút nhanh "➕ Thêm thu nhập" và "➖ Thêm chi tiêu" to rõ ràng.

Fetch data từ Supabase bảng income và expense, lọc theo tháng hiện tại.
Format tiền VNĐ: 1.500.000 đ.
```

---

### **BƯỚC 3 — Nhập Thu Nhập (Income CRUD)**

```
Tạo màn hình quản lý Thu Nhập với đầy đủ CRUD dùng Supabase bảng income.

FORM NHẬP (dùng React Hook Form + Zod validation):
  - Chọn người: [👨 Thu nhập của Bố] [👩 Thu nhập của Mẹ] — dạng toggle button to
  - Số tiền: input kiểu number, auto format nghìn phân cách, suffix "đ"
  - Ngày: date picker, mặc định hôm nay
  - Ghi chú: textarea, placeholder "VD: Lương tháng 6, tiền thưởng..."
  - Nút [💾 Lưu Thu Nhập] màu xanh lá, to

DANH SÁCH (phân trang hoặc scroll vô hạn):
  - Filter theo: tháng, người (Bố/Mẹ/Tất cả)
  - Mỗi dòng: avatar Bố/Mẹ, ghi chú, ngày, số tiền, nút ✏️ Sửa, 🗑️ Xóa
  - Confirm dialog trước khi xóa
  - Toast thành công/thất bại

EDIT: mở modal với form điền sẵn dữ liệu cũ.

Dùng custom hook useIncome() cho toàn bộ logic CRUD với Supabase.
```

---

### **BƯỚC 4 — Nhập Chi Tiêu (Expense CRUD)**

```
Tạo màn hình quản lý Chi Tiêu với đầy đủ CRUD dùng Supabase bảng expense.

DANH SÁCH PHÂN LOẠI (hiển thị dạng grid 2-3 cột để chọn):
  🍜 Ăn uống       ⚡ Tiền điện      💧 Tiền nước
  🏠 Tiền nhà      ⛽ Tiền xăng     🛍️ Mua sắm
  🎊 Hiếu hỉ-Đám   🚗 Xe cộ         💳 Vay nợ
  📦 Khác

FORM NHẬP:
  - Grid chọn danh mục (highlight khi chọn)
  - Số tiền + Ngày + Ghi chú
  - Nút [💾 Lưu Chi Tiêu] màu đỏ #dc2626

DANH SÁCH:
  - Filter theo: tháng, danh mục
  - Mỗi dòng: icon danh mục, tên danh mục, ghi chú, ngày, số tiền đỏ
  - Nút sửa/xóa với confirm dialog

Custom hook useExpense() cho CRUD với Supabase.
```

---

### **BƯỚC 5 — Thống Kê & Biểu Đồ**

```
Tạo trang Thống Kê dùng thư viện Recharts, dữ liệu từ Supabase.

PHẦN 1 — Bộ lọc thời gian:
  Chọn tháng/năm (mặc định tháng hiện tại)

PHẦN 2 — Biểu đồ cột (BarChart):
  - X-axis: các tuần trong tháng (Tuần 1, 2, 3, 4)
  - Bar xanh = Thu nhập, Bar đỏ = Chi tiêu
  - Tooltip hiển thị số tiền VNĐ
  - Responsive container 100% width

PHẦN 3 — Biểu đồ tròn (PieChart) Chi Tiêu theo Danh Mục:
  - Mỗi màu = 1 danh mục
  - Legend bên dưới với % và số tiền
  - Hiển thị top 5 danh mục tốn nhiều nhất

PHẦN 4 — So sánh Bố vs Mẹ:
  - Biểu đồ cột ngang (BarChart horizontal)
  - Thu nhập Bố vs Mẹ theo từng tháng trong năm

PHẦN 5 — Bảng tổng hợp:
  - Từng danh mục chi tiêu: tổng tiền, % trên tổng chi
  - Highlight hàng cao nhất màu cam nhạt
```

---

### **BƯỚC 6 — Lịch Thu Chi Theo Ngày**

```
Tạo trang Lịch hiển thị thu chi từng ngày trong tháng như calendar view.
Dùng date-fns để tính toán ngày tháng. Dữ liệu từ Supabase.

CALENDAR VIEW:
  - Grid 7 cột (Thứ 2 → Chủ nhật), tiêu đề bằng tiếng Việt
  - Header: điều hướng tháng trước/sau, hiển thị "Tháng X/YYYY"
  - Mỗi ô ngày:
      + Số ngày (to, rõ)
      + Chấm xanh nếu có thu nhập trong ngày đó
      + Chấm đỏ nếu có chi tiêu trong ngày đó
      + Tổng thu nhỏ: +500k / -200k
  - Ô hôm nay highlight nền xanh nhạt, border đậm

KHI CLICK VÀO NGÀY:
  - Drawer/Modal từ dưới lên (mobile-friendly)
  - Hiển thị danh sách giao dịch của ngày đó
  - Mỗi giao dịch: icon, tên, số tiền, ghi chú
  - Tổng thu / tổng chi / số dư ngày đó
  - Nút "➕ Thêm giao dịch ngày này" (pre-fill ngày)

Tải trước toàn bộ dữ liệu tháng 1 lần, không query từng ngày.
```

---

### **BƯỚC 7 — Nhiệm Vụ & Lịch Hẹn (Tasks)**

```
Tạo trang Lịch Trình & Nhiệm Vụ với 3 tab con: Nhiệm vụ | Lịch hẹn | Ngày lễ

=== TAB 1: NHIỆM VỤ (TodoList) — CRUD với Supabase bảng tasks ===

Form thêm nhiệm vụ:
  - Tiêu đề (bắt buộc)
  - Mô tả chi tiết (tuỳ chọn)
  - Ngày hết hạn (date picker)
  - Mức ưu tiên: 🔴 Cao | 🟡 Trung bình | 🟢 Thấp
  - Loại: ✅ Nhiệm vụ | 🎯 Mục tiêu | 📍 Lịch hẹn

Danh sách:
  - Checkbox to để đánh dấu hoàn thành
  - Filter: Tất cả | Đang làm | Hoàn thành | Quá hạn
  - Sort: theo ngày hạn, theo ưu tiên
  - Task quá hạn highlight đỏ nhạt
  - Task hoàn thành: gạch ngang text, mờ đi
  - Swipe to delete hoặc nút xóa

=== TAB 2: LỊCH ÂM DƯƠNG VIỆT NAM ===

Tích hợp thư viện tính lịch âm (dùng package 'vietnamese-lunar-calendar' hoặc tự implement).

Hiển thị:
  - Calendar grid tháng hiện tại
  - Mỗi ô: ngày dương (to) + ngày âm (nhỏ, xám)
  - Các ngày có lịch hẹn: dot màu
  - Giờ hoàng đạo của ngày (Tý, Sửu, Dần...)

Form thêm lịch hẹn:
  - Tiêu đề, ngày dương (tự tính sang âm), giờ, ghi chú
  - Nhắc nhở trước X ngày
  - Lưu vào Supabase bảng appointments

=== TAB 3: NGÀY LỄ VIỆT NAM — ĐẾM NGƯỢC ===

Danh sách cố định các ngày lễ VN:
  - Tết Nguyên Đán (tính theo âm lịch, tự động năm hiện tại)
  - 30/4 — Giải phóng miền Nam
  - 1/5 — Quốc tế Lao động
  - 2/9 — Quốc khánh
  - Rằm tháng Giêng, Tết Trung Thu (âm lịch)
  - Ngày Nhà giáo VN 20/11
  - Ngày 8/3, 20/10

Hiển thị dạng card:
  - Tên ngày lễ + icon
  - ĐẾM NGƯỢC to: "Còn X ngày"
  - Nếu hôm nay là ngày lễ: hiệu ứng 🎉 confetti nhỏ
  - Sort: ngày gần nhất lên đầu
```

---

### **BƯỚC 8 — AI Chat Box (Gemini)**

```
Tạo chat box AI phân tích tài chính và lịch trình dùng Google Gemini 1.5 Flash API.
File: src/lib/gemini.ts, src/components/ai-chat/ChatBox.tsx

GIAO DIỆN:
  - Floating button 💬 góc phải dưới màn hình
  - Click mở panel chat toàn màn hình hoặc drawer rộng
  - Bubble chat: AI bên trái (xám nhạt), User bên phải (xanh lá)
  - Input box dưới cùng + nút gửi
  - Typing indicator "..." khi AI đang trả lời
  - Nút xóa lịch sử chat

SYSTEM PROMPT (gửi kèm mỗi request):
  Bạn là trợ lý tài chính gia đình thông minh, thân thiện, trả lời bằng tiếng Việt đơn giản, dễ hiểu.
  Bạn giúp phân tích thu chi, đưa ra lời khuyên tiết kiệm, nhắc lịch hẹn và nhiệm vụ.
  Trả lời ngắn gọn, dùng emoji phù hợp, tránh thuật ngữ phức tạp.

CONTEXT TỰ ĐỘNG (inject vào prompt):
  - Tổng thu nhập tháng này: X đ
  - Tổng chi tiêu tháng này: X đ  
  - Top 3 danh mục chi nhiều nhất
  - Số nhiệm vụ chưa hoàn thành

QUICK PROMPTS (gợi ý sẵn, click để gửi):
  - "📊 Phân tích chi tiêu tháng này"
  - "💡 Gợi ý tiết kiệm cho gia đình tôi"
  - "📅 Nhắc nhiệm vụ sắp đến hạn"
  - "⚖️ So sánh thu nhập Bố và Mẹ"

Dùng fetch() gọi trực tiếp Gemini API endpoint với API key từ .env.
Xử lý stream response nếu muốn hiệu ứng text chạy từng chữ.
```

---

### **BƯỚC 9 — Tối Ưu & Hoàn Thiện**

```
Hoàn thiện và tối ưu ứng dụng quản lý thu chi gia đình:

1. LOADING STATES:
   - Skeleton loading cho tất cả danh sách và biểu đồ
   - Spinner cho các action (lưu, xóa)

2. ERROR HANDLING:
   - Hiển thị lỗi thân thiện bằng tiếng Việt
   - Retry button khi mất mạng
   - Sonner toast cho success/error

3. EMPTY STATES:
   - Illustration + text khi chưa có dữ liệu
   - Nút call-to-action "Thêm ngay"

4. RESPONSIVE:
   - Test trên mobile 375px, tablet 768px, desktop 1280px
   - Bottom sheet thay modal trên mobile
   - Table thành card list trên mobile

5. PERFORMANCE:
   - useMemo cho tính toán tổng, biểu đồ
   - Lazy load từng trang với React.lazy
   - Cache data trong context hoặc Zustand

6. ACCESSIBILITY:
   - aria-label cho icon buttons
   - Keyboard navigation
   - Contrast màu đạt WCAG AA

7. PWA (tuỳ chọn):
   - Thêm manifest.json + service worker
   - Cài được trên màn hình điện thoại như app thật
```

---

## 🔑 MASTER PROMPT — Dùng Cho Antigravity

> Dán nguyên block này vào đầu chat Antigravity trước khi bắt đầu

```
Tôi đang xây dựng ứng dụng quản lý thu chi gia đình tên "Family Finance".

TECH STACK: React 18, TypeScript strict, Vite, Tailwind CSS, Supabase (PostgreSQL), 
Recharts (biểu đồ), React Router v6, React Hook Form + Zod, date-fns, Lucide React, 
Sonner (toast), Gemini 1.5 Flash API.

MỤC TIÊU NGƯỜI DÙNG: Bố mẹ lớn tuổi — giao diện phải cực kỳ đơn giản, 
chữ to (min 16px), nút bấm to (min 48px height), tránh thuật ngữ kỹ thuật.

SUPABASE TABLES:
- income: id, amount(numeric), person('bo'|'me'), note, date, created_at, updated_at
- expense: id, amount(numeric), category(enum), note, date, created_at, updated_at
- tasks: id, title, description, due_date, is_completed, priority, category, created_at
- appointments: id, title, description, date, lunar_date, time, reminder_days, created_at

FORMAT TIỀN: Luôn format theo VNĐ: 1.500.000 đ (dùng toLocaleString('vi-VN'))
FONT: Be Vietnam Pro từ Google Fonts
MÀU: Thu nhập = #16a34a (xanh lá), Chi tiêu = #dc2626 (đỏ), Primary = #0ea5e9 (xanh dương)

Khi tôi yêu cầu, hãy:
1. Tạo TypeScript interfaces đúng với schema trên
2. Tạo custom hook đầy đủ CRUD với Supabase (có error handling)
3. Tạo UI component responsive, mobile-first
4. Luôn có loading state, empty state, error state
5. Dùng toast (Sonner) cho feedback sau mỗi action

Hiểu rõ yêu cầu chưa? Hãy bắt đầu với Bước 0.
```

---

## 📅 Timeline Gợi Ý

| Ngày | Bước | Tính năng |
|------|------|-----------|
| 1 | 0 + 1 | Setup dự án, Database, Layout |
| 2 | 2 + 3 | Dashboard, Thu nhập CRUD |
| 3 | 4 | Chi tiêu CRUD |
| 4 | 5 | Thống kê biểu đồ |
| 5 | 6 | Lịch theo ngày |
| 6 | 7 | Tasks + Lịch âm + Ngày lễ |
| 7 | 8 | AI Chat Gemini |
| 8 | 9 | Tối ưu, test, deploy |

---

## 🚢 Deploy

```bash
# Build
npm run build

# Deploy Vercel (recommended)
npx vercel --prod

# Cấu hình env trên Vercel Dashboard:
# VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_GEMINI_API_KEY
```

---

## ✅ Checklist Kiểm Tra Trước Khi Bàn Giao

- [ ] Tất cả form validation hoạt động (không cho nhập số âm, bắt buộc điền đủ)
- [ ] CRUD hoàn chỉnh cho Income, Expense, Tasks, Appointments
- [ ] Biểu đồ hiển thị đúng dữ liệu, responsive
- [ ] Lịch hiển thị đúng thu chi từng ngày
- [ ] AI Chat trả lời được bằng tiếng Việt
- [ ] Test trên điện thoại thật (không chỉ DevTools)
- [ ] Chữ đủ to, nút đủ lớn cho người lớn tuổi
- [ ] Format tiền VNĐ đúng ở mọi nơi
- [ ] Xóa luôn có confirm dialog
- [ ] Toast thông báo sau mỗi thao tác

---

*README này được tạo cho dự án Family Finance Manager — phiên bản 1.0*
