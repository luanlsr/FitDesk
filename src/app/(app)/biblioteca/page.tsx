"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Dumbbell, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  PlayCircle, 
  Trash2,
  Tag,
  ChevronRight,
  X,
  PlusCircle,
  Video
} from "lucide-react";
import { useState, useEffect } from "react";
import { getLibraryExercises, createLibraryExercise, deleteLibraryExercise } from "@/app/actions/library";
import ModalPortal from "@/components/ModalPortal";

const categories = ["Peito", "Costas", "Pernas", "Ombros", "Braços", "Core", "Cardio", "Mobilidade", "Outros"];

export default function BibliotecaPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchExercises = async () => {
    setIsLoading(true);
    const data = await getLibraryExercises();
    setExercises(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const videoUrl = formData.get("videoUrl") as string;

    const res = await createLibraryExercise(name, category, videoUrl);
    if (res.success) {
      setIsModalOpen(false);
      fetchExercises();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja remover este exercício da biblioteca?")) {
      const res = await deleteLibraryExercise(id);
      if (res.success) fetchExercises();
      else alert(res.error);
    }
  };

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || ex.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-up">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Video className="w-5 h-5 text-[#FF5C00]" />
            <h1 className="text-2xl font-bold text-[#F5F5F0]">Biblioteca de Exercícios</h1>
          </div>
          <p className="text-[#7A7A85] text-sm">Acesse e catalogue seus exercícios favoritos para montagem rápida de treinos.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FF5C00] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(255,92,0,0.2)] hover:bg-[#FF7A2E] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Novo Exercício
        </button>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#16161A] border border-[#222228] p-4 rounded-2xl">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7A85]" />
          <input 
            type="text" 
            placeholder="Buscar exercício..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl pl-10 pr-4 py-2 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl text-[0.7rem] font-bold transition-all border whitespace-nowrap cursor-pointer ${!selectedCategory ? "bg-[#FF5C00] text-white border-[#FF5C00]" : "bg-[#0A0A0B] text-[#7A7A85] border-[#222228] hover:text-[#F5F5F0]"}`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-[0.7rem] font-bold transition-all border whitespace-nowrap cursor-pointer ${selectedCategory === cat ? "bg-[#FF5C00] text-white border-[#FF5C00]" : "bg-[#0A0A0B] text-[#7A7A85] border-[#222228] hover:text-[#F5F5F0]"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array(8).fill(0).map((_, i) => (
            <div key={i} className="h-40 bg-[#16161A] border border-[#222228] rounded-2xl animate-pulse" />
          ))
        ) : filteredExercises.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-[#111114] border border-[#222228] rounded-3xl">
            <Search className="w-12 h-12 text-[#222228] mx-auto mb-4" />
            <p className="text-[#7A7A85]">Nenhum exercício encontrado com este critério.</p>
          </div>
        ) : (
          filteredExercises.map((ex, i) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className="bg-[#16161A] border border-[#222228] p-5 rounded-2xl hover:border-[#FF5C00]/30 transition-all group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-[#FF5C00]/10 text-[#FF5C00] p-3 rounded-2xl">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div className="flex gap-1">
                  {ex.videoUrl && (
                    <a href={ex.videoUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#0A0A0B] border border-[#222228] rounded-xl text-[#FFD600] hover:bg-[#FFD600]/10 transition-all">
                      <PlayCircle className="w-4 h-4" />
                    </a>
                  )}
                  <button onClick={() => handleDelete(ex.id)} className="p-2 bg-[#0A0A0B] border border-[#222228] rounded-xl text-[#7A7A85] hover:text-[#FF4444] transition-all cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-[#F5F5F0] font-bold mb-1 truncate">{ex.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-[0.65rem] text-[#7A7A85] uppercase tracking-widest font-bold">{ex.category}</span>
                {ex.userId === null && (
                  <span className="text-[0.55rem] bg-[#00E676]/10 text-[#00E676] px-1.5 py-0.5 rounded border border-[#00E676]/20">Global</span>
                )}
              </div>

              <div className="absolute -bottom-1 -right-1 opacity-5 group-hover:opacity-10 transition-opacity">
                <Dumbbell className="w-20 h-20 rotate-12" />
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal Novo Exercício */}
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
                <h2 className="text-xl font-bold text-[#F5F5F0]">Adicionar à Biblioteca</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-[#7A7A85] hover:text-[#F5F5F0] hover:bg-[#222228] rounded-xl transition-all cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreate} id="add-library-form" className="flex flex-col flex-1 overflow-hidden">
                  {/* Body com Rolagem */}
                  <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                      <div className="space-y-4">
                          <div className="space-y-2">
                              <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Nome do Exercício</label>
                              <input name="name" required className="w-full bg-[#0A0A0B] border border-[#222228] p-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" placeholder="Ex: Supino Reto com Barra" />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Categoria</label>
                              <select name="category" required className="w-full bg-[#0A0A0B] border border-[#222228] p-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]">
                                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Vídeo Privado/YouTube (URL)</label>
                              <div className="relative">
                                  <PlayCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333338]" />
                                  <input name="videoUrl" className="w-full bg-[#0A0A0B] border border-[#222228] pl-10 pr-4 py-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" placeholder="https://..." />
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Footer Fixo */}
                  <div className="p-8 border-t border-[#222228] bg-[#111114]">
                      <button type="submit" className="w-full bg-[#FF5C00] text-white py-4 rounded-xl font-bold hover:bg-[#FF7A2E] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-xl shadow-[#FF5C00]/10">
                          Salvar na Biblioteca
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
