-- Shop tables for accounts, stock, carts, and orders.
-- Run this in the Supabase SQL editor, or with the Supabase CLI.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  full_name text,
  phone text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  price numeric(12, 2) not null check (price >= 0),
  department text not null check (department in ('sneakers', 'clothing', 'accessories')),
  category text not null,
  image text not null,
  hover_image text not null,
  color text,
  featured boolean not null default false,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.stock (
  product_id text not null references public.products (id) on delete cascade,
  size text not null,
  quantity integer not null default 0 check (quantity >= 0),
  primary key (product_id, size)
);

create table if not exists public.cart_items (
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id text not null references public.products (id) on delete cascade,
  size text not null,
  quantity integer not null check (quantity > 0),
  primary key (user_id, product_id, size)
);

create sequence if not exists public.order_number_seq start 1001;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  number text unique,
  status text not null default 'unpaid' check (status in ('unpaid', 'paid', 'failed')),
  total numeric(12, 2) not null check (total >= 0),
  email text,
  recipient_name text not null,
  address_line text not null,
  city text not null,
  phone text not null,
  payment_ref text unique,
  payment_state text,
  stock_applied boolean not null default false,
  failure_reason text,
  email_sent boolean not null default false,
  sms_sent boolean not null default false,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.order_lines (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id text not null,
  name text not null,
  size text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price >= 0)
);

create table if not exists public.notify_log (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders (id) on delete cascade,
  channel text not null,
  ok boolean not null,
  detail text,
  created_at timestamptz not null default now()
);

create or replace function public.assign_order_number()
returns trigger
language plpgsql
as $$
begin
  if new.number is null or new.number = '' then
    new.number := 'NO-' || nextval('public.order_number_seq');
  end if;
  return new;
end;
$$;

drop trigger if exists orders_assign_number on public.orders;
create trigger orders_assign_number
  before insert on public.orders
  for each row execute function public.assign_order_number();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email, 'shopper'), '@', 1)),
    new.raw_user_meta_data->>'phone',
    'customer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Paid once. A repeated success callback returns false and does not touch stock again.
create or replace function public.apply_paid_order(target uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  ord public.orders%rowtype;
  line record;
begin
  select * into ord from public.orders where id = target for update;
  if not found then
    return false;
  end if;
  if ord.status = 'paid' or ord.stock_applied then
    return false;
  end if;

  for line in select * from public.order_lines where order_id = ord.id loop
    update public.stock
      set quantity = greatest(quantity - line.quantity, 0)
      where product_id = line.product_id and size = line.size;
  end loop;

  update public.orders
    set status = 'paid', stock_applied = true, paid_at = now(), failure_reason = null
    where id = ord.id;
  return true;
end;
$$;

create or replace function public.mark_order_failed(target uuid, reason text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  ord public.orders%rowtype;
begin
  select * into ord from public.orders where id = target for update;
  if not found then
    return false;
  end if;
  if ord.status = 'paid' or ord.stock_applied then
    return false;
  end if;
  update public.orders
    set status = 'failed', failure_reason = reason
    where id = ord.id;
  return true;
end;
$$;

revoke all on function public.apply_paid_order(uuid) from public, anon, authenticated;
revoke all on function public.mark_order_failed(uuid, text) from public, anon, authenticated;
grant execute on function public.apply_paid_order(uuid) to service_role;
grant execute on function public.mark_order_failed(uuid, text) to service_role;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.stock enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_lines enable row level security;
alter table public.notify_log enable row level security;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select p.role from public.profiles p where p.id = auth.uid())
  );

drop policy if exists products_read on public.products;
create policy products_read on public.products
  for select using (hidden = false or public.is_admin());

drop policy if exists products_admin on public.products;
create policy products_admin on public.products
  for all using (public.is_admin())
  with check (public.is_admin());

drop policy if exists stock_read on public.stock;
create policy stock_read on public.stock
  for select using (true);

drop policy if exists stock_admin on public.stock;
create policy stock_admin on public.stock
  for all using (public.is_admin())
  with check (public.is_admin());

drop policy if exists cart_own on public.cart_items;
create policy cart_own on public.cart_items
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists orders_read on public.orders;
create policy orders_read on public.orders
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists orders_insert on public.orders;
create policy orders_insert on public.orders
  for insert with check (user_id = auth.uid() and status = 'unpaid');

drop policy if exists lines_read on public.order_lines;
create policy lines_read on public.order_lines
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists lines_insert on public.order_lines;
create policy lines_insert on public.order_lines
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid() and o.status = 'unpaid'
    )
  );
