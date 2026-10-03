-- جدول الطلبات — انسخ الكلام ده كله والصقه في Supabase > SQL Editor > Run
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_no text not null,
  mode text not null,            -- full | deposit | quote
  items jsonb not null default '[]',
  total numeric not null default 0,
  due numeric not null default 0,
  status text not null default 'new', -- new | confirmed | in_production | ready | delivered
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- كل عميل يشوف ويضيف طلباته هو بس
create policy "own orders read" on public.orders
  for select using (auth.uid() = user_id);
create policy "own orders insert" on public.orders
  for insert with check (auth.uid() = user_id);
