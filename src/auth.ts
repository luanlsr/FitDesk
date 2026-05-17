import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { supabaseAdmin } from "@/lib/supabase";

const authSecret = process.env.AUTH_SECRET || "fallback-secret-for-nextauth-build-only-32-chars";

if (!process.env.AUTH_SECRET && process.env.NODE_ENV === "production") {
  console.warn("⚠ [FitDesk] AUTH_SECRET não configurado no ambiente de produção. Usando fallback temporário para compilação.");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: authSecret,
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 horas (reduzido de 30 dias por segurança)
  },
  providers: [
    Credentials({
      name: "Login por E-mail",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
        lgpdConsent: { label: "LGPD", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("[AuthDebug] Credenciais incompletas.");
          return null;
        }

        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: authData, error: authError } =
          await supabase.auth.signInWithPassword({
            email: credentials.email as string,
            password: credentials.password as string,
          });

        if (authError || !authData.user || !authData.session) {
          console.error("[AuthDebug] Erro no Supabase Auth:", authError?.message);
          return null;
        }

        const accessToken = authData.session.access_token;
        if (!accessToken) {
          console.error("[AuthDebug] Supabase não retornou access token.");
          return null;
        }

        const { data: profile, error } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (error || !profile) {
          console.error("[AuthDebug] Perfil público não encontrado.", error?.message);
          return null;
        }

        console.log("[AuthDebug] Perfil encontrado com sucesso! Retornando sessão para:", profile.name);

        const lgpdConsent = credentials.lgpdConsent === "true";
        if (lgpdConsent) {
          await supabaseAdmin.from('users').update({
            lgpd_consent_at: new Date().toISOString(),
            lgpd_consent_version: 'v1.0'
          }).eq('id', profile.id);
        }

        return {
          id: profile.id,
          name: profile.name,
          email: profile.email || credentials.email,
          role: profile.role,
          supabaseAccessToken: accessToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as any).role;
        token.supabaseAccessToken = (user as any).supabaseAccessToken;
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
      if (token.supabaseAccessToken && session.user) {
        session.user.supabaseAccessToken = token.supabaseAccessToken as string;
      }
      return session;
    },
  },
});
