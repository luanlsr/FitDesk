"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "1.200+", label: "Personais Ativos", suffix: "" },
  { value: "R$ 15", label: "Milhões Transacionados", suffix: "M" },
  { value: "50.000+", label: "Alunos Treinando", suffix: "" },
  { value: "98%", label: "Taxa de Retenção", suffix: "%" },
];

export default function Stats() {
  return (
    <section className="py-20 relative bg-[#0A0A0B] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-20">
        <div className="w-[800px] h-[300px] bg-[#FF5C00] blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 mb-2 font-mono">
                {stat.value}
              </h3>
              <p className="text-[#FF5C00] font-bold text-sm uppercase tracking-widest">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
