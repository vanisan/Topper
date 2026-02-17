
-- ### SETUP SCRIPT FOR TOPPER SOCIAL NETWORK ###
--
-- Інструкція:
-- 1. Перейдіть до вашого проєкту в Supabase.
-- 2. В меню зліва оберіть "SQL Editor".
-- 3. Натисніть "New query".
-- 4. Вставте весь цей код у вікно редактора.
-- 5. Натисніть "RUN".
--
-- Цей скрипт налаштує все необхідне для роботи додатку.

-- 1. СТВОРЕННЯ ТАБЛИЦІ PROFILES
-- Ця таблиця буде зберігати публічну інформацію про користувачів.
-- Вона пов'язана з таблицею `auth.users` через `id`.
CREATE TABLE public.profiles (
    id uuid NOT NULL,
    login text NOT NULL,
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

-- Коментарі до таблиці для ясності
COMMENT ON TABLE public.profiles IS 'Stores user profile information.';


-- 2. СТВОРЕННЯ ТАБЛИЦІ MESSAGES
-- Тут зберігатимуться повідомлення між користувачами.
CREATE TABLE public.messages (
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

-- Правила для profiles:
-- 1) Дозволити всім автентифікованим користувачам читати всі профілі.
CREATE POLICY "Allow authenticated users to read profiles" ON public.profiles
    FOR SELECT USING (auth.role() = 'authenticated');

-- 2) Дозволити користувачам створювати свій власний профіль.
CREATE POLICY "Allow users to insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 3) Дозволити користувачам оновлювати лише свій власний профіль.
CREATE POLICY "Allow users to update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Вмикаємо RLS для таблиці messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Правила для messages:
-- 1) Дозволити користувачам читати повідомлення, де вони є відправником або отримувачем.
CREATE POLICY "Allow users to read their own messages" ON public.messages
    FOR SELECT USING (auth.uid() = "senderId" OR auth.uid() = "receiverId");

-- 2) Дозволити користувачам створювати (відправляти) повідомлення від свого імені.
CREATE POLICY "Allow users to send messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = "senderId");


-- 4. НАЛАШТУВАННЯ REALTIME ДЛЯ ПОВІДОМЛЕНЬ
-- Supabase використовує "publications" для трансляції змін.
-- Додамо таблицю messages до стандартної публікації, щоб чат оновлювався в реальному часі.
-- Примітка: Зазвичай Supabase робить це автоматично для нових таблиць, але для надійності пропишемо це явно.
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;


-- ### КІНЕЦЬ СКРИПТУ ###
-- Налаштування завершено! Можна повертатися до додатку.
