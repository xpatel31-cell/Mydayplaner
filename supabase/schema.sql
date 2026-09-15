create table availability (
  id uuid primary key default gen_random_uuid(),
  day_of_week int not null,
  start_time time not null,
  end_time time not null,
  created_at timestamp with time zone default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  due_date date,
  priority int not null default 2,
  duration_minutes int not null default 30,
  completed boolean not null default false,
  scheduled_start timestamp with time zone,
  created_at timestamp with time zone default now()
);

create index tasks_priority_due_idx on tasks (priority, due_date);
