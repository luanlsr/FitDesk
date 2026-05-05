"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Phone, 
  Mail, 
  Instagram, 
  TrendingUp,
  X,
  UserPlus
} from "lucide-react";
import { useState, useEffect } from "react";
import { getLeads, createLead, updateLeadStatus, deleteLead } from "@/app/actions/leads";

const columns = [
  { id: "Novo", label: "Novos Leads", color: "#64B5FF" },
  { id: "Em Contato", label: "Em Contato", color: "#FFD600" },
  { id: "Experimental", label: "Aula Experimental", color: "#FF5C00" },
  { id: "Convertido", label: "Convertidos", color: "#00E676" },
  { id: "Perdido", label: "Perdidos", color: "#FF4444" },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    const data = await getLeads();
    setLeads(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await updateLeadStatus(id, newStatus);
    if (res.success) fetchLeads();
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await createLead(formData);
    if (res.success) {
      setIsModalOpen(false);
      fetchLeads();
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-up">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F5F0]">CRM de Leads</h1>
          <p className="text-[#7A7A85] text-sm">Gerencie seu funil de vendas e converta novos alunos.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FF5C00] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(255,92,0,0.2)] hover:bg-[#FF7A2E] transition-all flex items-center gap-2 group cursor-pointer"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          Novo Lead
        </button>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {columns.map((column) => (
          <div key={column.id} className="min-w-[300px] flex-shrink-0 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: column.color }}></div>
                <h2 className="text-xs font-bold text-[#F5F5F0] uppercase tracking-wider">{column.label}</h2>
                <span className="text-[0.65rem] text-[#7A7A85] bg-[#111114] px-2 py-0.5 rounded-full border border-[#222228]">
                  {leads.filter(l => l.status === column.id).length}
                </span>
              </div>
              <button className="text-[#333338] hover:text-[#7A7A85] transition-colors"><MoreVertical className="w-4 h-4" /></button>
            </div>

            <div className="bg-[#111114]/50 border border-[#222228] p-2 rounded-2xl flex-1 space-y-3 min-h-[500px]">
              {loading ? (
                Array(2).fill(0).map((_, i) => (
                  <div key={i} className="h-32 bg-[#16161A] border border-[#222228] rounded-xl animate-pulse" />
                ))
              ) : (
                <AnimatePresence>
                  {leads.filter(l => l.status === column.id).map((lead, i) => (
                    <motion.div
                      key={lead.id}
                      layoutId={lead.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-[#16161A] border border-[#222228] p-4 rounded-xl hover:border-[#FF5C00]/30 transition-all group relative cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[0.6rem] text-[#7A7A85] uppercase font-bold tracking-tighter opacity-50">{lead.origin || "Origem não info"}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {column.id !== "Convertido" && (
                            <button 
                              onClick={() => handleStatusChange(lead.id, columns[columns.findIndex(c => c.id === column.id) + 1]?.id)}
                              className="p-1 hover:bg-[#222228] rounded-md text-[#00E676]"
                            >
                              <TrendingUp className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="text-[#F5F5F0] text-sm font-bold mb-3">{lead.name}</h3>
                      
                      <div className="flex items-center gap-3 mb-4">
                        {lead.phone && <Phone className="w-3 h-3 text-[#7A7A85]" />}
                        {lead.email && <Mail className="w-3 h-3 text-[#7A7A85]" />}
                        {lead.origin === "Instagram" && <Instagram className="w-3 h-3 text-[#FF5C00]" />}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-[#FFD600] font-mono font-bold text-xs">
                          {lead.value ? `R$ ${lead.value.toFixed(2)}` : "R$ 0,00"}
                        </div>
                        <div className="text-[0.6rem] text-[#333338] font-mono">
                          {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#111114] border border-[#222228] rounded-3xl p-8 relative z-10 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#FFD600]/10 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-[#FFD600]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#F5F5F0]">Novo Lead</h2>
                <p className="text-xs text-[#7A7A85]">Adicione um potencial aluno ao seu funil.</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[0.7rem] uppercase font-bold text-[#7A7A85] ml-1">Nome</label>
                <input name="name" required className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" placeholder="Nome do prospect..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[0.7rem] uppercase font-bold text-[#7A7A85] ml-1">Telefone</label>
                  <input name="phone" className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" placeholder="(11) 9...." />
                </div>
                <div className="space-y-2">
                  <label className="text-[0.7rem] uppercase font-bold text-[#7A7A85] ml-1">Origem</label>
                  <select name="origin" className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]">
                    <option>Instagram</option>
                    <option>Indicação</option>
                    <option>Site/Landing Page</option>
                    <option>Outros</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[0.7rem] uppercase font-bold text-[#7A7A85] ml-1">Valor Estimado (Plano)</label>
                <input name="value" type="number" step="0.01" className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" placeholder="Ex: 150.00" />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-[#16161A] text-[#7A7A85] rounded-xl font-bold cursor-pointer">Cancelar</button>
                <button type="submit" className="flex-[2] py-3 bg-[#FF5C00] text-white rounded-xl font-bold hover:bg-[#FF7A2E] shadow-xl cursor-pointer">Adicionar ao Funil</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
