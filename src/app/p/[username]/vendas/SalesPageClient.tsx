"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Dumbbell, 
  Sparkles,
  Calendar,
  Zap,
  Target
} from "lucide-react";
import { processStudentCheckout } from "@/app/actions/studentCheckout";

interface SalesPageClientProps {
  personal: {
    id: string;
    name: string;
    email: string;
    sales_plan_value: number;
    sales_plan_description: string;
  };
  username: string;
}

const maskCpf = (value: string) =>
  value.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})/, "$1-$2").replace(/(-\d{2})\d+?$/, "$1");

const maskPhone = (value: string) =>
  value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").replace(/(-\d{4})\d+?$/, "$1");

const maskCardNumber = (value: string) =>
  value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ").substring(0, 19);

const maskExpiry = (value: string) =>
  value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").substring(0, 5);

const maskCep = (value: string) =>
  value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").substring(0, 9);

export default function SalesPageClient({ personal, username }: SalesPageClientProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Dados Pessoais do Aluno
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Dados do Cartão (Somente client-side)
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || name.trim().length < 3) { setError("Informe seu nome completo."); return; }
    if (!email.includes("@")) { setError("Informe um e-mail válido."); return; }
    if (cpf.replace(/\D/g, "").length !== 11) { setError("CPF inválido."); return; }
    if (phone.replace(/\D/g, "").length < 10) { setError("WhatsApp inválido."); return; }
    if (postalCode.replace(/\D/g, "").length !== 8) { setError("CEP inválido."); return; }
    if (!acceptedTerms) { setError("Você precisa concordar com os Termos de Uso."); return; }

    setError("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Gera token de cartão seguro (PCI-DSS compliant)
      // Em modo Sandbox / Produção local, simulamos um token seguro para prosseguir
      let creditCardToken = "tok_student_sandbox_dev_secure";

      if (typeof window !== "undefined" && window.AsaasCheckout) {
        const [expMonth, expYear] = cardExpiry.split("/");
        const tokenResult = await window.AsaasCheckout.tokenizeCard({
          holderName: cardName,
          number: cardNumber.replace(/\s/g, ""),
          expiryMonth: expMonth,
          expiryYear: expYear.length === 2 ? `20${expYear}` : expYear,
          ccv: cardCvv,
        });
        creditCardToken = tokenResult.creditCardToken;
      }

      // Apaga dados confidenciais do cartão do state imediatamente
      setCardNumber("");
      setCardCvv("");

      const res = await processStudentCheckout({
        personalUsername: username,
        name,
        email,
        cpf,
        phone,
        postalCode,
        creditCardToken,
      });

      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.error || "Ocorreu um erro ao processar o seu pagamento.");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Falha na conexão com o servidor. Tente novamente.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#111114] border border-[#222228] p-8 md:p-12 rounded-[32px] text-center max-w-lg w-full shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#FF5C00]/10 rounded-full blur-[80px] -mt-20"></div>
          <div className="w-20 h-20 bg-[#00E676]/10 text-[#00E676] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-4">Matrícula Confirmada! 🎉</h1>
          <p className="text-[#CFCFC8] text-sm leading-relaxed mb-6">
            Parabéns! Sua assinatura foi criada com sucesso. Enviamos um e-mail para <strong className="text-white">{email}</strong> com as instruções e o link exclusivo para criar sua senha de acesso.
          </p>
          <div className="bg-[#16161A] border border-[#222228] p-5 rounded-2xl mb-8 text-left space-y-3">
            <div className="flex items-center gap-3 text-xs text-[#7A7A85]">
              <Sparkles className="w-4 h-4 text-[#FF5C00]" />
              <span>Acesse sua ficha de treinos completa</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#7A7A85]">
              <Calendar className="w-4 h-4 text-[#FF5C00]" />
              <span>Agende horários diretamente com {personal.name}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#7A7A85]">
              <Target className="w-4 h-4 text-[#FF5C00]" />
              <span>Acompanhe seu progresso e evolução</span>
            </div>
          </div>
          <p className="text-xs text-[#7A7A85]">
            Verifique também sua caixa de Spam ou Promoções se não receber o convite nos próximos 3 minutos.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF5C00]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FF5C00]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1.2fr_1fr] bg-[#111114] border border-[#222228] rounded-[32px] shadow-2xl relative z-10 overflow-hidden"
      >
        {/* Lado Esquerdo - Checkout / Formulário */}
        <div className="p-6 md:p-12 flex flex-col justify-center min-h-[500px] order-2 md:order-1">
          <div className="flex items-center justify-between mb-8 border-b border-[#222228] pb-4">
            <div className={`text-xs uppercase font-bold tracking-wider ${step === 1 ? "text-[#FF5C00]" : "text-[#00E676]"} flex items-center gap-2`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] ${step === 1 ? "bg-[#FF5C00]/20" : "bg-[#00E676]/20"}`}>
                {step === 1 ? "1" : <CheckCircle2 className="w-3 h-3" />}
              </span>
              Seus Dados
            </div>
            <div className={`text-xs uppercase font-bold tracking-wider ${step === 2 ? "text-[#FF5C00]" : "text-[#7A7A85]"} flex items-center gap-2`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] ${step === 2 ? "bg-[#FF5C00]/20" : "bg-[#222228]"}`}>2</span>
              Pagamento
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-bold text-center"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleNextStep}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Nome Completo</label>
                  <input 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                    className="w-full bg-[#0A0A0B] border border-[#222228] p-3.5 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00] transition-colors" 
                    placeholder="Seu nome completo" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">E-mail</label>
                  <input 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    type="email" 
                    required 
                    className="w-full bg-[#0A0A0B] border border-[#222228] p-3.5 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00] transition-colors" 
                    placeholder="seu@email.com" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">CPF</label>
                    <input 
                      value={cpf} 
                      onChange={e => setCpf(maskCpf(e.target.value))} 
                      required 
                      className="w-full bg-[#0A0A0B] border border-[#222228] p-3.5 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00] transition-colors" 
                      placeholder="000.000.000-00" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">WhatsApp</label>
                    <input 
                      value={phone} 
                      onChange={e => setPhone(maskPhone(e.target.value))} 
                      required 
                      className="w-full bg-[#0A0A0B] border border-[#222228] p-3.5 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00] transition-colors" 
                      placeholder="(00) 00000-0000" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">CEP</label>
                  <input 
                    value={postalCode} 
                    onChange={e => setPostalCode(maskCep(e.target.value))} 
                    required 
                    className="w-full bg-[#0A0A0B] border border-[#222228] p-3.5 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00] transition-colors" 
                    placeholder="00000-000" 
                  />
                </div>

                <div className="flex items-center gap-3 cursor-pointer select-none pt-2">
                  <input
                    type="checkbox"
                    id="lgpd_student_checkout"
                    checked={acceptedTerms}
                    onChange={e => setAcceptedTerms(e.target.checked)}
                    className="w-4.5 h-4.5 rounded bg-[#0A0A0B] border-[#222228] text-[#FF5C00] accent-[#FF5C00] cursor-pointer"
                  />
                  <label htmlFor="lgpd_student_checkout" className="text-xs text-[#7A7A85] hover:text-[#CFCFC8] cursor-pointer transition-colors">
                    Aceito os Termos de Serviço e autorizo a coleta segura de dados para fins de planejamento físico e faturamento.
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={!acceptedTerms}
                  className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mt-6 ${
                    acceptedTerms ? "bg-[#FF5C00] text-white hover:bg-[#FF7A2E] cursor-pointer" : "bg-[#222228] text-[#7A7A85] cursor-not-allowed opacity-50"
                  }`}
                >
                  Ir para o Pagamento <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="p-3 bg-[#00E676]/5 border border-[#00E676]/20 rounded-xl flex items-center gap-2.5 text-[0.7rem] text-[#00E676] font-bold mb-2">
                  <ShieldCheck className="w-4.5 h-4.5 shrink-0" />
                  Conexão segura. Seus dados de cartão são tokenizados diretamente na adquirente.
                </div>

                <div className="space-y-1">
                  <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Número do Cartão</label>
                  <input 
                    value={cardNumber} 
                    onChange={e => setCardNumber(maskCardNumber(e.target.value))} 
                    required 
                    className="w-full bg-[#0A0A0B] border border-[#222228] p-3.5 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00] font-mono tracking-widest" 
                    placeholder="0000 0000 0000 0000" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Nome no Cartão</label>
                  <input 
                    value={cardName} 
                    onChange={e => setCardName(e.target.value)} 
                    required 
                    className="w-full bg-[#0A0A0B] border border-[#222228] p-3.5 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00] uppercase" 
                    placeholder="COMO IMPRESSO NO CARTÃO" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Validade</label>
                    <input 
                      value={cardExpiry} 
                      onChange={e => setCardExpiry(maskExpiry(e.target.value))} 
                      required 
                      className="w-full bg-[#0A0A0B] border border-[#222228] p-3.5 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00] font-mono text-center" 
                      placeholder="MM/AA" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">CVV</label>
                    <input 
                      value={cardCvv} 
                      onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 4))} 
                      required 
                      type="password" 
                      placeholder="***" 
                      className="w-full bg-[#0A0A0B] border border-[#222228] p-3.5 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00] font-mono text-center" 
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)} 
                    className="p-4 bg-[#16161A] border border-[#222228] rounded-xl text-[#7A7A85] hover:text-white transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="flex-1 bg-[#00E676] text-black py-4 rounded-xl font-bold hover:bg-[#00C864] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    {loading ? "Processando..." : "Confirmar Matrícula"}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Lado Direito - Resumo / Info do Professor */}
        <div className="bg-[#16161A] p-8 md:p-12 border-t md:border-t-0 md:border-l border-[#222228] flex flex-col justify-between relative overflow-hidden order-1 md:order-2">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5C00]/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF5C00]/20 rounded-xl flex items-center justify-center text-[#FF5C00]">
                <Dumbbell className="w-5 h-5" />
              </div>
              <span className="font-bebas text-2xl text-white tracking-widest">FIT<span className="text-[#FF5C00]">DESK</span></span>
            </div>

            <div className="space-y-1">
              <span className="text-[0.65rem] font-bold text-[#FF5C00] uppercase tracking-wider">Apoio Profissional</span>
              <h2 className="text-3xl font-extrabold text-white">{personal.name}</h2>
              <p className="text-xs text-[#7A7A85]">{personal.sales_plan_description}</p>
            </div>

            <div className="h-px bg-[#222228] w-full"></div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs text-[#CFCFC8]">
                <CheckCircle2 className="w-5 h-5 text-[#00E676]" />
                <span>Planilha de treinos digital e intuitiva</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#CFCFC8]">
                <Zap className="w-5 h-5 text-[#00E676]" />
                <span>Histórico de Anamnese & Avaliações físicas</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#CFCFC8]">
                <Calendar className="w-5 h-5 text-[#00E676]" />
                <span>Agendamentos flexíveis pelo App</span>
              </div>
            </div>

            <div className="h-px bg-[#222228] w-full"></div>

            <div className="space-y-2">
              <span className="text-[0.65rem] font-bold text-[#7A7A85] uppercase tracking-wider">Valor Recorrente</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-[#7A7A85] font-semibold">R$</span>
                <span className="text-5xl font-black text-white tracking-tight">{personal.sales_plan_value.toFixed(2).split('.')[0]}</span>
                <span className="text-sm text-[#7A7A85] font-semibold">,{personal.sales_plan_value.toFixed(2).split('.')[1]} /mês</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 space-y-2 text-[0.7rem] text-[#7A7A85]">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#00E676]" />
              <span>Assinatura Mensal sem fidelidade compulsória</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00E676]" />
              <span>Seus dados protegidos sob a LGPD</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
