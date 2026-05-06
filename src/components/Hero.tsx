"use client";

import Link from "next/link";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center px-[5%] py-32 md:py-48 lg:py-64 relative overflow-hidden">
      <div className="hero-grid absolute inset-0"></div>
      <div className="hero-glow absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"></div>

      <div className="anim-fade-up inline-flex items-center gap-2 bg-[#FF5C00]/12 border border-[#FF5C00]/30 text-[#FF7A2E] px-4 py-1.5 rounded-full text-[0.8rem] font-semibold tracking-[0.05em] uppercase mb-6">
        <span className="w-2 h-2 bg-[#00E676] rounded-full animate-pulse-custom"></span>
        Novo · IA integrada ao WhatsApp
      </div>

      <h1 className="anim-fade-up anim-d2 font-bebas text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] text-[#F5F5F0] tracking-[1px] relative mb-4">
        Gerencie sua carreira de<br />
        <span className="text-[#FF5C00]">personal trainer</span><br />
        com excelência
      </h1>

      <p className="anim-fade-up anim-d3 text-[clamp(1rem,2vw,1.2rem)] text-[#7A7A85] max-w-[580px] mx-auto mb-10 font-light">
        Agendamentos automáticos via WhatsApp, fichas de treino digitais, controle financeiro e relatórios inteligentes. Tudo que um personal precisa em um único dashboard.
      </p>

      <div className="anim-fade-up anim-d4 flex flex-col sm:flex-row gap-4 items-center justify-center mb-16 w-full max-w-[400px] sm:max-w-none px-4 sm:px-0">
        <button
          onClick={() => scrollTo("precos")}
          className="w-full sm:w-auto bg-[#FF5C00] text-white px-8 sm:px-9 py-3.5 rounded-lg text-sm sm:text-base font-bold transition-all shadow-[0_0_30px_rgba(255,92,0,0.35)] hover:bg-[#FF7A2E] hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(255,92,0,0.5)] cursor-pointer"
        >
          <span className="sm:hidden">Começar agora →</span>
          <span className="hidden sm:inline">Teste grátis por 14 dias</span>
        </button>
        <Link
          href="/funcionalidades"
          className="w-full sm:w-auto border border-[#222228] text-[#CFCFC8] px-8 sm:px-9 py-3.5 rounded-lg text-sm sm:text-base font-medium no-underline transition-all hover:border-[#FF5C00]/50 hover:text-[#F5F5F0] hover:bg-[#FF5C00]/5 text-center"
        >
          Ver funcionalidades →
        </Link>
      </div>


    </section>
  );
}
