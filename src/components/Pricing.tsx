import { Check, X } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    desc: "Para quem está começando.",
    price: "49",
    features: [
      { name: "Até 10 alunos ativos", ok: true },
      { name: "Agenda Inteligente", ok: true },
      { name: "Fichas de Treino", ok: true },
      { name: "Suporte via E-mail", ok: true },
      { name: "WhatsApp IA", ok: false },
      { name: "Relatórios Avançados", ok: false },
    ],
    featured: false,
  },
  {
    name: "Pro",
    desc: "O plano mais vendido.",
    price: "89",
    features: [
      { name: "Alunos ilimitados", ok: true },
      { name: "Agenda Inteligente", ok: true },
      { name: "Fichas de Treino", ok: true },
      { name: "WhatsApp IA (Beta)", ok: true },
      { name: "Relatórios Financeiros", ok: true },
      { name: "Suporte prioritário", ok: true },
    ],
    featured: true,
  },
  {
    name: "Studio",
    desc: "Para múltiplos personals.",
    price: "159",
    features: [
      { name: "Até 5 Personals/Staff", ok: true },
      { name: "Tudo do plano PRO", ok: true },
      { name: "Branding Personalizado", ok: true },
      { name: "API de Integração", ok: true },
      { name: "WhatsApp IA Full", ok: true },
      { name: "Suporte 24/7", ok: true },
    ],
    featured: false,
  },
];

const delays = ["anim-d1", "anim-d3", "anim-d5"];

export default function Pricing() {
  return (
    <section id="precos" className="bg-[#111114] border-t border-[#222228] py-16 md:py-24 px-[5%]">
      <div className="text-center mb-10 md:mb-16">
        <div className="font-mono text-[0.7rem] md:text-[0.75rem] text-[#FF5C00] uppercase tracking-[0.15em] mb-3 md:mb-4">
          Preços
        </div>
        <h2 className="font-bebas text-[2.5rem] md:text-[clamp(2.5rem,5vw,4rem)] text-[#F5F5F0] leading-[1] mb-4 md:mb-6">
          Escolha o plano <span>ideal</span>
        </h2>
        <p className="text-[#CFCFC8] text-sm md:text-base mb-6 md:mb-8 max-w-[500px] mx-auto px-4 sm:px-0">
          Preços simples e transparentes. Teste grátis por 14 dias.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`anim-fade-up ${delays[i]} bg-[#16161A] border ${
              plan.featured ? "border-[#FF5C00] ring-1 ring-[#FF5C00]/20" : "border-[#222228]"
            } rounded-2xl p-6 md:p-8 relative transition-all hover:-translate-y-1.5`}
          >
            {plan.featured && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF5C00] text-white px-4 py-1 rounded-full text-[0.65rem] md:text-[0.72rem] font-bold tracking-[0.05em] uppercase whitespace-nowrap">
                Melhor Escolha
              </div>
            )}
            <div className="font-bebas text-xl md:text-2xl text-[#F5F5F0] mb-1 tracking-wider uppercase">{plan.name}</div>
            <div className="text-[0.75rem] md:text-[0.82rem] text-[#7A7A85] mb-5 md:mb-6 uppercase tracking-tight">{plan.desc}</div>
            
            <div className="flex items-end gap-1 mb-6 md:mb-8">
              <div className="text-[0.8rem] md:text-[0.9rem] text-[#7A7A85] mb-2 font-mono">R$</div>
              <div className="font-bebas text-5xl md:text-6xl text-[#F5F5F0] leading-none mb-1">{plan.price}</div>
              <div className="text-[0.75rem] md:text-[0.8rem] text-[#7A7A85] mb-2 font-mono">/mês</div>
            </div>

            <ul className="space-y-3 md:space-y-4 mb-8">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-3 text-[0.8rem] md:text-[0.85rem] text-[#F5F5F0]">
                  {f.ok ? (
                    <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#00E676] flex-shrink-0" />
                  ) : (
                    <X className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#222228] flex-shrink-0" />
                  )}
                  <span className={f.ok ? "" : "text-[#7A7A85]"}>{f.name}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className={`block w-full text-center py-3 md:py-3.5 rounded-lg text-[0.85rem] md:text-[0.9rem] font-bold no-underline transition-all ${
                plan.featured
                  ? "bg-[#FF5C00] text-white shadow-[0_0_30px_rgba(255,92,0,0.3)] hover:bg-[#FF7A2E] hover:shadow-[0_0_40px_rgba(255,92,0,0.4)]"
                  : "bg-transparent border border-[#222228] text-[#CFCFC8] hover:border-[#7A7A85] hover:text-[#F5F5F0]"
              }`}
            >
              Começar agora
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
