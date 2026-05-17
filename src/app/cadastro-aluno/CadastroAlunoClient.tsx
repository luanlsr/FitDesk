"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ShieldCheck, Dumbbell, AlertTriangle, ArrowRight } from "lucide-react";
import { registerStudentFromInvite } from "../actions/studentInvite";

interface Props {
  personalName: string;
  personalId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
}

export default function CadastroAlunoClient({
  personalName,
  personalId,
  studentId,
  studentName,
  studentEmail
}: Props) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas digitadas não coincidem.");
      return;
    }

    if (password.length < 8) {
      setError("A senha deve conter no mínimo 8 caracteres.");
      return;
    }

    if (!lgpdConsent) {
      setError("Você precisa concordar com os termos de consentimento da LGPD.");
      return;
    }

    setLoading(true);

    try {
      const res = await registerStudentFromInvite({
        personalId,
        email: studentEmail,
        password,
        studentId,
        lgpdConsent
      });

      if (res.success) {
        setSuccess(true);
        // Iniciar contagem regressiva para redirecionar
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              router.push("/login");
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(res.error || "Ocorreu um erro ao cadastrar sua senha.");
      }
    } catch (err: any) {
      setError(err.message || "Erro desconhecido durante o cadastro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F0] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[#FF5C00]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[#FF5C00]/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-[#111114] border border-[#222228] p-8 md:p-10 rounded-[32px] shadow-2xl relative z-10 space-y-8"
      >
        {/* Logo / Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5C00] to-[#FF8C00] flex items-center justify-center mx-auto shadow-lg shadow-[#FF5C00]/20">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-[#CFCFC8]">
            Ative sua Conta
          </h1>
          <p className="text-sm text-[#7A7A85] px-4">
            Olá, <span className="text-[#FF5C00] font-bold">{studentName}</span>! Defina sua senha para acessar seus treinos prescritos por <span className="text-[#F5F5F0] font-semibold">{personalName}</span>.
          </p>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-6"
          >
            <div className="w-16 h-16 rounded-full bg-[#00E676]/10 border border-[#00E676]/20 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8 text-[#00E676]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#F5F5F0]">Senha Cadastrada com Sucesso!</h2>
              <p className="text-sm text-[#7A7A85] px-4">
                Sua conta de aluno está ativada. Você será redirecionado para a tela de login em{" "}
                <span className="text-[#FF5C00] font-extrabold">{countdown}s</span>...
              </p>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-3 bg-[#FF5C00] hover:bg-[#FF7A30] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 mx-auto transition-all shadow-lg shadow-[#FF5C00]/20 cursor-pointer"
            >
              Fazer Login Agora <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 bg-[#FF4444]/10 border border-[#FF4444]/20 p-4 rounded-xl text-xs text-[#FF4444] font-medium"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Email Field (Disabled) */}
            <div className="space-y-2">
              <label className="text-[0.65rem] text-[#7A7A85] font-bold uppercase tracking-wider block">
                Seu E-mail Cadastrado
              </label>
              <input
                type="email"
                value={studentEmail}
                disabled
                className="w-full bg-[#16161A] border border-[#222228] px-4 py-3.5 rounded-xl text-sm text-[#7A7A85] focus:outline-none cursor-not-allowed opacity-80"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2 relative">
              <label className="text-[0.65rem] text-[#7A7A85] font-bold uppercase tracking-wider block">
                Nova Senha de Acesso
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo de 8 caracteres"
                  required
                  className="w-full bg-[#16161A] border border-[#222228] hover:border-[#33333E] focus:border-[#FF5C00] px-4 py-3.5 pr-12 rounded-xl text-sm text-[#F5F5F0] placeholder-[#4E4E5A] focus:outline-none transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A7A85] hover:text-[#F5F5F0] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2 relative">
              <label className="text-[0.65rem] text-[#7A7A85] font-bold uppercase tracking-wider block">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita sua senha exatamente"
                  required
                  className="w-full bg-[#16161A] border border-[#222228] hover:border-[#33333E] focus:border-[#FF5C00] px-4 py-3.5 pr-12 rounded-xl text-sm text-[#F5F5F0] placeholder-[#4E4E5A] focus:outline-none transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A7A85] hover:text-[#F5F5F0] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* LGPD Consent Checkbox */}
            <label className="flex items-start gap-3 bg-[#16161A]/50 border border-[#222228] p-4 rounded-xl cursor-pointer hover:border-[#FF5C00]/20 transition-all">
              <input
                type="checkbox"
                checked={lgpdConsent}
                onChange={(e) => setLgpdConsent(e.target.checked)}
                className="w-4 h-4 accent-[#FF5C00] mt-0.5 shrink-0"
              />
              <span className="text-[0.7rem] leading-relaxed text-[#7A7A85] font-medium select-none">
                Estou ciente e aceito que meus dados de cadastro de evolução física, treinos e saúde sejam armazenados de forma criptografada pelo sistema sob os termos de conformidade com a <span className="text-[#FF5C00] font-bold">LGPD (Lei Geral de Proteção de Dados)</span>.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#FF5C00] hover:bg-[#FF7A30] disabled:bg-[#33333E] disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#FF5C00]/10 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" /> Ativar Minha Conta de Aluno
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
