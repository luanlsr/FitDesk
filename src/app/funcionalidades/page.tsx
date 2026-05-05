import Link from "next/link";
import {
  Calendar,
  Users,
  Dumbbell,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  ArrowLeft,
  Check,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Funcionalidades — FitDesk",
  description: "Conheça todas as ferramentas do FitDesk: agenda inteligente, fichas de treino, controle financeiro, WhatsApp IA e muito mais.",
};

const features = [
  {
    id: "01",
    tag: "Organização",
    title: "Agenda Inteligente",
    subtitle: "Nunca mais perca um horário",
    icon: Calendar,
    color: "#FF5C00",
    description:
      "Visualize toda a sua semana em um único painel. Arraste e solte aulas, defina horários fixos e bloqueie períodos de folga. Seus alunos recebem confirmações automáticas pelo WhatsApp.",
    items: [
      "Visão semanal e mensal com drag-and-drop",
      "Sincronização em tempo real com o app do aluno",
      "Alertas de conflito de horário",
      "Histórico completo de aulas realizadas",
      "Bloqueio de férias e dias livres",
    ],
  },
  {
    id: "02",
    tag: "Alunos",
    title: "Gestão de Alunos",
    subtitle: "Ficha completa em segundos",
    icon: Users,
    color: "#00E676",
    description:
      "Cadastre anamnese, avaliação física, fotos de evolução e histórico de lesões. Tudo protegido com criptografia e termos de consentimento digital conforme a LGPD.",
    items: [
      "Anamnese e avaliação física digital",
      "Galeria de fotos de evolução com comparativo",
      "Histórico de lesões e restrições médicas",
      "Relatórios em PDF profissionais em 1 clique",
      "Termo de consentimento LGPD integrado",
    ],
  },
  {
    id: "03",
    tag: "Treinos",
    title: "Fichas de Treino Digitais",
    subtitle: "Biblioteca completa de exercícios",
    icon: Dumbbell,
    color: "#FF5C00",
    description:
      "Prescreva treinos personalizados em segundos. Seu aluno acessa o treino do dia no celular, marca séries concluídas e você acompanha a evolução de cada exercício em tempo real.",
    items: [
      "Biblioteca de exercícios com vídeo e foto",
      "Treinos por objetivo: força, hipertrofia, emagrecimento",
      "Progressão de carga automatizada",
      "App para o aluno marcar séries no smartphone",
      "Relatórios de progressão enviados automaticamente",
    ],
  },
  {
    id: "04",
    tag: "Financeiro",
    title: "Controle Financeiro",
    subtitle: "Receita, despesas e inadimplência",
    icon: TrendingUp,
    color: "#FFD600",
    description:
      "Gerencie mensalidades, pacotes avulsos e comissões. O sistema cobra automaticamente alunos inadimplentes via Pix ou cartão e gera relatórios mensais detalhados do seu negócio.",
    items: [
      "Cobranças automáticas via Pix e cartão de crédito",
      "Dashboard financeiro com lucro líquido e despesas",
      "Alertas de inadimplência com régua de cobrança",
      "Relatórios mensais e anuais exportáveis em CSV/PDF",
      "Gestão de pacotes, mensalidades e aulas avulsas",
    ],
  },
  {
    id: "05",
    tag: "IA",
    title: "WhatsApp AI",
    subtitle: "Sua secretária virtual",
    icon: MessageSquare,
    color: "#00E676",
    description:
      "Nossa inteligência artificial atende seus alunos diretamente no WhatsApp. Ela agenda, cancela, confirma presenças e cobra mensalidades — em linguagem natural, como um humano.",
    items: [
      "Agendamento e cancelamento via conversa natural",
      "Verificação de disponibilidade em tempo real",
      "Cobranças e lembretes de mensalidade automáticos",
      "Integração com o seu número pessoal do WhatsApp",
      "Treinamento personalizado com sua voz e tom",
    ],
  },
  {
    id: "06",
    tag: "Segurança",
    title: "Privacidade & LGPD",
    subtitle: "Proteja você e seus alunos",
    icon: ShieldCheck,
    color: "#64B5FF",
    description:
      "Todos os dados de saúde são criptografados. Termos de consentimento são assinados digitalmente e armazenados com validade jurídica. Fique tranquilo com a lei.",
    items: [
      "Criptografia para dados sensíveis de saúde",
      "Assinatura digital de termos com validade jurídica",
      "Controle de acesso por perfil (personal, aluno, staff)",
      "Auditoria completa de acesso e modificações",
      "Exclusão de dados a pedido conforme art. 18 da LGPD",
    ],
  },
];

export default function FuncionalidadesPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F0]">
      {/* Top Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] py-4 bg-[#0A0A0B]/90 backdrop-blur-md border-b border-[#222228]">
        <Link href="/" className="font-bebas text-2xl text-[#F5F5F0] tracking-[2px] no-underline">
          FIT<span className="text-[#FF5C00]">DESK</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-[#7A7A85] text-xs font-medium hover:text-[#F5F5F0] transition-colors no-underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar
        </Link>
      </nav>

      {/* Header */}
      <section className="pt-40 pb-20 px-[5%] text-center relative overflow-hidden">
        <div className="hero-grid absolute inset-0 opacity-30"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="anim-fade-up font-mono text-[0.75rem] text-[#FF5C00] uppercase tracking-[0.2em] mb-4">
            Tudo que você precisa
          </div>
          <h1 className="anim-fade-up anim-d2 font-bebas text-[clamp(3rem,8vw,6rem)] leading-[0.9] text-[#F5F5F0] mb-6">
            6 módulos.<br />
            <span className="text-[#FF5C00]">1 plataforma.</span><br />
            Zero papel.
          </h1>
          <p className="anim-fade-up anim-d3 text-[#7A7A85] text-lg max-w-[560px] mx-auto font-light leading-relaxed mb-10">
            Cada módulo foi construído para resolver um problema real do personal trainer. Sem funcionalidades genéricas — só o que você usa todo dia.
          </p>
          <div className="anim-fade-up anim-d4 flex gap-3 justify-center flex-wrap">
            <Link
              href="/login"
              className="bg-[#FF5C00] text-white px-8 py-3 rounded-lg text-sm font-bold no-underline hover:bg-[#FF7A2E] transition-all hover:-translate-y-0.5 shadow-[0_0_30px_rgba(255,92,0,0.3)]"
            >
              Começar grátis por 14 dias
            </Link>
          </div>
        </div>
      </section>

      {/* Features — Vertical Narrative Layout */}
      <section className="px-[5%] pb-32 max-w-6xl mx-auto">
        {features.map((f, i) => {
          const Icon = f.icon;
          const isEven = i % 2 === 0;
          return (
            <div
              key={f.id}
              className={`anim-fade-up anim-d${(i % 4) + 1} group relative flex flex-col lg:flex-row gap-0 mb-1 border border-[#1A1A20] hover:border-[#222228] transition-all rounded-2xl overflow-hidden bg-[#0D0D0F]`}
            >
              {/* Number strip */}
              <div
                className="hidden lg:flex flex-col items-center justify-between px-6 py-10 border-r border-[#1A1A20] min-w-[80px]"
                style={{ borderColor: `${f.color}18` }}
              >
                <span
                  className="font-bebas text-[3rem] leading-none"
                  style={{ color: `${f.color}30` }}
                >
                  {f.id}
                </span>
                <div
                  className="w-0.5 flex-1 my-4"
                  style={{ background: `linear-gradient(to bottom, ${f.color}30, transparent)` }}
                />
                <Icon className="w-5 h-5 opacity-40" style={{ color: f.color }} />
              </div>

              {/* Content */}
              <div className={`flex-1 p-8 lg:p-10 flex flex-col lg:flex-row gap-8 lg:gap-16 items-start ${isEven ? "" : "lg:flex-row-reverse"}`}>
                {/* Left: text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: f.color }} />
                    </div>
                    <span
                      className="font-mono text-[0.65rem] uppercase tracking-[0.15em] font-bold"
                      style={{ color: f.color }}
                    >
                      {f.tag}
                    </span>
                  </div>
                  <h2 className="font-bebas text-[clamp(1.8rem,4vw,2.8rem)] text-[#F5F5F0] leading-[1] mb-1">
                    {f.title}
                  </h2>
                  <p className="text-[#7A7A85] text-sm mb-4 font-mono uppercase tracking-wider">
                    {f.subtitle}
                  </p>
                  <p className="text-[#CFCFC8] text-[0.95rem] leading-[1.8]">
                    {f.description}
                  </p>
                </div>

                {/* Right: checklist */}
                <div className="lg:w-[280px] flex-shrink-0">
                  <div
                    className="rounded-xl p-6"
                    style={{ background: `${f.color}06`, border: `1px solid ${f.color}15` }}
                  >
                    <p className="text-[0.65rem] font-mono uppercase tracking-[0.15em] text-[#7A7A85] mb-4">
                      Incluído no plano
                    </p>
                    <ul className="space-y-3">
                      {f.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-[0.82rem] text-[#CFCFC8]">
                          <div
                            className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: `${f.color}20` }}
                          >
                            <Check className="w-2.5 h-2.5" style={{ color: f.color }} />
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* CTA */}
      <section className="px-[5%] pb-32">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute inset-0 bg-[#FF5C00]/5 rounded-3xl blur-3xl"></div>
          <div className="relative border border-[#FF5C00]/20 rounded-3xl p-12 md:p-16 text-center bg-[#0D0D0F]">
            <p className="font-mono text-[0.75rem] text-[#FF5C00] uppercase tracking-[0.2em] mb-4">Pronto para começar?</p>
            <h2 className="font-bebas text-[clamp(2.5rem,6vw,5rem)] text-[#F5F5F0] leading-[0.95] mb-6">
              14 dias grátis.<br />
              <span className="text-[#FF5C00]">Sem cartão de crédito.</span>
            </h2>
            <p className="text-[#7A7A85] text-base mb-8 max-w-[440px] mx-auto">
              Acesse todos os módulos sem limitação. Cancele a qualquer momento, sem burocracia.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/login"
                className="bg-[#FF5C00] text-white px-10 py-4 rounded-lg text-base font-bold no-underline hover:bg-[#FF7A2E] transition-all hover:-translate-y-0.5 shadow-[0_0_40px_rgba(255,92,0,0.35)]"
              >
                Criar conta grátis
              </Link>
              <Link
                href="/?scrollTo=precos"
                className="border border-[#222228] text-[#CFCFC8] px-10 py-4 rounded-lg text-base font-medium no-underline hover:border-[#7A7A85] hover:text-[#F5F5F0] transition-all"
              >
                Ver planos e preços
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
