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
  X,
  Tag,
  Link
} from "lucide-react";
import { useState, useEffect } from "react";
import { getStudents, createStudent } from "@/app/actions/students";
import { getStudentGroups } from "@/app/actions/groups";
import ModalPortal from "@/components/ModalPortal";
import { maskPhone } from "@/lib/utils";

export default function AlunosPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    const [stData, gpData] = await Promise.all([
      getStudents(),
      getStudentGroups()
    ]);
    setStudents(stData);
    setGroups(gpData);
    setIsLoading(false);
  }

  async function handleAddStudent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await createStudent(formData);

    if (result.success) {
      setIsModalOpen(false);
      loadData();
    } else {
      alert("Erro ao adicionar aluno: " + result.error);
    }
  }

  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-up max-w-[1400px] mx-auto">
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
          className="bg-[#FF5C00] text-white text-sm font-bold px-6 py-3 rounded-2xl shadow-[0_0_20px_rgba(255,92,0,0.2)] hover:bg-[#FF7A2E] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-5 h-5" /> Novo Aluno
        </button>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-[#16161A] border border-[#222228] p-4 rounded-3xl shadow-lg">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7A85]" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0A0A0B] border border-[#222228] rounded-2xl pl-12 pr-4 py-3 text-sm text-[#F5F5F0] focus:border-[#FF5C00] transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#0A0A0B] border border-[#222228] rounded-2xl text-[0.8rem] text-[#7A7A85] hover:text-[#F5F5F0] hover:border-[#7A7A85] transition-all cursor-pointer">
            <Filter className="w-4 h-4" /> Filtros
          </button>
          <div className="hidden sm:flex items-center gap-2">
            {groups.slice(0, 3).map(g => (
              <span key={g.id} className="text-[0.6rem] font-bold px-3 py-1.5 rounded-xl border border-[#222228] text-[#7A7A85] flex items-center gap-1.5 bg-[#0A0A0B]">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: g.color }}></span>
                {g.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* List Container */}
      <div className="animate-in fade-in slide-in-from-bottom-2">
        <div className="hidden md:block bg-[#16161A] border border-[#222228] rounded-[32px] overflow-hidden shadow-xl">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-[#111114] border-b border-[#222228]">
                <th className="px-6 py-5 text-[0.65rem] font-mono text-[#7A7A85] uppercase tracking-wider">Aluno</th>
                <th className="px-6 py-5 text-[0.65rem] font-mono text-[#7A7A85] uppercase tracking-wider">Categoria / Grupo</th>
                <th className="px-6 py-5 text-[0.65rem] font-mono text-[#7A7A85] uppercase tracking-wider text-center">Objetivo</th>
                <th className="px-6 py-5 text-[0.65rem] font-mono text-[#7A7A85] uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-5 text-[0.65rem] font-mono text-[#7A7A85] uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222228]">
              {isLoading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8 h-20 bg-[#16161A]/50"></td>
                  </tr>
                ))
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#7A7A85]">Nenhum aluno encontrado.</td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-[#0A0A0B]/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#0A0A0B] border border-[#222228] flex items-center justify-center font-bold text-sm text-[#FF5C00]">
                          {student.name.split(" ").map((n: string) => n[0]).join("")}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#F5F5F0] group-hover:text-[#FF5C00] transition-colors">{student.name}</div>
                          <div className="text-[0.7rem] text-[#7A7A85] mt-0.5">{student.email || "Sem e-mail"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {student.group ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[0.65rem] font-bold border border-white/5 bg-white/5" style={{ color: student.group.color }}>
                          <Tag className="w-3 h-3" />
                          {student.group.name}
                        </span>
                      ) : (
                        <span className="text-[0.65rem] text-[#333338] italic font-bold">Sem grupo</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-[0.7rem] font-bold bg-[#FF5C00]/10 text-[#FF5C00] px-3 py-1 rounded-lg border border-[#FF5C00]/15 uppercase">
                        {student.goal || "Geral"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`text-[0.7rem] font-bold px-3 py-1 rounded-full ${student.status === 'Ativo' ? 'bg-[#00E676]/10 text-[#00E676]' : 'bg-[#FF4444]/10 text-[#FF4444]'}`}>
                        {student.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/alunos/${student.id}`} className="p-2.5 bg-[#0A0A0B] border border-[#222228] rounded-xl text-[#7A7A85] hover:text-[#F5F5F0] hover:border-[#7A7A85] transition-all cursor-pointer">
                          <FileText className="w-4 h-4" />
                        </Link>
                        <button className="p-2.5 bg-[#0A0A0B] border border-[#222228] rounded-xl text-[#7A7A85] hover:text-white transition-all cursor-pointer">
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
          {filteredStudents.map((student) => (
            <div key={student.id} className="bg-[#16161A] border border-[#222228] p-5 rounded-3xl space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0A0A0B] border border-[#222228] flex items-center justify-center font-bold text-sm text-[#FF5C00]">
                  {student.name.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#F5F5F0] font-bold text-sm truncate">{student.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[0.6rem] bg-[#00E676]/10 text-[#00E676] px-1.5 py-0.5 rounded uppercase font-bold">{student.status}</span>
                    {student.group && <span className="text-[0.6rem] font-bold" style={{ color: student.group.color }}>{student.group.name}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/alunos/${student.id}`} className="flex-1 py-3 bg-[#0A0A0B] border border-[#222228] rounded-2xl text-[0.7rem] font-bold text-[#7A7A85] text-center">Ver Perfil</Link>
                <button className="p-3 bg-[#0A0A0B] border border-[#222228] rounded-2xl text-[#7A7A85]"><MoreHorizontal className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Add Student */}
      {isModalOpen && (
        <ModalPortal>
          <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="fixed inset-0" onClick={() => setIsModalOpen(false)}></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-2xl bg-[#16161A] border border-[#222228] rounded-[40px] shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="flex justify-between items-center p-8 border-b border-[#222228] bg-[#111114]">
                <h2 className="text-xl font-bold text-[#F5F5F0]">Novo Aluno</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-[#7A7A85] hover:text-[#F5F5F0] hover:bg-[#222228] rounded-xl cursor-pointer"><X className="w-6 h-6" /></button>
              </div>

              <form onSubmit={handleAddStudent} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold">Nome Completo</label>
                      <input name="name" required className="w-full bg-[#0A0A0B] border border-[#222228] rounded-2xl px-4 py-4 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all" placeholder="Nome do aluno" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold">WhatsApp</label>
                      <input name="phone" onChange={(e) => e.target.value = maskPhone(e.target.value)} className="w-full bg-[#0A0A0B] border border-[#222228] rounded-2xl px-4 py-4 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all" placeholder="(00) 00000-0000" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold">E-mail</label>
                      <input name="email" type="email" className="w-full bg-[#0A0A0B] border border-[#222228] rounded-2xl px-4 py-4 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all" placeholder="email@exemplo.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold">Grupo / Categoria</label>
                      <select name="groupId" className="w-full bg-[#0A0A0B] border border-[#222228] rounded-2xl px-4 py-4 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all appearance-none cursor-pointer">
                        <option value="">Sem grupo</option>
                        {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold">Objetivo Principal</label>
                      <input name="goal" className="w-full bg-[#0A0A0B] border border-[#222228] rounded-2xl px-4 py-4 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all" placeholder="Ex: Hipertrofia" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold">Valor (R$)</label>
                        <input name="planValue" type="number" className="w-full bg-[#0A0A0B] border border-[#222228] rounded-2xl px-4 py-4 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold">Vencimento</label>
                        <input name="paymentDay" type="number" min="1" max="31" className="w-full bg-[#0A0A0B] border border-[#222228] rounded-2xl px-4 py-4 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all" placeholder="Dia" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-8 border-t border-[#222228] bg-[#111114]">
                  <button type="submit" className="w-full bg-[#FF5C00] text-white py-5 rounded-2xl font-bold shadow-xl shadow-[#FF5C00]/20 hover:bg-[#FF7A2E] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer">
                    Finalizar Cadastro
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
