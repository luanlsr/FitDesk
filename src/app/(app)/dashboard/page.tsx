"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  UserPlus, 
  Cake,
  CheckCircle2,
  Clock,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  Building2,
  Crown,
  Bell,
  Activity,
  ArrowUpRight,
  PlusCircle
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session } = useSession();
  const isMaster = session?.user?.role === "MASTER";

  const personalStats = [
    { label: "Alunos Ativos", val: "34", icon: <Users className="w-5 h-5 text-[#FF5C00]" />, trend: "+2 este mês" },
    { label: "Aulas Realizadas", val: "156", icon: <Calendar className="w-5 h-5 text-[#00E676]" />, trend: "98% comparecimento" },
    { label: "Receita (Março)", val: "R$ 12.450", icon: <TrendingUp className="w-5 h-5 text-[#64B5FF]" />, trend: "Meta: R$ 15K" },
    { label: "Inadimplentes", val: "02", icon: <AlertCircle className="w-5 h-5 text-[#FF4444]" />, trend: "R$ 480 pendente" },
  ];

  const masterStats = [
    { label: "Total de Personais", val: "12", icon: <UserPlus className="w-5 h-5 text-[#64B5FF]" />, trend: "+3 este mês" },
    { label: "Alunos na Base", val: "428", icon: <Users className="w-5 h-5 text-[#FF5C00]" />, trend: "Crescimento 12%" },
    { label: "Receita Plataforma", val: "R$ 45.900", icon: <TrendingUp className="w-5 h-5 text-[#00E676]" />, trend: "Meta: R$ 50K" },
    { label: "Atividade Global", val: "1.2k", icon: <Activity className="w-5 h-5 text-[#FFD600]" />, trend: "Ações hoje" },
  ];

  const currentStats = isMaster ? masterStats : personalStats;

  const personalSessions = [
    { time: "07:00", name: "Rafael Alvarez", type: "Hipertrofia", status: "Done" },
    { time: "08:15", name: "Camila Ortiz", type: "Emagrecimento", status: "Done" },
    { time: "10:30", name: "Bruno Mendes", type: "Reabilitação", status: "Upcoming" },
  ];

  const masterTenants = [
    { name: "Luciano Treinador", email: "luciano@personal.com", plan: "PRO", status: "Active" },
    { name: "Ana Beatriz", email: "ana@fit.com", plan: "BASIC", status: "Active" },
    { name: "Carlos Magno", email: "carlos@power.net", plan: "ELITE", status: "Pending" },
  ];

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
          {isMaster ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none bg-[#16161A] border border-[#222228] text-[0.7rem] font-bold px-4 py-3 rounded-xl hover:border-[#7A7A85] transition-all cursor-pointer uppercase tracking-wider">
                Exportar
              </button>
              <Link href="/tenants" className="flex-[2] sm:flex-none bg-[#FF5C00] text-white text-[0.7rem] font-bold px-5 py-3 rounded-xl shadow-[0_0_20px_rgba(255,92,0,0.2)] hover:bg-[#FF7A2E] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider">
                <Building2 className="w-4 h-4" /> Personais
              </Link>
            </div>
          ) : (
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
        {currentStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#16161A] border border-[#222228] p-5 md:p-6 rounded-2xl md:rounded-3xl relative overflow-hidden group hover:border-[#FF5C00]/20 transition-all shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-[#0A0A0B] border border-[#222228] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {stat.icon}
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
                {isMaster ? "Novos Profissionais" : "Agenda do Dia"}
              </h2>
            </div>
            <Link 
              href={isMaster ? "/tenants" : "/agenda"} 
              className="text-[#FF5C00] text-[0.75rem] font-bold hover:text-[#FF7A2E] flex items-center gap-1 uppercase tracking-wider"
            >
              Ver Tudo <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-[#222228]">
            {isMaster ? (
              masterTenants.map((tenant, i) => (
                <div key={i} className="flex items-center p-5 md:p-6 gap-4 md:gap-6 hover:bg-[#0A0A0B]/50 transition-colors group">
                  <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl bg-[#0A0A0B] border border-[#222228] flex items-center justify-center font-bold text-xs text-[#64B5FF]">
                    {tenant.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-[#F5F5F0] truncate">{tenant.name}</div>
                    <div className="text-[0.65rem] text-[#7A7A85] truncate">{tenant.email}</div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4 shrink-0">
                    <span className="hidden sm:inline-block text-[0.6rem] font-bold px-2 py-0.5 rounded-lg bg-[#222228] text-[#F5F5F0] border border-[#333338]">
                      {tenant.plan}
                    </span>
                    <span className={`text-[0.6rem] font-bold px-2.5 py-1 rounded-full ${
                      tenant.status === "Active" 
                      ? "bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/15" 
                      : "bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/15"
                    }`}>
                      {tenant.status === "Active" ? "ATIVO" : "PENDENTE"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              personalSessions.map((session, i) => (
                <div key={i} className="flex items-center p-5 md:p-6 gap-4 md:gap-6 hover:bg-[#0A0A0B]/50 transition-colors group">
                  <div className="flex flex-col items-center min-w-[50px] md:min-w-[60px] shrink-0">
                    <div className="text-xs md:text-sm font-bold text-[#F5F5F0] font-mono">{session.time}</div>
                    <Clock className="w-3 h-3 text-[#7A7A85] mt-1" />
                  </div>
                  <div className="flex-1 flex items-center gap-3 md:gap-4 min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-[#0A0A0B] border border-[#222228] flex items-center justify-center font-bold text-xs">
                      {session.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#F5F5F0] truncate">{session.name}</div>
                      <div className="text-[0.6rem] text-[#7A7A85] uppercase tracking-wider truncate">{session.type}</div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className={`text-[0.6rem] font-bold px-2.5 py-1 rounded-full ${
                      session.status === "Done" 
                      ? "bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/15" 
                      : "bg-[#FF5C00]/10 text-[#FF5C00] border border-[#FF5C00]/15"
                    }`}>
                      {session.status === "Done" ? "CONCLUÍDO" : "AGENDADO"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Sidebar Alerts */}
        <aside className="space-y-6">
          {isMaster ? (
            <>
              <section className="bg-[#16161A] border border-[#222228] rounded-3xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#FFD600]/10 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-[#FFD600]" />
                  </div>
                  <h2 className="text-sm font-bold text-[#F5F5F0] uppercase tracking-wide">Alertas do Sistema</h2>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "Renovação Pendente", desc: "3 Personais vencem em 48h", type: "warning" },
                    { title: "Bug Reportado", desc: "Erro no carregamento de treinos", type: "error" },
                  ].map((alert, i) => (
                    <div key={i} className="flex gap-3 p-4 rounded-2xl bg-[#0A0A0B] border border-[#222228] hover:border-[#FF5C00]/20 transition-all cursor-pointer">
                      <div className={`w-1 shrink-0 rounded-full ${alert.type === 'error' ? 'bg-[#FF4444]' : 'bg-[#FFD600]'}`}></div>
                      <div>
                        <div className="text-[0.8rem] font-bold text-[#F5F5F0]">{alert.title}</div>
                        <div className="text-[0.7rem] text-[#7A7A85] mt-0.5">{alert.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-gradient-to-br from-[#16161A] to-[#111114] border border-[#222228] rounded-3xl p-6 relative overflow-hidden shadow-lg">
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="p-2 bg-[#64B5FF]/10 rounded-lg">
                    <Crown className="w-5 h-5 text-[#64B5FF]" />
                  </div>
                  <h2 className="text-sm font-bold text-[#F5F5F0] uppercase tracking-wide">Insights</h2>
                </div>
                <p className="text-[0.75rem] text-[#7A7A85] leading-relaxed relative z-10">
                  O plano <span className="text-[#64B5FF] font-bold">ELITE</span> teve um aumento de 25% na conversão. Considere destaque na landing page.
                </p>
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#64B5FF]/5 rounded-full -mr-8 -mt-8 blur-2xl"></div>
              </section>
            </>
          ) : (
            <>
              <section className="bg-[#16161A] border border-[#222228] rounded-3xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#64B5FF]/10 rounded-lg">
                    <UserPlus className="w-5 h-5 text-[#64B5FF]" />
                  </div>
                  <h2 className="text-sm font-bold text-[#F5F5F0] uppercase tracking-wide">Novos Leads</h2>
                </div>
                <div className="space-y-4">
                  {[
                    { name: "João Silva", origin: "Instagram", status: "Aguardando" },
                    { name: "Maria Clara", origin: "Indicação", status: "Contatado" },
                    { name: "Pedro Rocha", origin: "Google Ads", status: "Aguardando" },
                  ].map((lead, i) => (
                    <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-[#0A0A0B]/50 p-3 -mx-2 rounded-2xl transition-all border border-transparent hover:border-[#222228]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0A0A0B] flex items-center justify-center font-bold text-[0.6rem] border border-[#222228] text-[#64B5FF]">
                          {lead.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="text-[0.8rem] font-bold text-[#CFCFC8]">{lead.name}</div>
                      </div>
                      <div className="text-[0.6rem] font-bold text-[#7A7A85] uppercase tracking-widest">{lead.origin}</div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-3 bg-[#0A0A0B] border border-[#222228] rounded-xl text-[0.7rem] font-bold text-[#7A7A85] hover:text-[#F5F5F0] hover:border-[#7A7A85] transition-all uppercase tracking-wider">
                  Ver Todos
                </button>
              </section>

              <section className="bg-gradient-to-br from-[#16161A] to-[#111114] border border-[#222228] rounded-3xl p-6 relative overflow-hidden shadow-lg">
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="p-2 bg-[#FFD600]/10 rounded-lg">
                    <Cake className="w-5 h-5 text-[#FFD600]" />
                  </div>
                  <h2 className="text-sm font-bold text-[#F5F5F0] uppercase tracking-wide">Aniversariantes</h2>
                </div>
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-10 h-10 rounded-full border-2 border-[#FFD600]/40 p-0.5">
                      <div className="w-full h-full rounded-full bg-[#222228] flex items-center justify-center text-[0.6rem] font-bold">AM</div>
                    </div>
                    <div>
                      <div className="text-[0.8rem] font-bold text-[#F5F5F0]">Arthur Morais</div>
                      <div className="text-[0.6rem] font-bold text-[#FFD600] uppercase tracking-widest mt-0.5">AMANHÃ! 🎂</div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFD600]/5 rounded-full -mr-8 -mt-8 blur-2xl"></div>
              </section>

              <section className="bg-[#16161A] border border-[#222228] rounded-3xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#00E676]/10 rounded-lg">
                    <Activity className="w-5 h-5 text-[#00E676]" />
                  </div>
                  <h2 className="text-sm font-bold text-[#F5F5F0] uppercase tracking-wide">Dica do FitDesk</h2>
                </div>
                <p className="text-[0.75rem] text-[#7A7A85] leading-relaxed">
                  O aluno <span className="text-[#F5F5F0] font-bold">Rafael Alvarez</span> bateu metas de carga hoje. Sugira um aumento na próxima sessão!
                </p>
              </section>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
