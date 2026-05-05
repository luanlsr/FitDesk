"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Dumbbell, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Clock, 
  ChevronRight,
  User,
  Trash2,
  CheckCircle2,
  X,
  PlusCircle,
  Hash
} from "lucide-react";
import { useState, useEffect } from "react";
import { getWorkouts, createWorkout, addExerciseToWorkout, deleteWorkout } from "@/app/actions/workouts";
import { getStudents } from "@/app/actions/students";
import ModalPortal from "@/components/ModalPortal";

export default function TreinosPage() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const [wData, sData] = await Promise.all([getWorkouts(), getStudents()]);
    setWorkouts(wData);
    setStudents(sData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateWorkout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const studentId = formData.get("studentId") as string;
    const name = formData.get("name") as string;
    const desc = formData.get("description") as string;

    const res = await createWorkout(studentId, name, desc);
    if (res.success) {
      setIsModalOpen(false);
      fetchData();
    }
  };

  const handleAddExercise = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      sets: parseInt(formData.get("sets") as string),
      reps: formData.get("reps") as string,
      weight: formData.get("weight") as string,
      rest: formData.get("rest") as string,
    };

    const res = await addExerciseToWorkout(selectedWorkout.id, data);
    if (res.success) {
      setIsAddExerciseOpen(false);
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja remover esta ficha de treino?")) {
      const res = await deleteWorkout(id);
      if (res.success) fetchData();
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-up">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Dumbbell className="w-5 h-5 text-[#FF5C00]" />
            <h1 className="text-2xl font-bold text-[#F5F5F0]">Fichas de Treino</h1>
          </div>
          <p className="text-[#7A7A85] text-sm">Crie e gerencie os treinos personalizados dos seus alunos.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FF5C00] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(255,92,0,0.2)] hover:bg-[#FF7A2E] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nova Ficha
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          Array(2).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-[#16161A] border border-[#222228] rounded-2xl animate-pulse" />
          ))
        ) : workouts.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-[#111114] border border-[#222228] rounded-3xl">
            <Dumbbell className="w-12 h-12 text-[#222228] mx-auto mb-4" />
            <p className="text-[#7A7A85]">Nenhuma ficha encontrada. Comece criando uma para um aluno.</p>
          </div>
        ) : (
          workouts.map((workout, i) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#16161A] border border-[#222228] rounded-2xl overflow-hidden hover:border-[#FF5C00]/30 transition-all group"
            >
              <div className="p-6 border-b border-[#222228]/50 flex justify-between items-start bg-[#111114]/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FF5C00]/10 rounded-2xl flex items-center justify-center text-[#FF5C00]">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-[#F5F5F0] font-bold">{workout.student?.name}</h3>
                    <div className="text-[0.65rem] text-[#FF5C00] font-bold uppercase tracking-widest">{workout.name}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setSelectedWorkout(workout);
                      setIsAddExerciseOpen(true);
                    }}
                    className="p-2 bg-[#0A0A0B] border border-[#222228] rounded-lg text-[#7A7A85] hover:text-[#FF5C00] transition-all cursor-pointer"
                    title="Adicionar Exercício"
                  >
                    <PlusCircle className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(workout.id)}
                    className="p-2 bg-[#0A0A0B] border border-[#222228] rounded-lg text-[#7A7A85] hover:text-[#FF4444] transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto no-scrollbar">
                {workout.exercises.length === 0 ? (
                  <p className="text-[0.7rem] text-[#333338] italic">Nenhum exercício adicionado a esta ficha.</p>
                ) : (
                  <div className="space-y-3">
                    {workout.exercises.map((ex: any) => (
                      <div key={ex.id} className="flex items-center justify-between p-3 bg-[#0A0A0B] rounded-xl border border-[#222228] group-hover:border-[#FF5C00]/10 transition-all">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-[#00E676]" />
                          <div>
                            <div className="text-sm font-semibold text-[#F5F5F0]">{ex.name}</div>
                            <div className="text-[0.65rem] text-[#7A7A85] font-mono">
                              {ex.sets}x {ex.reps} · {ex.weight || 'Sem carga'} · Descanso {ex.rest || 'N/I'}
                            </div>
                          </div>
                        </div>
                        <MoreVertical className="w-4 h-4 text-[#333338]" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal Nova Ficha */}
      {isModalOpen && (
        <ModalPortal>
          <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="fixed inset-0" onClick={() => setIsModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-lg bg-[#16161A] border border-[#222228] rounded-[32px] shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Header Fixo */}
              <div className="flex justify-between items-center p-8 border-b border-[#222228] bg-[#111114]">
                <h2 className="text-xl font-bold text-[#F5F5F0]">Criar Ficha de Treino</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-[#7A7A85] hover:text-[#F5F5F0] hover:bg-[#222228] rounded-xl transition-all cursor-pointer"><X className="w-6 h-6" /></button>
              </div>

              <form onSubmit={handleCreateWorkout} id="create-workout-form" className="flex flex-col flex-1 overflow-hidden">
                  {/* Body com Rolagem */}
                  <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                      <div className="space-y-4">
                          <div className="space-y-2">
                              <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Aluno</label>
                              <select name="studentId" required className="w-full bg-[#0A0A0B] border border-[#222228] p-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]">
                                  <option value="">Selecione um aluno...</option>
                                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                              </select>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Identificação (Ex: Treino A, Treino de Pernas)</label>
                              <input name="name" required className="w-full bg-[#0A0A0B] border border-[#222228] p-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" placeholder="Nome da ficha" />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Descrição (Opcional)</label>
                              <textarea name="description" rows={3} className="w-full bg-[#0A0A0B] border border-[#222228] p-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00] resize-none" placeholder="Ex: Focar em amplitude máxima..." />
                          </div>
                      </div>
                  </div>

                  {/* Footer Fixo */}
                  <div className="p-8 border-t border-[#222228] bg-[#111114]">
                      <button type="submit" className="w-full bg-[#FF5C00] text-white py-4 rounded-xl font-bold hover:bg-[#FF7A2E] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-xl shadow-[#FF5C00]/10">
                          Criar Treino
                      </button>
                  </div>
              </form>
            </motion.div>
          </div>
        </ModalPortal>
      )}

      {/* Modal Adicionar Exercício */}
      {isAddExerciseOpen && (
        <ModalPortal>
          <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="fixed inset-0" onClick={() => setIsAddExerciseOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-lg bg-[#16161A] border border-[#222228] rounded-[32px] shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Header Fixo */}
              <div className="flex justify-between items-center p-8 border-b border-[#222228] bg-[#111114]">
                <div>
                  <h2 className="text-xl font-bold text-[#F5F5F0]">Adicionar Exercício</h2>
                  <p className="text-xs text-[#7A7A85] uppercase tracking-wider font-bold mt-1">Ficha: {selectedWorkout?.name}</p>
                </div>
                <button onClick={() => setIsAddExerciseOpen(false)} className="p-2 text-[#7A7A85] hover:text-[#F5F5F0] hover:bg-[#222228] rounded-xl transition-all cursor-pointer"><X className="w-6 h-6" /></button>
              </div>

              <form onSubmit={handleAddExercise} id="add-exercise-form" className="flex flex-col flex-1 overflow-hidden">
                  {/* Body com Rolagem */}
                  <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                      <div className="space-y-5">
                          <div className="space-y-2">
                              <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Nome do Exercício</label>
                              <div className="relative">
                                  <Dumbbell className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333338]" />
                                  <input name="name" required className="w-full bg-[#0A0A0B] border border-[#222228] pl-10 pr-4 py-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" placeholder="Ex: Agachamento Livre" />
                              </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Séries</label>
                                  <div className="relative">
                                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333338]" />
                                      <input name="sets" type="number" required defaultValue={3} className="w-full bg-[#0A0A0B] border border-[#222228] pl-10 pr-4 py-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" />
                                  </div>
                              </div>
                              <div className="space-y-2">
                                  <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Repetições</label>
                                  <input name="reps" required className="w-full bg-[#0A0A0B] border border-[#222228] p-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" placeholder="Ex: 8 a 12" />
                              </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Carga/Peso</label>
                                  <input name="weight" className="w-full bg-[#0A0A0B] border border-[#222228] p-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" placeholder="Ex: 20kg cada lado" />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Descanso</label>
                                  <div className="relative">
                                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333338]" />
                                      <input name="rest" className="w-full bg-[#0A0A0B] border border-[#222228] pl-10 pr-4 py-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" placeholder="Ex: 60s" />
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Footer Fixo */}
                  <div className="p-8 border-t border-[#222228] bg-[#111114]">
                      <button type="submit" className="w-full bg-[#00E676] text-black py-4 rounded-xl font-bold cursor-pointer hover:bg-[#00C864] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#00E676]/10">
                          Salvar no Treino
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
