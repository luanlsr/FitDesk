import type { Metadata } from "next";
import { Bebas_Neue, Sora, Space_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "FitDesk — Gestão Inteligente para Personal Trainers",
  description: "Gerencie sua academia pessoal como um CEO com agendamentos automáticos, fichas digitais e controle financeiro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${bebasNeue.variable} ${sora.variable} ${spaceMono.variable} font-sans antialiased bg-[#0A0A0B] text-[#F5F5F0]`}
        suppressHydrationWarning
      >
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
