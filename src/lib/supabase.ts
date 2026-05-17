import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ─────────────────────────────────────────────────────────
// Cliente público — para uso em Client Components e auth
// Usa a anon key, sujeito às políticas RLS do Supabase
// ─────────────────────────────────────────────────────────
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─────────────────────────────────────────────────────────
// Cliente Admin — SOMENTE para operações que PRECISAM
// bypassar RLS: criação de usuário (checkout), auth.ts
// NUNCA use para ler/escrever dados de tenant
// ─────────────────────────────────────────────────────────
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// ─────────────────────────────────────────────────────────
// Factory de cliente autenticado — para Server Actions
// Injeta o JWT do usuário para que o RLS seja aplicado
// Cada requisição usa a identidade real do usuário logado
// ─────────────────────────────────────────────────────────
export function createSupabaseServerClient(accessToken: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
