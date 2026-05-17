"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-[#0A0A0B] to-[#16161A]">
      {/* Abstract Grid */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-5xl bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FF5C00]/20 via-[#0A0A0B]/0 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#FF5C00]/10 text-[#FF5C00] px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest mb-8 border border-[#FF5C00]/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5C00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5C00]"></span>
            </span>
            Últimas vagas com preço de lançamento
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            A agenda dos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5C00] to-[#FF8A00]">melhores personais</span> está sempre cheia.
          </h2>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Pare de perder tempo com planilhas e cobranças chatas. Junte-se à nova era da consultoria fitness e escale seus ganhos enquanto trabalha menos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login?tab=register"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#FF5C00] text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-[#FF7A2E] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,92,0,0.4)]"
            >
              Começar Meu Teste Grátis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00E676]" /> Sem necessidade de cartão de crédito
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00E676]" /> Cancele quando quiser
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00E676]" /> Dados 100% seguros
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
