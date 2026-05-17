"use client";

import { motion } from "framer-motion";
import { Clock, Wallet, UserX, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const pains = [
  {
    icon: Wallet,
    title: "Dinheiro Deixado na Mesa",
    description: "Alunos atrasam pagamentos porque você esquece ou tem vergonha de cobrar no WhatsApp. Todo mês você perde pelo menos R$ 400 em inadimplência silenciosa.",
  },
  {
    icon: Clock,
    title: "Trabalho Invisível e Exaustivo",
    description: "Você passa os finais de semana montando planilhas em PDF ou Excel. São mais de 10 horas semanais não remuneradas só para montar treinos genéricos.",
  },
  {
    icon: UserX,
    title: "Alta Taxa de Desistência",
    description: "Alunos que recebem treinos em PDF se sentem desamparados, não sabem executar o movimento corretamente e acabam desistindo no segundo mês.",
  }
];

export default function PainPoints() {
  return (
    <section className="py-24 bg-[#111114] relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            Quanto você <span className="text-[#FF4444]">perde</span> por não ter um sistema profissional?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400"
          >
            Ser um excelente personal trainer não é suficiente se a sua gestão parece amadora. Veja o que está sugando seu tempo e dinheiro:
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pains.map((pain, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#16161A] border border-[#FF4444]/20 p-8 rounded-3xl relative overflow-hidden group hover:border-[#FF4444]/50 transition-all"
            >
              <div className="w-14 h-14 bg-[#FF4444]/10 rounded-2xl flex items-center justify-center mb-6 text-[#FF4444]">
                <pain.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{pain.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {pain.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* The Solution Transition */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#FF5C00] to-[#FF7A2E] rounded-3xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_50px_rgba(255,92,0,0.3)] relative overflow-hidden"
        >
          {/* Overlay pattern */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
          
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">A solução? Automatizar e Profissionalizar.</h3>
            <ul className="space-y-3">
              {[
                "Cobrança automática via PIX/Cartão",
                "Montagem de treinos em 3 minutos com biblioteca integrada",
                "App premium exclusivo para seus alunos"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/90 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 w-full md:w-auto">
            <Link 
              href="/login?tab=register"
              className="group flex w-full md:w-auto items-center justify-center gap-3 bg-white text-[#FF5C00] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 active:scale-95"
            >
              Parar de Perder Dinheiro
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
