import { ShieldAlert, Info } from "lucide-react";

export default function Aluno() {
  return (
    <section id="alunos" className="py-20 px-[5%]">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-12 items-center max-w-7xl mx-auto">
        <div>
          <div className="font-mono text-[0.75rem] text-[#FF5C00] uppercase tracking-[0.15em] mb-4">
            Gestão de Alunos
          </div>
          <h2 className="font-bebas text-[clamp(2.5rem,5vw,4rem)] text-[#F5F5F0] leading-[1] mb-6">
            Avaliação física <span>completa</span> e segura
          </h2>
          <p className="text-[#CFCFC8] text-base mb-8 max-w-[500px]">
            Registre peso, medidas, dobras cutâneas e fotos de evolução. Gere relatórios em PDF profissionais para enviar aos alunos em um clique.
          </p>
          <div className="bg-[#FF5C00]/10 border border-[#FF5C00]/30 rounded-lg p-5 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#FF5C00] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-[#F5F5F0] mb-0.5">Segurança LGPD</div>
              <div className="text-[0.75rem] text-[#7A7A85] leading-relaxed">
                Dados sensíveis de saúde são criptografados e protegidos com termos de consentimento digitais assinados pelos alunos conforme a lei.
              </div>
            </div>
          </div>
        </div>

        <div className="anim-slide-right anim-d2 bg-[#16161A] border border-[#222228] rounded-xl overflow-hidden shadow-2xl">
          <div className="p-6 flex gap-4 items-center border-b border-[#222228]">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF5C00] to-[#FF9A00] flex items-center justify-center font-bebas text-2xl text-white">RA</div>
            <div>
              <div className="text-base font-semibold text-[#F5F5F0]">Rafael Alvarez</div>
              <div className="text-[0.78rem] text-[#7A7A85]">Objetivo: Hipertrofia Moderada</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#222228]">
            {[
              { label: "Peso", val: "84.2kg" },
              { label: "Altura", val: "1.82m" },
              { label: "IMC", val: "25.4", color: "text-[#FFD600]" },
              { label: "Gordura", val: "14.2%" },
            ].map((metric) => (
              <div key={metric.label} className="p-4 border-r border-[#222228] last-of-type:border-r-0 text-center">
                <div className={`font-bebas text-2xl ${metric.color || "text-[#F5F5F0]"}`}>{metric.val}</div>
                <div className="text-[0.65rem] text-[#7A7A85] uppercase tracking-[0.05em]">{metric.label}</div>
              </div>
            ))}
          </div>
          <div className="p-6 flex gap-2 flex-wrap">
            <div className="bg-[#FF5050]/15 text-[#FF6464] border border-[#FF5050]/25 px-3 py-1 rounded-sm text-[0.7rem] font-bold font-mono">LESÃO NO OMBRO (D)</div>
            <div className="bg-[#FFD600]/12 text-[#FFD600] border border-[#FFD600]/20 px-3 py-1 rounded-sm text-[0.7rem] font-bold font-mono">HIPERTENSO</div>
            <div className="bg-[#0096FF]/12 text-[#64B5FF] border border-[#0096FF]/20 px-3 py-1 rounded-sm text-[0.7rem] font-bold font-mono">ESTUDANTE</div>
          </div>
          <div className="bg-[#00E676]/6 border-t border-[#00E676]/15 px-6 py-3 flex items-center gap-2 text-[0.72rem] text-[#00E676]">
            <Info className="w-3.5 h-3.5" />
            Consentimento LGPD firmado digitalmente em 14/01/2026 às 10:22.
          </div>
        </div>
      </div>
    </section>
  );
}
