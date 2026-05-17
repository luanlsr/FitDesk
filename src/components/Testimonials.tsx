"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rafael Cardoso",
    role: "Personal Trainer • 45 alunos",
    image: "https://i.pravatar.cc/150?img=11",
    content: "Eu perdia cerca de 3 dias por mês só montando planilhas em PDF e mandando mensagem no WhatsApp cobrando mensalidade. O FitDesk automatizou tudo isso. Aumentei meu faturamento em 40% porque agora tenho tempo para focar em captar mais alunos.",
  },
  {
    name: "Juliana Mendes",
    role: "Treinadora Online • 120 alunos",
    image: "https://i.pravatar.cc/150?img=5",
    content: "A taxa de retenção dos meus alunos disparou! Eles adoram o fato de terem um aplicativo próprio com vídeos dos exercícios (GIFs incríveis). Pareço ter uma equipe de TI trabalhando pra mim. Foi o melhor investimento do meu negócio.",
  },
  {
    name: "Marcos Silva",
    role: "Personal Presencial & Online",
    image: "https://i.pravatar.cc/150?img=68",
    content: "Antes eu cobrava via PIX manual e sempre esquecia quem não tinha pago. A cobrança no cartão recorrente direto pelo app salvou meu caixa. E a biblioteca de exercícios integrada é surreal de rápida para montar o treino.",
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#0A0A0B] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-[#FF5C00]/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            O segredo dos <span className="text-[#FF5C00]">Personais de Elite</span>
          </motion.h2>
          <p className="text-gray-400 text-lg">Veja o que dizem os profissionais que já automatizaram suas consultorias.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-[#16161A] border border-[#222228] p-8 rounded-3xl relative hover:border-[#FF5C00]/30 transition-colors"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-[#FF5C00]/10" />
              
              <div className="flex items-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-[#FFC107] text-[#FFC107]" />
                ))}
              </div>

              <p className="text-gray-300 mb-8 leading-relaxed text-sm italic">
                "{t.content}"
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <img 
                  src={t.image} 
                  alt={t.name} 
                  className="w-12 h-12 rounded-full border-2 border-[#222228]"
                />
                <div>
                  <h4 className="text-white font-bold">{t.name}</h4>
                  <p className="text-[#FF5C00] text-xs font-medium">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
