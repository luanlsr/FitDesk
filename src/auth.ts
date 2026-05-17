import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

if (!process.env.AUTH_SECRET) {
  throw new Error(
    "[FitDesk] AUTH_SECRET não configurado. Gere um segredo forte com: openssl rand -base64 32"
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 horas (reduzido de 30 dias por segurança)
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // Usa o client Anon nativo do Supabase como solicitado
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: authData, error: authError } =
          await supabase.auth.signInWithPassword({
            email: credentials.email as string,
            password: credentials.password as string,
          });

        if (authError || !authData.user) {
          console.error("[AuthDebug] Erro no Supabase Auth:", authError?.message);
          return null;
        }

        // Busca perfil público
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (!profile) {
          console.error("[AuthDebug] Perfil público não encontrado.");
          return null;
        }

        console.log("[AuthDebug] Perfil encontrado com sucesso! Retornando sessão para:", profile.name);

        const lgpdConsent = credentials.lgpdConsent === "true";
        if (lgpdConsent) {
          await supabase.from('users').update({
            lgpd_consent_at: new Date().toISOString(),
            lgpd_consent_version: 'v1.0'
          }).eq('id', profile.id);
        }

        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
