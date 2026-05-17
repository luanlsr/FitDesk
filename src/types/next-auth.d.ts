import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: string;
      supabaseAccessToken?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    supabaseAccessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    supabaseAccessToken?: string;
  }
}
