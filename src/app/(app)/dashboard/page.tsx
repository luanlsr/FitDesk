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
  ArrowUpRight
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
    <div className="p-4 md:p-8 space-y-8 animate-fade-up">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-[#F5F5F0]">
              Olá, {session?.user?.name || (isMaster ? "Administrador" : "Personal")}! 👋
            </h1>
            {isMaster && (
              <div className="bg-[#FF5C00]/10 border border-[#FF5C00]/30 rounded-full px-2 py-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#FF5C00]" />
                <span className="text-[0.6rem] font-bold text-[#FF5C00] uppercase tracking-wider">MODO MASTER</span>
              </div>
            )}
          </div>
          <p className="text-[#7A7A85] text-sm">
            {isMaster 
              ? "Bem-vindo ao centro de comando. Gerencie a saúde da plataforma FitDesk." 
              : "Bem-vindo ao FitDesk. Veja como está sua academia pessoal hoje."}
          </p>
        </div>
        <div className="flex gap-2">
          {isMaster ? (
            <>
              <button className="bg-[#16161A] border border-[#222228] text-sm font-medium px-4 py-2.5 rounded-xl hover:border-[#7A7A85] transition-all cursor-pointer">
                Exportar Dados
              </button>
              <Link href="/tenants" className="bg-[#FF5C00] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(255,92,0,0.2)] hover:bg-[#FF7A2E] transition-all cursor-pointer flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Gerenciar Personais
              </Link>
            </>
          ) : (
            <>
            </>
          )}
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#16161A] border border-[#222228] p-6 rounded-2xl relative overflow-hidden group hover:border-[#FF5C00]/20 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-[#0A0A0B] border border-[#222228] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="text-[0.65rem] font-mono text-[#7A7A85] uppercase tracking-wider">{stat.trend}</div>
            </div>
            <div className="text-3xl font-bebas text-[#F5F5F0] tracking-wider">{stat.val}</div>
            <div className="text-[0.8rem] text-[#7A7A85] mt-1">{stat.label}</div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5C00]/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-[#FF5C00]/10 transition-all"></div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* Main Section */}
        <section className="bg-[#16161A] border border-[#222228] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[#222228] flex justify-between items-center bg-[#111114]">
            <div className="flex items-center gap-2">
              {isMaster ? (
                <>
                  <Building2 className="w-5 h-5 text-[#64B5FF]" />
                  <h2 className="text-base font-semibold text-[#F5F5F0]">Novos Profissionais (Personais)</h2>
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5 text-[#FF5C00]" />
                  <h2 className="text-base font-semibold text-[#F5F5F0]">Aulas do Dia (22 Março)</h2>
                </>
              )}
            </div>
            <Link 
              href={isMaster ? "/tenants" : "/agenda"} 
              className="text-[#FF5C00] text-[0.8rem] font-semibold hover:underline flex items-center gap-1"
            >
              {isMaster ? "Ver Todos os Personais" : "Ver Agenda Completa"} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-[#222228]">
            {isMaster ? (
              masterTenants.map((tenant, i) => (
                <div key={i} className="flex items-center p-6 gap-6 hover:bg-[#0A0A0B]/50 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-[#0A0A0B] border border-[#222228] flex items-center justify-center font-bold text-xs text-[#64B5FF]">
                    {tenant.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-[#F5F5F0]">{tenant.name}</div>
                    <div className="text-[0.7rem] text-[#7A7A85]">{tenant.email}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-lg bg-[#222228] text-[#F5F5F0] border border-[#333338]">
                      {tenant.plan}
                    </span>
                    <span className={`text-[0.7rem] font-bold px-3 py-1 rounded-full ${
                      tenant.status === "Active" 
                      ? "bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/15" 
                      : "bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/15"
                    }`}>
                      {tenant.status === "Active" ? "ATIVO" : "PENDENTE"}
                    </span>
                    <button className="p-2 text-[#7A7A85] hover:text-[#F5F5F0] opacity-0 group-hover:opacity-100 transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              personalSessions.map((session, i) => (
                <div key={i} className="flex items-center p-6 gap-6 hover:bg-[#0A0A0B]/50 transition-colors group">
                  <div className="flex flex-col items-center min-w-[60px]">
                    <div className="text-sm font-bold text-[#F5F5F0] font-mono">{session.time}</div>
                    <Clock className="w-3.5 h-3.5 text-[#7A7A85]" />
                  </div>
                  <div className="flex-1 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0A0A0B] border border-[#222228] flex items-center justify-center font-bold text-xs">
                      {session.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#F5F5F0]">{session.name}</div>
                      <div className="text-[0.7rem] text-[#7A7A85] uppercase tracking-wider">{session.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[0.7rem] font-bold px-3 py-1 rounded-full ${
                      session.status === "Done" 
                      ? "bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/15" 
                      : "bg-[#FF5C00]/10 text-[#FF5C00] border border-[#FF5C00]/15"
                    }`}>
                      {session.status === "Done" ? "CONCLUÍDO" : "AGENDADO"}
                    </span>
                    <button className="p-2 text-[#7A7A85] hover:text-[#F5F5F0] opacity-0 group-hover:opacity-100 transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
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
              <section className="bg-[#16161A] border border-[#222228] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <AlertCircle className="w-5 h-5 text-[#FFD600]" />
                  <h2 className="text-base font-semibold text-[#F5F5F0]">Alertas do Sistema</h2>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "Renovação Pendente", desc: "3 Personais vencem em 48h", type: "warning" },
                    { title: "Bug Reportado", desc: "Erro no carregamento de treinos", type: "error" },
                  ].map((alert, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-[#0A0A0B] border border-[#222228]">
                      <div className={`w-1.5 rounded-full ${alert.type === 'error' ? 'bg-[#FF4444]' : 'bg-[#FFD600]'}`}></div>
                      <div>
                        <div className="text-[0.8rem] font-bold text-[#F5F5F0]">{alert.title}</div>
                        <div className="text-[0.7rem] text-[#7A7A85]">{alert.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-[#16161A] border border-[#222228] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-5 h-5 text-[#64B5FF]" />
                  <h2 className="text-base font-semibold text-[#F5F5F0]">Insights Plataforma</h2>
                </div>
                <p className="text-[0.8rem] text-[#7A7A85] leading-relaxed">
                  O plano <span className="text-[#64B5FF] font-medium">ELITE</span> teve um aumento de 25% na conversão após a última atualização. Considere destaque na landing page.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="bg-[#16161A] border border-[#222228] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <UserPlus className="w-5 h-5 text-[#64B5FF]" />
                  <h2 className="text-base font-semibold text-[#F5F5F0]">Leads Recentes</h2>
                </div>
                <div className="space-y-4">
                  {[
                    { name: "João Silva", origin: "Instagram", status: "Aguardando" },
                    { name: "Maria Clara", origin: "Indicação", status: "Contatado" },
                    { name: "Pedro Rocha", origin: "Google Ads", status: "Aguardando" },
                  ].map((lead, i) => (
                    <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-[#0A0A0B]/50 p-2 -mx-2 rounded-xl transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0A0A0B] flex items-center justify-center font-bold text-[0.65rem] border border-[#222228]">LS</div>
                        <div className="text-sm font-medium text-[#CFCFC8]">{lead.name}</div>
                      </div>
                      <div className="text-[0.65rem] text-[#7A7A85] uppercase tracking-wider">{lead.origin}</div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-2.5 bg-[#0A0A0B]/50 border border-[#222228] rounded-xl text-[0.8rem] text-[#7A7A85] hover:text-[#F5F5F0] hover:border-[#7A7A85] transition-all">
                  Ver Todos os Leads
                </button>
              </section>

              <section className="bg-gradient-to-br from-[#16161A] to-[#111114] border border-[#222228] rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-6">
                  <Cake className="w-5 h-5 text-[#FFD600]" />
                  <h2 className="text-base font-semibold text-[#F5F5F0]">Aniversariantes</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-[#FFD600]/40 p-0.5">
                      <div className="w-full h-full rounded-full bg-[#222228] flex items-center justify-center text-xs">AM</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#F5F5F0]">Arthur Morais</div>
                      <div className="text-[0.7rem] text-[#FFD600]">AMANHÃ! 🎂</div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFD600]/5 rounded-full -mr-8 -mt-8 blur-2xl"></div>
              </section>

              <section className="bg-[#16161A] border border-[#222228] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-[#00E676]" />
                  <h2 className="text-base font-semibold text-[#F5F5F0]">Dica da IA</h2>
                </div>
                <p className="text-[0.8rem] text-[#7A7A85] leading-relaxed">
                  O aluno <span className="text-[#F5F5F0] font-medium">Rafael Alvarez</span> bateu todas as metas de carga no Supino hoje. Que tal sugerir um aumento de 5kg na próxima sessão?
                </p>
              </section>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
