
import { createClient } from '@supabase/supabase-js';

// Дані для підключення до вашого проєкту Supabase
const supabaseUrl = 'https://coeajlbihzfttvidkpuf.supabase.co';
const supabaseKey = 'sb_publishable_a5GYf6va3ZF7PfUW8Jitfw_GqSeA2M0';

if (!supabaseUrl) {
    const message = "Supabase URL не вказано у файлі supabaseClient.ts";
    console.error(message);
    alert(message);
}

if (!supabaseKey) {
    const message = "Supabase Key не вказано у файлі supabaseClient.ts";
    console.error(message);
    alert(message);
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        // Увімкнення збереження сесії. Це дозволяє користувачам залишатися
        // в системі навіть після закриття браузера чи вкладки.
        // Supabase за замовчуванням використовує localStorage для цього.
        persistSession: true,
        
        // Автоматичне оновлення токена доступу, щоб сесія не переривалася.
        autoRefreshToken: true,
        
        // Дозволяє виявляти сесію в URL (корисно для посилань відновлення пароля тощо).
        detectSessionInUrl: true,
    },
});
