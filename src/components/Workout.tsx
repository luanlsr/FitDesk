import { Check } from "lucide-react";

export default function Workout() {
  return (
    <section id="treinos" className="py-20 px-[5%]">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-12 items-center max-w-7xl mx-auto">
        <div>
          <div className="font-mono text-[0.75rem] text-[#FF5C00] uppercase tracking-[0.15em] mb-4">
            Gestão de Treinos
          </div>
          <h2 className="font-bebas text-[clamp(2.5rem,5vw,4rem)] text-[#F5F5F0] leading-[1] mb-6">
            Fichas <span>digitais</span> que seus alunos amam
          </h2>
          <p className="text-[#CFCFC8] text-base mb-8 max-w-[500px]">
            Chega de papel! Seus alunos acessam o treino do dia no celular, marcam as séries concluídas e registram o peso. Você recebe relatórios de progressão automáticos.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#16161A] p-5 rounded-lg border border-[#222228]">
              <div className="text-xl font-bold text-[#F5F5F0] mb-1 font-bebas tracking-wider">200+</div>
              <div className="text-[0.7rem] text-[#7A7A85] uppercase tracking-[0.05em]">Exercícios com vídeo</div>
            </div>
            <div className="bg-[#16161A] p-5 rounded-lg border border-[#222228]">
              <div className="text-xl font-bold text-[#F5F5F0] mb-1 font-bebas tracking-wider">100%</div>
              <div className="text-[0.7rem] text-[#7A7A85] uppercase tracking-[0.05em]">Personalizável</div>
            </div>
          </div>
        </div>

        <div className="anim-slide-right anim-d2 bg-[#16161A] border border-[#222228] rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-[#111114] px-6 py-4 flex justify-between items-center border-b border-[#222228]">
            <div className="font-semibold text-[#F5F5F0] text-sm">Treino A — Peito e Tríceps</div>
            <div className="bg-[#FF5C00]/15 text-[#FF5C00] px-3 py-1 rounded-sm text-[0.7rem] font-bold font-mono">HIPERTROFIA</div>
          </div>
          <div className="px-6 py-4 bg-[#111114] grid grid-cols-[3fr_1fr_1fr_1fr] gap-2 text-[0.7rem] text-[#7A7A85] uppercase tracking-wider">
            <div>Exercício</div>
            <div className="text-center">Séries</div>
            <div className="text-center">Reps</div>
            <div className="text-center">Status</div>
          </div>
          {[
            { name: "Supino Inclinado (Halteres)", s: "4", r: "10-12", done: true },
            { name: "Crucifixo Máquina", s: "3", r: "15", done: true },
            { name: "Tríceps Corda", s: "4", r: "12", done: false },
            { name: "Tríceps Francês", s: "3", r: "12", done: false },
          ].map((ex, i) => (
            <div key={i} className="px-6 py-4 grid grid-cols-[3fr_1fr_1fr_1fr] gap-2 border-b border-[#222228] items-center text-[0.85rem]">
              <div className="text-[#F5F5F0] font-medium">{ex.name}</div>
              <div className="text-center text-[#7A7A85]">{ex.s}</div>
              <div className="text-center text-[#FF5C00] font-mono">{ex.r}</div>
              <div className="flex justify-center">
                {ex.done ? (
                  <div className="w-4 h-4 rounded-full bg-[#00E676] flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-[#0A0A0B]" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-[#222228]"></div>
                )}
              </div>
            </div>
          ))}
          <div className="p-4 bg-[#111114] text-center text-[0.7rem] text-[#7A7A85] font-mono uppercase tracking-widest">
            Próximo Treino: Treino B (Costas)
          </div>
        </div>
      </div>
    </section>
  );
}
