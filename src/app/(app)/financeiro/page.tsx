"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  PlusCircle,
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Wallet, 
  Tag, 
  CreditCard, 
  PieChart,
  ArrowUpCircle,
  ArrowDownCircle,
  Trash2,
  Calendar as CalendarIcon,
  MessageCircle,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { getTransactions, createTransaction, deleteTransaction, getFinancialStats } from "@/app/actions/finance";
import { getStudents } from "@/app/actions/students";
import ModalPortal from "@/components/ModalPortal";
import { getBillingStatus } from "@/app/actions/billing";
import { updateStudentPlan } from "@/app/actions/plans";
import { format, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function FinanceiroPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [billing, setBilling] = useState<any[]>([]);
  const [stats, setStats] = useState({ in: 0, out: 0, balance: 0 });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"IN" | "OUT">("IN");
  const [tab, setTab] = useState<"fluxo" | "mensalidades" | "planos">("fluxo");

  // Armazenar valores temporários dos inputs de planos
  const [planEdits, setPlanEdits] = useState<Record<string, { planValue: number; paymentDay: number }>>({});

  const handleUpdatePlan = async (id: string) => {
    const edit = planEdits[id];
    if (!edit) return;
    
    const formData = new FormData();
    formData.append("id", id);
    formData.append("planValue", edit.planValue.toString());
    formData.append("paymentDay", edit.paymentDay.toString());
    
    setIsLoading(true);
    const res = await updateStudentPlan(formData);
    if (res.success) {
      fetchData();
      // Limpar edit após salvar
      setPlanEdits(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } else {
      alert("Erro ao salvar plano.");
    }
    setIsLoading(false);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tData, stData, sData, bData] = await Promise.all([
        getTransactions(currentMonth),
        getFinancialStats(currentMonth),
        getStudents(),
        getBillingStatus()
      ]);
      setTransactions(tData);
      setStats(stData);
      setStudents(sData);
      setBilling(bData);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentMonth]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("type", transactionType);
    
    const res = await createTransaction(formData);
    if (res.success) {
      setIsModalOpen(false);
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja remover esta transação?")) {
      const res = await deleteTransaction(id);
      if (res.success) fetchData();
    }
  };

  const handleWhatsApp = (student: any) => {
    const text = `Olá ${student.name}, tudo bem? Estou passando para lembrar da mensalidade da FitDesk no valor de R$ ${student.planValue?.toFixed(2)}. Qual a previsão para o acerto? Abraço!`;
    window.open(`https://wa.me/55${student.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-up max-w-[1400px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-5 h-5 text-[#FF5C00]" />
            <h1 className="text-2xl font-bold text-[#F5F5F0]">Financeiro</h1>
          </div>
          <p className="text-[#7A7A85] text-sm">Gestão de fluxo de caixa, mensalidades e planos.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex items-center justify-between gap-2 bg-[#16161A] border border-[#222228] p-1.5 rounded-xl">
             <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 text-[#7A7A85] hover:text-[#F5F5F0] hover:bg-[#222228] rounded-lg cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
             <span className="text-[0.7rem] font-bold text-[#F5F5F0] px-2 min-w-[120px] text-center capitalize">{format(currentMonth, "MMMM yyyy", { locale: ptBR })}</span>
             <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 text-[#7A7A85] hover:text-[#F5F5F0] hover:bg-[#222228] rounded-lg cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <button 
            onClick={() => {
                setTransactionType("IN");
                setIsModalOpen(true);
            }}
            className="bg-[#FF5C00] text-white text-sm font-bold px-6 py-4 sm:py-3 rounded-2xl shadow-[0_0_20px_rgba(255,92,0,0.2)] hover:bg-[#FF7A2E] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" /> Novo Lançamento
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#16161A] border border-[#222228] p-5 md:p-6 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-[#00E676]/10 rounded-2xl flex items-center justify-center text-[#00E676]">
              <ArrowUpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[0.65rem] font-bold text-[#7A7A85] uppercase tracking-wider">Entradas (Mês)</div>
              <div className="text-xl font-bold text-[#F5F5F0]">R$ {stats.in.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00E676]/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#16161A] border border-[#222228] p-5 md:p-6 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-[#FF4444]/10 rounded-2xl flex items-center justify-center text-[#FF4444]">
              <ArrowDownCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[0.65rem] font-bold text-[#7A7A85] uppercase tracking-wider">Saídas (Mês)</div>
              <div className="text-xl font-bold text-[#F5F5F0]">R$ {stats.out.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF4444]/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`p-5 md:p-6 rounded-3xl relative overflow-hidden group border col-span-1 sm:col-span-2 lg:col-span-1 ${stats.balance >= 0 ? "bg-[#00E676]/5 border-[#00E676]/20" : "bg-[#FF4444]/5 border-[#FF4444]/20"}`}>
          <div className="flex items-center gap-4 relative z-10">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stats.balance >= 0 ? "bg-[#00E676]/10 text-[#00E676]" : "bg-[#FF4444]/10 text-[#FF4444]"}`}>
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[0.65rem] font-bold text-[#7A7A85] uppercase tracking-wider">Saldo Final</div>
              <div className={`text-xl font-bold ${stats.balance >= 0 ? "text-[#00E676]" : "text-[#FF4444]"}`}>R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#222228] pb-1 font-bold text-sm overflow-x-auto no-scrollbar scroll-hint relative">
        <button onClick={() => setTab("fluxo")} className={`px-4 py-3 border-b-2 transition-all whitespace-nowrap cursor-pointer ${tab === "fluxo" ? "text-[#FF5C00] border-[#FF5C00]" : "text-[#7A7A85] border-transparent"}`}>
          Fluxo de Caixa
        </button>
        <button onClick={() => setTab("mensalidades")} className={`px-4 py-3 border-b-2 transition-all whitespace-nowrap cursor-pointer ${tab === "mensalidades" ? "text-[#FF5C00] border-[#FF5C00]" : "text-[#7A7A85] border-transparent"}`}>
          Mensalidades
        </button>
        <button onClick={() => setTab("planos")} className={`px-4 py-3 border-b-2 transition-all whitespace-nowrap cursor-pointer ${tab === "planos" ? "text-[#FF5C00] border-[#FF5C00]" : "text-[#7A7A85] border-transparent"}`}>
          Gestão de Planos
        </button>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center bg-[#16161A] border border-[#222228] rounded-2xl">
          <div className="w-8 h-8 border-4 border-[#FF5C00]/20 border-t-[#FF5C00] rounded-full animate-spin"></div>
        </div>
      ) : tab === "fluxo" ? (
        /* FLUXO DE CAIXA */
        <div className="animate-in fade-in slide-in-from-bottom-2">
            <div className="hidden md:block bg-[#16161A] border border-[#222228] rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-[#222228] flex justify-between items-center bg-[#111114]/50">
                    <h2 className="text-[0.65rem] font-bold text-[#F5F5F0] uppercase tracking-widest">Movimentações do Mês</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                        <tr className="border-b border-[#222228]">
                            <th className="px-6 py-4 text-[0.6rem] font-mono text-[#7A7A85] uppercase">Descrição</th>
                            <th className="px-6 py-4 text-[0.6rem] font-mono text-[#7A7A85] uppercase">Categoria</th>
                            <th className="px-6 py-4 text-[0.6rem] font-mono text-[#7A7A85] uppercase">Vínculo</th>
                            <th className="px-6 py-4 text-[0.6rem] font-mono text-[#7A7A85] uppercase">Data</th>
                            <th className="px-6 py-4 text-[0.6rem] font-mono text-[#7A7A85] uppercase text-right">Valor</th>
                            <th className="px-6 py-4 text-[0.6rem] font-mono text-[#7A7A85] uppercase text-right">Ações</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-[#222228]">
                        {transactions.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-[#333338] italic">Lista vazia.</td></tr>
                        ) : (
                            transactions.map((t) => (
                            <tr key={t.id} className="hover:bg-[#0A0A0B]/50 transition-colors group">
                                <td className="px-6 py-4 font-semibold text-sm text-[#F5F5F0]">{t.description}</td>
                                <td className="px-6 py-4"><span className="text-[0.6rem] bg-[#222228] text-[#7A7A85] px-2 py-1 rounded-full uppercase font-bold">{t.category}</span></td>
                                <td className="px-6 py-4 text-[0.7rem] text-[#CFCFC8]">{t.student?.name || "-"}</td>
                                <td className="px-6 py-4 text-[0.7rem] text-[#7A7A85]">{format(new Date(t.date), "dd/MM HH:mm")}</td>
                                <td className={`px-6 py-4 text-right font-mono font-bold text-sm ${t.type === "IN" ? "text-[#00E676]" : "text-[#FF4444]"}`}>
                                {t.type === "IN" ? "+" : "-"} R$ {t.amount.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                <button onClick={() => handleDelete(t.id)} className="p-2 text-[#333338] hover:text-[#FF4444] transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="md:hidden space-y-4">
                {transactions.length === 0 ? (
                    <div className="py-12 text-center bg-[#16161A] border border-[#222228] rounded-2xl text-[#333338] italic">Nenhuma transação este mês.</div>
                ) : (
                    transactions.map((t) => (
                        <div key={t.id} className="bg-[#16161A] border border-[#222228] p-5 rounded-2xl space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-[#F5F5F0] text-sm">{t.description}</h3>
                                    <p className="text-[0.65rem] text-[#7A7A85] mt-1">{format(new Date(t.date), "dd/MM/yy 'às' HH:mm")}</p>
                                </div>
                                <div className={`text-sm font-bold font-mono ${t.type === "IN" ? "text-[#00E676]" : "text-[#FF4444]"}`}>
                                    {t.type === "IN" ? "+" : "-"} R$ {t.amount.toFixed(2)}
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-[#222228]">
                                <div className="flex items-center gap-2">
                                    <span className="text-[0.55rem] bg-[#222228] text-[#7A7A85] px-2 py-0.5 rounded uppercase font-bold">{t.category}</span>
                                    {t.student?.name && <span className="text-[0.55rem] text-[#CFCFC8] font-medium">{t.student.name}</span>}
                                </div>
                                <button onClick={() => handleDelete(t.id)} className="p-2 text-[#FF4444]/60 hover:text-[#FF4444]">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      ) : tab === "mensalidades" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-2">
          {billing.length === 0 ? (
            <div className="col-span-full py-20 text-center text-[#7A7A85] italic">Nenhum aluno com plano ativo para este mês.</div>
          ) : (
            billing.map((b) => (
              <div key={b.id} className="bg-[#16161A] border border-[#222228] p-5 rounded-3xl relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-[#FF5C00]/10 rounded-2xl flex items-center justify-center text-[#FF5C00]">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[0.6rem] font-bold uppercase tracking-widest ${
                    b.status === "Pago" ? "bg-[#00E676]/10 text-[#00E676]" : 
                    b.status === "Atrasado" ? "bg-[#FF4444]/10 text-[#FF4444]" : "bg-[#7A7A85]/10 text-[#7A7A85]"
                  }`}>
                    {b.status}
                  </div>
                </div>
                
                <h3 className="text-[#F5F5F0] font-bold text-lg mb-1">{b.name}</h3>
                <p className="text-[#7A7A85] text-xs mb-4">Vencimento: Dia {b.paymentDay || '-'}</p>
                
                <div className="flex items-center justify-between p-3 bg-[#0A0A0B] rounded-2xl border border-[#222228]">
                  <div>
                    <span className="text-[0.6rem] text-[#7A7A85] uppercase font-bold block">Valor do Plano</span>
                    <span className="text-[#F5F5F0] font-mono font-bold">R$ {b.planValue?.toFixed(2) || '0.00'}</span>
                  </div>
                  {b.status !== "Pago" && (
                    <button 
                      onClick={() => handleWhatsApp(b)}
                      className="p-3 bg-[#00E676] text-black rounded-xl hover:bg-[#00C864] transition-all cursor-pointer shadow-lg active:scale-95"
                      title="Cobrar via WhatsApp"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  )}
                  {b.status === "Pago" && (
                    <div className="p-3 bg-white/5 rounded-xl text-[#00E676]"><CheckCircle2 className="w-5 h-5" /></div>
                  )}
                </div>

                {b.paymentDate && (
                  <p className="text-[0.6rem] text-[#7A7A85] mt-3 italic flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#00E676]" /> Pago em {format(new Date(b.paymentDate), "dd/MM/yyyy")}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2">
            <div className="hidden md:block bg-[#16161A] border border-[#222228] rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-[#222228] flex justify-between items-center bg-[#111114]/50">
                    <div>
                    <h2 className="text-[0.65rem] font-bold text-[#F5F5F0] uppercase tracking-widest">Planos por Aluno</h2>
                    <p className="text-[#7A7A85] text-[0.7rem] mt-1">Defina o valor mensal e o dia de vencimento de cada aluno.</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                            <tr className="border-b border-[#222228]">
                                <th className="px-6 py-4 text-[0.6rem] font-mono text-[#7A7A85] uppercase">Aluno</th>
                                <th className="px-6 py-4 text-[0.6rem] font-mono text-[#7A7A85] uppercase">Valor Mensal (R$)</th>
                                <th className="px-6 py-4 text-[0.6rem] font-mono text-[#7A7A85] uppercase">Dia do Vencimento</th>
                                <th className="px-6 py-4 text-[0.6rem] font-mono text-[#7A7A85] uppercase">Plano Ativo</th>
                                <th className="px-6 py-4 text-[0.6rem] font-mono text-[#7A7A85] uppercase text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#222228]">
                            {students.map((s) => (
                                <tr key={s.id} className="hover:bg-[#0A0A0B]/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-[#F5F5F0]">{s.name}</div>
                                        <div className="text-[0.65rem] text-[#7A7A85]">{s.email || "Sem e-mail"}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-[#F5F5F0]">R$</span>
                                            <input 
                                                type="number" 
                                                key={s.id + "-value"}
                                                defaultValue={s.planValue || 0}
                                                onChange={(e) => setPlanEdits(prev => ({
                                                    ...prev,
                                                    [s.id]: {
                                                        planValue: parseFloat(e.target.value),
                                                        paymentDay: prev[s.id]?.paymentDay || s.paymentDay || 10
                                                    }
                                                }))}
                                                className="w-24 bg-[#0A0A0B] border border-[#222228] rounded-lg px-2 py-1 text-sm text-white focus:border-[#FF5C00] outline-none" 
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <input 
                                            type="number" 
                                            key={s.id + "-day"}
                                            min="1" max="31"
                                            defaultValue={s.paymentDay || 10}
                                            onChange={(e) => setPlanEdits(prev => ({
                                                ...prev,
                                                [s.id]: {
                                                    planValue: prev[s.id]?.planValue || s.planValue || 0,
                                                    paymentDay: parseInt(e.target.value)
                                                }
                                            }))}
                                            className="w-16 bg-[#0A0A0B] border border-[#222228] rounded-lg px-2 py-1 text-sm text-white focus:border-[#FF5C00] outline-none" 
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[0.6rem] bg-[#FF5C00]/10 text-[#FF5C00] px-2 py-0.5 rounded-lg border border-[#FF5C00]/20 font-bold uppercase">Personalizado</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleUpdatePlan(s.id)}
                                            disabled={!planEdits[s.id]}
                                            className={`px-3 py-1.5 text-white text-[0.65rem] font-bold rounded-lg transition-all ${planEdits[s.id] ? "bg-[#FF5C00] hover:bg-[#FF7A2E] cursor-pointer" : "bg-[#222228] text-[#7A7A85] cursor-not-allowed"}`}
                                        >
                                            Salvar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="md:hidden space-y-4">
                {students.map((s) => (
                    <div key={s.id} className="bg-[#16161A] border border-[#222228] p-5 rounded-2xl space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-[#F5F5F0] text-sm">{s.name}</h3>
                                <p className="text-[0.65rem] text-[#7A7A85]">{s.email || "Sem e-mail"}</p>
                            </div>
                            <span className="text-[0.5rem] bg-[#FF5C00]/10 text-[#FF5C00] px-1.5 py-0.5 rounded font-bold uppercase">ATIVO</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#0A0A0B] p-3 rounded-xl border border-[#222228]">
                                <span className="text-[0.55rem] text-[#7A7A85] uppercase font-bold block mb-1">Valor Mensal</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-[0.7rem] text-[#F5F5F0]">R$</span>
                                    <input 
                                        type="number" 
                                        defaultValue={s.planValue || 0}
                                        onChange={(e) => setPlanEdits(prev => ({
                                            ...prev,
                                            [s.id]: {
                                                planValue: parseFloat(e.target.value),
                                                paymentDay: prev[s.id]?.paymentDay || s.paymentDay || 10
                                            }
                                        }))}
                                        className="w-full bg-transparent text-sm text-[#F5F5F0] font-bold outline-none"
                                    />
                                </div>
                            </div>
                            <div className="bg-[#0A0A0B] p-3 rounded-xl border border-[#222228]">
                                <span className="text-[0.55rem] text-[#7A7A85] uppercase font-bold block mb-1">Vencimento</span>
                                <input 
                                    type="number" 
                                    defaultValue={s.paymentDay || 10}
                                    onChange={(e) => setPlanEdits(prev => ({
                                        ...prev,
                                        [s.id]: {
                                            planValue: prev[s.id]?.planValue || s.planValue || 0,
                                            paymentDay: parseInt(e.target.value)
                                        }
                                    }))}
                                    className="w-full bg-transparent text-sm text-[#F5F5F0] font-bold outline-none"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={() => handleUpdatePlan(s.id)}
                            disabled={!planEdits[s.id]}
                            className={`w-full py-3 text-white text-xs font-bold rounded-xl transition-all ${planEdits[s.id] ? "bg-[#FF5C00] shadow-lg shadow-[#FF5C00]/20" : "bg-[#222228] text-[#7A7A85]"}`}
                        >
                            Salvar Alterações
                        </button>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* MODAL TRANSACAO - CORRIGIDO (ALINHAMENTO & ROLAGEM) */}
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
                      <h2 className="text-xl font-bold text-[#F5F5F0]">Nova Transação</h2>
                      <button onClick={() => setIsModalOpen(false)} className="p-2 text-[#7A7A85] hover:text-[#F5F5F0] hover:bg-[#222228] rounded-xl transition-all cursor-pointer"><X className="w-6 h-6" /></button>
                  </div>

                  <form onSubmit={handleCreate} id="transaction-form" className="flex flex-col flex-1 overflow-hidden">
                      {/* Body com Rolagem */}
                      <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                          <div className="flex gap-2 mb-4 bg-[#0A0A0B] p-1.5 rounded-2xl border border-[#222228]">
                              <button type="button" onClick={() => setTransactionType("IN")} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${transactionType === "IN" ? "bg-[#00E676] text-black shadow-lg shadow-[#00E676]/10" : "text-[#7A7A85] hover:text-[#F5F5F0]"}`}>Entrada (+)</button>
                              <button type="button" onClick={() => setTransactionType("OUT")} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${transactionType === "OUT" ? "bg-[#FF4444] text-white shadow-lg shadow-[#FF4444]/10" : "text-[#7A7A85] hover:text-[#F5F5F0]"}`}>Saída (-)</button>
                          </div>

                          <div className="space-y-4">
                              <div className="space-y-2">
                                  <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold">Descrição</label>
                                  <input name="description" required className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all" placeholder="Ex: Mensalidade João Silva" />
                              </div>
                              
                              <div className="space-y-2">
                                  <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold">Valor (R$)</label>
                                  <input name="amount" type="number" step="0.01" required className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all" placeholder="0.00" />
                              </div>

                              <div className="space-y-2">
                                  <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold">Categoria</label>
                                  <select name="category" className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all appearance-none cursor-pointer">
                                      <option>Mensalidade</option>
                                      <option>Equipamento</option>
                                      <option>Aluguel</option>
                                      <option>Suplemento</option>
                                      <option>Marketing</option>
                                      <option>Outros</option>
                                  </select>
                              </div>

                              <div className="space-y-2">
                                  <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold">Vínculo com Aluno</label>
                                  <select name="studentId" className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all appearance-none cursor-pointer">
                                      <option value="none">Opcional</option>
                                      {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                  </select>
                              </div>
                          </div>
                      </div>

                      {/* Footer Fixo */}
                      <div className="p-8 border-t border-[#222228] bg-[#111114]">
                          <button 
                              type="submit" 
                              className={`w-full py-4 rounded-2xl font-bold shadow-xl transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] ${transactionType === "IN" ? "bg-[#00E676] text-black hover:bg-[#00C864] shadow-[#00E676]/20" : "bg-[#FF4444] text-white hover:bg-[#E63E3E] shadow-[#FF4444]/20"}`}
                          >
                              Salvar Lançamento
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
