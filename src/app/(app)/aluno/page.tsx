"use client";

import { motion } from "framer-motion";
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
  LogOut
} from "lucide-react";
import { useState, useEffect } from "react";
import { getMyStudentProfile, getMyWorkouts, getMyNextAppointment } from "@/app/actions/student-app";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AlunoDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [nextApp, setNextApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [p, w, n] = await Promise.all([
        getMyStudentProfile(),
        getMyWorkouts(),
        getMyNextAppointment()
      ]);
      setProfile(p);
      setWorkouts(w);
      setNextApp(n);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FF5C00]/20 border-t-[#FF5C00] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 text-center bg-[#0A0A0B] min-h-screen flex flex-col items-center justify-center">
        <div className="bg-[#16161A] p-8 rounded-3xl border border-[#222228] max-w-sm">
          <User className="w-12 h-12 text-[#7A7A85] mx-auto mb-4" />
          <h1 className="text-xl font-bold text-[#F5F5F0] mb-2">Perfil não vinculado</h1>
          <p className="text-sm text-[#7A7A85] mb-6">Peça ao seu personal trainer para vincular este e-mail ao seu perfil de aluno.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0B] min-h-screen p-4 md:p-8 space-y-6 max-w-2xl mx-auto pb-24">
      {/* Header Profile */}
      <header className="flex items-center gap-4 bg-[#16161A] border border-[#222228] p-5 rounded-3xl shadow-xl">
        <div className="w-16 h-16 bg-[#FF5C00]/20 rounded-2xl flex items-center justify-center font-bold text-2xl text-[#FF5C00]">
          {profile.name?.[0]}
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#F5F5F0]">{profile.name}</h1>
          <p className="text-xs text-[#7A7A85] flex items-center gap-1">
            <User className="w-3 h-3" /> Personal: {profile.user?.name}
          </p>
        </div>
      </header>

      {/* Próximo Agendamento */}
      {nextApp ? (
        <section className="bg-gradient-to-r from-[#FF5C00] to-[#FF7A2E] p-6 rounded-3xl shadow-[0_0_30px_rgba(255,92,0,0.1)] relative overflow-hidden group">
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#0A0A0B]/60">Próxima Aula</span>
              <h2 className="text-2xl font-bold text-white">{format(new Date(nextApp.start), "HH:mm")}</h2>
              <p className="text-sm font-semibold text-white/90">{format(new Date(nextApp.start), "eeee, dd 'de' MMMM", { locale: ptBR })}</p>
            </div>
            <CalendarDays className="w-12 h-12 text-white/20" />
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-all"></div>
        </section>
      ) : (
        <section className="bg-[#16161A] border border-[#222228] p-6 rounded-3xl text-center">
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#7A7A85]">Próxima Aula</span>
            <p className="text-[#333338] text-sm mt-2 italic">Nenhuma marcada.</p>
        </section>
      )}

      {/* Treinos Atuais */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#7A7A85] uppercase tracking-wider ml-1">Meus Treinos</h3>
        <div className="space-y-4">
          {workouts.length === 0 ? (
            <div className="text-center py-10 bg-[#16161A] border-dashed border-2 border-[#222228] rounded-3xl">
              <Dumbbell className="w-8 h-8 text-[#222228] mx-auto mb-2" />
              <p className="text-[#333338] text-sm">Seu personal ainda não liberou sua ficha.</p>
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
      <div className="fixed bottom-6 left-6 right-6 flex gap-3 z-50 md:hidden">
        <button className="flex-1 bg-[#16161A] border border-[#222228] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-2xl">
          <Video className="w-4 h-4" /> Vídeo-Aula
        </button>
        <button className="flex-1 bg-[#FF5C00] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,92,0,0.3)]">
          <Calendar className="w-4 h-4" /> Agenda
        </button>
      </div>

      {/* Footer / Evolução */}
      <section className="bg-[#16161A] border border-[#222228] p-6 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-[#00E676]" />
            <div>
                <p className="text-xs font-bold text-[#F5F5F0]">Minha Evolução</p>
                <p className="text-[0.65rem] text-[#7A7A85]">Ver histórico de medidas e peso.</p>
            </div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#333338]" />
      </section>
    </div>
  );
}
