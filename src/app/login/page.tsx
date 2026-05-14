"use client";

import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!acceptedTerms) {
      setError("Você precisa aceitar os termos de tratamento de dados.");
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("E-mail ou senha incorretos.");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Ocorreu um erro ao tentar entrar. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4 relative overflow-y-auto">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full hero-grid opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-[#FF5C00]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-[#64B5FF]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#111114] border border-[#222228] rounded-[32px] p-8 md:p-10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-8">
            <div className="font-bebas text-3xl text-[#F5F5F0] tracking-[3px]">
              FIT<span className="text-[#FF5C00]">DESK</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[#F5F5F0] mb-2">Bem-vindo de volta!</h1>
          <p className="text-[#7A7A85] text-sm">Acesse sua conta para gerenciar seus alunos.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-500 text-[0.7rem] p-3 rounded-xl text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold ml-1">E-mail Profissional</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7A85]" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0A0A0B] border border-[#222228] rounded-2xl pl-12 pr-4 py-4 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all placeholder:text-[#333338]"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold">Senha</label>
              <Link href="/recuperar-senha" className="text-[0.7rem] text-[#FF5C00] hover:underline font-bold uppercase tracking-wider">Esqueceu?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7A85]" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0A0A0B] border border-[#222228] rounded-2xl pl-12 pr-4 py-4 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all placeholder:text-[#333338]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 group cursor-pointer ml-1">
            <input 
              type="checkbox" 
              id="lgpd"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="w-4 h-4 rounded-lg bg-[#0A0A0B] border-[#222228] text-[#FF5C00] transition-colors cursor-pointer"
            />
            <label htmlFor="lgpd" className="text-[0.65rem] text-[#7A7A85] group-hover:text-[#CFCFC8] transition-colors cursor-pointer select-none">
              Concordo com o tratamento dos meus dados conforme a <Link href="/privacidade" className="text-[#FF5C00] hover:underline font-bold">LGPD</Link>.
            </label>
          </div>

          <button 
            type="submit"
            disabled={!acceptedTerms}
            className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group ${acceptedTerms ? "bg-[#FF5C00] text-white shadow-[0_0_30px_rgba(255,92,0,0.2)] hover:bg-[#FF7A2E] hover:scale-[1.01] cursor-pointer" : "bg-[#222228] text-[#7A7A85] cursor-not-allowed opacity-50"}`}
          >
            Entrar no Painel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-[#222228] text-center">
        </div>

        <p className="mt-8 text-center text-[0.7rem] text-[#7A7A85] italic font-light">
          Acesso restrito a profissionais cadastrados pela FitDesk. 
        </p>
      </motion.div>
    </div>
  );
}
