"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  TrendingUp,
  FileText,
  UserCheck2,
  ChevronLeft,
  ChevronRight,
  X 
} from "lucide-react";
import { useState, useEffect } from "react";
import { getStudents, createStudent } from "@/app/actions/students";
import ModalPortal from "@/components/ModalPortal";

export default function AlunosPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    setIsLoading(true);
    const data = await getStudents();
    setStudents(data);
    setIsLoading(false);
  }

  async function handleAddStudent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await createStudent(formData);
    
    if (result.success) {
      setIsModalOpen(false);
      loadStudents();
    } else {
      alert("Erro ao adicionar aluno: " + result.error);
    }
  }

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-up">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-[#FF5C00]" />
            <h1 className="text-2xl font-bold text-[#F5F5F0]">Meus Alunos</h1>
          </div>
          <p className="text-[#7A7A85] text-sm">Gerencie sua lista de alunos, treinos e avaliações.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FF5C00] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(255,92,0,0.2)] hover:bg-[#FF7A2E] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Novo Aluno
        </button>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-[#16161A] border border-[#222228] p-4 rounded-2xl shadow-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7A85]" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou e-mail..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl pl-10 pr-4 py-3 md:py-2 text-sm text-[#F5F5F0] focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00]/20 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 md:py-2 bg-[#0A0A0B] border border-[#222228] rounded-xl text-[0.8rem] text-[#7A7A85] hover:text-[#F5F5F0] hover:border-[#7A7A85] transition-all">
            <Filter className="w-4 h-4" /> Filtros
          </button>
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 md:py-2 bg-[#0A0A0B] border border-[#222228] rounded-xl text-[0.8rem] text-[#7A7A85] hover:text-[#F5F5F0] hover:border-[#7A7A85] transition-all">
            Exportar CSV
          </button>
        </div>
      </div>

      {/* List Container */}
      <div className="animate-in fade-in slide-in-from-bottom-2">
        {/* Desktop Table */}
        <div className="hidden md:block bg-[#16161A] border border-[#222228] rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-[#111114] border-b border-[#222228]">
                <th className="px-6 py-4 text-[0.65rem] font-mono text-[#7A7A85] uppercase tracking-wider">Aluno</th>
                <th className="px-6 py-4 text-[0.65rem] font-mono text-[#7A7A85] uppercase tracking-wider">Contato</th>
                <th className="px-6 py-4 text-[0.65rem] font-mono text-[#7A7A85] uppercase tracking-wider text-center">Objetivo</th>
                <th className="px-6 py-4 text-[0.65rem] font-mono text-[#7A7A85] uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[0.65rem] font-mono text-[#7A7A85] uppercase tracking-wider text-center">Início</th>
                <th className="px-6 py-4 text-[0.65rem] font-mono text-[#7A7A85] uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222228]">
              {isLoading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-4 h-16 bg-[#16161A]/50"></td>
                  </tr>
                ))
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#7A7A85]">
                    Nenhum aluno encontrado.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-[#0A0A0B]/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0A0A0B] border border-[#222228] flex items-center justify-center font-bold text-xs text-[#F5F5F0]">
                          {student.name.split(" ").map((n: string) => n[0]).join("")}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#F5F5F0] group-hover:text-[#FF5C00] transition-colors">{student.name}</div>
                          <div className="text-[0.7rem] text-[#7A7A85] flex items-center gap-1">
                            <UserCheck2 className="w-3 h-3" /> Aluno Ativo
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-[0.75rem] text-[#CFCFC8] flex items-center gap-2">
                          <Mail className="w-3 h-3 text-[#7A7A85]" /> {student.email || "-"}
                        </div>
                        <div className="text-[0.75rem] text-[#CFCFC8] flex items-center gap-2">
                          <Phone className="w-3 h-3 text-[#7A7A85]" /> {student.phone || "-"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[0.7rem] font-medium bg-[#FF5C00]/10 text-[#FF5C00] px-3 py-1 rounded-full border border-[#FF5C00]/15 uppercase tracking-tight">
                        {student.goal || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[0.7rem] font-medium bg-[#00E676]/10 text-[#00E676] px-3 py-1 rounded-full border border-[#00E676]/15 uppercase tracking-tight">
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-[0.75rem] text-[#7A7A85]">
                      {new Date(student.startDate).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button title="Ver Perfil" className="p-2 bg-[#0A0A0B] border border-[#222228] rounded-lg text-[#7A7A85] hover:text-[#F5F5F0] hover:border-[#7A7A85] transition-all cursor-pointer">
                          <FileText className="w-4 h-4" />
                        </button>
                        <button title="Ver Evolução" className="p-2 bg-[#0A0A0B] border border-[#222228] rounded-lg text-[#7A7A85] hover:text-[#00E676] hover:border-[#00E676] transition-all cursor-pointer">
                          <TrendingUp className="w-4 h-4" />
                        </button>
                        <button title="Mais Opções" className="p-2 bg-[#0A0A0B] border border-[#222228] rounded-lg text-[#7A7A85] hover:text-white transition-all cursor-pointer">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {isLoading ? (
             [1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-[#16161A] border border-[#222228] rounded-2xl animate-pulse" />
             ))
          ) : filteredStudents.length === 0 ? (
            <div className="py-20 text-center bg-[#16161A] border border-[#222228] rounded-2xl text-[#7A7A85]">Nenhum aluno encontrado.</div>
          ) : (
            filteredStudents.map((student) => (
              <div key={student.id} className="bg-[#16161A] border border-[#222228] p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#0A0A0B] border border-[#222228] flex items-center justify-center font-bold text-sm text-[#F5F5F0]">
                    {student.name.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#F5F5F0] font-bold text-sm truncate">{student.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[0.6rem] bg-[#00E676]/10 text-[#00E676] px-1.5 py-0.5 rounded uppercase font-bold">{student.status}</span>
                      <span className="text-[0.6rem] text-[#7A7A85]">{student.goal || "Sem objetivo"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                   <div className="text-[0.7rem] text-[#CFCFC8] flex items-center gap-2 overflow-hidden">
                      <Mail className="w-3.5 h-3.5 text-[#7A7A85] shrink-0" />
                      <span className="truncate">{student.email || "-"}</span>
                   </div>
                   <div className="text-[0.7rem] text-[#CFCFC8] flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#7A7A85] shrink-0" />
                      <span>{student.phone || "-"}</span>
                   </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#222228]">
                   <span className="text-[0.6rem] text-[#333338] font-mono">Início: {new Date(student.startDate).toLocaleDateString("pt-BR")}</span>
                   <div className="flex gap-2">
                      <button className="p-2 bg-[#0A0A0B] border border-[#222228] rounded-lg text-[#FF5C00]">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-[#0A0A0B] border border-[#222228] rounded-lg text-[#00E676]">
                        <TrendingUp className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between">
        <div className="text-[0.8rem] text-[#7A7A85] italic font-light">
          Exibindo {filteredStudents.length} de {students.length} alunos
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-[#16161A] border border-[#222228] rounded-xl text-[#7A7A85] hover:border-[#7A7A85] transition-all disabled:opacity-30" disabled>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-2 bg-[#16161A] border border-[#222228] rounded-xl text-[#7A7A85] hover:border-[#7A7A85] transition-all disabled:opacity-30" disabled>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal Add Student */}
      {isModalOpen && (
        <ModalPortal>
          <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6">
            <div className="fixed inset-0" onClick={() => setIsModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-2xl bg-[#16161A] border border-[#222228] rounded-[32px] shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Header Fixo */}
              <div className="flex justify-between items-center p-6 md:p-8 border-b border-[#222228] bg-[#111114]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FF5C00]/10 rounded-xl flex items-center justify-center text-[#FF5C00]">
                      <Plus className="w-6 h-6" />
                  </div>
                  <div>
                      <h2 className="text-xl font-bold text-[#F5F5F0]">Adicionar Novo Aluno</h2>
                      <p className="text-xs text-[#7A7A85] mt-0.5">Preencha os dados do aluno para criar o perfil.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-[#7A7A85] hover:text-[#F5F5F0] hover:bg-[#222228] rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleAddStudent} className="flex flex-col flex-1 overflow-hidden">
                  {/* Corpo Rolável */}
                  <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
                     <div className="space-y-6">
                         <div className="space-y-3">
                          <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold ml-1">Dados Pessoais</label>
                          <div className="grid grid-cols-1 gap-4">
                              <div className="space-y-2">
                                  <label className="text-[0.65rem] text-[#333338] font-bold uppercase ml-1">Nome Completo</label>
                                  <input 
                                  name="name" 
                                  required 
                                  className="w-full bg-[#0A0A0B] border border-[#222228] rounded-2xl px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all"
                                  placeholder="Ex: João Silva de Souza"
                                  autoFocus
                                  />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                  <label className="text-[0.65rem] text-[#333338] font-bold uppercase ml-1">WhatsApp</label>
                                  <input 
                                      name="phone" 
                                      className="w-full bg-[#0A0A0B] border border-[#222228] rounded-2xl px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all"
                                      placeholder="(00) 00000-0000"
                                  />
                                  </div>
                                  <div className="space-y-2">
                                  <label className="text-[0.65rem] text-[#333338] font-bold uppercase ml-1">E-mail</label>
                                  <input 
                                      name="email" 
                                      type="email"
                                      className="w-full bg-[#0A0A0B] border border-[#222228] rounded-2xl px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all"
                                      placeholder="joao@email.com"
                                  />
                                  </div>
                              </div>
                          </div>
                         </div>

                         <div className="space-y-3 pt-4">
                          <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold ml-1">Histórico de Saúde</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                              <label className="text-[0.65rem] text-[#333338] font-bold uppercase ml-1">Lesões</label>
                              <input name="lesions" className="w-full bg-[#0A0A0B] border border-[#222228] px-4 py-3 rounded-2xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" placeholder="Nenhuma" />
                              </div>
                              <div className="space-y-2">
                              <label className="text-[0.65rem] text-[#333338] font-bold uppercase ml-1">Condições Médicas</label>
                              <input name="conditions" className="w-full bg-[#0A0A0B] border border-[#222228] px-4 py-3 rounded-2xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" placeholder="Nenhuma" />
                              </div>
                              <div className="space-y-2">
                              <label className="text-[0.65rem] text-[#333338] font-bold uppercase ml-1">Medicamentos</label>
                              <input name="medications" className="w-full bg-[#0A0A0B] border border-[#222228] px-4 py-3 rounded-2xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" placeholder="Nenhum" />
                              </div>
                              <div className="space-y-2">
                              <label className="text-[0.65rem] text-[#333338] font-bold uppercase ml-1">Cirurgias</label>
                              <input name="cirurgias" className="w-full bg-[#0A0A0B] border border-[#222228] px-4 py-3 rounded-2xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" placeholder="Nenhuma" />
                              </div>
                          </div>
                         </div>

                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
                          <label className="flex items-center gap-3 bg-[#0A0A0B] border border-[#222228] p-4 rounded-2xl cursor-pointer group hover:border-[#FF5C00]/30 transition-all">
                            <input type="checkbox" name="hipertensao" value="true" className="w-5 h-5 rounded-lg bg-[#16161A] border-[#222228] text-[#FF5C00] focus:ring-[#FF5C00] cursor-pointer" />
                            <span className="text-[0.7rem] text-[#7A7A85] font-bold uppercase group-hover:text-[#F5F5F0]">Hipertensão</span>
                          </label>
                          <label className="flex items-center gap-3 bg-[#0A0A0B] border border-[#222228] p-4 rounded-2xl cursor-pointer group hover:border-[#FF5C00]/30 transition-all">
                            <input type="checkbox" name="diabetes" value="true" className="w-5 h-5 rounded-lg bg-[#16161A] border-[#222228] text-[#FF5C00] focus:ring-[#FF5C00] cursor-pointer" />
                            <span className="text-[0.7rem] text-[#7A7A85] font-bold uppercase group-hover:text-[#F5F5F0]">Diabetes</span>
                          </label>
                          <label className="flex items-center gap-3 bg-[#0A0A0B] border border-[#222228] p-4 rounded-2xl cursor-pointer group hover:border-[#FF5C00]/30 transition-all">
                            <input type="checkbox" name="fumante" value="true" className="w-5 h-5 rounded-lg bg-[#16161A] border-[#222228] text-[#FF5C00] focus:ring-[#FF5C00] cursor-pointer" />
                            <span className="text-[0.7rem] text-[#7A7A85] font-bold uppercase group-hover:text-[#F5F5F0]">Fumante</span>
                          </label>
                         </div>

                         <div className="space-y-2">
                          <label className="text-[0.65rem] text-[#333338] font-bold uppercase ml-1">Observações Gerais</label>
                          <textarea name="observacoes" rows={3} className="w-full bg-[#0A0A0B] border border-[#222228] p-4 rounded-2xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00] resize-none" placeholder="Ex: Aluno sente dores no joelho ao realizar agachamento..."></textarea>
                         </div>
                     </div>
                  </div>

                  {/* Footer Fixo */}
                  <div className="p-6 md:p-8 border-t border-[#222228] bg-[#111114] flex flex-col sm:flex-row gap-4">
                     <button 
                       type="button"
                       onClick={() => setIsModalOpen(false)}
                       className="flex-1 bg-transparent border border-[#222228] text-[#7A7A85] py-4 rounded-2xl font-bold hover:bg-[#222228] hover:text-white transition-all order-2 sm:order-1"
                     >
                       Cancelar
                     </button>
                     <button 
                       type="submit"
                       className="flex-[2] bg-[#FF5C00] text-white py-4 rounded-xl font-bold shadow-[0_10px_40px_rgba(255,92,0,0.2)] hover:bg-[#FF7A2E] hover:scale-[1.02] active:scale-[0.98] transition-all order-1 sm:order-2"
                     >
                       Salvar Cadastro
                     </button>
                  </div>
              </form>
            </motion.div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
