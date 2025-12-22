-- Migration: create domain tables referenced by frontend UI
-- Timestamp: 2025-12-11 13:00:00

create extension if not exists pgcrypto;

-- Enums
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM (
      'super_admin','sales_officer','field_officer','mdo','regional_manager','zonal_manager','warehouse_manager','manufacturing_manager','qc_analyst','finance_officer','hr_manager','rnd_manager','executive'
    );
  END IF;
END$$;

-- Regions
create table if not exists public.regions (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  name text not null,
  zone text,
  created_at timestamptz default now()
);

-- Warehouses
create table if not exists public.warehouses (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  name text not null,
  address text,
  city text,
  region_id uuid references public.regions (id) on delete set null,
  capacity integer,
  manager_id uuid references public.employees (id) on delete set null,
  status text,
  created_at timestamptz default now()
);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text,
  category text,
  description text,
  price numeric not null default 0,
  cost numeric,
  min_stock_level integer,
  status text,
  unit text,
  created_at timestamptz default now()
);

-- Production batches
create table if not exists public.production_batches (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products (id) on delete restrict,
  batch_number text not null,
  planned_quantity integer not null,
  actual_quantity integer,
  cost_per_unit numeric,
  total_cost numeric,
  start_date date,
  end_date date,
  status text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- QC Tests
create table if not exists public.qc_tests (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references public.production_batches (id) on delete cascade,
  test_type text not null,
  parameters jsonb,
  result text,
  passed boolean,
  attachments jsonb,
  approved_by uuid references auth.users (id) on delete set null,
  tested_by uuid references auth.users (id) on delete set null,
  test_date timestamptz,
  created_at timestamptz default now()
);

-- Stocks
create table if not exists public.stocks (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products (id) on delete restrict,
  warehouse_id uuid references public.warehouses (id) on delete restrict,
  quantity numeric default 0,
  batch_number text,
  expiry_date date,
  status text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Dealers
create table if not exists public.dealers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business_name text,
  address text,
  city text,
  state text,
  region_id uuid references public.regions (id) on delete set null,
  phone text,
  email text,
  kyc_documents jsonb,
  kyc_status text,
  outstanding_balance numeric default 0,
  credit_limit numeric,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null,
  dealer_id uuid references public.dealers (id) on delete restrict,
  created_by uuid references auth.users (id) on delete set null,
  order_date date,
  expected_delivery date,
  net_amount numeric,
  discount_amount numeric,
  tax_amount numeric,
  total_amount numeric,
  payment_status text,
  status text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete restrict,
  quantity numeric not null,
  unit_price numeric not null,
  discount_percent numeric,
  total_price numeric not null,
  created_at timestamptz default now()
);

-- Invoices
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null,
  order_id uuid references public.orders (id) on delete set null,
  dealer_id uuid references public.dealers (id) on delete restrict,
  invoice_date date,
  due_date date,
  subtotal numeric not null,
  tax_amount numeric,
  total_amount numeric not null,
  paid_amount numeric,
  status text,
  created_at timestamptz default now()
);

-- Payments
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid references public.dealers (id) on delete restrict,
  invoice_id uuid references public.invoices (id) on delete set null,
  amount numeric not null,
  payment_date date,
  payment_method text,
  reference_number text,
  notes text,
  created_at timestamptz default now()
);

-- Employees
create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  employee_code text not null,
  full_name text not null,
  email text,
  phone text,
  department text,
  designation text,
  date_of_joining date,
  salary numeric,
  bank_account text,
  status text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Attendance
create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references public.employees (id) on delete cascade,
  date date not null,
  check_in timestamptz,
  check_out timestamptz,
  status text,
  notes text,
  created_at timestamptz default now()
);

-- Leaves
create table if not exists public.leaves (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references public.employees (id) on delete cascade,
  leave_type text not null,
  start_date date not null,
  end_date date not null,
  reason text,
  status text,
  approved_by uuid references public.employees (id) on delete set null,
  created_at timestamptz default now()
);

-- Farmers
CREATE TABLE public.farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INTEGER,
  phone TEXT,
  village TEXT,
  district TEXT,
  state TEXT,
  farm_size_acres DECIMAL(10, 2),
  irrigation_type TEXT,
  land_type TEXT,
  soil_type TEXT,
  crops JSONB NOT NULL DEFAULT '[]'::jsonb,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Field visits
create table if not exists public.field_visits (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references public.employees (id) on delete set null,
  farmer_id uuid references public.farmers (id) on delete set null,
  visit_date date not null,
  visit_type text,
  purpose text,
  location text,
  gps_lat numeric,
  gps_lng numeric,
  outcome text,
  issues_reported text,
  photos jsonb,
  created_at timestamptz default now()
);

-- Trials
create table if not exists public.trials (
  id uuid primary key default gen_random_uuid(),
  trial_code text not null,
  name text not null,
  product_id uuid references public.products (id) on delete set null,
  objectives text,
  documents jsonb,
  start_date date,
  end_date date,
  status text,
  budget numeric,
  spent numeric,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Campaigns
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned',
  start_date DATE,
  end_date DATE,
  budget NUMERIC,
  spent NUMERIC,
  target NUMERIC,
  achieved NUMERIC,
  area TEXT,
  campaign_run_by TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- Notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  title text not null,
  message text not null,
  link text,
  type text,
  read boolean default false,
  created_at timestamptz default now()
);

-- User roles
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz default now()
);

-- Audit logs
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  record_id text,
  action text not null,
  user_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz default now()
);

-- Basic functions used by types
create or replace function public.generate_order_number()
returns text language sql immutable as $$ select ('ORD-' || to_char(now(), 'YYYYMMDDHH24MISS') || '-' || substr(md5(random()::text),1,6)) $$;

create or replace function public.has_role(_role public.app_role, _user_id uuid)
returns boolean language sql stable as $$ select exists (select 1 from public.user_roles ur where ur.user_id = _user_id and ur.role = _role) $$;

-- Indexes
create index if not exists idx_products_sku on public.products (sku);
create index if not exists idx_orders_dealer_id on public.orders (dealer_id);
create index if not exists idx_stocks_product_warehouse on public.stocks (product_id, warehouse_id);

-- Enable RLS and add simple owner-based policies for tables with created_by/user_id/owner_id
-- We'll allow authenticated inserts and owner-only updates/deletes; selects allowed for owner or public if no owner column

-- Helper to enable RLS and basic policies
-- Regions (public)
alter table public.regions enable row level security;
create policy if not exists "regions_select_public" on public.regions for select using (true);

-- For tables with created_by
DO $$
BEGIN
  PERFORM 1;
EXCEPTION WHEN undefined_table THEN
  -- noop
END$$;

-- Apply RLS for several tables
-- A small set of owner-based policies
-- For tables that have created_by
alter table public.production_batches enable row level security;
create policy if not exists "prod_batches_insert_auth" on public.production_batches for insert using (auth.uid() is not null) with check (auth.uid() = created_by);
create policy if not exists "prod_batches_select_owner" on public.production_batches for select using (created_by = auth.uid());
create policy if not exists "prod_batches_update_owner" on public.production_batches for update using (created_by = auth.uid()) with check (created_by = auth.uid());

alter table public.trials enable row level security;
create policy if not exists "trials_insert_auth" on public.trials for insert using (auth.uid() is not null) with check (auth.uid() = created_by);
create policy if not exists "trials_select_owner" on public.trials for select using (created_by = auth.uid() OR created_by IS NULL);
create policy if not exists "trials_update_owner" on public.trials for update using (created_by = auth.uid()) with check (created_by = auth.uid());

-- Generic pattern for tables that reference auth.users as owner
-- For employees, orders, invoices, payments, dealers, campaigns, warehouses, products, stocks, qc_tests, orders, order_items, invoices, payments, farmers, field_visits, attendance, leaves, notifications, user_roles, audit_logs

-- Enable RLS for these and allow authenticated inserts; selects restricted to owner/creator where applicable
alter table public.dealers enable row level security;
create policy if not exists "dealers_insert_auth" on public.dealers for insert using (auth.uid() is not null) with check (auth.uid() = created_by OR created_by IS NULL);
create policy if not exists "dealers_select" on public.dealers for select using (created_by = auth.uid() OR created_by IS NULL);
create policy if not exists "dealers_update_owner" on public.dealers for update using (created_by = auth.uid()) with check (created_by = auth.uid());

alter table public.orders enable row level security;
create policy if not exists "orders_insert_auth" on public.orders for insert using (auth.uid() is not null) with check (auth.uid() = created_by);
create policy if not exists "orders_select_owner" on public.orders for select using (created_by = auth.uid() OR dealer_id IN (select id from public.dealers d where d.created_by = auth.uid()));
create policy if not exists "orders_update_owner" on public.orders for update using (created_by = auth.uid()) with check (created_by = auth.uid());

alter table public.order_items enable row level security;
create policy if not exists "order_items_insert_auth" on public.order_items for insert using (auth.uid() is not null);
create policy if not exists "order_items_select" on public.order_items for select using (exists(select 1 from public.orders o where o.id = public.order_items.order_id and (o.created_by = auth.uid())));

alter table public.invoices enable row level security;
create policy if not exists "invoices_insert_auth" on public.invoices for insert using (auth.uid() is not null);
create policy if not exists "invoices_select" on public.invoices for select using (dealer_id IN (select id from public.dealers d where d.created_by = auth.uid()) OR created_by = auth.uid());

alter table public.payments enable row level security;
create policy if not exists "payments_insert_auth" on public.payments for insert using (auth.uid() is not null);
create policy if not exists "payments_select" on public.payments for select using (dealer_id IN (select id from public.dealers d where d.created_by = auth.uid()) OR created_by = auth.uid());

alter table public.employees enable row level security;
create policy if not exists "employees_insert_auth" on public.employees for insert using (auth.uid() is not null);
create policy if not exists "employees_select" on public.employees for select using (user_id = auth.uid() OR true);

alter table public.notifications enable row level security;
create policy if not exists "notifications_insert_auth" on public.notifications for insert using (auth.uid() is not null) with check (auth.uid() = user_id);
create policy if not exists "notifications_select_user" on public.notifications for select using (user_id = auth.uid());

alter table public.user_roles enable row level security;
create policy if not exists "user_roles_insert_auth" on public.user_roles for insert using (auth.uid() is not null) with check (auth.uid() = user_id OR auth.role() = 'super_admin');
create policy if not exists "user_roles_select" on public.user_roles for select using (user_id = auth.uid() OR auth.role() = 'super_admin');

-- For simple public-read tables allow selects
alter table public.products enable row level security;
create policy if not exists "products_select_public" on public.products for select using (true);

alter table public.regions enable row level security;
create policy if not exists "regions_select_public" on public.regions for select using (true);

alter table public.warehouses enable row level security;
create policy if not exists "warehouses_select_public" on public.warehouses for select using (true);

-- Done
