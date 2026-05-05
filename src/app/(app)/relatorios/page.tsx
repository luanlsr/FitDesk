"use client";

import { motion } from "framer-motion";
import { 
  FileText, 
  BarChart3, 
  Download, 
  ChevronRight, 
  Calendar, 
  Users, 
  TrendingUp, 
  ShieldCheck 
} from "lucide-react";

const reportTemplates = [
  { 
    title: "Relatório Mensal de Faturamento", 
    desc: "Resumo completo de receitas, despesas e lucro real do mês.", 
    icon: <TrendingUp className="w-5 h-5 text-[#FF5C00]" />,
    tags: ["FINANCEIRO", "MENSAL"] 
  },
  { 
    title: "Análise de Frequência de Alunos", 
    desc: "Taxa de comparecimento e alunos em risco de desistência.", 
    icon: <Users className="w-5 h-5 text-[#64B5FF]" />,
    tags: ["OPERACIONAL", "SEMANAL"] 
  },
  { 
    title: "Relatório de Inadimplência", 
    desc: "Lista de pendências e histórico de cobranças enviadas.", 
    icon: <BarChart3 className="w-5 h-5 text-[#FFD600]" />,
    tags: ["FINANCEIRO", "CRÍTICO"] 
  },
  { 
    title: "Evolução Corporal Agrupada", 
    desc: "Média de resultados de todos os alunos em um período.", 
    icon: <FileText className="w-5 h-5 text-[#00E676]" />,
    tags: ["TREINOS", "BIMESTRAL"] 
  },
];

export default function RelatoriosPage() {
  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-up">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-[#FF5C00]" />
            <h1 className="text-2xl font-bold text-[#F5F5F0]">Relatórios & Dashboards</h1>
          </div>
          <p className="text-[#7A7A85] text-sm">Gere insights sobre o seu negócio e exporte para PDF ou Excel.</p>
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTemplates.map((report, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#16161A] border border-[#222228] p-8 rounded-3xl group hover:border-[#FF5C00]/30 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-[#0A0A0B] border border-[#222228] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {report.icon}
              </div>
              <div className="flex flex-wrap gap-2 justify-end max-w-[50%]">
                {report.tags.map(tag => (
                  <span key={tag} className="text-[0.6rem] font-bold font-mono px-2 py-0.5 bg-[#222228] text-[#7A7A85] rounded-md">{tag}</span>
                ))}
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-[#F5F5F0] mb-2 group-hover:text-[#FF5C00] transition-colors">{report.title}</h3>
            <p className="text-sm text-[#7A7A85] leading-relaxed mb-8">{report.desc}</p>
            
            <div className="flex items-center justify-between border-t border-[#222228] pt-6 mt-4">
              <button className="flex items-center gap-2 text-[0.8rem] text-[#FF5C00] font-bold hover:underline">
                Visualizar Agora <ChevronRight className="w-4 h-4" />
              </button>
              <button title="Gerar PDF" className="p-2.5 bg-[#0A0A0B] border border-[#222228] rounded-xl text-[#7A7A85] hover:text-white transition-all">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Custom Report Tool */}
      <section className="bg-gradient-to-br from-[#16161A] to-[#111114] border border-[#222228] rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-[#FF5C00]" />
            <h2 className="text-xl font-bold text-[#F5F5F0]">Exportar Período Customizado</h2>
          </div>
          <p className="text-[#7A7A85] text-base leading-relaxed max-w-[500px]">
            Selecione um intervalo de datas e os campos que deseja para gerar um relatório sob medida.
          </p>
          <div className="flex flex-wrap gap-3 pt-4">
            <button className="bg-[#0A0A0B] border border-[#222228] px-6 py-3 rounded-xl text-sm text-[#F5F5F0] hover:border-[#7A7A85] transition-all">
              Março 2026
            </button>
            <button className="bg-[#FF5C00] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(255,92,0,0.2)] hover:bg-[#FF7A2E] transition-all">
              Gerar Relatório Customizado
            </button>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-center gap-4 bg-[#0A0A0B]/50 p-6 border border-[#222228] rounded-2xl border-dashed">
          <ShieldCheck className="w-10 h-10 text-[#00E676] opacity-30" />
          <div className="text-[0.7rem] text-[#7A7A85] uppercase tracking-widest font-bold">Relatório Certificado</div>
        </div>
      </section>
    </div>
  );
}
