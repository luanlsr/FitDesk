"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Dumbbell, 
  TrendingUp, 
  Clock, 
  ChevronRight, 
  Video,
  CheckCircle2,
  CalendarDays,
  User,
  LogOut,
  X,
  Scale,
  Activity,
  Lock,
  ArrowLeft
} from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

interface Props {
  personalUsername: string;
  studentId: string;
}

export default function AlunoDashboardDynamic({ personalUsername, studentId }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [nextApp, setNextApp] = useState<any>(null);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isEvolutionOpen, setIsEvolutionOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { getStudentDashboardData } = await import("@/app/actions/student-app");
        const res = await getStudentDashboardData(studentId);
        if (res.success) {
          setProfile(res.profile);
          setWorkouts(res.workouts || []);
          setNextApp(res.nextAppointment);
          setEvaluations(res.evaluations || []);
        } else {
          setErrorMsg(res.error || "Erro ao carregar dados.");
        }
      } catch (err) {
        setErrorMsg("Falha ao comunicar com o servidor.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [studentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FF5C00]/20 border-t-[#FF5C00] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (errorMsg || !profile) {
    return (
      <div className="p-8 text-center bg-[#0A0A0B] min-h-screen flex flex-col items-center justify-center text-[#F5F5F0]">
        <div className="bg-[#16161A] p-8 rounded-3xl border border-[#222228] max-w-sm space-y-4">
          <X className="w-12 h-12 text-[#FF4444] mx-auto" />
          <h1 className="text-xl font-bold">{errorMsg || "Acesso negado"}</h1>
          <p className="text-sm text-[#7A7A85]">Você não possui permissão para acessar esta área ou o aluno não foi encontrado.</p>
          <button
            onClick={() => window.history.back()}
            className="w-full py-3 bg-[#222228] border border-[#33333E] hover:border-[#FF5C00] text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const isPersonalViewing = session?.user?.id === profile.personalId;

  return (
    <div className="bg-[#0A0A0B] min-h-screen p-4 md:p-8 space-y-6 max-w-2xl mx-auto pb-28 relative text-[#F5F5F0]">
      {/* Visualização de Personal Banner */}
      {isPersonalViewing && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FF5C00]/10 border border-[#FF5C00]/20 text-[#FF5C00] px-5 py-4 rounded-3xl text-xs font-bold flex items-center justify-between shadow-lg select-none"
        >
          <span className="flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0" />
            Visualizando como Personal Trainer
          </span>
          <Link
            href={`/alunos/${studentId}`}
            className="px-3 py-1.5 bg-[#FF5C00] hover:bg-[#FF7A2E] text-white font-extrabold rounded-lg transition-all text-[0.65rem] uppercase tracking-wider flex items-center gap-1 shrink-0 shadow-md shadow-[#FF5C00]/10"
          >
            <ArrowLeft className="w-3 h-3" /> Sair da Pré-visualização
          </Link>
        </motion.div>
      )}

      {/* Header Profile */}
      <header className="flex items-center justify-between bg-[#16161A] border border-[#222228] p-5 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#FF5C00]/20 rounded-2xl flex items-center justify-center font-bold text-2xl text-[#FF5C00] select-none">
            {profile.name?.[0]}
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#F5F5F0]">{profile.name}</h1>
            <p className="text-xs text-[#7A7A85] flex items-center gap-1.5 mt-0.5">
              <User className="w-3 h-3" /> Personal: {profile.user?.name}
            </p>
          </div>
        </div>

        {/* Logout (Only if student is the actual logged-in user) */}
        {!isPersonalViewing && (
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-3 bg-[#222228]/50 hover:bg-[#FF4444]/10 border border-[#222228] hover:border-[#FF4444]/30 rounded-2xl text-[#7A7A85] hover:text-[#FF4444] transition-all cursor-pointer"
            title="Sair da Conta"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </header>

      {/* Próximo Agendamento */}
      {nextApp ? (
        <section className="bg-gradient-to-r from-[#FF5C00] to-[#FF7A2E] p-6 rounded-3xl shadow-[0_0_30px_rgba(255,92,0,0.1)] relative overflow-hidden group">
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#0A0A0B]/60 font-bebas">Próxima Aula</span>
              <h2 className="text-2xl font-bold text-white">{format(new Date(nextApp.start), "HH:mm")}</h2>
              <p className="text-sm font-semibold text-white/90">{format(new Date(nextApp.start), "eeee, dd 'de' MMMM", { locale: ptBR })}</p>
            </div>
            <CalendarDays className="w-12 h-12 text-white/20" />
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-all"></div>
        </section>
      ) : (
        <section className="bg-[#16161A] border border-[#222228] p-6 rounded-3xl text-center">
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#7A7A85] block font-mono">Próxima Aula</span>
            <p className="text-[#333338] text-sm mt-2 italic font-medium">Nenhuma marcada.</p>
        </section>
      )}

      {/* Treinos Atuais */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#7A7A85] uppercase tracking-wider ml-1">Meus Treinos</h3>
        <div className="space-y-4">
          {workouts.length === 0 ? (
            <div className="text-center py-10 bg-[#16161A] border-dashed border-2 border-[#222228] rounded-3xl">
              <Dumbbell className="w-8 h-8 text-[#222228] mx-auto mb-2" />
              <p className="text-[#333338] text-sm">Seu personal ainda não liberou sua ficha de treinos.</p>
            </div>
          ) : (
            workouts.map((workout: any) => (
              <motion.div
                key={workout.id}
                whileTap={{ scale: 0.98 }}
                className="bg-[#16161A] border border-[#222228] p-5 rounded-3xl flex items-center justify-between group cursor-pointer hover:border-[#FF5C00]/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FF5C00]/10 rounded-2xl flex items-center justify-center text-[#FF5C00]">
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#F5F5F0] group-hover:text-[#FF5C00] transition-colors">{workout.name}</h4>
                    <span className="text-[0.65rem] text-[#7A7A85] font-bold uppercase tracking-widest">{workout.exercises.length} Exercícios</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#333338] group-hover:text-[#FF5C00] transition-colors" />
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Botões de Ação Rápida no Mobile */}
      <div className="fixed bottom-6 left-6 right-6 flex gap-3 z-40 md:hidden">
        <button className="flex-1 bg-[#16161A] border border-[#222228] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-2xl">
          <Video className="w-4 h-4" /> Vídeo-Aula
        </button>
        <button className="flex-1 bg-[#FF5C00] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,92,0,0.3)]">
          <Calendar className="w-4 h-4" /> Agenda
        </button>
      </div>

      {/* Footer / Evolução */}
      <section 
        onClick={() => setIsEvolutionOpen(true)}
        className="bg-[#16161A] border border-[#222228] p-6 rounded-3xl flex items-center justify-between hover:border-[#FF5C00]/40 transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-[#00E676] group-hover:scale-110 transition-transform" />
            <div>
                <p className="text-xs font-bold text-[#F5F5F0] group-hover:text-[#FF5C00] transition-colors">Minha Evolução</p>
                <p className="text-[0.65rem] text-[#7A7A85]">Ver histórico de medidas e peso corporal.</p>
            </div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#333338] group-hover:text-[#FF5C00] transition-colors" />
      </section>

      {/* MODAL / DRAWER INTERATIVO DE EVOLUÇÃO FÍSICA DO ALUNO */}
      <AnimatePresence>
        {isEvolutionOpen && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm" 
              onClick={() => setIsEvolutionOpen(false)}
            ></motion.div>

            {/* Modal Box */}
            <motion.div 
              initial={{ y: "100%", opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.8 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full max-w-xl bg-[#16161A] border-t md:border border-[#222228] rounded-t-[32px] md:rounded-[32px] p-6 relative z-10 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#222228] mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#00E676]" />
                  <h3 className="text-sm font-bold text-[#F5F5F0] uppercase tracking-wider">Histórico de Evolução</h3>
                </div>
                <button 
                  onClick={() => setIsEvolutionOpen(false)}
                  className="p-2 text-[#7A7A85] hover:text-[#F5F5F0] bg-[#111114] border border-[#222228] rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto space-y-8 pr-1 no-scrollbar pb-6">
                
                {evaluations.length > 0 ? (
                  <>
                    {/* Gráfico 1: Peso */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-[#7A7A85] uppercase tracking-wider flex items-center gap-1.5 ml-1">
                        <Scale className="w-4 h-4 text-[#FF5C00]" />
                        Peso Corporal (kg)
                      </h4>
                      
                      <div className="h-[180px] flex items-end justify-between gap-2 pt-6 border-b border-[#222228] pb-1 font-mono">
                        {evaluations.slice().reverse().map((ev, idx) => {
                          const data = ev.encryptedData || ev;
                          const maxWeight = Math.max(...evaluations.map(e => (e.encryptedData || e).weight), 100);
                          const heightPercent = Math.max(10, Math.min(90, (data.weight / maxWeight) * 100));
                          const dateStr = new Date(ev.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end">
                              <div className="text-[0.6rem] text-[#F5F5F0] font-bold opacity-0 group-hover:opacity-100 transition-opacity mb-1 bg-[#111114] px-1 py-0.5 rounded border border-[#222228] select-none font-mono">
                                {data.weight}kg
                              </div>
                              <div 
                                className="w-full bg-gradient-to-t from-[#FF5C00]/40 to-[#FF5C00] rounded-t-md group-hover:brightness-125 transition-all relative"
                                style={{ height: `${heightPercent}%` }}
                              ></div>
                              <span className="text-[0.55rem] text-[#7A7A85] font-bold mt-1 font-mono">{dateStr}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Gráfico 2: Gordura */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-[#7A7A85] uppercase tracking-wider flex items-center gap-1.5 ml-1">
                        <Activity className="w-4 h-4 text-[#00E676]" />
                        Percentual de Gordura (BF%)
                      </h4>
                      
                      <div className="h-[180px] flex items-end justify-between gap-2 pt-6 border-b border-[#222228] pb-1 font-mono">
                        {evaluations.slice().reverse().map((ev, idx) => {
                          const data = ev.encryptedData || ev;
                          const bf = data.results?.bf || data.bf || 0;
                          const maxBF = Math.max(...evaluations.map(e => (e.encryptedData || e).results?.bf || 40), 40);
                          const heightPercent = Math.max(10, Math.min(90, (bf / maxBF) * 100));
                          const dateStr = new Date(ev.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end font-mono">
                              <div className="text-[0.6rem] text-[#00E676] font-bold opacity-0 group-hover:opacity-100 transition-opacity mb-1 bg-[#111114] px-1 py-0.5 rounded border border-[#222228] select-none font-mono">
                                {bf}%
                              </div>
                              <div 
                                className="w-full bg-gradient-to-t from-[#00E676]/40 to-[#00E676] rounded-t-md group-hover:brightness-125 transition-all"
                                style={{ height: `${heightPercent}%` }}
                              ></div>
                              <span className="text-[0.55rem] text-[#7A7A85] font-bold mt-1 font-mono">{dateStr}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-[#7A7A85]">
                    <Scale className="w-12 h-12 mx-auto text-[#222228] mb-3" />
                    <h4 className="text-sm font-bold text-[#F5F5F0] mb-1">Nenhum dado cadastrado</h4>
                    <p className="text-xs max-w-xs mx-auto">Sua avaliação física antropométrica fará seus gráficos de progresso aparecerem aqui.</p>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
