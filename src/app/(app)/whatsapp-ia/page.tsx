"use client";

import { motion } from "framer-motion";
import { 
  MessageSquare, 
  QrCode, 
  Settings, 
  Smartphone, 
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Send,
  MoreVertical
} from "lucide-react";

export default function WhatsAppIAPage() {
  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-up">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-5 h-5 text-[#FF5C00]" />
            <h1 className="text-2xl font-bold text-[#F5F5F0]">IA no WhatsApp</h1>
          </div>
          <p className="text-[#7A7A85] text-sm">Configure seu assistente virtual para agendamentos e atendimento automático.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-[#111114] border border-[#222228] text-sm font-medium px-4 py-2.5 rounded-xl text-[#FF4444] hover:border-[#FF4444]/30 hover:bg-[#FF4444]/5 transition-all flex items-center gap-2">
            Desconectar Número
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
        {/* Connection Status & QR Code */}
        <section className="bg-[#16161A] border border-[#222228] rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-[#222228] bg-[#111114] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#FF5C00]" />
              <h2 className="text-sm font-bold text-[#F5F5F0] uppercase tracking-wider">Conexão do Chip</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#00E676] rounded-full animate-pulse"></span>
              <span className="text-[0.65rem] font-bold text-[#00E676] uppercase tracking-widest">Ativo</span>
            </div>
          </div>
          
          <div className="p-8 flex flex-col items-center justify-center gap-6">
            <div className="p-4 bg-white rounded-3xl relative group cursor-pointer shadow-[0_0_40px_rgba(255,255,255,0.05)]">
              <QrCode className="w-32 h-32 text-[#0A0A0B]" />
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <CheckCircle2 className="w-12 h-12 text-[#00E676]" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-sm font-bold text-[#F5F5F0]">Telefone: (11) 98765-4321</div>
              <div className="text-[0.7rem] text-[#7A7A85] uppercase tracking-widest">Última sincronização: 5 min atrás</div>
            </div>
          </div>
          
          <div className="p-6 bg-[#0A0A0B]/50 border-t border-[#222228] space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#FFD600] flex-shrink-0 mt-0.5" />
              <p className="text-[0.7rem] text-[#7A7A85] leading-relaxed italic font-light">
                Mantenha seu celular conectado à internet e carregado para o assistente da IA continuar respondendo.
              </p>
            </div>
          </div>
        </section>

        {/* Configuration Area */}
        <div className="space-y-6">
          <section className="bg-[#16161A] border border-[#222228] rounded-3xl p-8 space-y-8">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-5 h-5 text-[#64B5FF]" />
              <h2 className="text-lg font-bold text-[#F5F5F0]">Ajustes do Assistente</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-1.5 px-1">
                  <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold">Nome do Assistente</label>
                  <input 
                    className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all"
                    defaultValue="Assistente do FitDesk"
                  />
                </div>
                <div className="space-y-1.5 px-1">
                  <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold">Tom de Voz</label>
                  <select className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all appearance-none">
                    <option>Amigável & Motivacional</option>
                    <option>Formal & Direto</option>
                    <option>Descontraído & Informal</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5 px-1">
                  <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold">Status Automático</label>
                  <div className="p-4 bg-[#0A0A0B] border border-[#222228] rounded-xl flex items-center justify-between">
                    <div className="text-[0.8rem] text-[#F5F5F0] font-medium">Responder agendamentos</div>
                    <div className="w-10 h-5 bg-[#FF5C00] rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(255,92,0,0.3)]">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5 px-1">
                  <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold">Modo "Não Perturbe"</label>
                  <div className="p-4 bg-[#0A0A0B] border border-[#222228] rounded-xl flex items-center justify-between">
                    <div className="text-[0.8rem] text-[#F5F5F0] font-medium">Das 22h às 06h</div>
                    <div className="w-10 h-5 bg-[#222228] rounded-full relative cursor-pointer">
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-[#7A7A85] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button className="bg-[#FF5C00] text-white text-sm font-bold px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(255,92,0,0.2)] hover:bg-[#FF7A2E] hover:scale-[1.02] transition-all">
                Salvar Alterações
              </button>
            </div>
          </section>

          {/* Training Area Preview */}
          <section className="bg-[#16161A] border border-[#222228] rounded-3xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-[#00E676]" />
              <h2 className="text-lg font-bold text-[#F5F5F0]">Simulação de Resposta</h2>
            </div>
            <div className="bg-[#0A0A0B] border border-[#222228] rounded-2xl overflow-hidden min-h-[120px] p-6 relative group">
              <div className="text-[0.8rem] text-[#F5F5F0] font-light leading-relaxed italic opacity-80">
                “Oi {`{aluno_nome}`}! Vi aqui na agenda do {`{personal_nome}`} que ele tem um horário disponível na segunda às 15h. Vamos marcar?”
              </div>
              <div className="absolute bottom-4 right-4 text-[0.6rem] text-[#7A7A85] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Clique para editar template
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
