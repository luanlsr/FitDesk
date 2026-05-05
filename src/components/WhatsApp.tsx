import { Send } from "lucide-react";

export default function WhatsApp() {
  return (
    <section className="bg-[#111114] border-t border-b border-[#222228] py-20 px-[5%]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
        <div>
          <div className="font-mono text-[0.75rem] text-[#FF5C00] uppercase tracking-[0.15em] mb-4">
            WhatsApp AI
          </div>
          <h2 className="font-bebas text-[clamp(2.5rem,5vw,4rem)] text-[#F5F5F0] leading-[1] mb-6">
            Sua secretária <span>atende</span> 24 horas por dia
          </h2>
          <p className="text-[#CFCFC8] text-base mb-8 max-w-[500px]">
            Nossa IA conversa com seus alunos, verifica sua agenda, confirma horários e cancela aulas. Tudo de forma natural, automática e integrada ao seu número.
          </p>
          <ul className="space-y-4 mb-10">
            {[
              "Agendamento automático via conversa",
              "Verificação de disponibilidade em tempo real",
              "Cobranças de mensalidades atrasadas",
              "Lembretes de aula e confirmações",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-[#F5F5F0]">
                <div className="w-5 h-5 flex items-center justify-center bg-[#00E676]/15 rounded-full">
                  <div className="w-1.5 h-1.5 bg-[#00E676] rounded-full"></div>
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="anim-scale-in anim-d2 bg-[#111111] border border-[#222228] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <div className="bg-[#1A1A20] px-5 py-4 flex items-center gap-3 border-b border-[#222228]">
            <div className="w-9 h-9 border-2 border-[#FF5C00] rounded-full flex items-center justify-center font-bold text-xs text-white">IA</div>
            <div>
              <div className="text-sm font-semibold text-[#F5F5F0]">Assistente da Academia</div>
              <div className="text-[0.65rem] text-[#00E676] font-medium tracking-tight">ONLINE</div>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-3 min-h-[300px]">
            <div className="max-w-[85%] self-end bg-[#1A5C2A] text-[#D4F5DA] p-3 rounded-2xl rounded-tr-sm text-[0.8rem] leading-relaxed relative">
              Oi Carol! Consegue marcar uma aula pra mim amanhã às 15h?
              <div className="text-[0.6rem] opacity-50 text-right mt-1">09:12</div>
            </div>
            <div className="max-w-[85%] self-start bg-[#16161A] text-[#CFCFC8] border border-[#222228] p-3 rounded-2xl rounded-tl-sm text-[0.8rem] leading-relaxed relative">
              Oi Rafael! Verifiquei aqui na agenda da Carol e esse horário está disponível. Posso reservar pra você?
              <div className="text-[0.6rem] opacity-50 text-left mt-1">09:12</div>
            </div>
            <div className="max-w-[85%] self-end bg-[#1A5C2A] text-[#D4F5DA] p-3 rounded-2xl rounded-tr-sm text-[0.8rem] leading-relaxed relative">
              Pode sim, por favor!
              <div className="text-[0.6rem] opacity-50 text-right mt-1">09:13</div>
            </div>
            <div className="max-w-[85%] self-start bg-[#16161A] text-[#CFCFC8] border border-[#222228] p-3 rounded-2xl rounded-tl-sm text-[0.8rem] leading-relaxed relative">
              Pronto! Sua aula está agendada para amanhã (23/03) às 15:00. Acabei de avisar a Carol por aqui. 💪
              <div className="text-[0.6rem] opacity-50 text-left mt-1">09:13</div>
            </div>
          </div>
          <div className="bg-[#1A1A20] px-4 py-3 border-t border-[#222228] flex items-center gap-3">
            <div className="flex-1 bg-[#2A2A30] border border-[#222228] rounded-full px-4 py-2 text-[0.8rem] text-[#7A7A85]">
              Sua mensagem...
            </div>
            <div className="w-8 h-8 bg-[#FF5C00] rounded-full flex items-center justify-center text-white">
              <Send className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
