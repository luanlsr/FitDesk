import type { NextConfig } from "next";

const securityHeaders = [
  // Força HTTPS por 2 anos (incluindo subdomínios)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Previne clickjacking (embedding em iframe)
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Previne MIME type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Limita informações do Referrer ao origin
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Desabilita APIs de hardware desnecessárias
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(self)",
  },
  // Previne XSS e define fontes confiáveis
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js requer 'unsafe-inline' e 'unsafe-eval' para hot reload e SSR
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      // Supabase para dados e autenticação
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://sandbox.asaas.com https://api.asaas.com",
      "img-src 'self' data: blob: https://*.supabase.co https://www.youtube.com https://raw.githubusercontent.com",
      // YouTube para vídeos e GitHub Raw para GIFs da biblioteca
      "media-src 'self' https://raw.githubusercontent.com",
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  experimental: {
    scrollRestoration: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
  async headers() {
    return [
      {
        // Aplica os cabeçalhos de segurança em todas as rotas
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // CORS explícito para rotas da API
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: process.env.NEXT_PUBLIC_APP_URL || "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;
