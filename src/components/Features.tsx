import { 
  Calendar, 
  Users, 
  Dumbbell, 
  TrendingUp, 
  MessageSquare, 
  ShieldCheck 
} from "lucide-react";

const features = [
  {
    title: "Agenda Inteligente",
    desc: "Controle suas aulas com arrastar e soltar. Sincronização em tempo real e visualização semanal completa.",
    icon: <Calendar className="w-5 h-5 text-[#FF5C00]" />,
  },
  {
    title: "Gestão de Alunos",
    desc: "Anamnese, avaliação física, fotos e histórico completo. Tudo organizado por aluno seguindo a LGPD.",
    icon: <Users className="w-5 h-5 text-[#FF5C00]" />,
  },
  {
    title: "Fichas de Treino",
    desc: "Prescreva treinos em segundos com nossa biblioteca de 200+ exercícios com vídeo e fotos.",
    icon: <Dumbbell className="w-5 h-5 text-[#FF5C00]" />,
  },
  {
    title: "Controle Financeiro",
    desc: "Mensalidades, pacotes, lucro e despesas. Cobranças automáticas via Pix e Cartão direto no app.",
    icon: <TrendingUp className="w-5 h-5 text-[#FF5C00]" />,
  },
  {
    title: "WhatsApp AI",
    desc: "Nossa IA agenda, desmarca e tira dúvidas dos alunos 24h por dia no seu WhatsApp pessoal.",
    icon: <MessageSquare className="w-5 h-5 text-[#FF5C00]" />,
  },
  {
    title: "Privacidade & LGPD",
    desc: "Termos de consentimento digitais e criptografia de ponta para os dados sensíveis de saúde.",
    icon: <ShieldCheck className="w-5 h-5 text-[#FF5C00]" />,
  },
];

const delays = ["anim-d1", "anim-d2", "anim-d3", "anim-d4", "anim-d5", "anim-d6"];

export default function Features() {
  return (
    <section id="funcionalidades" className="py-20 px-[5%] relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="font-mono text-[0.75rem] text-[#FF5C00] uppercase tracking-[0.15em] mb-3">
            Funcionalidades
          </div>
          <h2 className="font-bebas text-[clamp(2.5rem,5vw,4rem)] text-[#F5F5F0] leading-[1] mb-4">
            O ecossistema <span>completo</span> para seu negócio
          </h2>
          <p className="text-[#7A7A85] text-[1.05rem] max-w-[520px] font-light italic">
            Projetado para eliminar os processos manuais e focar no que você faz de melhor: dar aula.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <div
            key={i}
            className={`anim-fade-up ${delays[i]} bg-[#16161A] border border-[#222228] p-8 rounded-xl relative overflow-hidden group hover:border-[#FF5C00]/30 transition-all hover:-translate-y-1 feature-card`}
          >
            <div className="w-11 h-11 bg-[#FF5C00]/12 border border-[#FF5C00]/25 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-base font-semibold text-[#F5F5F0] mb-2">{feature.title}</h3>
            <p className="text-[0.875rem] text-[#7A7A85] leading-[1.7]">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
