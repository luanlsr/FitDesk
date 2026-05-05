"use client";

import Link from "next/link";
import { ArrowLeft, MessageCircle, Mail, HelpCircle, ChevronRight, WhatsApp } from "lucide-react";
import { useState } from "react";

export default function SuportePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F0] py-20 px-[5%]">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-[#7A7A85] text-sm mb-12 hover:text-[#FF5C00] transition-colors no-underline">
          <ArrowLeft className="w-4 h-4" /> Voltar para a página inicial
        </Link>
        
        <h1 className="font-bebas text-5xl mb-4 tracking-tight">Centro de <span className="text-[#FF5C00]">Suporte</span></h1>
        <p className="text-[#7A7A85] text-sm mb-12 font-mono uppercase tracking-widest">Estamos aqui para ajudar você a crescer.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <a 
            href="https://wa.me/5500000000000" 
            target="_blank" 
            className="group bg-[#111114] border border-[#222228] p-8 rounded-3xl hover:border-[#00E676]/30 transition-all no-underline"
          >
            <div className="w-12 h-12 bg-[#00E676]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6 text-[#00E676]" />
            </div>
            <h3 className="text-[#F5F5F0] font-bold text-xl mb-2">WhatsApp</h3>
            <p className="text-[#7A7A85] text-sm leading-relaxed mb-6">Atendimento rápido em horário comercial para dúvidas técnicas.</p>
            <span className="text-[#00E676] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              Chamar agora <ChevronRight className="w-4 h-4" />
            </span>
          </a>

          <a 
            href="mailto:suporte@fitdesk.com.br" 
            className="group bg-[#111114] border border-[#222228] p-8 rounded-3xl hover:border-[#FF5C00]/30 transition-all no-underline"
          >
            <div className="w-12 h-12 bg-[#FF5C00]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6 text-[#FF5C00]" />
            </div>
            <h3 className="text-[#F5F5F0] font-bold text-xl mb-2">E-mail</h3>
            <p className="text-[#7A7A85] text-sm leading-relaxed mb-6">Para questões administrativas, faturamento ou sugestões.</p>
            <span className="text-[#FF5C00] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              Enviar e-mail <ChevronRight className="w-4 h-4" />
            </span>
          </a>
        </div>

        <section className="bg-[#111114]/50 border border-[#222228] rounded-3xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-6 h-6 text-[#FF5C00]" />
            <h2 className="text-[#F5F5F0] font-bold text-2xl tracking-tight">Dúvidas Frequentes</h2>
          </div>

          <div className="space-y-6 divide-y divide-[#222228]">
            <div className="pt-6 first:pt-0">
              <h4 className="text-[#F5F5F0] font-semibold mb-2">Como funciona o período de teste?</h4>
              <p className="text-[#7A7A85] text-sm leading-relaxed">
                Você tem 14 dias de acesso total a todos os módulos (Agenda, Treinos, Financeiro, etc.) sem precisar cadastrar cartão de crédito. Após esse período, você escolhe se deseja continuar.
              </p>
            </div>
            <div className="pt-6">
              <h4 className="text-[#F5F5F0] font-semibold mb-2">Posso importar meus alunos de outra plataforma?</h4>
              <p className="text-[#7A7A85] text-sm leading-relaxed">
                Sim! Nossa equipe de suporte ajuda você a importar sua base de alunos via planilha CSV ou Excel para você não perder tempo.
              </p>
            </div>
            <div className="pt-6">
              <h4 className="text-[#F5F5F0] font-semibold mb-2">O FitDesk tem aplicativo para o aluno?</h4>
              <p className="text-[#7A7A85] text-sm leading-relaxed">
                Sim. O aluno acessa um Progressive Web App (PWA) leve, que não ocupa espaço no celular e permite marcar treinos e ver a evolução em tempo real.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
