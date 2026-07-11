-- Chạy toàn bộ file này trong Supabase Dashboard → SQL Editor → New query → Run.
-- An toàn để chạy lại nhiều lần (dùng "if not exists").

create table if not exists products (
  id text primary key,
  name text not null default '',
  tagline text not null default '',
  category text not null default '',
  price text not null default '',
  rating text not null default '',
  image text,
  description text not null default '',
  features jsonb not null default '[]',
  usage_steps jsonb not null default '[]',
  pricing_tiers jsonb not null default '[]',
  software_file text,
  software_file_name text,
  software_file_size text,
  external_download_url text not null default '',
  is_new boolean not null default false,
  trial_days integer not null default 0,
  version text not null default '',
  guide_url text not null default '',
  created_at timestamptz not null default now()
);

-- Bảng nội dung trang chủ/liên hệ — luôn chỉ có đúng 1 dòng (id = 1).
create table if not exists site_content (
  id integer primary key default 1,
  hero jsonb not null default '{}',
  contact jsonb not null default '{}',
  constraint site_content_singleton check (id = 1)
);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  message text not null,
  submitted_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  product_name text not null,
  email text not null,
  amount integer not null,
  status text not null default 'pending' check (status in ('pending', 'paid')),
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  gateway_transaction_id text
);

-- Mật khẩu quản trị (dạng hash) — đổi được ngay từ /admin, không cần sửa
-- ADMIN_PASSWORD trong biến môi trường + deploy lại nữa. Bảng chỉ có đúng 1 dòng.
create table if not exists admin_settings (
  id integer primary key default 1,
  password_hash text,
  constraint admin_settings_singleton check (id = 1)
);

-- Thư viện Prompt tham khảo (tab riêng trong /admin, tách khỏi bảng products vì
-- không có giá/ảnh/file tải về — chỉ có nội dung template để copy).
create table if not exists prompts (
  id text primary key,
  title text not null default '',
  description text not null default '',
  category text not null default '',
  tools jsonb not null default '[]',
  is_new boolean not null default false,
  template text not null default '',
  created_at timestamptz not null default now()
);

-- Bật Row Level Security và KHÔNG thêm policy nào — chặn hoàn toàn truy cập qua
-- anon/public key. Server luôn dùng service role key (bỏ qua RLS) nên vẫn hoạt động bình thường.
alter table products enable row level security;
alter table site_content enable row level security;
alter table contacts enable row level security;
alter table orders enable row level security;
alter table admin_settings enable row level security;
alter table prompts enable row level security;

-- Dòng nội dung mặc định cho site_content nếu bảng đang trống (server sẽ ghi đè giá trị
-- thật qua trang /admin, đây chỉ là để tránh lỗi "không tìm thấy dòng" trong lần chạy đầu).
insert into site_content (id, hero, contact)
values (1, '{}', '{}')
on conflict (id) do nothing;
