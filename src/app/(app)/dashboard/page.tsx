"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  UserPlus, 
  Cake,
  Clock,
  Activity,
  ArrowUpRight,
  PlusCircle,
  Building2,
  ShieldCheck,
  Crown
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDashboardData } from "@/app/actions/dashboard";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const isMaster = session?.user?.role === "MASTER";

  useEffect(() => {
    async function loadData() {
      const res = await getDashboardData();
      if (res) setData(res);
      setLoading(false);
    }
    if (session?.user?.id && !isMaster) {
      loadData();
    } else if (isMaster) {
       setLoading(false); // Master data could be added later
    }
  }, [session, isMaster]);

  // Fallback for Personal Stats if loading
  const personalStats = data?.stats || [
    { label: "Alunos Ativos", val: "...", icon: <Users className="w-5 h-5 text-[#FF5C00]" />, trend: "Carregando..." },
    { label: "Aulas no Mês", val: "...", icon: <Calendar className="w-5 h-5 text-[#00E676]" />, trend: "Carregando..." },
    { label: "Receita Mensal", val: "...", icon: <TrendingUp className="w-5 h-5 text-[#64B5FF]" />, trend: "Carregando..." },
    { label: "Alertas", val: "...", icon: <AlertCircle className="w-5 h-5 text-[#FF4444]" />, trend: "Carregando..." },
  ];

  const masterStats = [
    { label: "Total de Personais", val: "12", icon: <UserPlus className="w-5 h-5 text-[#64B5FF]" />, trend: "+3 este mês" },
    { label: "Alunos na Base", val: "428", icon: <Users className="w-5 h-5 text-[#FF5C00]" />, trend: "Crescimento 12%" },
    { label: "Receita Plataforma", val: "R$ 45.900", icon: <TrendingUp className="w-5 h-5 text-[#00E676]" />, trend: "Meta: R$ 50K" },
    { label: "Atividade Global", val: "1.2k", icon: <Activity className="w-5 h-5 text-[#FFD600]" />, trend: "Ações hoje" },
  ];

  const currentStats = isMaster ? masterStats : personalStats;

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-fade-up max-w-[1400px] mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl md:text-2xl font-bold text-[#F5F5F0]">
              Olá, {session?.user?.name?.split(" ")[0] || (isMaster ? "Administrador" : "Personal")}! 👋
            </h1>
            {isMaster && (
              <div className="bg-[#FF5C00]/10 border border-[#FF5C00]/30 rounded-full px-2 py-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#FF5C00]" />
                <span className="text-[0.6rem] font-bold text-[#FF5C00] uppercase tracking-wider">MODO MASTER</span>
              </div>
            )}
          </div>
          <p className="text-[#7A7A85] text-xs md:text-sm">
            {isMaster 
              ? "Bem-vindo ao centro de comando FitDesk." 
              : "Bem-vindo ao FitDesk. Veja sua academia pessoal hoje."}
          </p>
        </div>
        <div className="flex gap-2">
          {!isMaster && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link href="/alunos" className="flex-1 sm:flex-none bg-[#16161A] border border-[#222228] text-[0.7rem] font-bold px-4 py-3 rounded-xl hover:border-[#7A7A85] transition-all cursor-pointer text-center uppercase tracking-wider">
                Meus Alunos
              </Link>
              <Link href="/treinos" className="flex-1 sm:flex-none bg-[#FF5C00] text-white text-[0.7rem] font-bold px-5 py-3 rounded-xl shadow-[0_0_20px_rgba(255,92,0,0.2)] hover:bg-[#FF7A2E] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider">
                <PlusCircle className="w-4 h-4" /> Novo Treino
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {currentStats.map((stat: any, i: number) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#16161A] border border-[#222228] p-5 md:p-6 rounded-2xl md:rounded-3xl relative overflow-hidden group hover:border-[#FF5C00]/20 transition-all shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-[#0A0A0B] border border-[#222228] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {stat.icon || <Activity className="w-5 h-5 text-[#FF5C00]" />}
              </div>
              <div className="text-[0.6rem] font-mono text-[#7A7A85] uppercase tracking-wider bg-[#0A0A0B] px-2 py-0.5 rounded-full border border-[#222228]">{stat.trend}</div>
            </div>
            <div className="text-2xl md:text-3xl font-bebas text-[#F5F5F0] tracking-wider">{stat.val}</div>
            <div className="text-[0.75rem] text-[#7A7A85] mt-1 font-medium">{stat.label}</div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5C00]/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-[#FF5C00]/10 transition-all"></div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 md:gap-8">
        {/* Main Section */}
        <section className="bg-[#16161A] border border-[#222228] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl">
          <div className="p-5 md:p-6 border-b border-[#222228] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111114]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FF5C00]/10 rounded-lg">
                {isMaster ? <Building2 className="w-5 h-5 text-[#64B5FF]" /> : <Calendar className="w-5 h-5 text-[#FF5C00]" />}
              </div>
              <h2 className="text-sm md:text-base font-bold text-[#F5F5F0] uppercase tracking-wide">
                {isMaster ? "Novos Profissionais" : "Agenda de Hoje"}
              </h2>
            </div>
            <Link 
              href={isMaster ? "/tenants" : "/agenda"} 
              className="text-[#FF5C00] text-[0.75rem] font-bold hover:text-[#FF7A2E] flex items-center gap-1 uppercase tracking-wider"
            >
              Ver Calendário Completo <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-[#222228]">
            {!isMaster && data?.agenda?.length === 0 && (
              <div className="p-10 text-center text-[#7A7A85] text-sm italic">
                Nenhum agendamento para hoje.
              </div>
            )}
            
            {!isMaster && data?.agenda?.map((item: any, i: number) => (
              <div key={i} className="flex items-center p-5 md:p-6 gap-4 md:gap-6 hover:bg-[#0A0A0B]/50 transition-colors group">
                <div className="flex flex-col items-center min-w-[50px] md:min-w-[60px] shrink-0">
                  <div className="text-xs md:text-sm font-bold text-[#F5F5F0] font-mono">
                    {format(new Date(item.start), "HH:mm")}
                  </div>
                  <Clock className="w-3 h-3 text-[#7A7A85] mt-1" />
                </div>
                <div className="flex-1 flex items-center gap-3 md:gap-4 min-w-0">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-[#0A0A0B] border border-[#222228] flex items-center justify-center font-bold text-xs text-[#FF5C00]">
                    {item.student?.name?.[0] || "A"}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#F5F5F0] truncate">{item.student?.name}</div>
                    <div className="text-[0.6rem] text-[#7A7A85] uppercase tracking-wider truncate">{item.title}</div>
                  </div>
                </div>
                <div className="shrink-0">
                  <span className={`text-[0.6rem] font-bold px-2.5 py-1 rounded-full bg-[#FF5C00]/10 text-[#FF5C00] border border-[#FF5C00]/15 uppercase`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sidebar Alerts */}
        <aside className="space-y-6">
          <section className="bg-[#16161A] border border-[#222228] rounded-3xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#64B5FF]/10 rounded-lg">
                <UserPlus className="w-5 h-5 text-[#64B5FF]" />
              </div>
              <h2 className="text-sm font-bold text-[#F5F5F0] uppercase tracking-wide">Leads Recentes</h2>
            </div>
            <div className="space-y-4">
              {data?.leads?.length === 0 && (
                <div className="text-center text-[#7A7A85] text-xs italic">Nenhum lead novo.</div>
              )}
              {data?.leads?.map((lead: any, i: number) => (
                <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-[#0A0A0B]/50 p-3 -mx-2 rounded-2xl transition-all border border-transparent hover:border-[#222228]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0A0A0B] flex items-center justify-center font-bold text-[0.6rem] border border-[#222228] text-[#64B5FF]">
                      {lead.name?.[0]}
                    </div>
                    <div className="text-[0.8rem] font-bold text-[#CFCFC8]">{lead.name}</div>
                  </div>
                  <div className="text-[0.6rem] font-bold text-[#7A7A85] uppercase tracking-widest">{lead.origin}</div>
                </div>
              ))}
            </div>
            <Link href="/leads" className="block w-full mt-6 py-3 bg-[#0A0A0B] border border-[#222228] rounded-xl text-[0.7rem] font-bold text-[#7A7A85] hover:text-[#F5F5F0] hover:border-[#7A7A85] transition-all text-center uppercase tracking-wider">
              Gerenciar CRM
            </Link>
          </section>

          <section className="bg-gradient-to-br from-[#16161A] to-[#111114] border border-[#222228] rounded-3xl p-6 relative overflow-hidden shadow-lg">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2 bg-[#FFD600]/10 rounded-lg">
                <Cake className="w-5 h-5 text-[#FFD600]" />
              </div>
              <h2 className="text-sm font-bold text-[#F5F5F0] uppercase tracking-wide">Aniversariantes</h2>
            </div>
            <div className="space-y-4 relative z-10">
              <p className="text-[0.7rem] text-[#7A7A85] italic">Nenhum aniversariante hoje.</p>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFD600]/5 rounded-full -mr-8 -mt-8 blur-2xl"></div>
          </section>

          <section className="bg-[#16161A] border border-[#222228] rounded-3xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#00E676]/10 rounded-lg">
                <Activity className="w-5 h-5 text-[#00E676]" />
              </div>
              <h2 className="text-sm font-bold text-[#F5F5F0] uppercase tracking-wide">Resumo Semanal</h2>
            </div>
            <p className="text-[0.75rem] text-[#7A7A85] leading-relaxed">
              Você tem <span className="text-[#F5F5F0] font-bold">15 treinos</span> planejados para esta semana. O engajamento dos alunos subiu 10%!
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
