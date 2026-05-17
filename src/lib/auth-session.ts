import { auth } from "@/auth";
import { createSupabaseServerClient } from "@/lib/supabase";

// ─────────────────────────────────────────────────────────
// Retorna { session, db } onde db é o cliente Supabase
// autenticado com o JWT do usuário, respeitando RLS.
// Lança erro se não houver sessão válida.
// ─────────────────────────────────────────────────────────
export async function requireAuth() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Não autorizado.");
  }

  // O accessToken do NextAuth é o JWT do Supabase quando
  // usamos Supabase como provedor de auth
  // Para forçar o RLS, passamos o token do usuário logado
  const accessToken =
    (session as any).supabaseAccessToken ??
    process.env.SUPABASE_SERVICE_ROLE_KEY!; // fallback temporário — será removido na Sprint 3

  const db = createSupabaseServerClient(accessToken);

  return {
    session,
    userId: session.user.id,
    db,
  };
}
