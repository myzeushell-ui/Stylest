// Плейсхолдер клиента Supabase. На старте приложение работает локально-первым
// способом (данные в localStorage через Zustand persist, PWA-офлайн). Когда
// поднимем self-hosted Supabase, сюда придёт реальный клиент @supabase/supabase-js.
//
// ДОПУЩЕНИЕ: не тянем зависимость @supabase/supabase-js, пока нет живого
// инстанса — чтобы проект собирался и запускался без внешней инфраструктуры.

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && anonKey);

// TODO(v2): when supabaseConfigured →
//   import { createClient } from '@supabase/supabase-js';
//   export const supabase = createClient(url!, anonKey!);
export const supabase = null as unknown;
