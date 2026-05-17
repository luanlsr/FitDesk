"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  Plus,
  Search,
  MoreVertical,
  PlayCircle,
  Trash2,
  X,
  Video
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { getLibraryExercises, createLibraryExercise, deleteLibraryExercise } from "@/app/actions/library";
import ModalPortal from "@/components/ModalPortal";
import { ExerciseVisual } from "@/components/ExerciseVisual";

const DEFAULT_CATEGORIES = ["Peito", "Costas", "Pernas", "Ombros", "Braços", "Core", "Cardio", "Mobilidade", "Alongamento"];

function getNormalizedCategory(category: string): string {
  if (!category) return "Outros";
  const cat = category.toLowerCase().trim();
  
  if (cat === "peito" || cat === "chest") return "Peito";
  if (cat === "costas" || cat === "back" || cat === "dorsais" || cat === "meio-das-costas") return "Costas";
  if (cat === "ombros" || cat === "shoulders") return "Ombros";
  if (cat === "braços" || cat === "triceps" || cat === "biceps" || cat === "antebracos" || cat === "arms" || cat === "braço" || cat === "braco") return "Braços";
  if (
    cat === "pernas" || 
    cat === "quadriceps" || 
    cat === "gluteos" || 
    cat === "isquiotibiais" || 
    cat === "panturrilhas" || 
    cat === "abdutores" || 
    cat === "adutores" || 
    cat === "legs" || 
    cat === "perna" || 
    cat === "glúteos" || 
    cat === "quadríceps"
  ) return "Pernas";
  if (cat === "core" || cat === "abdominais" || cat === "abs" || cat === "abdômen" || cat === "abdomen") return "Core";
  if (cat === "cardio" || cat === "aeróbico") return "Cardio";
  if (cat === "mobilidade" || cat === "flexibilidade") return "Mobilidade";
  if (cat === "alongamento" || cat === "stretching") return "Alongamento";

  return category.charAt(0).toUpperCase() + category.slice(1);
}

export default function BibliotecaPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<any | null>(null);
  const [displayLimit, setDisplayLimit] = useState(24);

  // Deriva dinamicamente as categorias unindo a lista padrão com as categorias normalizadas do banco
  const categories = useMemo(() => {
    const dbCategories = exercises.map(ex => getNormalizedCategory(ex.category)).filter(Boolean);
    return Array.from(new Set([...DEFAULT_CATEGORIES, ...dbCategories]));
  }, [exercises]);

  const fetchExercises = async () => {
    setIsLoading(true);
    const data = await getLibraryExercises();
    setExercises(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  // Resetar o limite quando o filtro mudar
  useEffect(() => {
    setDisplayLimit(24);
  }, [searchTerm, selectedCategory]);

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
      const normalizedExCat = getNormalizedCategory(ex.category);
      const matchesCategory = !selectedCategory || normalizedExCat === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [exercises, searchTerm, selectedCategory]);

  const displayedExercises = useMemo(() => {
    return filteredExercises.slice(0, displayLimit);
  }, [filteredExercises, displayLimit]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;

    const res = await createLibraryExercise(name, category, videoUrl, description, imageUrl);
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
        ) : displayedExercises.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-[#111114] border border-[#222228] rounded-3xl">
            <Search className="w-12 h-12 text-[#222228] mx-auto mb-4" />
            <p className="text-[#7A7A85]">Nenhum exercício encontrado com este critério.</p>
          </div>
        ) : (
          displayedExercises.map((ex, i) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedExercise(ex)}
              className="bg-[#16161A] border border-[#222228] rounded-2xl hover:border-[#FF5C00]/30 transition-all group relative overflow-hidden flex flex-col cursor-pointer hover:bg-[#1C1C21]"
            >
                  <div className="relative group overflow-hidden bg-[#0A0A0B]">
                    <ExerciseVisual 
                      imageUrl={ex.imageUrl} 
                      videoUrl={ex.videoUrl} 
                      className="w-full aspect-video"
                      animate={false} 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 bg-[#FF5C00] rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                        <PlayCircle className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                <div className="absolute top-3 right-3 flex gap-1">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(ex.id);
                    }} 
                    className="p-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-white/60 hover:text-[#FF4444] hover:bg-[#FF4444]/10 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="text-[0.6rem] bg-[#FF5C00] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    {getNormalizedCategory(ex.category)}
                  </span>
                </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#F5F5F0] font-bold truncate pr-2">{ex.name}</h3>
                  {ex.personalId === null && (
                    <span className="text-[0.5rem] bg-[#00E676]/10 text-[#00E676] px-1.5 py-0.5 rounded border border-[#00E676]/20 flex-shrink-0">GLOBAL</span>
                  )}
                </div>
                
                <p className="text-[#7A7A85] text-[0.75rem] line-clamp-2 leading-relaxed mb-4">
                  {ex.description || "Sem descrição disponível."}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#222228]">
                   <span className="text-[0.6rem] text-[#333338] font-mono">ID: {ex.id.slice(-6)}</span>
                   <span className="text-[0.65rem] font-bold text-[#FF5C00]/40 group-hover:text-[#FF5C00] uppercase tracking-wider transition-colors">
                     Clique para detalhes
                   </span>
                </div>
              </div>
            </motion.div>
      ))
        )}
    </div>

      {/* Botão Carregar Mais */ }
  {
    !isLoading && filteredExercises.length > displayedExercises.length && (
      <div className="mt-12 flex flex-col items-center gap-4">
        <p className="text-[#7A7A85] text-xs">Exibindo {displayedExercises.length} de {filteredExercises.length} exercícios</p>
        <button
          onClick={() => setDisplayLimit(prev => prev + 24)}
          className="px-8 py-3 bg-[#16161A] border border-[#222228] text-[#F5F5F0] text-sm font-bold rounded-xl hover:border-[#FF5C00] hover:text-[#FF5C00] transition-all cursor-pointer"
        >
          Carregar mais exercícios
        </button>
      </div>
    )
  }

  {/* Footer Info */ }
  {
    !isLoading && filteredExercises.length > 0 && (
      <div className="mt-12 pt-8 border-t border-[#222228] text-center">
        <p className="text-[#333338] text-[0.6rem] uppercase tracking-widest font-bold">
          FitDesk Library v4.0 • {exercises.length} Exercícios Catalogados
        </p>
      </div>
    )
  }

  {/* Modal Novo Exercício */ }
  {
    isModalOpen && (
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
                    <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">URL da Imagem de Referência</label>
                    <input name="imageUrl" className="w-full bg-[#0A0A0B] border border-[#222228] p-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" placeholder="https://images.unsplash.com/..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Vídeo (URL)</label>
                    <div className="relative">
                      <PlayCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333338]" />
                      <input name="videoUrl" className="w-full bg-[#0A0A0B] border border-[#222228] pl-10 pr-4 py-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" placeholder="https://..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Instruções de Execução</label>
                    <textarea name="description" rows={3} className="w-full bg-[#0A0A0B] border border-[#222228] p-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00] resize-none" placeholder="Descreva brevemente como realizar o exercício..." />
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
    )
  }

  {/* Modal Detalhes do Exercício */ }
  {
    selectedExercise && (
      <ModalPortal>
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={() => setSelectedExercise(null)}></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-[#16161A] border border-[#222228] rounded-[32px] shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            <button
              onClick={() => setSelectedExercise(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-black/50 text-white hover:bg-black rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Área Visual */}
            <div className="w-full md:w-1/2 bg-[#0A0A0B] relative flex items-center justify-center min-h-[400px]">
              <ExerciseVisual
                imageUrl={selectedExercise.imageUrl}
                videoUrl={selectedExercise.videoUrl}
                className="w-full h-full"
                animate={true}
              />

              <div className="absolute bottom-6 left-6">
                <div className="bg-[#FF5C00] text-white text-[0.6rem] px-3 py-1 rounded-full font-bold uppercase tracking-widest mb-2 inline-block">
                  {getNormalizedCategory(selectedExercise.category)}
                </div>
              </div>
            </div>

            {/* Informações */}
            <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto custom-scrollbar">
              <h2 className="text-2xl font-bold text-[#F5F5F0] mb-4">{selectedExercise.name}</h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-[0.65rem] uppercase font-bold text-[#7A7A85] tracking-widest">Como executar</h4>
                  <p className="text-[#F5F5F0]/80 text-sm leading-relaxed text-justify">
                    {selectedExercise.description || "Nenhuma instrução detalhada disponível para este exercício."}
                  </p>
                </div>

                {selectedExercise.videoUrl && (
                  <div className="pt-4 border-t border-[#222228]">
                    <a
                      href={selectedExercise.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-[#FFD600]/10 text-[#FFD600] py-3 rounded-xl border border-[#FFD600]/20 hover:bg-[#FFD600] hover:text-black transition-all font-bold text-sm"
                    >
                      <PlayCircle className="w-5 h-5" /> Assistir Vídeo Aula
                    </a>
                  </div>
                )}

                <div className="pt-4 border-t border-[#222228] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[0.6rem] text-[#333338] uppercase font-bold">Tipo</span>
                    <span className="text-xs text-[#7A7A85] font-bold">{selectedExercise.personalId === null ? "Global FitDesk" : "Personalizado"}</span>
                  </div>
                  <Dumbbell className="w-8 h-8 text-[#222228]" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </ModalPortal>
    )
  }
</div>
  );
}
