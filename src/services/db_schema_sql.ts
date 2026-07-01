/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const SUPABASE_SQL_SCHEMA = `-- ============================================================================
-- PERMISO: STUDENTS PERMISSION & ABSENCE MANAGEMENT DATABASE SCHEMA (SUPABASE)
-- ============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create ENUM types for status and roles
create type user_role as enum ('admin', 'teacher', 'student');
create type attendance_status as enum ('present', 'absent', 'late');
create type leave_type as enum ('sickness', 'compassionate', 'family_activity', 'school_duty', 'other');
create type leave_status as enum ('pending', 'approved', 'rejected');

-- 1. DEPARTMENTS TABLE
create table public.departments (
    id uuid default gen_random_uuid() primary key,
    department_name text not null unique,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. USERS TABLE (Linked with Supabase Auth auth.users via foreign key trigger)
create table public.users (
    id uuid references auth.users on delete cascade primary key,
    fullname text not null,
    email text not null unique,
    role user_role not null default 'student',
    avatar_url text,
    phone text,
    status text not null check (status in ('active', 'inactive')) default 'active',
    onboarding_completed boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. TEACHERS TABLE
create table public.teachers (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null unique,
    department_id uuid references public.departments(id) on delete set null,
    specialization text
);

-- 4. CLASSES TABLE
create table public.classes (
    id uuid default gen_random_uuid() primary key,
    class_name text not null,
    department_id uuid references public.departments(id) on delete cascade not null,
    advisor_teacher_id uuid references public.users(id) on delete set null,
    academic_year text not null,
    unique (class_name, academic_year)
);

-- 5. STUDENTS TABLE
create table public.students (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null unique,
    student_id text not null unique, -- school numerical registration number
    class_id uuid references public.classes(id) on delete set null,
    department_id uuid references public.departments(id) on delete set null,
    enrollment_year integer not null,
    status text not null check (status in ('active', 'suspended', 'graduated')) default 'active'
);

-- 6. ATTENDANCE TABLE
create table public.attendance (
    id uuid default gen_random_uuid() primary key,
    student_id uuid references public.users(id) on delete cascade not null, -- points to student's user_id
    class_id uuid references public.classes(id) on delete cascade not null,
    attendance_date date not null default current_date,
    status attendance_status not null default 'present',
    checked_by uuid references public.users(id) on delete set null, -- teacher user_id
    remarks text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (student_id, class_id, attendance_date)
);

-- 7. PERMISSION_REQUESTS TABLE
create table public.permission_requests (
    id uuid default gen_random_uuid() primary key,
    student_id uuid references public.users(id) on delete cascade not null, -- points to student user_id
    request_type leave_type not null,
    reason text not null,
    attachment_url text, -- Supabase storage URL for uploaded files
    start_date date not null,
    end_date date not null,
    status leave_status not null default 'pending',
    approved_by uuid references public.users(id) on delete set null, -- approving teacher user_id
    rejection_reason text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    check (start_date <= end_date)
);

-- 8. NOTIFICATIONS TABLE
create table public.notifications (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    title text not null,
    message text not null,
    type text not null check (type in ('info', 'success', 'warning', 'alert')) default 'info',
    is_read boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. ACTIVITY_LOGS TABLE
create table public.activity_logs (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete set null,
    action text not null,
    description text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================================================
-- PERFORMANCE OPTIMIZING INDEXES
-- ============================================================================
create index idx_attendance_date_student on public.attendance (attendance_date, student_id);
create index idx_attendance_class on public.attendance (class_id);
create index idx_permission_student on public.permission_requests (student_id);
create index idx_permission_status on public.permission_requests (status);
create index idx_notifications_user_read on public.notifications (user_id, is_read);
create index idx_students_class on public.students (class_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.departments enable row level security;
alter table public.classes enable row level security;
alter table public.students enable row level security;
alter table public.teachers enable row level security;
alter table public.attendance enable row level security;
alter table public.permission_requests enable row level security;
alter table public.notifications enable row level security;
alter table public.activity_logs enable row level security;

-- USERS POLICIES
create policy "Allow public read access to active users"
    on public.users for select
    using (true);

create policy "Allow direct insert of users for simulator / onboarding"
    on public.users for insert
    with check (true);

create policy "Allow users to update their own record"
    on public.users for update
    using (auth.uid() = id)
    with check (auth.uid() = id);

create policy "Allow admins to update any record"
    on public.users for update
    using (exists (
        select 1 from public.users where id = auth.uid() and role = 'admin'
    ));

-- STUDENTS & TEACHERS POLICIES
create policy "Allow read access to students for all users"
    on public.students for select using (true);

create policy "Allow insert/modify on students for simulation"
    on public.students for all using (true) with check (true);

create policy "Allow read access to teachers for all users"
    on public.teachers for select using (true);

create policy "Allow insert/modify on teachers for simulation"
    on public.teachers for all using (true) with check (true);

-- DEPARTMENTS & CLASSES POLICIES (Read for all, write for admin/simulation)
create policy "Allow read access to departments"
    on public.departments for select using (true);

create policy "Allow write access to departments"
    on public.departments for all using (true) with check (true);

create policy "Allow read access to classes for all users"
    on public.classes for select using (true);

create policy "Allow class edits for admins & simulation"
    on public.classes for all using (true) with check (true);

-- ATTENDANCE POLICIES
create policy "Allow all users to perform attendance actions for simulation"
    on public.attendance for all using (true) with check (true);

-- PERMISSION REQUEST POLICIES
create policy "Allow students and teachers to create and view permission requests"
    on public.permission_requests for all using (true) with check (true);

-- NOTIFICATIONS POLICIES
create policy "Allow direct read, insert, and update on notifications for all users"
    on public.notifications for all using (true) with check (true);

-- ACTIVITY LOGS POLICIES
create policy "Allow direct read and insert on activity logs for all users"
    on public.activity_logs for all using (true) with check (true);

-- ============================================================================
-- HELPER TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function to handle public.users registration on auth.users sign-up
create or replace function public.handle_new_user()
returns trigger as $$
declare
  user_role_str text;
  final_role user_role;
begin
  -- Safely extract and check role
  user_role_str := lower(coalesce(new.raw_user_meta_data->>'role', ''));
  if user_role_str = 'admin' then
    final_role := 'admin'::user_role;
  elseif user_role_str = 'teacher' then
    final_role := 'teacher'::user_role;
  else
    final_role := 'student'::user_role;
  end if;

  insert into public.users (id, fullname, email, role, avatar_url, phone, status)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'fullname',
      new.raw_user_meta_data->>'full_name',
      'New User'
    ),
    new.email,
    final_role,
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'phone',
    'active'
  )
  on conflict (id) do update set
    fullname = excluded.fullname,
    email = excluded.email;
  return new;
exception
  when others then
    -- Catch all exceptions so auth sign up NEVER fails
    return new;
end;
$$ language plpgsql security definer;

-- Trigger to create user on auth sign up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger for public.users updated_at field update
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_users_updated_at
  before update on public.users
  for each row execute procedure public.handle_updated_at();

-- ============================================================================
-- STORAGE BUCKETS CONFIGURATION (Supabase Storage)
-- ============================================================================
-- Insert statement to initialize the bucket "attachments"
-- insert into storage.buckets (id, name, public) values ('attachments', 'attachments', true);

-- Storage security policies
-- create policy "Allow public viewing of attachments"
--   on storage.objects for select using (bucket_id = 'attachments');

-- create policy "Allow authenticated users to upload attachments"
--   on storage.objects for insert with check (
--     bucket_id = 'attachments' and auth.role() = 'authenticated'
--   );
`;
