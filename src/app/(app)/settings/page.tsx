"use client";

import { motion } from "framer-motion";
import { 
  User, 
  Lock, 
  Bell, 
  CreditCard, 
  Shield, 
  Smartphone,
  Save,
  ChevronRight,
  LogOut,
  Mail,
  Camera
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { exportUserData, deleteUserAccount } from "@/app/actions/privacy";
import { maskPhone } from "@/lib/utils";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("perfil");

  const tabs = [
    { id: "perfil", label: "Perfil", icon: <User className="w-4 h-4" /> },
    { id: "seguranca", label: "Segurança", icon: <Lock className="w-4 h-4" /> },
    { id: "notificacoes", label: "Notificações", icon: <Bell className="w-4 h-4" /> },
    { id: "plano", label: "Plano & Faturamento", icon: <CreditCard className="w-4 h-4" /> },
    { id: "privacidade", label: "Privacidade", icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-fade-up">
      <header>
        <h1 className="text-2xl font-bold text-[#F5F5F0] mb-2">Configurações</h1>
        <p className="text-[#7A7A85] text-sm">Gerencie sua conta, preferências e faturamento.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar Tabs */}
        <aside className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-[#FF5C00]/10 text-[#FF5C00] border border-[#FF5C00]/20"
                  : "text-[#7A7A85] hover:text-[#F5F5F0] hover:bg-[#16161A]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-[#222228]">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#FF4444] hover:bg-[#FF4444]/5 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sair da conta
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="bg-[#16161A] border border-[#222228] rounded-2xl overflow-hidden">
          {activeTab === "perfil" && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 md:p-8 space-y-8"
            >
              {/* Profile Photo */}
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl bg-[#0A0A0B] border-2 border-[#222228] flex items-center justify-center font-bebas text-4xl text-[#FF5C00] overflow-hidden">
                    {session?.user?.name?.[0] || "U"}
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2 bg-[#FF5C00] text-white rounded-lg shadow-lg hover:bg-[#FF7A2E] transition-all">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="text-[#F5F5F0] font-semibold mb-1">Foto de Perfil</h3>
                  <p className="text-[#7A7A85] text-xs mb-3">Recomendado: 400x400px. Máximo 2MB.</p>
                  <div className="flex gap-2">
                    <button className="text-xs font-bold text-[#F5F5F0] bg-[#222228] px-4 py-2 rounded-lg hover:bg-[#2A2A30] transition-all">Alterar</button>
                    <button className="text-xs font-bold text-[#FF4444] bg-transparent px-4 py-2 rounded-lg hover:bg-[#FF4444]/5 transition-all">Remover</button>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#222228]">
                <div className="space-y-2">
                  <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold ml-1">Nome Completo</label>
                  <input 
                    type="text" 
                    defaultValue={session?.user?.name || ""}
                    className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold ml-1">E-mail Profissional</label>
                  <input 
                    type="email" 
                    defaultValue={session?.user?.email || ""}
                    disabled
                    className="w-full bg-[#0A0A0B]/50 border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#7A7A85] cursor-not-allowed outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold ml-1">Telefone / WhatsApp</label>
                  <input 
                    type="text" 
                    placeholder="(00) 00000-0000"
                    onChange={(e) => e.target.value = maskPhone(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold ml-1">CREF (Opcional)</label>
                  <input 
                    type="text" 
                    placeholder="000000-G/UF"
                    className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-[#222228] flex justify-end">
                <button className="flex items-center gap-2 bg-[#FF5C00] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(255,92,0,0.2)] hover:bg-[#FF7A2E] transition-all hover:-translate-y-0.5">
                  <Save className="w-4 h-4" /> Salvar Alterações
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "seguranca" && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 md:p-8 space-y-8"
            >
              <div>
                <h3 className="text-[#F5F5F0] font-semibold mb-2">Alterar Senha</h3>
                <p className="text-[#7A7A85] text-sm mb-6">Mantenha sua conta segura com uma senha forte.</p>
                
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold ml-1">Senha Atual</label>
                    <input type="password" className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold ml-1">Nova Senha</label>
                    <input type="password" className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.7rem] uppercase tracking-wider text-[#7A7A85] font-bold ml-1">Confirmar Nova Senha</label>
                    <input type="password" className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#222228]">
                <h3 className="text-[#F5F5F0] font-semibold mb-2">Autenticação em Duas Etapas</h3>
                <p className="text-[#7A7A85] text-sm mb-4">Adicione uma camada extra de segurança à sua conta.</p>
                <button className="flex items-center gap-2 bg-[#16161A] border border-[#222228] text-[#F5F5F0] px-4 py-2.5 rounded-xl text-xs font-bold hover:border-[#7A7A85] transition-all">
                  <Smartphone className="w-4 h-4 text-[#FF5C00]" /> Configurar 2FA
                </button>
              </div>

              <div className="pt-6 border-t border-[#222228] flex justify-end">
                <button className="bg-[#FF5C00] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(255,92,0,0.2)] hover:bg-[#FF7A2E] transition-all">
                  Atualizar Senha
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "plano" && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 md:p-8 space-y-8"
            >
              <div className="bg-[#0A0A0B] border border-[#222228] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="text-[0.6rem] font-bold text-[#FF5C00] uppercase tracking-widest mb-1">PLANO ATUAL</div>
                  <h3 className="text-2xl font-bebas text-[#F5F5F0] tracking-wider">FITDESK PRO</h3>
                  <p className="text-[#7A7A85] text-sm mt-1">Próxima renovação em 14 de Abril de 2026</p>
                </div>
                <button className="bg-[#FF5C00] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#FF7A2E] transition-all">
                  Upgrade de Plano
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-[#F5F5F0] font-semibold">Método de Pagamento</h3>
                <div className="flex items-center justify-between p-4 bg-[#0A0A0B] border border-[#222228] rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-6 bg-[#16161A] border border-[#222228] rounded flex items-center justify-center text-[0.6rem] font-bold">VISA</div>
                    <div>
                      <div className="text-sm text-[#F5F5F0]">Visa final 4242</div>
                      <div className="text-[0.7rem] text-[#7A7A85]">Expira em 12/28</div>
                    </div>
                  </div>
                  <button className="text-[0.7rem] font-bold text-[#FF5C00] uppercase tracking-wider hover:underline">Editar</button>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-[#222228]">
                <h3 className="text-[#F5F5F0] font-semibold">Últimas Faturas</h3>
                <div className="divide-y divide-[#222228] bg-[#0A0A0B] border border-[#222228] rounded-xl overflow-hidden">
                  {[
                    { date: "14 Mar 2026", amount: "R$ 89,00", status: "Pago" },
                    { date: "14 Fev 2026", amount: "R$ 89,00", status: "Pago" },
                    { date: "14 Jan 2026", amount: "R$ 89,00", status: "Pago" },
                  ].map((inv, i) => (
                    <div key={i} className="flex items-center justify-between p-4 text-sm hover:bg-[#16161A] transition-all">
                      <div className="text-[#CFCFC8]">{inv.date}</div>
                      <div className="text-[#F5F5F0] font-medium">{inv.amount}</div>
                      <div className="flex items-center gap-4">
                        <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/15 uppercase tracking-tighter">PAGO</span>
                        <button className="text-[#7A7A85] hover:text-[#F5F5F0]">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "privacidade" && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 md:p-8 space-y-8"
            >
              <div>
                <h3 className="text-[#F5F5F0] font-semibold mb-2">Exportar Meus Dados</h3>
                <p className="text-[#7A7A85] text-sm mb-4">
                  Baixe um arquivo JSON contendo todas as suas informações pessoais, alunos e dados financeiros em conformidade com o Art. 18 da LGPD.
                </p>
                <button 
                  onClick={async () => {
                    const res = await exportUserData();
                    if (res.success && res.data) {
                      const blob = new Blob([res.data], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "meus_dados_fitdesk.json";
                      a.click();
                      URL.revokeObjectURL(url);
                    } else {
                      alert("Erro ao exportar dados.");
                    }
                  }}
                  className="bg-[#16161A] border border-[#222228] text-[#F5F5F0] px-4 py-2.5 rounded-xl text-xs font-bold hover:border-[#FF5C00] transition-all"
                >
                  Exportar Dados (JSON)
                </button>
              </div>

              <div className="pt-6 border-t border-[#222228]">
                <h3 className="text-[#FF4444] font-semibold mb-2">Excluir Conta e Dados</h3>
                <p className="text-[#7A7A85] text-sm mb-4">
                  Esta ação é irreversível. Seu perfil será anonimizado e você perderá acesso ao painel imediatamente. Registros financeiros poderão ser mantidos anonimizados por 5 anos para fins fiscais.
                </p>
                <button 
                  onClick={async () => {
                    if (confirm("Tem certeza absoluta? Esta ação não pode ser desfeita.")) {
                      const res = await deleteUserAccount();
                      if (res.success) {
                        signOut({ callbackUrl: "/" });
                      } else {
                        alert(res.error);
                      }
                    }
                  }}
                  className="bg-[#FF4444]/10 border border-[#FF4444]/20 text-[#FF4444] px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#FF4444] hover:text-white transition-all"
                >
                  Excluir Permanentemente
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "notificacoes" && (
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-[#0A0A0B] border border-[#222228] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Bell className="w-8 h-8 text-[#FF5C00] opacity-20" />
              </div>
              <h3 className="text-[#F5F5F0] font-semibold">Em breve</h3>
              <p className="text-[#7A7A85] text-sm max-w-xs mx-auto">
                Estamos finalizando estas configurações para você. Em breve você poderá gerenciar tudo aqui.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
