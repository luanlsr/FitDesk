import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rate limiting em memória (por processo — adequado para Edge/Vercel)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 8;          // max tentativas
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutos em ms

function getRateLimitKey(req: NextRequest): string {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "unknown";
  return ip;
}

function isRateLimited(req: NextRequest): boolean {
  if (process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DISABLE_RATE_LIMIT === "true") {
    return false;
  }
  const key = getRateLimitKey(req);
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (!record || now > record.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function middleware(req: NextRequest) {
  // Aplicar rate limiting apenas no endpoint de autenticação
  if (req.nextUrl.pathname.startsWith("/api/auth/callback/credentials")) {
    if (isRateLimited(req)) {
      return new NextResponse(
        JSON.stringify({ error: "Muitas tentativas de login. Aguarde 15 minutos." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "900",
          },
        }
      );
    }
  }

  // Delegação ao auth do NextAuth para proteção de rotas
  return (auth as any)(req);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};