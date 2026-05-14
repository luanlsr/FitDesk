"use client";

import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/nova-senha`,
      });

      if (error) {
        setStatus("error");
        setMessage(error.message);
      } else {
        setStatus("success");
        setMessage("Se o e-mail existir em nossa base, você receberá um link para redefinir sua senha em instantes.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Ocorreu um erro ao tentar recuperar a senha. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full hero-grid opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-[#FF5C00]/10 rounded-full blur-[120px] pointer-events-none"></div>
      
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
          <h1 className="text-2xl font-bold text-[#F5F5F0] mb-2">Recuperar Senha</h1>
          <p className="text-[#7A7A85] text-sm">Digite seu e-mail para receber o link de recuperação.</p>
        </div>

        {status === "success" ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="bg-[#FF5C00]/10 border border-[#FF5C00]/20 text-[#FF5C00] p-4 rounded-2xl text-sm font-medium">
              {message}
            </div>
            <Link 
              href="/login"
              className="inline-flex items-center justify-center gap-2 text-[#7A7A85] hover:text-[#F5F5F0] text-sm font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar para o Login
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {status === "error" && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 text-[0.7rem] p-3 rounded-xl text-center font-medium"
              >
                {message}
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

            <button 
              type="submit"
              disabled={status === "loading" || !email}
              className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group ${status === "loading" || !email ? "bg-[#222228] text-[#7A7A85] cursor-not-allowed opacity-50" : "bg-[#FF5C00] text-white shadow-[0_0_30px_rgba(255,92,0,0.2)] hover:bg-[#FF7A2E] hover:scale-[1.01] cursor-pointer"}`}
            >
              {status === "loading" ? "Enviando..." : "Enviar Link de Recuperação"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="text-center mt-6">
              <Link 
                href="/login"
                className="inline-flex items-center justify-center gap-2 text-[#7A7A85] hover:text-[#F5F5F0] text-xs font-bold transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Voltar para o Login
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
