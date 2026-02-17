
-- ### SETUP SCRIPT FOR TOPPER SOCIAL NETWORK ###
--
-- Інструкція:
-- 1. Перейдіть до вашого проєкту в Supabase.
-- 2. В меню зліва оберіть "SQL Editor".
-- 3. Натисніть "New query".
-- 4. Вставте весь цей код у вікно редактора.
-- 5. Натисніть "RUN".
--
-- Цей скрипт тепер безпечно запускати кілька разів.

-- 1. СТВОРЕННЯ ТАБЛИЦІ PROFILES
-- Ця таблиця буде зберігати публічну інформацію про користувачів.
-- Вона пов'язана з таблицею `auth.users` через `id`.
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL,
    login text NOT NULL UNIQUE,
    name text NOT NULL,
    "avatarUrl" text NULL,
    location text NULL,
    "likesReceived" integer DEFAULT 0 NOT NULL,
    "giftsReceived" jsonb DEFAULT '[]'::jsonb NOT NULL,
    "likesGiven" integer DEFAULT 0 NOT NULL,
    "likeTimestamps" jsonb DEFAULT '{}'::jsonb NOT NULL,
    "passiveRating" integer DEFAULT 0 NOT NULL,
    age integer NULL,
    hobbies jsonb NULL,
    "aboutMe" text NULL,
    "relationshipStatus" text NULL,
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Додавання колонки balance, якщо вона не існує
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'public.profiles'::regclass AND attname = 'balance') THEN
        ALTER TABLE public.profiles ADD COLUMN balance numeric NOT NULL DEFAULT 0;
    END IF;
END $$;


-- Коментарі до таблиці для ясності
COMMENT ON TABLE public.profiles IS 'Stores user profile information.';


-- 2. СТВОРЕННЯ ТАБЛИЦІ MESSAGES
-- Тут зберігатимуться повідомлення між користувачами.
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "senderId" uuid NOT NULL,
    "receiverId" uuid NOT NULL,
    text text NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT messages_pkey PRIMARY KEY (id),
    CONSTRAINT messages_receiverId_fkey FOREIGN KEY ("receiverId") REFERENCES public.profiles(id) ON DELETE CASCADE,
    CONSTRAINT messages_senderId_fkey FOREIGN KEY ("senderId") REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Коментарі до таблиці для ясності
COMMENT ON TABLE public.messages IS 'Stores chat messages between users.';


-- 3. НАЛАШТУВАННЯ БЕЗПЕКИ (ROW LEVEL SECURITY - RLS)
-- Це НАЙВАЖЛИВІША частина. Ці правила захищають дані користувачів.

-- Вмикаємо RLS для таблиці profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Видаляємо існуючі політики, щоб застосувати оновлені
DROP POLICY IF EXISTS "Allow authenticated users to read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;

-- Правила для profiles:
-- 1) Дозволити всім автентифікованим користувачам читати всі профілі.
CREATE POLICY "Allow authenticated users to read profiles" ON public.profiles
    FOR SELECT USING (auth.role() = 'authenticated');

-- 2) Дозволити користувачам оновлювати лише свій власний профіль.
CREATE POLICY "Allow users to update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Примітка: Створення профілів (INSERT) обробляється автоматичним тригером (див. розділ 5).

-- Вмикаємо RLS для таблиці messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Видаляємо існуючі політики, щоб застосувати оновлені
DROP POLICY IF EXISTS "Allow users to read their own messages" ON public.messages;
DROP POLICY IF EXISTS "Allow users to send messages" ON public.messages;

-- Правила для messages:
-- 1) Дозволити користувачам читати повідомлення, де вони є відправником або отримувачем.
CREATE POLICY "Allow users to read their own messages" ON public.messages
    FOR SELECT USING (auth.uid() = "senderId" OR auth.uid() = "receiverId");

-- 2) Дозволити користувачам створювати (відправляти) повідомлення від свого імені.
CREATE POLICY "Allow users to send messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = "senderId");


-- 4. НАЛАШТУВАННЯ REALTIME ДЛЯ ПОВІДОМЛЕНЬ
-- Примітка: Якщо ви запускаєте цей скрипт повторно, наступна команда може викликати помилку,
-- повідомляючи, що таблиця 'messages' вже є частиною публікації.
-- Це очікувано і безпечно ігнорувати.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;


-- 5. АВТОМАТИЧНЕ СТВОРЕННЯ ПРОФІЛЮ ДЛЯ НОВИХ КОРИСТУВАЧІВ
-- Ця функція та тригер автоматично створюють запис у `public.profiles`
-- щоразу, коли новий користувач реєструється в `auth.users`.

-- Функція, яка копіює дані з нового запису в auth.users до public.profiles
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
    balance
  )
  values (
    new.id,
    lower(new.raw_user_meta_data->>'login'), -- Get REAL login from metadata and convert to lowercase
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'avatarUrl',
    (new.raw_user_meta_data->>'age')::integer,
    new.raw_user_meta_data->>'location',
    (new.raw_user_meta_data->'hobbies'),
    new.raw_user_meta_data->>'aboutMe',
    new.raw_user_meta_data->>'relationshipStatus',
    0
  );
  return new;
end;
$$;

-- Тригер, який викликає функцію handle_new_user() після створення нового користувача
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 6. RPC FUNCTIONS
create or replace function public.send_gift_and_update_balance(
    sender_id uuid,
    receiver_id uuid,
    gift_cost numeric,
    gift_payload jsonb
)
returns text
language plpgsql
security definer -- Important!
as $$
declare
  sender_balance numeric;
begin
  -- Check sender's balance
  select balance into sender_balance from public.profiles where id = sender_id;
  if sender_balance is null or sender_balance < gift_cost then
    raise exception 'Insufficient balance';
  end if;

  -- Deduct cost from sender
  update public.profiles
  set balance = balance - gift_cost
  where id = sender_id;

  -- Add gift to receiver
  update public.profiles
  set "giftsReceived" = "giftsReceived" || gift_payload
  where id = receiver_id;

  return 'Gift sent successfully';
end;
$$;


-- ### КІНЕЦЬ СКРИПТУ ###
-- Налаштування завершено!