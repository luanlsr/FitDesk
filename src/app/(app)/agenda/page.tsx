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
import { useState, useEffect, useRef } from "react";
import { 
  getAppointments, 
  createAppointment, 
  updateAppointment,
  updateAppointmentStatus, 
  deleteAppointment 
} from "@/app/actions/appointments";
import { getStudents } from "@/app/actions/students";
import ModalPortal from "@/components/ModalPortal";
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  startOfDay, 
  endOfDay, 
  isSameDay, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth,
  addMonths,
  isValid
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence } from "framer-motion";

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [view, setView] = useState<"week" | "day" | "month">("month");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Novos estados para a visão mensal
  const [selectedDay, setSelectedDay] = useState(new Date());

  const hours = Array.from({ length: 16 }, (_, i) => i + 6);
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));

  const fetchAppointments = async () => {
    setLoading(true);
    let start, end;
    
    if (view === "week") {
      start = startOfWeek(currentDate);
      end = endOfWeek(currentDate);
    } else if (view === "day") {
      start = startOfDay(currentDate);
      end = endOfDay(currentDate);
    } else {
      start = startOfMonth(currentDate);
      end = endOfMonth(currentDate);
    }

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
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, -1));
    } else {
      setCurrentDate(addDays(currentDate, view === "week" ? -7 : -1));
    }
  };

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, view === "week" ? 7 : 1));
    }
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

  const [formDate, setFormDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [formTime, setFormTime] = useState("08:00");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const dateTriggerRef = useRef<HTMLButtonElement>(null);
  const [datePickerCoords, setDatePickerCoords] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (isDatePickerOpen && dateTriggerRef.current) {
      const rect = dateTriggerRef.current.getBoundingClientRect();
      setDatePickerCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isDatePickerOpen]);

  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const h = i + 6; // Começa às 06:00
    return `${h.toString().padStart(2, "0")}:00`;
  });

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const start = new Date(`${formDate}T${formTime}:00`);
    const end = new Date(start.getTime() + 60 * 60 * 1000); 
    
    formData.set("start", start.toISOString());
    formData.set("end", end.toISOString());

    const res = isEditing && editingId 
      ? await updateAppointment(editingId, formData)
      : await createAppointment(formData);

    if (res.success) {
      setIsAddModalOpen(false);
      setIsEditing(false);
      setEditingId(null);
      fetchAppointments();
    } else {
      alert(res.error || "Ocorreu um erro");
    }
  };

  return (
    <div className="p-3 md:p-8 space-y-6 md:space-y-8 animate-fade-up">
      {/* Header */}
      <header className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#FF5C00]" />
            <h1 className="text-xl md:text-2xl font-bold text-[#F5F5F0]">Minha Agenda</h1>
          </div>
          <div className="flex items-center gap-1 bg-[#16161A] border border-[#222228] p-1 rounded-xl">
            <button 
              onClick={() => setView("week")}
              className={`p-1 px-3 md:px-4 text-[0.65rem] md:text-[0.7rem] font-bold rounded-lg transition-all ${view === "week" ? "bg-[#FF5C00] text-white shadow-[0_0_10px_rgba(255,92,0,0.2)]" : "text-[#7A7A85] hover:text-[#F5F5F0] cursor-pointer"}`}
            >
              Semana
            </button>
            <button 
              onClick={() => setView("month")}
              className={`p-1 px-3 md:px-4 text-[0.65rem] md:text-[0.7rem] font-bold rounded-lg transition-all ${view === "month" ? "bg-[#FF5C00] text-white shadow-[0_0_10px_rgba(255,92,0,0.2)]" : "text-[#7A7A85] hover:text-[#F5F5F0] cursor-pointer"}`}
            >
              Mês
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center justify-between md:justify-start gap-4 text-[#F5F5F0] font-semibold text-base">
            <div className="flex items-center gap-1">
              <button onClick={handlePrev} className="p-2 bg-[#16161A] border border-[#222228] rounded-xl hover:border-[#7A7A85] transition-all cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
              <span className="px-4 capitalize min-w-[140px] text-center text-sm md:text-base">{format(currentDate, "MMMM yyyy", { locale: ptBR })}</span>
              <button onClick={handleNext} className="p-2 bg-[#16161A] border border-[#222228] rounded-xl hover:border-[#7A7A85] transition-all cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
          <button 
            onClick={() => {
              setFormDate(format(selectedDay, "yyyy-MM-dd"));
              setIsAddModalOpen(true);
            }}
            className="w-full md:w-auto bg-[#FF5C00] text-white text-sm font-bold px-5 py-3 md:py-2.5 rounded-xl shadow-[0_0_20px_rgba(255,92,0,0.2)] hover:bg-[#FF7A2E] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Novo Horário
          </button>
        </div>
      </header>

      {/* Calendar Grid Container (Visible for Week and Day) */}
      {view !== "month" ? (
        <div className="bg-[#16161A] border border-[#222228] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[65vh] md:h-[70vh]">
          {/* Scrollable Wrapper */}
          <div className="flex-1 flex flex-col overflow-x-auto custom-scrollbar">
            {/* Days Header */}
            <div className={`grid ${view === "week" ? "grid-cols-[50px_repeat(7,120px)] md:grid-cols-[80px_repeat(7,1fr)]" : "grid-cols-[50px_1fr] md:grid-cols-[80px_1fr]"} border-b border-[#222228] bg-[#111114] min-w-max md:min-w-0`}>
              <div className="p-4"></div>
              {(view === "week" ? weekDays : [currentDate]).map((date) => (
                <div key={date.toString()} className="p-3 md:p-4 flex flex-col items-center gap-1">
                  <span className={`text-[0.6rem] md:text-[0.65rem] font-mono tracking-widest ${isSameDay(date, new Date()) ? "text-[#FF5C00]" : "text-[#7A7A85]"}`}>
                    {format(date, "EEE", { locale: ptBR }).toUpperCase()}
                  </span>
                  <div className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-xl font-bold font-mono transition-all text-sm md:text-base ${isSameDay(date, new Date()) ? "bg-[#FF5C00] text-white shadow-[0_0_15px_rgba(255,92,0,0.3)]" : "text-[#F5F5F0]"}`}>
                    {format(date, "dd")}
                  </div>
                </div>
              ))}
            </div>

            {/* Calendar Body */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative min-w-max md:min-w-0">
              <div className={`grid ${view === "week" ? "grid-cols-[50px_repeat(7,120px)] md:grid-cols-[80px_repeat(7,1fr)]" : "grid-cols-[50px_1fr] md:grid-cols-[80px_1fr]"} min-h-[960px] relative`}>
                {/* Timeline Column */}
                <div className="border-r border-[#222228] bg-[#111114]/50 sticky left-0 z-20">
                  {hours.map((h) => (
                    <div key={h} className="h-20 p-2 flex items-start justify-center text-[0.6rem] md:text-[0.65rem] font-mono text-[#7A7A85] border-b border-[#222228]/30 bg-[#111114]">
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
                          className={`absolute left-1 right-1 md:left-2 md:right-2 p-2 md:p-3 rounded-xl border z-10 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl shadow-lg flex flex-col justify-between overflow-hidden ${
                            event.status === "Concluído"
                              ? "bg-[#00E676]/5 border-[#00E676]/20 text-[#00E676]"
                              : event.status === "Cancelado"
                              ? "bg-[#FF4444]/5 border-[#FF4444]/20 text-[#FF4444]"
                              : "bg-[#FF5C00]/5 border-[#FF5C00]/20 text-[#FF5C00]"
                          }`}
                          style={{ top: `${top}px`, height: '80px' }}
                        >
                          <div className="flex justify-between items-start gap-1">
                            <div className="truncate text-[0.65rem] md:text-[0.75rem] font-bold uppercase tracking-tight">
                              {event.student?.name || event.title}
                            </div>
                            <div className="flex-shrink-0">
                              {event.status === "Concluído" ? <CheckCircle2 className="w-3 md:w-3.5 h-3 md:h-3.5" /> : <Clock className="w-3 md:w-3.5 h-3 md:h-3.5" />}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5 md:mt-1">
                            <span className="text-[0.6rem] md:text-[0.65rem] font-mono font-bold">{format(startDate, "HH:mm")}</span>
                            <span className="text-[0.55rem] md:text-[0.6rem] opacity-70 italic truncate">· {event.title}</span>
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
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 h-auto lg:h-[70vh]">
          {/* Month Calendar Grid */}
          <div className="bg-[#16161A] border border-[#222228] rounded-2xl p-6 shadow-2xl">
            <div className="grid grid-cols-7 mb-4">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
                <div key={d} className="text-center text-[0.65rem] font-bold text-[#7A7A85] uppercase tracking-widest p-2">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {(() => {
                const start = startOfWeek(startOfMonth(currentDate));
                const end = endOfWeek(endOfMonth(currentDate));
                const days = eachDayOfInterval({ start, end });
                
                return days.map((day) => {
                  const dayAppointments = appointments.filter(a => isSameDay(new Date(a.start), day));
                  const isToday = isSameDay(day, new Date());
                  const isSelected = isSameDay(day, selectedDay);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  
                  return (
                    <button
                      key={day.toString()}
                      onClick={() => setSelectedDay(day)}
                      className={`relative h-16 md:h-24 rounded-xl border transition-all flex flex-col items-center justify-start p-2 hover:border-[#FF5C00]/50 cursor-pointer ${
                        !isCurrentMonth ? "opacity-20 bg-transparent border-transparent" : 
                        isSelected ? "bg-[#FF5C00]/10 border-[#FF5C00] shadow-[0_0_20px_rgba(255,92,0,0.1)]" : 
                        "bg-[#0A0A0B] border-[#222228] hover:bg-[#16161A]"
                      }`}
                    >
                      <span className={`text-xs md:text-sm font-mono font-bold ${
                        isToday ? "text-[#FF5C00]" : 
                        isSelected ? "text-[#FF5C00]" : "text-[#F5F5F0]"
                      }`}>
                        {format(day, "d")}
                      </span>
                      
                      {isCurrentMonth && dayAppointments.length > 0 && (
                        <div className="mt-auto flex flex-wrap justify-center gap-0.5 md:gap-1 max-w-full">
                          {dayAppointments.slice(0, 3).map((a, idx) => (
                            <div key={idx} className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${a.status === "Concluído" ? "bg-[#00E676]" : "bg-[#FF5C00]"}`}></div>
                          ))}
                          {dayAppointments.length > 3 && <div className="text-[0.5rem] text-[#7A7A85] font-bold">+{dayAppointments.length - 3}</div>}
                        </div>
                      )}
                    </button>
                  );
                });
              })()}
            </div>
          </div>

          {/* Selected Day Agenda List */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#111114] border border-[#222228] rounded-2xl p-5 flex flex-col h-full shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-[#F5F5F0] uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FF5C00]" />
                  Agenda · {format(selectedDay, "dd/MM", { locale: ptBR })}
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                {(() => {
                  const dayApps = appointments.filter(a => isSameDay(new Date(a.start), selectedDay));
                  if (dayApps.length === 0) {
                    return (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-30">
                        <CalendarIcon className="w-10 h-10 mb-2" />
                        <p className="text-xs">Nenhum agendamento para este dia</p>
                      </div>
                    );
                  }
                  return dayApps.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()).map(event => (
                    <div 
                      key={event.id}
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsDetailsModalOpen(true);
                      }}
                      className="group bg-[#16161A] border border-[#222228] p-4 rounded-xl hover:border-[#FF5C00]/30 transition-all cursor-pointer flex items-center gap-4"
                    >
                      <div className="text-center min-w-[50px]">
                        <div className="text-xs font-mono font-bold text-[#FF5C00]">{format(new Date(event.start), "HH:mm")}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-[#F5F5F0] truncate">{event.student?.name || event.title}</div>
                        <div className="text-[0.65rem] text-[#7A7A85] truncate">{event.title}</div>
                      </div>
                      {event.status === "Concluído" && <CheckCircle2 className="w-4 h-4 text-[#00E676]" />}
                    </div>
                  ));
                })()}
              </div>

              <button 
                onClick={() => {
                  setFormDate(format(selectedDay, "yyyy-MM-dd"));
                  setIsAddModalOpen(true);
                }}
                className="mt-6 w-full py-3 bg-[#16161A] border border-[#222228] text-[#F5F5F0] text-xs font-bold rounded-xl hover:border-[#FF5C00] transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-3 h-3" /> Adicionar Aula
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary cards (Show only on week/day or reduced for month) */}
      {view !== "month" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#16161A] border border-[#222228] p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FF5C00]/10 rounded-2xl flex items-center justify-center text-[#FF5C00]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#F5F5F0]">Restam hoje</div>
              <div className="text-[0.7rem] text-[#7A7A85]">{appointments.filter(a => a.status === "Agendado" && isSameDay(new Date(a.start), new Date())).length} agendamentos pendentes</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Appointment */}
      {isAddModalOpen && (
        <ModalPortal>
          <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="fixed inset-0" onClick={() => setIsAddModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-2xl bg-[#16161A] border border-[#222228] rounded-[32px] shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Header Fixo */}
              <div className="flex justify-between items-center p-6 md:p-8 border-b border-[#222228] bg-[#111114]">
                <h2 className="text-xl font-bold text-[#F5F5F0]">{isEditing ? "Editar Agendamento" : "Novo Agendamento"}</h2>
                <button onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditing(false);
                  setEditingId(null);
                }} className="p-2 text-[#7A7A85] hover:text-[#F5F5F0] hover:bg-[#222228] rounded-xl transition-all cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreate} id="add-appointment-form" className="flex flex-col flex-1 overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Título / Tipo</label>
                                <input name="title" defaultValue={isEditing ? selectedEvent?.title : ""} required className="w-full bg-[#0A0A0B] border border-[#222228] p-3.5 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" placeholder="Ex: Treino A, Avaliação..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Aluno</label>
                                <select name="studentId" defaultValue={isEditing ? selectedEvent?.studentId || "block" : "block"} className="w-full bg-[#0A0A0B] border border-[#222228] p-3.5 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00] cursor-pointer">
                                    <option value="block">Nenhum (Bloqueio de Agenda)</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2 relative">
                                <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Data do Agendamento</label>
                                <button 
                                  ref={dateTriggerRef}
                                  type="button"
                                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                                  className={`w-full bg-[#0A0A0B] border p-4 rounded-xl text-sm text-[#F5F5F0] outline-none flex items-center justify-between transition-all ${isDatePickerOpen ? "border-[#FF5C00] shadow-[0_0_15px_rgba(255,92,0,0.1)]" : "border-[#222228] hover:border-[#7A7A85]"}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <CalendarIcon className={`w-4 h-4 ${isDatePickerOpen ? "text-[#FF5C00]" : "text-[#7A7A85]"}`} />
                                    <span className="font-mono">{format(new Date(`${formDate}T00:00:00`), "dd/MM/yyyy")}</span>
                                  </div>
                                  <ChevronRight className={`w-4 h-4 text-[#7A7A85] transition-all ${isDatePickerOpen ? "rotate-90 text-[#FF5C00]" : ""}`} />
                                </button>

                                <AnimatePresence>
                                  {isDatePickerOpen && (
                                    <ModalPortal>
                                      <div className="fixed inset-0 z-[10000]" onClick={() => setIsDatePickerOpen(false)}></div>
                                      <motion.div 
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        className="fixed bg-[#111114] border border-[#222228] p-4 rounded-2xl z-[10001] shadow-2xl"
                                        style={{ 
                                          top: datePickerCoords.top + 8, 
                                          left: datePickerCoords.left,
                                          width: datePickerCoords.width
                                        }}
                                      >
                                        <div className="flex items-center justify-between mb-4">
                                          <button 
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setFormDate(format(addMonths(new Date(`${formDate}T00:00:00`), -1), "yyyy-MM-dd"));
                                            }}
                                            className="p-1 hover:bg-[#16161A] rounded-lg transition-all"
                                          >
                                            <ChevronLeft className="w-4 h-4 text-[#7A7A85]" />
                                          </button>
                                          <span className="text-[0.7rem] font-bold text-[#F5F5F0] uppercase tracking-wider">
                                            {format(new Date(`${formDate}T00:00:00`), "MMMM yyyy", { locale: ptBR })}
                                          </span>
                                          <button 
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setFormDate(format(addMonths(new Date(`${formDate}T00:00:00`), 1), "yyyy-MM-dd"));
                                            }}
                                            className="p-1 hover:bg-[#16161A] rounded-lg transition-all"
                                          >
                                            <ChevronRight className="w-4 h-4 text-[#7A7A85]" />
                                          </button>
                                        </div>
                                        <div className="grid grid-cols-7 mb-2">
                                          {["D", "S", "T", "Q", "Q", "S", "S"].map(d => (
                                            <div key={d} className="text-center text-[0.6rem] font-bold text-[#7A7A85] p-1">{d}</div>
                                          ))}
                                        </div>
                                        <div className="grid grid-cols-7 gap-1">
                                          {(() => {
                                            const start = startOfWeek(startOfMonth(new Date(`${formDate}T00:00:00`)));
                                            const end = endOfWeek(endOfMonth(new Date(`${formDate}T00:00:00`)));
                                            const days = eachDayOfInterval({ start, end });
                                            
                                            return days.map((day) => {
                                              const isSelected = isSameDay(day, new Date(`${formDate}T00:00:00`));
                                              const isCurrentMonth = isSameMonth(day, new Date(`${formDate}T00:00:00`));
                                              
                                              return (
                                                <button
                                                  key={day.toString()}
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFormDate(format(day, "yyyy-MM-dd"));
                                                    setIsDatePickerOpen(false);
                                                  }}
                                                  className={`h-8 rounded-lg text-[0.7rem] font-bold transition-all flex items-center justify-center cursor-pointer ${
                                                    !isCurrentMonth ? "opacity-10" : 
                                                    isSelected ? "bg-[#FF5C00] text-white" : 
                                                    "text-[#F5F5F0] hover:bg-[#222228]"
                                                  }`}
                                                >
                                                  {format(day, "d")}
                                                </button>
                                              );
                                            });
                                          })()}
                                        </div>
                                      </motion.div>
                                    </ModalPortal>
                                  )}
                                </AnimatePresence>
                            </div>
                          </div>

                          <div className="space-y-2">
                              <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85] flex justify-between">
                                <span>Horário</span>
                                <span className="text-[#FF5C00] font-mono">{formTime}</span>
                              </label>
                              <div className="grid grid-cols-3 gap-2 h-[300px] overflow-y-auto no-scrollbar border border-[#222228] p-3 rounded-2xl bg-[#0A0A0B]">
                                  {timeSlots.map(time => {
                                    const isOccupied = appointments.some(a => 
                                      isSameDay(new Date(a.start), new Date(`${formDate}T00:00:00`)) && 
                                      format(new Date(a.start), "HH:mm") === time &&
                                      a.status !== "Cancelado"
                                    );

                                    return (
                                      <button
                                        key={time}
                                        type="button"
                                        onClick={() => setFormTime(time)}
                                        className={`py-2.5 rounded-lg text-xs font-mono font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
                                          formTime === time 
                                            ? "bg-[#FF5C00] text-white shadow-lg" 
                                            : isOccupied 
                                              ? "bg-red-500/10 text-red-500/50 border border-red-500/20 cursor-not-allowed"
                                              : "bg-[#16161A] text-[#7A7A85] hover:bg-[#222228] hover:text-[#F5F5F0] cursor-pointer"
                                        }`}
                                      >
                                        {time}
                                        {isOccupied && <span className="text-[0.5rem] uppercase opacity-50">Ocupado</span>}
                                      </button>
                                    );
                                  })}
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="p-6 md:p-8 border-t border-[#222228] bg-[#111114]">
                      <button type="submit" className="w-full bg-[#FF5C00] text-white py-4 rounded-xl font-bold hover:bg-[#FF7A2E] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-xl shadow-[#FF5C00]/10 flex items-center justify-center gap-2">
                        {isEditing ? <Settings className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                        {isEditing ? "Salvar Alterações" : "Confirmar Agendamento"}
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
                <button 
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    setIsEditing(true);
                    setEditingId(selectedEvent.id);
                    setFormDate(format(new Date(selectedEvent.start), "yyyy-MM-dd"));
                    setFormTime(format(new Date(selectedEvent.start), "HH:mm"));
                    setIsAddModalOpen(true);
                  }}
                  className="flex-1 bg-[#222228] text-white py-4 rounded-xl text-sm font-bold hover:bg-[#2A2A30] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Editar
                </button>
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
