-- لوحة التحكم (المرحلة 1) — شغّل الملف ده بعد schema.sql
-- Supabase > SQL Editor > الصق الكلام ده كله > Run  (ينفع يتشغّل أكتر من مرة عادي)

-- 1) بيانات زيادة على الطلبات: بيانات العميل، التصنيع (عندنا / ورشة)، ميعاد التسليم
alter table public.orders alter column user_id drop not null; -- طلبات الزوار والطلبات اليدوية ملهاش حساب
alter table public.orders
  add column if not exists customer_name text,
  add column if not exists customer_phone text,
  add column if not exists company text,
  add column if not exists address text,
  add column if not exists notes text,
  add column if not exists source text not null default 'site', -- site | manual
  add column if not exists production text,                     -- in_house | workshop
  add column if not exists workshop_name text,
  add column if not exists workshop_cost numeric not null default 0,
  add column if not exists due_date date,
  add column if not exists admin_notes text;

-- 2) الأدمن: الحسابات اللي ليها تدخل لوحة التحكم
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admins enable row level security; -- مفيش policies = محدش يقراه غير الدالة اللي تحت

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- الأدمن يشوف ويعدّل ويمسح كل الطلبات (العميل لسه بيشوف طلباته هو بس)
drop policy if exists "admin orders all" on public.orders;
create policy "admin orders all" on public.orders
  for all using (public.is_admin()) with check (public.is_admin());

-- 3) الدفعات: كل فلوس بتتحصّل على طلب
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  amount numeric not null check (amount > 0),
  method text,             -- cash | instapay | vodafone_cash | bank | other
  note text,
  paid_at date not null default current_date,
  created_at timestamptz not null default now()
);
alter table public.payments enable row level security;

drop policy if exists "admin payments all" on public.payments;
create policy "admin payments all" on public.payments
  for all using (public.is_admin()) with check (public.is_admin());

-- 4) خلّي حسابك أدمن: اعمل حساب من صفحة "حسابي" في الموقع الأول،
--    وبعدين غيّر الإيميل في السطر ده وشغّله لوحده:
-- insert into public.admins (user_id) select id from auth.users where email = 'your@email.com' on conflict do nothing;
