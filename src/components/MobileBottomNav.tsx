"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Dumbbell, 
  CircleDollarSign,
  MoreHorizontal,
  Library,
  UserPlus2,
  MessageSquare,
  Settings,
  LogOut,
  X,
  Building2,
  FileText
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const isMaster = session?.user?.role === "MASTER";

  // Fecha o menu ao mudar de rota
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const mainItems = isMaster ? [
    { label: "Home", href: "/dashboard", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "Tenants", href: "/tenants", icon: <Building2 className="w-5 h-5" /> },
    { label: "Lib", href: "/biblioteca", icon: <Library className="w-5 h-5" /> },
    { label: "Relatórios", href: "/relatorios", icon: <FileText className="w-5 h-5" /> },
  ] : [
    { label: "Home", href: "/dashboard", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "Agenda", href: "/agenda", icon: <Calendar className="w-5 h-5" /> },
    { label: "Alunos", href: "/alunos", icon: <Users className="w-5 h-5" /> },
    { label: "Treinos", href: "/treinos", icon: <Dumbbell className="w-5 h-5" /> },
  ];

  const moreItems = isMaster ? [] : [
    { label: "Biblioteca", href: "/biblioteca", icon: <Library className="w-5 h-5" /> },
    { label: "Leads", href: "/leads", icon: <UserPlus2 className="w-5 h-5" /> },
    { label: "Financeiro", href: "/financeiro", icon: <CircleDollarSign className="w-5 h-5" /> },
    { label: "WhatsApp IA", href: "/whatsapp-ia", icon: <MessageSquare className="w-5 h-5" /> },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-18 bg-[#111114]/90 backdrop-blur-lg border-t border-[#222228] z-[100] flex items-center justify-around px-2 pb-safe">
        {mainItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all ${
                isActive ? "text-[#FF5C00]" : "text-[#7A7A85]"
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? "bg-[#FF5C00]/10" : ""}`}>
                {item.icon}
              </div>
              <span className="text-[0.6rem] font-bold uppercase tracking-tighter">
                {item.label}
              </span>
            </Link>
          );
        })}

        <button 
          onClick={() => setIsMenuOpen(true)}
          className={`flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all ${
            isMenuOpen ? "text-[#FF5C00]" : "text-[#7A7A85]"
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${isMenuOpen ? "bg-[#FF5C00]/10" : ""}`}>
            <MoreHorizontal className="w-5 h-5" />
          </div>
          <span className="text-[0.6rem] font-bold uppercase tracking-tighter">
            Mais
          </span>
        </button>
      </nav>

      {/* Menu Overlay "Mais" */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] md:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-[#111114] border-t border-[#222228] rounded-t-[32px] z-[120] md:hidden p-8 pb-24"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-[#F5F5F0]">Menu Adicional</h3>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 bg-[#16161A] rounded-xl text-[#7A7A85]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {moreItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                      pathname === item.href 
                        ? "bg-[#FF5C00]/10 border-[#FF5C00]/30 text-[#FF5C00]" 
                        : "bg-[#0A0A0B] border-[#222228] text-[#7A7A85]"
                    }`}
                  >
                    {item.icon}
                    <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
                  </Link>
                ))}
                
                {/* Opções de Conta */}
                <Link
                  href="/settings"
                  className="col-span-2 flex items-center gap-3 p-4 bg-[#0A0A0B] border border-[#222228] rounded-2xl text-[#7A7A85]"
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Configurações da Conta</span>
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="col-span-2 flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-500"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Sair do FitDesk</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

