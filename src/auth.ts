import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { supabaseAdmin } from "@/lib/supabase";
import { userService } from "@/services/userService";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || "FitDeskSecretToken2026-SuperSecure!",
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days persistent session
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log("AUTHORIZE START", credentials?.email);
        const { email, password } = credentials;

        // Supabase Auth valida a senha usando o admin para evitar erro de localStorage no Node
        const { data: authData, error: authError } =
          await supabaseAdmin.auth.signInWithPassword({
            email: email as string,
            password: password as string,
          });

        console.log("AUTH DATA:", authData?.user?.id, "ERROR:", authError?.message);

        if (authError || !authData.user) {
          console.error("Login recusado no auth:", authError?.message);
          return null;
        }

        // Busca perfil público
        const userProfile = await userService.getByEmail(email as string);
        console.log("USER PROFILE DB:", userProfile?.id || "NULL");
        
        if (!userProfile) {
            console.log("Perfil não encontrado no public.users");
            return null;
        }

        console.log("AUTHORIZE SUCCESS!");
        return {
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
          role: userProfile.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Na primeira vez que o token é criado, `user` existe
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
