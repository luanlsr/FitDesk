"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  User, 
  Activity, 
  FileText, 
  TrendingUp, 
  Plus, 
  Save, 
  Trash2, 
  Lock, 
  ShieldCheck, 
  Scale, 
  ChevronRight, 
  Dumbbell,
  CheckCircle,
  AlertTriangle,
  Info,
  Copy,
  Check,
  Send,
  ExternalLink
} from "lucide-react";
import { getStudent } from "@/app/actions/students";
import { getStudentAnamnese, saveStudentAnamnese } from "@/app/actions/anamnese";
import { getStudentEvaluations, createStudentEvaluation, deleteStudentEvaluation } from "@/app/actions/evaluation";
import { maskPhone, maskCpf } from "@/lib/utils";
import ModalPortal from "@/components/ModalPortal";

type TabType = "overview" | "anamnese" | "physical" | "progress";

export default function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // States para Convite de Aluno
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  // States para Anamnese
  const [anamnese, setAnamnese] = useState<any>({
    patologias: {
      cardiopatia: false,
      hipertensao: false,
      diabetes: false,
      lesoesArticulares: false,
      lesoesColuna: false,
      alergias: "",
      outros: ""
    },
    estiloVida: {
      tabagista: false,
      etilista: false,
      sedentario: false,
      horasSono: 8,
      estresse: "Normal"
    },
    historicoFamiliar: {
      infarto: false,
      avc: false,
      outros: ""
    },
    medicamentos: "",
    cirurgias: "",
    restricoesMedicas: ""
  });
  const [savingAnamnese, setSavingAnamnese] = useState(false);
  const [anamneseStatusMsg, setAnamneseStatusMsg] = useState<{ type: "success" | "error", text: string } | null>(null);

  // States para Avaliações Físicas
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [savingEval, setSavingEval] = useState(false);
  
  // Formulário de Nova Avaliação
  const [protocol, setProtocol] = useState<"3" | "7">("3");
  const [age, setAge] = useState<number>(25);
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  
  // Perímetros
  const [perimeters, setPerimeters] = useState({
    neck: 0,
    chest: 0,
    rightBiceps: 0,
    leftBiceps: 0,
    rightForearm: 0,
    leftForearm: 0,
    waist: 0,
    abdomen: 0,
    hip: 0,
    rightThigh: 0,
    leftThigh: 0,
    rightCalf: 0,
    leftCalf: 0
  });

  // Dobras Cutâneas
  const [skinfolds, setSkinfolds] = useState({
    chest: 0,        // Peitoral
    midAxillary: 0,  // Axilar Média
    triceps: 0,      // Tríceps
    subscapular: 0,  // Subescapular
    suprailiac: 0,   // Suprailíaca
    abdomen: 0,      // Abdômen
    thigh: 0         // Coxa
  });

  // Testes Neuromotores
  const [tests, setTests] = useState({
    wells: 0,        // Banco de Wells (cm)
    pushUps: 0,      // Flexão de braço (repetições)
    sitUps: 0        // Abdominais (1 min)
  });

  // Avaliação Postural
  const [postural, setPostural] = useState({
    head: "Normal",
    shoulders: "Simétricos",
    spine: "Normal",
    hip: "Alinhado",
    knees: "Normais",
    feet: "Normais"
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentRes, anamneseRes, evalRes] = await Promise.all([
        getStudent(studentId),
        getStudentAnamnese(studentId),
        getStudentEvaluations(studentId)
      ]);

      if (studentRes.success && studentRes.data) {
        setStudent(studentRes.data);
        // Calcular idade básica baseada em 25 anos padrão se não informado
        setAge(studentRes.data.age || 25);
      }
      
      if (anamneseRes.success && anamneseRes.data) {
        setAnamnese(anamneseRes.data.data || anamneseRes.data);
      }
      
      if (evalRes.success && evalRes.data) {
        setEvaluations(evalRes.data);
      }
    } catch (err) {
      console.error("Erro ao carregar dados do aluno", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [studentId]);

  // Cálculo de Gordura Corporal (BF%) via Jackson & Pollock
  const calculateBF = () => {
    const isMale = student?.gender === "Masculino" || student?.gender === "M";
    let density = 1;
    let sum = 0;

    if (protocol === "3") {
      if (isMale) {
        // Homens 3 Dobras: Peitoral, Abdômen, Coxa
        sum = skinfolds.chest + skinfolds.abdomen + skinfolds.thigh;
        density = 1.10938 - (0.0008267 * sum) + (0.0000016 * Math.pow(sum, 2)) - (0.0002574 * age);
      } else {
        // Mulheres 3 Dobras: Tríceps, Suprailíaca, Coxa
        sum = skinfolds.triceps + skinfolds.suprailiac + skinfolds.thigh;
        density = 1.0994921 - (0.0009929 * sum) + (0.0000023 * Math.pow(sum, 2)) - (0.0001392 * age);
      }
    } else {
      // 7 Dobras: Peitoral, Axilar Média, Tríceps, Subescapular, Suprailíaca, Abdômen, Coxa
      sum = skinfolds.chest + skinfolds.midAxillary + skinfolds.triceps + skinfolds.subscapular + skinfolds.suprailiac + skinfolds.abdomen + skinfolds.thigh;
      if (isMale) {
        density = 1.112 - (0.00043499 * sum) + (0.00000055 * Math.pow(sum, 2)) - (0.00028826 * age);
      } else {
        density = 1.097 - (0.00046971 * sum) + (0.00000056 * Math.pow(sum, 2)) - (0.00012828 * age);
      }
    }

    // Fórmula de Siri
    const bf = density > 0.5 ? ((4.95 / density) - 4.5) * 100 : 0;
    const finalBF = Math.max(0, Math.min(60, bf)); // Limitar limites reais
    const fatMass = weight * (finalBF / 100);
    const leanMass = weight - fatMass;

    return {
      bf: parseFloat(finalBF.toFixed(1)),
      fatMass: parseFloat(fatMass.toFixed(1)),
      leanMass: parseFloat(leanMass.toFixed(1)),
      density: parseFloat(density.toFixed(4))
    };
  };

  const handleSaveAnamnese = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAnamnese(true);
    setAnamneseStatusMsg(null);
    
    const res = await saveStudentAnamnese(studentId, anamnese);
    setSavingAnamnese(false);
    if (res.success) {
      setAnamneseStatusMsg({ type: "success", text: "Anamnese salva e criptografada com sucesso (Conformidade LGPD)!" });
      setTimeout(() => setAnamneseStatusMsg(null), 5000);
    } else {
      setAnamneseStatusMsg({ type: "error", text: res.error || "Erro ao salvar anamnese." });
    }
  };

  const handleCreateEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEval(true);
    
    const results = calculateBF();
    const evaluationData = {
      protocol,
      age,
      weight,
      height,
      perimeters,
      skinfolds,
      tests,
      postural,
      results
    };

    const res = await createStudentEvaluation(studentId, evaluationData);
    setSavingEval(false);
    if (res.success) {
      setIsEvalModalOpen(false);
      // Resetar form
      setPerimeters({
        neck: 0, chest: 0, rightBiceps: 0, leftBiceps: 0, rightForearm: 0, leftForearm: 0,
        waist: 0, abdomen: 0, hip: 0, rightThigh: 0, leftThigh: 0, rightCalf: 0, leftCalf: 0
      });
      setSkinfolds({ chest: 0, midAxillary: 0, triceps: 0, subscapular: 0, suprailiac: 0, abdomen: 0, thigh: 0 });
      setTests({ wells: 0, pushUps: 0, sitUps: 0 });
      fetchData();
    } else {
      alert(res.error || "Erro ao salvar avaliação física.");
    }
  };

  const handleDeleteEvaluation = async (evalId: string) => {
    if (confirm("Tem certeza de que deseja excluir esta avaliação física? Esta ação não pode ser desfeita.")) {
      const res = await deleteStudentEvaluation(evalId, studentId);
      if (res.success) {
        fetchData();
      } else {
        alert(res.error || "Erro ao excluir avaliação.");
      }
    }
  };

  const bfResults = calculateBF();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B] text-[#F5F5F0]">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-[#FF5C00] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-[#7A7A85] font-medium">Carregando perfil do aluno criptografado...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0B] text-[#F5F5F0] p-4">
        <AlertTriangle className="w-16 h-16 text-[#FF5C00] mb-4" />
        <h2 className="text-xl font-bold mb-2">Aluno não encontrado</h2>
        <p className="text-sm text-[#7A7A85] mb-6">O aluno solicitado não existe ou você não possui permissão para acessá-lo.</p>
        <Link href="/alunos" className="px-5 py-2.5 bg-[#16161A] border border-[#222228] text-sm font-bold rounded-xl hover:border-[#FF5C00] transition-all">
          Voltar para Alunos
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-up max-w-7xl mx-auto">
      {/* Header com Navegação */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/alunos" className="p-2.5 bg-[#16161A] border border-[#222228] rounded-xl text-[#7A7A85] hover:text-[#F5F5F0] hover:border-[#7A7A85] transition-all cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[0.6rem] font-bold px-2 py-0.5 rounded-full uppercase ${student.status === "Ativo" ? "bg-[#00E676]/10 text-[#00E676]" : "bg-[#FF4444]/10 text-[#FF4444]"}`}>{student.status}</span>
              {student.group && (
                <span className="text-[0.6rem] font-bold px-2.5 py-0.5 rounded-full border" style={{ borderColor: student.group.color, color: student.group.color }}>
                  {student.group.name}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-[#F5F5F0] mt-1">{student.name}</h1>
          </div>
        </div>
        
        {/* Abas de Navegação */}
        <div className="flex bg-[#111114] border border-[#222228] p-1 rounded-2xl overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === "overview" ? "bg-[#FF5C00] text-white shadow-lg" : "text-[#7A7A85] hover:text-[#F5F5F0]"}`}
          >
            <User className="w-3.5 h-3.5" />
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab("anamnese")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === "anamnese" ? "bg-[#FF5C00] text-white shadow-lg" : "text-[#7A7A85] hover:text-[#F5F5F0]"}`}
          >
            <FileText className="w-3.5 h-3.5" />
            Anamnese Criptografada
          </button>
          <button
            onClick={() => setActiveTab("physical")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === "physical" ? "bg-[#FF5C00] text-white shadow-lg" : "text-[#7A7A85] hover:text-[#F5F5F0]"}`}
          >
            <Activity className="w-3.5 h-3.5" />
            Avaliação Física
          </button>
          <button
            onClick={() => setActiveTab("progress")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === "progress" ? "bg-[#FF5C00] text-white shadow-lg" : "text-[#7A7A85] hover:text-[#F5F5F0]"}`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Evolução
          </button>
        </div>
      </header>

      {/* Conteúdo Principal baseando-se na aba ativa */}
      <main className="min-h-[500px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: VISÃO GERAL */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Card de Informações Cadastrais */}
              <div className="bg-[#111114] border border-[#222228] p-6 rounded-3xl space-y-6 flex flex-col justify-between">
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-[#F5F5F0] uppercase tracking-wider">Dados Cadastrais</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[0.65rem] text-[#7A7A85] font-bold uppercase block">WhatsApp</label>
                      <span className="text-sm text-[#F5F5F0] font-mono">{student.phone ? maskPhone(student.phone) : "Não cadastrado"}</span>
                    </div>
                    <div>
                      <label className="text-[0.65rem] text-[#7A7A85] font-bold uppercase block">E-mail</label>
                      <span className="text-sm text-[#F5F5F0]">{student.email || "Não cadastrado"}</span>
                    </div>
                    <div>
                      <label className="text-[0.65rem] text-[#7A7A85] font-bold uppercase block">CPF</label>
                      <span className="text-sm text-[#F5F5F0] font-mono">{student.cpf ? maskCpf(student.cpf) : "Não cadastrado"}</span>
                    </div>
                    <div>
                      <label className="text-[0.65rem] text-[#7A7A85] font-bold uppercase block">Objetivo</label>
                      <span className="text-sm text-[#F5F5F0] font-bold text-[#FF5C00]">{student.goal || "Não informado"}</span>
                    </div>
                    <div>
                      <label className="text-[0.65rem] text-[#7A7A85] font-bold uppercase block">Gênero</label>
                      <span className="text-sm text-[#F5F5F0]">{student.gender || "Não informado"}</span>
                    </div>
                  </div>
                </div>

                {student.associatedUserId ? (
                  <div className="space-y-3 pt-4 border-t border-[#222228] mt-4">
                    <div className="flex items-center gap-2.5 text-xs text-[#00E676] bg-[#00E676]/5 p-3 rounded-2xl border border-[#00E676]/10 select-none">
                      <ShieldCheck className="w-4 h-4 text-[#00E676]" />
                      <span className="font-bold">Acesso Ativado pelo Aluno</span>
                    </div>
                    <button
                      onClick={() => {
                        setIsInviteModalOpen(true);
                        setInviteCopied(false);
                        setEmailSent(false);
                      }}
                      className="w-full py-2 bg-[#16161A] border border-[#222228] hover:border-[#FF5C00] text-[0.7rem] font-bold text-[#7A7A85] hover:text-[#FF5C00] rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Lock className="w-3 h-3" /> Reenviar / Ver Link de Acesso
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-[#222228] mt-4">
                    <button
                      onClick={() => {
                        setIsInviteModalOpen(true);
                        setInviteCopied(false);
                        setEmailSent(false);
                      }}
                      className="w-full py-3 bg-[#FF5C00]/10 border border-[#FF5C00]/20 hover:border-[#FF5C00] text-xs font-bold text-[#FF5C00] rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer hover:bg-[#FF5C00]/20"
                    >
                      <Lock className="w-3.5 h-3.5" /> Enviar Acesso ao Aluno
                    </button>
                  </div>
                )}
              </div>

              {/* Card de Faturamento e Planos */}
              <div className="bg-[#111114] border border-[#222228] p-6 rounded-3xl space-y-6">
                <h3 className="text-sm font-bold text-[#F5F5F0] uppercase tracking-wider">Mensalidade & Cobrança</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[0.65rem] text-[#7A7A85] font-bold uppercase block">Valor do Plano</label>
                    <span className="text-xl font-bold font-mono text-[#00E676]">{student.planValue ? `R$ ${student.planValue.toFixed(2)}` : "R$ 0,00"}</span>
                  </div>
                  <div>
                    <label className="text-[0.65rem] text-[#7A7A85] font-bold uppercase block">Dia do Vencimento</label>
                    <span className="text-sm text-[#F5F5F0] font-mono">Todo dia {student.paymentDay || 1}</span>
                  </div>
                  <div>
                    <label className="text-[0.65rem] text-[#7A7A85] font-bold uppercase block">Status da Assinatura (Asaas)</label>
                    <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full uppercase mt-1 inline-block ${student.plan_status === "active" ? "bg-[#00E676]/10 text-[#00E676]" : "bg-[#FFD600]/10 text-[#FFD600]"}`}>
                      {student.plan_status === "active" ? "Paga / Ativa" : "Pendente"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Resumo da Última Avaliação */}
              <div className="bg-[#111114] border border-[#222228] p-6 rounded-3xl space-y-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#F5F5F0] uppercase tracking-wider mb-4">Última Avaliação</h3>
                  {evaluations.length > 0 ? (
                    (() => {
                      const lastEval = evaluations[0].data || evaluations[0];
                      return (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center bg-[#16161A] p-3 rounded-2xl border border-[#222228]">
                            <span className="text-xs text-[#7A7A85]">Peso</span>
                            <span className="text-sm font-bold text-[#F5F5F0] font-mono">{lastEval.weight} kg</span>
                          </div>
                          <div className="flex justify-between items-center bg-[#16161A] p-3 rounded-2xl border border-[#222228]">
                            <span className="text-xs text-[#7A7A85]">BF (Gordura)</span>
                            <span className="text-sm font-bold text-[#FF5C00] font-mono">{lastEval.results?.bf || lastEval.bf || 0}%</span>
                          </div>
                          <div className="flex justify-between items-center bg-[#16161A] p-3 rounded-2xl border border-[#222228]">
                            <span className="text-xs text-[#7A7A85]">Massa Magra</span>
                            <span className="text-sm font-bold text-[#00E676] font-mono">{lastEval.results?.leanMass || lastEval.leanMass || 0} kg</span>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center py-6 text-[#7A7A85]">
                      <Scale className="w-10 h-10 mx-auto text-[#222228] mb-2" />
                      <p className="text-xs">Nenhuma avaliação realizada ainda.</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab("physical")}
                  className="w-full mt-4 py-3 bg-[#16161A] border border-[#222228] hover:border-[#FF5C00] transition-all rounded-xl text-xs font-bold text-[#F5F5F0] flex items-center justify-center gap-2 cursor-pointer"
                >
                  Ir para Avaliações <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB 2: ANAMNESE (CRIPTO LGPD) */}
          {activeTab === "anamnese" && (
            <motion.div
              key="anamnese"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-[#111114] border border-[#222228] p-6 md:p-8 rounded-[32px] space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222228] pb-6">
                <div>
                  <h2 className="text-lg font-bold text-[#F5F5F0] flex items-center gap-2">
                    <Lock className="w-5 h-5 text-[#FF5C00]" />
                    Ficha de Anamnese Criptografada
                  </h2>
                  <p className="text-xs text-[#7A7A85] mt-1">Conduza a entrevista de saúde com o aluno de forma totalmente protegida pela Lei Geral de Proteção de Dados.</p>
                </div>
                <div className="flex items-center gap-2 bg-[#FF5C00]/10 text-[#FF5C00] px-4 py-2 rounded-xl text-xs font-bold border border-[#FF5C00]/20">
                  <ShieldCheck className="w-4 h-4 text-[#FF5C00]" />
                  Conformidade LGPD Ativa
                </div>
              </div>

              <form onSubmit={handleSaveAnamnese} className="space-y-8">
                {/* 1. Antecedentes Patológicos */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#7A7A85] uppercase tracking-wider border-l-2 border-[#FF5C00] pl-2">1. Antecedentes Patológicos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className="flex items-center gap-3 bg-[#0A0A0B] border border-[#222228] p-4 rounded-xl cursor-pointer hover:border-[#FF5C00]/30 transition-all">
                      <input 
                        type="checkbox" 
                        checked={anamnese.patologias.cardiopatia}
                        onChange={(e) => setAnamnese({
                          ...anamnese,
                          patologias: { ...anamnese.patologias, cardiopatia: e.target.checked }
                        })}
                        className="w-4 h-4 accent-[#FF5C00]" 
                      />
                      <span className="text-xs text-[#CFCFC8] font-semibold">Cardiopatia</span>
                    </label>
                    <label className="flex items-center gap-3 bg-[#0A0A0B] border border-[#222228] p-4 rounded-xl cursor-pointer hover:border-[#FF5C00]/30 transition-all">
                      <input 
                        type="checkbox" 
                        checked={anamnese.patologias.hipertensao}
                        onChange={(e) => setAnamnese({
                          ...anamnese,
                          patologias: { ...anamnese.patologias, hipertensao: e.target.checked }
                        })}
                        className="w-4 h-4 accent-[#FF5C00]" 
                      />
                      <span className="text-xs text-[#CFCFC8] font-semibold">Hipertensão</span>
                    </label>
                    <label className="flex items-center gap-3 bg-[#0A0A0B] border border-[#222228] p-4 rounded-xl cursor-pointer hover:border-[#FF5C00]/30 transition-all">
                      <input 
                        type="checkbox" 
                        checked={anamnese.patologias.diabetes}
                        onChange={(e) => setAnamnese({
                          ...anamnese,
                          patologias: { ...anamnese.patologias, diabetes: e.target.checked }
                        })}
                        className="w-4 h-4 accent-[#FF5C00]" 
                      />
                      <span className="text-xs text-[#CFCFC8] font-semibold">Diabetes</span>
                    </label>
                    <label className="flex items-center gap-3 bg-[#0A0A0B] border border-[#222228] p-4 rounded-xl cursor-pointer hover:border-[#FF5C00]/30 transition-all">
                      <input 
                        type="checkbox" 
                        checked={anamnese.patologias.lesoesArticulares}
                        onChange={(e) => setAnamnese({
                          ...anamnese,
                          patologias: { ...anamnese.patologias, lesoesArticulares: e.target.checked }
                        })}
                        className="w-4 h-4 accent-[#FF5C00]" 
                      />
                      <span className="text-xs text-[#CFCFC8] font-semibold">Lesões Articulares</span>
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85] ml-1">Alergias / Intolerâncias</label>
                      <input 
                        type="text" 
                        value={anamnese.patologias.alergias}
                        onChange={(e) => setAnamnese({
                          ...anamnese,
                          patologias: { ...anamnese.patologias, alergias: e.target.value }
                        })}
                        placeholder="Ex: Glúten, Lactose, Corantes..." 
                        className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85] ml-1">Lesões de Coluna / Outras Patologias</label>
                      <input 
                        type="text" 
                        value={anamnese.patologias.outros}
                        onChange={(e) => setAnamnese({
                          ...anamnese,
                          patologias: { ...anamnese.patologias, outros: e.target.value }
                        })}
                        placeholder="Ex: Hérnia de Disco L4-L5, escoliose..." 
                        className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" 
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Estilo de Vida */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#7A7A85] uppercase tracking-wider border-l-2 border-[#FF5C00] pl-2">2. Estilo de Vida</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex gap-4">
                      <label className="flex-1 flex items-center justify-center gap-3 bg-[#0A0A0B] border border-[#222228] p-4 rounded-xl cursor-pointer hover:border-[#FF5C00]/30 transition-all">
                        <input 
                          type="checkbox" 
                          checked={anamnese.estiloVida.tabagista}
                          onChange={(e) => setAnamnese({
                            ...anamnese,
                            estiloVida: { ...anamnese.estiloVida, tabagista: e.target.checked }
                          })}
                          className="w-4 h-4 accent-[#FF5C00]" 
                        />
                        <span className="text-xs text-[#CFCFC8] font-semibold">Tabagista</span>
                      </label>
                      <label className="flex-1 flex items-center justify-center gap-3 bg-[#0A0A0B] border border-[#222228] p-4 rounded-xl cursor-pointer hover:border-[#FF5C00]/30 transition-all">
                        <input 
                          type="checkbox" 
                          checked={anamnese.estiloVida.sedentario}
                          onChange={(e) => setAnamnese({
                            ...anamnese,
                            estiloVida: { ...anamnese.estiloVida, sedentario: e.target.checked }
                          })}
                          className="w-4 h-4 accent-[#FF5C00]" 
                        />
                        <span className="text-xs text-[#CFCFC8] font-semibold">Sedentário</span>
                      </label>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85] ml-1">Horas de Sono (Média/Noite)</label>
                      <input 
                        type="number" 
                        value={anamnese.estiloVida.horasSono}
                        onChange={(e) => setAnamnese({
                          ...anamnese,
                          estiloVida: { ...anamnese.estiloVida, horasSono: parseInt(e.target.value) || 8 }
                        })}
                        placeholder="8" 
                        className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85] ml-1">Nível de Estresse Cotidiano</label>
                      <select 
                        value={anamnese.estiloVida.estresse}
                        onChange={(e) => setAnamnese({
                          ...anamnese,
                          estiloVida: { ...anamnese.estiloVida, estresse: e.target.value }
                        })}
                        className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]"
                      >
                        <option>Baixo</option>
                        <option>Normal</option>
                        <option>Alto (Muito estressado)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Observações Médicas e Histórico */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#7A7A85] uppercase tracking-wider border-l-2 border-[#FF5C00] pl-2">3. Detalhes Clínicos & Restrições</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85] ml-1">Medicamentos de Uso Contínuo</label>
                      <textarea 
                        rows={2}
                        value={anamnese.medicamentos}
                        onChange={(e) => setAnamnese({ ...anamnese, medicamentos: e.target.value })}
                        placeholder="Liste medicamentos ou deixe em branco se não aplicável..." 
                        className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00] no-scrollbar resize-none" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85] ml-1">Restrições Médicas Específicas / Cirurgias Recentes</label>
                      <textarea 
                        rows={2}
                        value={anamnese.restricoesMedicas}
                        onChange={(e) => setAnamnese({ ...anamnese, restricoesMedicas: e.target.value })}
                        placeholder="Ex: Proibido agachamento profundo, cirurgia no joelho há 3 meses..." 
                        className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00] no-scrollbar resize-none" 
                      />
                    </div>
                  </div>
                </div>

                {/* Mensagens de feedback */}
                {anamneseStatusMsg && (
                  <div className={`p-4 rounded-xl border text-xs font-medium ${anamneseStatusMsg.type === "success" ? "bg-[#00E676]/10 border-[#00E676]/20 text-[#00E676]" : "bg-red-500/10 border-red-500/20 text-red-500"}`}>
                    {anamneseStatusMsg.text}
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-[#222228]">
                  <button 
                    type="submit" 
                    disabled={savingAnamnese}
                    className="bg-[#FF5C00] text-white text-sm font-bold px-6 py-3.5 rounded-xl shadow-[0_0_20px_rgba(255,92,0,0.2)] hover:bg-[#FF7A2E] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {savingAnamnese ? "Criptografando e Gravando..." : "Gravar Anamnese com Segurança"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* TAB 3: AVALIAÇÃO FÍSICA */}
          {activeTab === "physical" && (
            <motion.div
              key="physical"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-[#F5F5F0]">Histórico de Avaliações Físicas</h2>
                  <p className="text-xs text-[#7A7A85]">Gere relatórios antropométricos e acompanhe o percentual de gordura do aluno.</p>
                </div>
                <button
                  onClick={() => setIsEvalModalOpen(true)}
                  className="bg-[#FF5C00] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(255,92,0,0.2)] hover:bg-[#FF7A2E] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Nova Avaliação
                </button>
              </div>

              {evaluations.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {evaluations.map((item) => {
                    const data = item.data || item;
                    const dateStr = new Date(item.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric"
                    });
                    
                    return (
                      <div key={item.id} className="bg-[#111114] border border-[#222228] p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#FF5C00]/30 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#FF5C00]/10 rounded-2xl flex items-center justify-center text-[#FF5C00]">
                            <Scale className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[#F5F5F0]">{dateStr}</h4>
                            <p className="text-xs text-[#7A7A85] mt-0.5">Jackson-Pollock {data.protocol || 3} dobras</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-8 bg-[#0A0A0B]/40 p-4 rounded-2xl border border-[#222228]/50">
                          <div>
                            <span className="text-[0.55rem] text-[#7A7A85] font-bold uppercase block">Peso</span>
                            <span className="text-sm font-bold text-[#F5F5F0] font-mono">{data.weight} kg</span>
                          </div>
                          <div>
                            <span className="text-[0.55rem] text-[#7A7A85] font-bold uppercase block">Estatura</span>
                            <span className="text-sm font-bold text-[#F5F5F0] font-mono">{data.height / 100} m</span>
                          </div>
                          <div>
                            <span className="text-[0.55rem] text-[#7A7A85] font-bold uppercase block">BF %</span>
                            <span className="text-sm font-bold text-[#FF5C00] font-mono">{data.results?.bf || data.bf || 0}%</span>
                          </div>
                          <div>
                            <span className="text-[0.55rem] text-[#7A7A85] font-bold uppercase block">Massa Magra</span>
                            <span className="text-sm font-bold text-[#00E676] font-mono">{data.results?.leanMass || data.leanMass || 0} kg</span>
                          </div>
                          <div>
                            <span className="text-[0.55rem] text-[#7A7A85] font-bold uppercase block">Flexibilidade</span>
                            <span className="text-sm font-bold text-[#64B5FF] font-mono">{data.tests?.wells || 0} cm</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleDeleteEvaluation(item.id)}
                            className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Excluir avaliação"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-[#111114] border border-[#222228] rounded-[32px] p-12 text-center text-[#7A7A85]">
                  <Scale className="w-16 h-16 text-[#222228] mx-auto mb-4" />
                  <h3 className="text-sm font-bold text-[#F5F5F0] mb-1">Nenhuma avaliação encontrada</h3>
                  <p className="text-xs max-w-sm mx-auto mb-6">Realize a primeira avaliação física para acompanhar e planejar a evolução corporal deste aluno.</p>
                  <button
                    onClick={() => setIsEvalModalOpen(true)}
                    className="bg-[#FF5C00] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg hover:bg-[#FF7A2E] cursor-pointer"
                  >
                    Adicionar Primeira Avaliação
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: EVOLUÇÃO GRÁFICA */}
          {activeTab === "progress" && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Gráfico 1: Peso Corporal */}
              <div className="bg-[#111114] border border-[#222228] p-6 md:p-8 rounded-[32px] space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#F5F5F0] uppercase tracking-wider flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#FF5C00]" />
                    Evolução do Peso Corporal (kg)
                  </h3>
                </div>

                {evaluations.length > 0 ? (
                  <div className="h-[250px] flex items-end justify-between gap-2 pt-6 border-b border-[#222228] pb-1 font-mono">
                    {evaluations.slice().reverse().map((ev, idx) => {
                      const data = ev.data || ev;
                      // Encontrar a proporção de peso para altura da barra
                      const maxWeight = Math.max(...evaluations.map(e => (e.data || e).weight), 100);
                      const heightPercent = Math.max(10, Math.min(90, (data.weight / maxWeight) * 100));
                      const dateStr = new Date(ev.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                          <div className="text-[0.65rem] text-[#F5F5F0] font-bold opacity-0 group-hover:opacity-100 transition-opacity mb-1 bg-[#16161A] px-1.5 py-0.5 rounded border border-[#222228] select-none">
                            {data.weight}kg
                          </div>
                          <div 
                            className="w-full bg-gradient-to-t from-[#FF5C00]/40 to-[#FF5C00] rounded-t-lg group-hover:brightness-125 transition-all relative"
                            style={{ height: `${heightPercent}%` }}
                          >
                            <div className="absolute top-2 inset-x-0 mx-auto w-1 h-1 bg-white rounded-full opacity-50"></div>
                          </div>
                          <span className="text-[0.6rem] text-[#7A7A85] font-bold mt-2">{dateStr}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-xs text-[#7A7A85]">
                    Adicione pelo menos 1 avaliação para iniciar a renderização gráfica.
                  </div>
                )}
              </div>

              {/* Gráfico 2: Percentual de Gordura (BF%) */}
              <div className="bg-[#111114] border border-[#222228] p-6 md:p-8 rounded-[32px] space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#F5F5F0] uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#00E676]" />
                    Evolução do Percentual de Gordura (BF%)
                  </h3>
                </div>

                {evaluations.length > 0 ? (
                  <div className="h-[250px] flex items-end justify-between gap-2 pt-6 border-b border-[#222228] pb-1 font-mono">
                    {evaluations.slice().reverse().map((ev, idx) => {
                      const data = ev.data || ev;
                      const bf = data.results?.bf || data.bf || 0;
                      // Proporção de BF
                      const maxBF = Math.max(...evaluations.map(e => (e.data || e).results?.bf || 40), 40);
                      const heightPercent = Math.max(10, Math.min(90, (bf / maxBF) * 100));
                      const dateStr = new Date(ev.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                          <div className="text-[0.65rem] text-[#00E676] font-bold opacity-0 group-hover:opacity-100 transition-opacity mb-1 bg-[#16161A] px-1.5 py-0.5 rounded border border-[#222228] select-none">
                            {bf}%
                          </div>
                          <div 
                            className="w-full bg-gradient-to-t from-[#00E676]/40 to-[#00E676] rounded-t-lg group-hover:brightness-125 transition-all relative"
                            style={{ height: `${heightPercent}%` }}
                          >
                            <div className="absolute top-2 inset-x-0 mx-auto w-1 h-1 bg-white rounded-full opacity-50"></div>
                          </div>
                          <span className="text-[0.6rem] text-[#7A7A85] font-bold mt-2">{dateStr}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-xs text-[#7A7A85]">
                    Adicione pelo menos 1 avaliação para iniciar a renderização gráfica.
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* MODAL NOVA AVALIAÇÃO FÍSICA */}
      {isEvalModalOpen && (
        <ModalPortal>
          <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="fixed inset-0" onClick={() => setIsEvalModalOpen(false)}></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-4xl bg-[#16161A] border border-[#222228] rounded-[40px] p-6 md:p-8 shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden"
            >
            {/* Header do Modal */}
            <div className="flex justify-between items-center border-b border-[#222228] pb-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#F5F5F0] flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#FF5C00]" />
                  Nova Avaliação Antropométrica e Postural
                </h3>
                <p className="text-xs text-[#7A7A85] mt-0.5">Insira os dados medidos do aluno. Fórmulas científicas calculam o percentual de gordura automaticamente.</p>
              </div>
              <button 
                onClick={() => setIsEvalModalOpen(false)}
                className="p-2 text-[#7A7A85] hover:text-[#F5F5F0] hover:bg-[#222228] rounded-xl transition-all cursor-pointer"
              >
                Voltar
              </button>
            </div>

            {/* Form com Rolagem Interna */}
            <form onSubmit={handleCreateEvaluation} className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
              
              {/* 1. Seleção de Protocolo e Métricas Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-[#0A0A0B]/40 p-5 rounded-2xl border border-[#222228]/50">
                <div className="space-y-2">
                  <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85] ml-1">Fórmula Pollock</label>
                  <select 
                    value={protocol} 
                    onChange={(e) => setProtocol(e.target.value as "3" | "7")}
                    className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] outline-none"
                  >
                    <option value="3">Pollock 3 Dobras</option>
                    <option value="7">Pollock 7 Dobras</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85] ml-1">Idade do Aluno</label>
                  <input 
                    type="number" 
                    value={age} 
                    onChange={(e) => setAge(parseInt(e.target.value) || 25)}
                    className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] outline-none font-mono" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85] ml-1">Peso Corporal (kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={weight} 
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 70)}
                    className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] outline-none font-mono" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85] ml-1">Altura (cm)</label>
                  <input 
                    type="number" 
                    value={height} 
                    onChange={(e) => setHeight(parseInt(e.target.value) || 170)}
                    className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] outline-none font-mono" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* 2. Perímetros Corporais (cm) */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-[#7A7A85] uppercase tracking-wider border-l-2 border-[#FF5C00] pl-2">2. Perímetros (cm)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[0.65rem] text-[#7A7A85] ml-1">Pescoço</span>
                      <input type="number" step="0.1" value={perimeters.neck} onChange={(e) => setPerimeters({ ...perimeters, neck: parseFloat(e.target.value) || 0 })} className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-2.5 text-xs text-[#F5F5F0] font-mono outline-none" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[0.65rem] text-[#7A7A85] ml-1">Tórax</span>
                      <input type="number" step="0.1" value={perimeters.chest} onChange={(e) => setPerimeters({ ...perimeters, chest: parseFloat(e.target.value) || 0 })} className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-2.5 text-xs text-[#F5F5F0] font-mono outline-none" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[0.65rem] text-[#7A7A85] ml-1">Bíceps Dir.</span>
                      <input type="number" step="0.1" value={perimeters.rightBiceps} onChange={(e) => setPerimeters({ ...perimeters, rightBiceps: parseFloat(e.target.value) || 0 })} className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-2.5 text-xs text-[#F5F5F0] font-mono outline-none" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[0.65rem] text-[#7A7A85] ml-1">Bíceps Esq.</span>
                      <input type="number" step="0.1" value={perimeters.leftBiceps} onChange={(e) => setPerimeters({ ...perimeters, leftBiceps: parseFloat(e.target.value) || 0 })} className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-2.5 text-xs text-[#F5F5F0] font-mono outline-none" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[0.65rem] text-[#7A7A85] ml-1">Cintura</span>
                      <input type="number" step="0.1" value={perimeters.waist} onChange={(e) => setPerimeters({ ...perimeters, waist: parseFloat(e.target.value) || 0 })} className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-2.5 text-xs text-[#F5F5F0] font-mono outline-none" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[0.65rem] text-[#7A7A85] ml-1">Abdômen</span>
                      <input type="number" step="0.1" value={perimeters.abdomen} onChange={(e) => setPerimeters({ ...perimeters, abdomen: parseFloat(e.target.value) || 0 })} className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-2.5 text-xs text-[#F5F5F0] font-mono outline-none" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[0.65rem] text-[#7A7A85] ml-1">Quadril</span>
                      <input type="number" step="0.1" value={perimeters.hip} onChange={(e) => setPerimeters({ ...perimeters, hip: parseFloat(e.target.value) || 0 })} className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-2.5 text-xs text-[#F5F5F0] font-mono outline-none" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[0.65rem] text-[#7A7A85] ml-1">Coxa Dir.</span>
                      <input type="number" step="0.1" value={perimeters.rightThigh} onChange={(e) => setPerimeters({ ...perimeters, rightThigh: parseFloat(e.target.value) || 0 })} className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-2.5 text-xs text-[#F5F5F0] font-mono outline-none" />
                    </div>
                  </div>
                </div>

                {/* 3. Dobras Cutâneas (mm) */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-[#7A7A85] uppercase tracking-wider border-l-2 border-[#FF5C00] pl-2">3. Dobras Cutâneas (mm)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Campos dinâmicos baseados no gênero e protocolo */}
                    <div className="space-y-1">
                      <span className="text-[0.65rem] text-[#7A7A85] ml-1">Peitoral</span>
                      <input type="number" disabled={protocol === "3" && student?.gender !== "Masculino" && student?.gender !== "M"} value={skinfolds.chest} onChange={(e) => setSkinfolds({ ...skinfolds, chest: parseFloat(e.target.value) || 0 })} className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-2.5 text-xs text-[#F5F5F0] font-mono outline-none disabled:opacity-30 disabled:cursor-not-allowed" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[0.65rem] text-[#7A7A85] ml-1">Tríceps</span>
                      <input type="number" disabled={protocol === "3" && (student?.gender === "Masculino" || student?.gender === "M")} value={skinfolds.triceps} onChange={(e) => setSkinfolds({ ...skinfolds, triceps: parseFloat(e.target.value) || 0 })} className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-2.5 text-xs text-[#F5F5F0] font-mono outline-none disabled:opacity-30 disabled:cursor-not-allowed" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[0.65rem] text-[#7A7A85] ml-1">Abdômen</span>
                      <input type="number" disabled={protocol === "3" && student?.gender !== "Masculino" && student?.gender !== "M"} value={skinfolds.abdomen} onChange={(e) => setSkinfolds({ ...skinfolds, abdomen: parseFloat(e.target.value) || 0 })} className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-2.5 text-xs text-[#F5F5F0] font-mono outline-none disabled:opacity-30 disabled:cursor-not-allowed" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[0.65rem] text-[#7A7A85] ml-1">Suprailíaca</span>
                      <input type="number" disabled={protocol === "3" && (student?.gender === "Masculino" || student?.gender === "M")} value={skinfolds.suprailiac} onChange={(e) => setSkinfolds({ ...skinfolds, suprailiac: parseFloat(e.target.value) || 0 })} className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-2.5 text-xs text-[#F5F5F0] font-mono outline-none disabled:opacity-30 disabled:cursor-not-allowed" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[0.65rem] text-[#7A7A85] ml-1">Coxa</span>
                      <input type="number" value={skinfolds.thigh} onChange={(e) => setSkinfolds({ ...skinfolds, thigh: parseFloat(e.target.value) || 0 })} className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-2.5 text-xs text-[#F5F5F0] font-mono outline-none" />
                    </div>
                    
                    {/* Campos extras apenas para o protocolo de 7 dobras */}
                    {protocol === "7" && (
                      <>
                        <div className="space-y-1">
                          <span className="text-[0.65rem] text-[#7A7A85] ml-1">Axilar Média</span>
                          <input type="number" value={skinfolds.midAxillary} onChange={(e) => setSkinfolds({ ...skinfolds, midAxillary: parseFloat(e.target.value) || 0 })} className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-2.5 text-xs text-[#F5F5F0] font-mono outline-none" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[0.65rem] text-[#7A7A85] ml-1">Subescapular</span>
                          <input type="number" value={skinfolds.subscapular} onChange={(e) => setSkinfolds({ ...skinfolds, subscapular: parseFloat(e.target.value) || 0 })} className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-2.5 text-xs text-[#F5F5F0] font-mono outline-none" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. Testes Posturais e Neuromotores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-[#7A7A85] uppercase tracking-wider border-l-2 border-[#FF5C00] pl-2">4. Testes Neuromotores</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <span className="text-[0.65rem] text-[#7A7A85] ml-1">Wells (cm)</span>
                      <input type="number" value={tests.wells} onChange={(e) => setTests({ ...tests, wells: parseInt(e.target.value) || 0 })} className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-2.5 text-xs text-[#F5F5F0] font-mono outline-none" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[0.65rem] text-[#7A7A85] ml-1">Flexões</span>
                      <input type="number" value={tests.pushUps} onChange={(e) => setTests({ ...tests, pushUps: parseInt(e.target.value) || 0 })} className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-2.5 text-xs text-[#F5F5F0] font-mono outline-none" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[0.65rem] text-[#7A7A85] ml-1">Abdominais</span>
                      <input type="number" value={tests.sitUps} onChange={(e) => setTests({ ...tests, sitUps: parseInt(e.target.value) || 0 })} className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-2.5 text-xs text-[#F5F5F0] font-mono outline-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-[#7A7A85] uppercase tracking-wider border-l-2 border-[#FF5C00] pl-2">5. Avaliação Postural Visual</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[0.65rem] text-[#7A7A85] ml-1">Coluna Vertebral</span>
                      <select value={postural.spine} onChange={(e) => setPostural({ ...postural, spine: e.target.value })} className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-2.5 text-xs text-[#F5F5F0] outline-none">
                        <option>Normal</option>
                        <option>Hiperlordose</option>
                        <option>Hipercifose</option>
                        <option>Escoliose</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[0.65rem] text-[#7A7A85] ml-1">Joelhos</span>
                      <select value={postural.knees} onChange={(e) => setPostural({ ...postural, knees: e.target.value })} className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-2.5 text-xs text-[#F5F5F0] outline-none">
                        <option>Normais</option>
                        <option>Geno Valgo (para dentro)</option>
                        <option>Geno Varo (para fora)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Pré-visualização dos Resultados Computados (Fórmula Científica) */}
              <div className="bg-[#0A0A0B] border border-[#222228] p-5 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold text-[#FF5C00] uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  Resultados Científicos Calculados em Tempo Real:
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#111114] p-4 rounded-xl border border-[#222228]/50">
                    <span className="text-[0.55rem] text-[#7A7A85] font-bold uppercase block">Densidade Corporal</span>
                    <span className="text-sm font-bold text-[#F5F5F0] font-mono">{bfResults.density} g/cm³</span>
                  </div>
                  <div className="bg-[#111114] p-4 rounded-xl border border-[#222228]/50">
                    <span className="text-[0.55rem] text-[#7A7A85] font-bold uppercase block">Percentual Gordura (BF%)</span>
                    <span className="text-base font-bold text-[#FF5C00] font-mono">{bfResults.bf}%</span>
                  </div>
                  <div className="bg-[#111114] p-4 rounded-xl border border-[#222228]/50">
                    <span className="text-[0.55rem] text-[#7A7A85] font-bold uppercase block">Massa Gorda</span>
                    <span className="text-sm font-bold text-red-400 font-mono">{bfResults.fatMass} kg</span>
                  </div>
                  <div className="bg-[#111114] p-4 rounded-xl border border-[#222228]/50">
                    <span className="text-[0.55rem] text-[#7A7A85] font-bold uppercase block">Massa Magra</span>
                    <span className="text-sm font-bold text-[#00E676] font-mono">{bfResults.leanMass} kg</span>
                  </div>
                </div>
              </div>

              {/* Footer do Modal */}
              <div className="pt-4 flex gap-3 border-t border-[#222228]">
                <button 
                  type="button" 
                  onClick={() => setIsEvalModalOpen(false)} 
                  className="flex-1 py-3 bg-[#16161A] text-[#7A7A85] rounded-xl font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={savingEval}
                  className="flex-[2] py-3 bg-[#FF5C00] text-white rounded-xl font-bold hover:bg-[#FF7A2E] shadow-xl cursor-pointer disabled:opacity-50"
                >
                  {savingEval ? "Salvando Avaliação..." : "Salvar Avaliação Física"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </ModalPortal>
    )}
    {/* MODAL ENVIAR ACESSO AO ALUNO */}
    {isInviteModalOpen && (
      <ModalPortal>
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={() => setIsInviteModalOpen(false)}></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg bg-[#16161A] border border-[#222228] rounded-[40px] p-6 md:p-8 shadow-2xl relative z-10 flex flex-col space-y-6"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-[#F5F5F0] flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#FF5C00]" />
                  Enviar Acesso ao Aluno
                </h3>
                <p className="text-xs text-[#7A7A85] mt-1">Gere e envie o link de ativação para que o aluno crie sua senha de acesso ao portal do FitDesk.</p>
              </div>
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="p-2 text-[#7A7A85] hover:text-[#F5F5F0] hover:bg-[#222228] rounded-xl transition-all cursor-pointer text-xs font-bold"
              >
                Fechar
              </button>
            </div>

            {/* Link Box */}
            <div className="space-y-2">
              <label className="text-[0.65rem] text-[#7A7A85] font-bold uppercase tracking-wider block">Link de Ativação do Aluno</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/cadastro-aluno?personalId=${student.personalId}&email=${encodeURIComponent(student.email)}&studentId=${student.id}`}
                  className="flex-1 bg-[#0A0A0B] border border-[#222228] px-4 py-3 rounded-xl text-xs text-[#7A7A85] focus:outline-none font-mono truncate"
                />
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/cadastro-aluno?personalId=${student.personalId}&email=${encodeURIComponent(student.email)}&studentId=${student.id}`;
                    navigator.clipboard.writeText(url);
                    setInviteCopied(true);
                    setTimeout(() => setInviteCopied(false), 3000);
                  }}
                  className="px-4 bg-[#222228] hover:bg-[#33333E] border border-[#33333E] text-xs font-bold text-[#F5F5F0] rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
                >
                  {inviteCopied ? (
                    <>
                      <Check className="w-4 h-4 text-[#00E676]" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  const url = `${window.location.origin}/cadastro-aluno?personalId=${student.personalId}&email=${encodeURIComponent(student.email)}&studentId=${student.id}`;
                  const message = `Olá ${student.name}! Seu personal trainer te convidou para acessar o FitDesk. Ative sua conta e crie sua senha de acesso agora pelo link:\n\n${url}`;
                  const formattedPhone = student.phone ? student.phone.replace(/\D/g, "") : "";
                  window.open(`https://wa.me/${formattedPhone ? "55" + formattedPhone : ""}?text=${encodeURIComponent(message)}`, "_blank");
                }}
                className="py-3 bg-[#25D366]/10 border border-[#25D366]/20 hover:border-[#25D366] text-xs font-bold text-[#25D366] rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer hover:bg-[#25D366]/20"
              >
                <Send className="w-3.5 h-3.5" />
                Enviar via WhatsApp
              </button>
              
              <button
                onClick={() => {
                  setEmailSent(true);
                  setTimeout(() => setEmailSent(false), 5000);
                }}
                className="py-3 bg-[#FF5C00]/10 border border-[#FF5C00]/20 hover:border-[#FF5C00] text-xs font-bold text-[#FF5C00] rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer hover:bg-[#FF5C00]/20"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Simular E-mail
              </button>
            </div>

            {emailSent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#00E676]/10 border border-[#00E676]/20 p-4 rounded-2xl text-xs text-[#00E676] font-medium text-center"
              >
                Convite de ativação enviado com sucesso para o e-mail: <strong className="font-bold">{student.email}</strong>
              </motion.div>
            )}

            <div className="pt-2 text-[0.65rem] text-[#7A7A85] text-center leading-relaxed">
              O aluno só precisa abrir o link para definir sua senha pessoal sob a proteção da LGPD. Ao concluir, seu status de acesso mudará automaticamente para <strong className="text-[#00E676] font-semibold">Ativado</strong>.
            </div>
          </motion.div>
        </div>
      </ModalPortal>
    )}
    </div>
  );
}
