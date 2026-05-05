export default function Mockup() {
  return (
    <section className="py-12 overflow-hidden relative">
      <div className="anim-fade-up anim-d2 w-[min(90%,900px)] mx-auto rounded-2xl overflow-hidden border border-[#222228] mockup-screen bg-[#111114]">
        <div className="bg-[#16161A] px-4 py-3 flex items-center gap-2 border-b border-[#222228]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] min-h-[400px]">
          <div className="hidden md:block bg-[#121216] border-r border-[#222228] p-6 pt-6">
            <div className="font-bebas text-[1.4rem] text-[#F5F5F0] mb-8 px-2 tracking-[1px]">
              FIT<span className="text-[#FF5C00]">DESK</span>
            </div>
            {[
              "Dashboard",
              "Agenda",
              "Alunos",
              "Treinos",
              "Financeiro",
              "Leads",
              "Relatórios",
            ].map((item, i) => (
              <div
                key={item}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md mb-1 text-[0.8rem] cursor-pointer transition-all ${
                  i === 0
                    ? "bg-[#FF5C00]/18 text-[#FF5C00] border border-[#FF5C00]/20 font-medium"
                    : "text-[#7A7A85] hover:text-[#F5F5F0]"
                }`}
              >
                <div className={`w-4 h-4 rounded-sm opacity-70 ${i === 0 ? "bg-[#FF5C00]" : "bg-current"}`}></div>
                {item}
              </div>
            ))}
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="text-base font-semibold text-[#F5F5F0]">Visão Geral · Março 2026</div>
              <div className="text-[0.75rem] text-[#7A7A85] font-mono tracking-tight uppercase">DOM 22/03/2026 · 09:14</div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Alunos ativos", val: "34" },
                { label: "Aulas hoje", val: "08" },
                { label: "Receita (M)", val: "R$ 12.4K", color: "text-[#00E676]" },
                { label: "Cancelados", val: "02", color: "text-[#FF5C00]" },
              ].map((card) => (
                <div key={card.label} className="bg-[#16161A] border border-[#222228] rounded-lg p-3">
                  <div className="text-[0.65rem] text-[#7A7A85] uppercase tracking-[0.05em] mb-1">{card.label}</div>
                  <div className={`font-bebas text-2xl ${card.color || "text-[#F5F5F0]"}`}>{card.val}</div>
                </div>
              ))}
            </div>
            <div className="bg-[#16161A] border border-[#222228] rounded-lg p-4 h-28 flex items-end gap-1.5 overflow-hidden">
              {[40, 65, 50, 80, 70, 90, 75].map((h, i) => (
                <div key={i} className="flex-1 rounded-t bg-[#222228] relative h-full">
                  <div
                    className={`absolute bottom-0 left-0 right-0 rounded-t ${
                      i === 5 ? "bg-[#FF7A2E]" : "bg-[#FF5C00]"
                    }`}
                    style={{ height: `${h}%` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
