"use client";

import { motion } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  User, 
  Settings,
  MoreVertical,
  CheckCircle2,
  XCircle,
  X,
  Trash2
} from "lucide-react";
import { useState, useEffect } from "react";
import { 
  getAppointments, 
  createAppointment, 
  updateAppointmentStatus, 
  deleteAppointment 
} from "@/app/actions/appointments";
import { getStudents } from "@/app/actions/students";
import ModalPortal from "@/components/ModalPortal";
import { format, startOfWeek, endOfWeek, addDays, startOfDay, endOfDay, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [view, setView] = useState<"week" | "day">("week");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const hours = Array.from({ length: 16 }, (_, i) => i + 6);
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));

  const fetchAppointments = async () => {
    setLoading(true);
    const start = view === "week" ? startOfWeek(currentDate) : startOfDay(currentDate);
    const end = view === "week" ? endOfWeek(currentDate) : endOfDay(currentDate);
    const data = await getAppointments(start, end);
    setAppointments(data);
    setLoading(false);
  };

  const fetchStudents = async () => {
    const data = await getStudents();
    setStudents(data);
  };

  useEffect(() => {
    fetchAppointments();
    fetchStudents();
  }, [currentDate, view]);

  const handlePrev = () => {
    setCurrentDate(addDays(currentDate, view === "week" ? -7 : -1));
  };

  const handleNext = () => {
    setCurrentDate(addDays(currentDate, view === "week" ? 7 : 1));
  };

  const handleStatusChange = async (id: string, status: string) => {
    const res = await updateAppointmentStatus(id, status);
    if (res.success) {
      setIsDetailsModalOpen(false);
      fetchAppointments();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja remover este agendamento?")) {
      const res = await deleteAppointment(id);
      if (res.success) {
        setIsDetailsModalOpen(false);
        fetchAppointments();
      }
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Ajuste das datas para o formato ISO que o Action espera
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const start = new Date(`${date}T${time}:00`);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hora de duração padrão
    
    formData.set("start", start.toISOString());
    formData.set("end", end.toISOString());

    const res = await createAppointment(formData);
    if (res.success) {
      setIsAddModalOpen(false);
      fetchAppointments();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-up">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#FF5C00]" />
            <h1 className="text-2xl font-bold text-[#F5F5F0]">Minha Agenda</h1>
          </div>
          <div className="flex items-center gap-2 bg-[#16161A] border border-[#222228] p-1.5 rounded-xl">
            <button 
              onClick={() => setView("week")}
              className={`p-1 px-4 text-[0.7rem] font-bold rounded-lg transition-all ${view === "week" ? "bg-[#FF5C00] text-white shadow-[0_0_10px_rgba(255,92,0,0.2)]" : "text-[#7A7A85] hover:text-[#F5F5F0] cursor-pointer"}`}
            >
              Semana
            </button>
            <button 
              onClick={() => setView("day")}
              className={`p-1 px-4 text-[0.7rem] font-bold rounded-lg transition-all ${view === "day" ? "bg-[#FF5C00] text-white shadow-[0_0_10px_rgba(255,92,0,0.2)]" : "text-[#7A7A85] hover:text-[#F5F5F0] cursor-pointer"}`}
            >
              Dia
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 mr-4 text-[#F5F5F0] font-semibold text-base">
            <button onClick={handlePrev} className="p-2 bg-[#16161A] border border-[#222228] rounded-xl hover:border-[#7A7A85] transition-all cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
            <span className="px-4 capitalize">{format(currentDate, "MMMM yyyy", { locale: ptBR })}</span>
            <button onClick={handleNext} className="p-2 bg-[#16161A] border border-[#222228] rounded-xl hover:border-[#7A7A85] transition-all cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#FF5C00] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(255,92,0,0.2)] hover:bg-[#FF7A2E] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Novo Horário
          </button>
        </div>
      </header>

      {/* Calendar Grid */}
      <div className="bg-[#16161A] border border-[#222228] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[70vh]">
        {/* Days Header */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-[#222228] bg-[#111114]">
          <div className="p-4"></div>
          {(view === "week" ? weekDays : [currentDate]).map((date) => (
            <div key={date.toString()} className="p-4 flex flex-col items-center gap-1">
              <span className={`text-[0.65rem] font-mono tracking-widest ${isSameDay(date, new Date()) ? "text-[#FF5C00]" : "text-[#7A7A85]"}`}>
                {format(date, "EEE", { locale: ptBR }).toUpperCase()}
              </span>
              <div className={`w-9 h-9 flex items-center justify-center rounded-xl font-bold font-mono transition-all ${isSameDay(date, new Date()) ? "bg-[#FF5C00] text-white shadow-[0_0_15px_rgba(255,92,0,0.3)]" : "text-[#F5F5F0]"}`}>
                {format(date, "dd")}
              </div>
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative">
          <div className="grid grid-cols-[80px_repeat(7,1fr)] min-h-[960px] relative">
            {/* Timeline Column */}
            <div className="border-r border-[#222228] bg-[#111114]/50">
              {hours.map((h) => (
                <div key={h} className="h-20 p-2 flex items-start justify-center text-[0.65rem] font-mono text-[#7A7A85] border-b border-[#222228]/30">
                  {h}:00
                </div>
              ))}
            </div>

            {/* Daily Columns */}
            {(view === "week" ? weekDays : [currentDate]).map((date) => (
              <div key={date.toString()} className="border-r border-[#222228] relative group">
                <div className="absolute inset-x-0 h-full">
                  {hours.map((h) => (
                    <div key={h} className="h-20 border-b border-[#222228]/10"></div>
                  ))}
                </div>
                
                {/* Events */}
                {appointments.filter(e => isSameDay(new Date(e.start), date)).map((event) => {
                  const startDate = new Date(event.start);
                  const hour = startDate.getHours();
                  const minute = startDate.getMinutes();
                  const top = (hour - 6) * 80 + (minute / 60) * 80;
                  
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsDetailsModalOpen(true);
                      }}
                      className={`absolute left-2 right-2 p-3 rounded-xl border z-10 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl shadow-lg flex flex-col justify-between overflow-hidden ${
                        event.status === "Concluído"
                          ? "bg-[#00E676]/5 border-[#00E676]/20 text-[#00E676]"
                          : event.status === "Cancelado"
                          ? "bg-[#FF4444]/5 border-[#FF4444]/20 text-[#FF4444]"
                          : "bg-[#FF5C00]/5 border-[#FF5C00]/20 text-[#FF5C00]"
                      }`}
                      style={{ top: `${top}px`, height: '70px' }}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <div className="truncate text-[0.75rem] font-bold uppercase tracking-tight">
                          {event.student?.name || event.title}
                        </div>
                        <div className="flex-shrink-0">
                          {event.status === "Concluído" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[0.65rem] font-mono font-bold">{format(startDate, "HH:mm")}</span>
                        <span className="text-[0.6rem] opacity-70 italic truncate">· {event.title}</span>
                      </div>
                      <div className={`absolute top-0 left-0 bottom-0 w-0.5 ${event.status === "Concluído" ? "bg-[#00E676]" : "bg-[#FF5C00]"}`}></div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals e Footer mantidos com lógica real */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#16161A] border border-[#222228] p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FF5C00]/10 rounded-2xl flex items-center justify-center text-[#FF5C00]">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[#F5F5F0]">Restam hoje</div>
            <div className="text-[0.7rem] text-[#7A7A85]">{appointments.filter(a => a.status === "Agendado").length} agendamentos pendentes</div>
          </div>
        </div>
        {/* ... outros cards estáticos ou dinâmicos ... */}
      </div>

      {/* Modal Add Appointment */}
      {isAddModalOpen && (
        <ModalPortal>
          <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="fixed inset-0" onClick={() => setIsAddModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-lg bg-[#16161A] border border-[#222228] rounded-[32px] shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Header Fixo */}
              <div className="flex justify-between items-center p-8 border-b border-[#222228] bg-[#111114]">
                <h2 className="text-xl font-bold text-[#F5F5F0]">Novo Agendamento</h2>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-[#7A7A85] hover:text-[#F5F5F0] hover:bg-[#222228] rounded-xl transition-all cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreate} id="add-appointment-form" className="flex flex-col flex-1 overflow-hidden">
                  {/* Body com Rolagem */}
                  <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                      <div className="space-y-4">
                          <div className="space-y-2">
                              <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Título / Tipo</label>
                              <input name="title" required className="w-full bg-[#0A0A0B] border border-[#222228] p-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" placeholder="Ex: Treino A, Avaliação..." />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Aluno</label>
                              <select name="studentId" className="w-full bg-[#0A0A0B] border border-[#222228] p-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]">
                                  <option value="block">Nenhum (Bloqueio de Agenda)</option>
                                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                              </select>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Data</label>
                                  <input name="date" type="date" required defaultValue={format(currentDate, "yyyy-MM-dd")} className="w-full bg-[#0A0A0B] border border-[#222228] p-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Hora</label>
                                  <input name="time" type="time" required className="w-full bg-[#0A0A0B] border border-[#222228] p-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" />
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Footer Fixo */}
                  <div className="p-8 border-t border-[#222228] bg-[#111114]">
                      <button type="submit" className="w-full bg-[#FF5C00] text-white py-4 rounded-xl font-bold hover:bg-[#FF7A2E] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-[#FF5C00]/10">
                          Agendar Horário
                      </button>
                  </div>
              </form>
            </motion.div>
          </div>
        </ModalPortal>
      )}

      {/* Modal Details */}
      {isDetailsModalOpen && selectedEvent && (
        <ModalPortal>
          <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="fixed inset-0" onClick={() => setIsDetailsModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-md bg-[#16161A] border border-[#222228] rounded-[32px] shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Header Fixo */}
              <div className="flex justify-between items-center p-8 border-b border-[#222228] bg-[#111114]">
                <span className={`text-[0.6rem] font-bold px-3 py-1 rounded-full uppercase ${
                  selectedEvent.status === "Concluído" ? "bg-[#00E676]/10 text-[#00E676]" : 
                  selectedEvent.status === "Cancelado" ? "bg-[#FF4444]/10 text-[#FF4444]" : "bg-[#FF5C00]/10 text-[#FF5C00]"
                }`}>
                  {selectedEvent.status}
                </span>
                <button onClick={() => setIsDetailsModalOpen(false)} className="p-2 text-[#7A7A85] hover:text-[#F5F5F0] hover:bg-[#222228] rounded-xl transition-all cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              
              {/* Body com Rolagem */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#0A0A0B] border border-[#222228] rounded-2xl flex items-center justify-center text-xl font-bold text-[#F5F5F0]">
                    {selectedEvent.student?.name?.[0] || "B"}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#F5F5F0]">{selectedEvent.student?.name || "Horário Bloqueado"}</h3>
                    <p className="text-sm text-[#7A7A85]">{selectedEvent.title}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[#CFCFC8]">
                    <Clock className="w-4 h-4 text-[#7A7A85]" />
                    <span className="text-sm">{selectedEvent.start && format(new Date(selectedEvent.start), "eeee, HH:mm", { locale: ptBR })}</span>
                  </div>
                  {selectedEvent.student?.phone && (
                    <div className="flex items-center gap-3 text-[#CFCFC8]">
                      <User className="w-4 h-4 text-[#7A7A85]" />
                      <span className="text-sm">{selectedEvent.student.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Fixo */}
              <div className="p-8 border-t border-[#222228] bg-[#111114] flex gap-3">
                {selectedEvent.status === "Agendado" && (
                  <button onClick={() => handleStatusChange(selectedEvent.id, "Concluído")} className="flex-2 bg-[#00E676] text-black py-4 rounded-xl text-sm font-bold hover:bg-[#00C864] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all">Check-in</button>
                )}
                {selectedEvent.status === "Agendado" && (
                  <button onClick={() => handleStatusChange(selectedEvent.id, "Cancelado")} className="flex-1 bg-[#222228] text-white py-4 rounded-xl text-sm font-bold hover:bg-[#2A2A30] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all">Cancelar</button>
                )}
                <button onClick={() => handleDelete(selectedEvent.id)} className="p-4 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 cursor-pointer hover:scale-[1.05] active:scale-[0.95] transition-all">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
