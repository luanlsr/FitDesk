"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { processCheckout } from "@/app/actions/checkout";

declare global {
  interface Window {
    AsaasCheckout?: {
      tokenizeCard: (cardData: {
        holderName: string;
        number: string;
        expiryMonth: string;
        expiryYear: string;
        ccv: string;
      }) => Promise<{ creditCardToken: string }>;
    };
  }
}

const plansInfo: any = {
  starter: { name: "Starter", price: "49", features: ["Até 10 alunos", "Agenda", "Treinos"] },
  pro: { name: "Pro", price: "89", features: ["Alunos ilimitados", "Agenda", "Treinos", "Relatórios"] },
  studio: { name: "Studio", price: "159", features: ["Até 5 Personals", "Branding", "API", "Suporte 24/7"] },
};

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

function getPasswordStrength(password: string): { level: 0 | 1 | 2 | 3; label: string; color: string } {
  if (password.length === 0) return { level: 0, label: "", color: "" };
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  if (password.length < 8 || !hasLetter || !hasNumber) return { level: 1, label: "Fraca", color: "#EF4444" };
  if (password.length >= 8 && hasLetter && hasNumber && !hasSpecial) return { level: 2, label: "Boa", color: "#F59E0B" };
  return { level: 3, label: "Forte", color: "#00E676" };
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planKey = searchParams.get("plan") || "pro";
  const plan = plansInfo[planKey] || plansInfo.pro;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [password, setPassword] = useState("");

  // Dados do cartão ficam APENAS no estado local do browser — nunca vão ao servidor
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const passwordStrength = getPasswordStrength(password);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    const cepDigits = postalCode.replace(/\D/g, "");
    if (!name || name.length < 2) { setError("Informe seu nome completo."); return; }
    if (!email.includes("@")) { setError("Informe um e-mail válido."); return; }
    if (cpf.replace(/\D/g, "").length !== 11) { setError("CPF inválido."); return; }
    if (phone.replace(/\D/g, "").length < 10) { setError("Telefone inválido."); return; }
    if (cepDigits.length !== 8) { setError("CEP inválido. Informe os 8 dígitos."); return; }
    if (passwordStrength.level < 2) { setError("Senha fraca. Use pelo menos 8 caracteres com letras e números."); return; }
    if (!acceptedTerms) { setError("Você precisa aceitar os termos de uso e política de privacidade."); return; }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Tokenizar cartão no client-side via Asaas.js (PCI-DSS compliant)
      // Em desenvolvimento/sandbox, usa um token de teste
      let creditCardToken = "sandbox-token-dev";

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

      // Limpar dados sensíveis da memória imediatamente após tokenização
      setCardNumber("");
      setCardCvv("");

      const formData = new FormData();
      formData.append("plan", planKey);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("cpf", cpf);
      formData.append("phone", phone);
      formData.append("postalCode", postalCode.replace(/\D/g, ""));
      formData.append("password", password);
      // Apenas o TOKEN vai ao servidor — NUNCA os dados do cartão em texto claro
      formData.append("creditCardToken", creditCardToken);
      formData.append("lgpdConsent", acceptedTerms ? "true" : "false");

      const res = await processCheckout(formData);

      if (res.success) {
        router.push("/login?checkout=success");
      } else {
        setError(res.error || "Erro ao processar pagamento");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao processar. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4 md:p-8 relative">
      <div className="absolute top-0 left-0 w-full h-full hero-grid opacity-20 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-0 bg-[#111114] border border-[#222228] rounded-[32px] shadow-2xl relative z-10 overflow-hidden"
      >
        {/* Lado Esquerdo - Resumo */}
        <div className="bg-[#16161A] p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#222228] flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5C00]/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <div className="font-bebas text-2xl text-[#F5F5F0] tracking-[2px] mb-8">FIT<span className="text-[#FF5C00]">DESK</span></div>
            <h2 className="text-[#7A7A85] text-sm uppercase tracking-widest font-bold mb-2">Resumo do Pedido</h2>
            <div className="font-bebas text-4xl text-[#F5F5F0] uppercase tracking-wider mb-2">Plano {plan.name}</div>
            <div className="flex items-end gap-1 mb-8">
              <span className="text-[#7A7A85] font-mono text-sm mb-1">R$</span>
              <span className="text-[#F5F5F0] font-bebas text-5xl leading-none">{plan.price}</span>
              <span className="text-[#7A7A85] font-mono text-sm mb-1">/mês</span>
            </div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feat: string, i: number) => (
                <li key={i} className="flex items-center gap-3 text-[#CFCFC8] text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#00E676]" /> {feat}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-3 text-[0.7rem] text-[#7A7A85]">
              <Lock className="w-4 h-4 text-[#00E676]" /> Pagamento 100% seguro via Asaas.
            </div>
            <div className="flex items-center gap-3 text-[0.7rem] text-[#7A7A85]">
              <ShieldCheck className="w-4 h-4 text-[#00E676]" /> Dados do cartão não tocam nossos servidores.
            </div>
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="p-6 md:p-12 flex flex-col justify-center min-h-[500px]">
          <div className="md:hidden flex justify-between items-center mb-6">
            <div className="font-bebas text-xl text-[#F5F5F0] tracking-[2px]">FIT<span className="text-[#FF5C00]">DESK</span></div>
            <div className="text-sm font-bold text-[#F5F5F0]">R$ {plan.price}/mês</div>
          </div>

          <div className="flex items-center justify-between mb-8 border-b border-[#222228] pb-4">
            <div className={`text-xs uppercase font-bold tracking-wider ${step === 1 ? "text-[#FF5C00]" : "text-[#00E676]"} flex items-center gap-2`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] ${step === 1 ? "bg-[#FF5C00]/20" : "bg-[#00E676]/20"}`}>
                {step === 1 ? "1" : <CheckCircle2 className="w-3 h-3" />}
              </span>
              Dados Pessoais
            </div>
            <div className={`text-xs uppercase font-bold tracking-wider ${step === 2 ? "text-[#FF5C00]" : "text-[#7A7A85]"} flex items-center gap-2`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] ${step === 2 ? "bg-[#FF5C00]/20" : "bg-[#222228]"}`}>2</span>
              Pagamento
            </div>
          </div>

          {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-bold text-center">{error}</div>}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                onSubmit={handleNextStep}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Nome Completo</label>
                  <input value={name} onChange={e => setName(e.target.value)} required className="w-full bg-[#0A0A0B] border border-[#222228] p-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" placeholder="Seu nome" />
                </div>
                <div className="space-y-1">
                  <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">E-mail Profissional</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="w-full bg-[#0A0A0B] border border-[#222228] p-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" placeholder="seu@email.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">CPF</label>
                    <input value={cpf} onChange={e => setCpf(maskCpf(e.target.value))} required className="w-full bg-[#0A0A0B] border border-[#222228] p-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" placeholder="000.000.000-00" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">WhatsApp</label>
                    <input value={phone} onChange={e => setPhone(maskPhone(e.target.value))} required className="w-full bg-[#0A0A0B] border border-[#222228] p-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" placeholder="(11) 90000-0000" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">CEP</label>
                  <input value={postalCode} onChange={e => setPostalCode(maskCep(e.target.value))} required className="w-full bg-[#0A0A0B] border border-[#222228] p-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]" placeholder="00000-000" />
                </div>
                <div className="space-y-1">
                  <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Senha de Acesso</label>
                  <div className="relative">
                    <input
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full bg-[#0A0A0B] border border-[#222228] p-3 pr-10 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00]"
                      placeholder="Mínimo 8 caracteres, letras e números"
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7A85] hover:text-[#F5F5F0] transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-1 flex-1">
                        {[1, 2, 3].map(l => (
                          <div key={l} className="h-1 flex-1 rounded-full transition-all" style={{ backgroundColor: passwordStrength.level >= l ? passwordStrength.color : "#222228" }} />
                        ))}
                      </div>
                      <span className="text-[0.6rem] font-bold" style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 group cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    id="lgpd_checkout"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-4 h-4 rounded-lg bg-[#0A0A0B] border-[#222228] text-[#FF5C00] transition-colors cursor-pointer"
                  />
                  <label htmlFor="lgpd_checkout" className="text-[0.65rem] text-[#7A7A85] group-hover:text-[#CFCFC8] transition-colors cursor-pointer select-none">
                    Li e concordo com os <Link href="/termos" target="_blank" className="text-[#FF5C00] hover:underline font-bold">Termos de Uso</Link> e a <Link href="/privacidade" target="_blank" className="text-[#FF5C00] hover:underline font-bold">Política de Privacidade</Link>.
                  </label>
                </div>

                <button type="submit" className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mt-6 ${acceptedTerms ? "bg-[#FF5C00] text-white hover:bg-[#FF7A2E]" : "bg-[#222228] text-[#7A7A85] cursor-not-allowed opacity-50"}`} disabled={!acceptedTerms}>
                  Continuar para Pagamento <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>

            ) : (

              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="mb-4 p-3 bg-[#00E676]/5 border border-[#00E676]/20 rounded-xl flex items-center gap-2 text-[0.65rem] text-[#00E676] font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  Os dados do cartão são criptografados pelo Asaas antes de serem processados. Nunca os armazenamos.
                </div>
                <div className="space-y-1">
                  <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Número do Cartão</label>
                  <input value={cardNumber} onChange={e => setCardNumber(maskCardNumber(e.target.value))} required className="w-full bg-[#0A0A0B] border border-[#222228] p-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00] font-mono tracking-widest" placeholder="0000 0000 0000 0000" autoComplete="cc-number" />
                </div>
                <div className="space-y-1">
                  <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Nome impresso no Cartão</label>
                  <input value={cardName} onChange={e => setCardName(e.target.value)} required className="w-full bg-[#0A0A0B] border border-[#222228] p-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00] uppercase" placeholder="LUAN SILVA" autoComplete="cc-name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">Validade</label>
                    <input value={cardExpiry} onChange={e => setCardExpiry(maskExpiry(e.target.value))} required className="w-full bg-[#0A0A0B] border border-[#222228] p-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00] font-mono text-center" placeholder="MM/AA" autoComplete="cc-exp" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[0.65rem] uppercase font-bold text-[#7A7A85]">CVV</label>
                    <input value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 4))} required type="password" placeholder="***" className="w-full bg-[#0A0A0B] border border-[#222228] p-3 rounded-xl text-sm text-[#F5F5F0] outline-none focus:border-[#FF5C00] font-mono text-center" autoComplete="cc-csc" />
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button type="button" onClick={() => setStep(1)} className="p-4 bg-[#16161A] border border-[#222228] rounded-xl text-[#7A7A85] hover:text-white transition-all">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 bg-[#00E676] text-black py-4 rounded-xl font-bold hover:bg-[#00C864] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    <Lock className="w-4 h-4" />
                    {loading ? "Processando..." : "Assinar com Segurança"}
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-[#222228] flex items-center justify-center gap-4 md:gap-6 opacity-60">
                  <div className="flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-wider text-[#7A7A85]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
                    <span>SSL 256-BIT</span>
                  </div>
                  <div className="w-px h-3 bg-[#222228]"></div>
                  <div className="flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-wider text-[#7A7A85]">
                    <Lock className="w-3.5 h-3.5 text-[#00E676]" />
                    <span>PCI-DSS</span>
                  </div>
                  <div className="w-px h-3 bg-[#222228]"></div>
                  <div className="flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-wider text-[#7A7A85]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676]" />
                    <span>ASAAS SECURE</span>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
