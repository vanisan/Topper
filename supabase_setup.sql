
-- ... (існуючий код sql) ...

-- Додавання колонок для системи лайків
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'public.profiles'::regclass AND attname = 'availableLikes') THEN
        ALTER TABLE public.profiles ADD COLUMN "availableLikes" integer DEFAULT 0 NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'public.profiles'::regclass AND attname = 'lastRechargeAt') THEN
        ALTER TABLE public.profiles ADD COLUMN "lastRechargeAt" timestamp with time zone DEFAULT '1970-01-01' NOT NULL;
    END IF;
END $$;

-- Оновлення handle_new_user для підтримки нових колонок
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    login,
    name,
    "avatarUrl",
    age,
    location,
    hobbies,
    "aboutMe",
    "relationshipStatus",
    balance,
    "availableLikes",
    "lastRechargeAt"
  )
  values (
    new.id,
    lower(new.raw_user_meta_data->>'login'),
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'avatarUrl',
    (new.raw_user_meta_data->>'age')::integer,
    new.raw_user_meta_data->>'location',
    (new.raw_user_meta_data->'hobbies'),
    new.raw_user_meta_data->>'aboutMe',
    new.raw_user_meta_data->>'relationshipStatus',
    0,
    0,
    '1970-01-01'
  );
  return new;
end;
$$;
