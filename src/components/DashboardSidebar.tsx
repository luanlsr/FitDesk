"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Calendar,
  Users,
  Dumbbell,
  CircleDollarSign,
  UserPlus2,
  FileText,
  ChevronLeft,
  Settings,
  LogOut,
  MessageSquare,
  ShieldCheck,
  Building2,
  Library,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: session } = useSession();

  const isMaster = session?.user?.role === "MASTER";

  const navItems = isMaster ? [
    { label: "Visão Geral", href: "/dashboard", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "Gestão Tenants", href: "/tenants", icon: <Building2 className="w-5 h-5" /> },
    { label: "Biblioteca Global", href: "/biblioteca", icon: <Library className="w-5 h-5" /> },
    { label: "Relatórios App", href: "/relatorios", icon: <FileText className="w-5 h-5" /> },
  ] : [
    { label: "Dashboard", href: "/dashboard", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "Agenda", href: "/agenda", icon: <Calendar className="w-5 h-5" /> },
    { label: "Alunos", href: "/alunos", icon: <Users className="w-5 h-5" /> },
    { label: "Treinos", href: "/treinos", icon: <Dumbbell className="w-5 h-5" /> },
    { label: "Biblioteca", href: "/biblioteca", icon: <Library className="w-5 h-5" /> },
    { label: "Leads", href: "/leads", icon: <UserPlus2 className="w-5 h-5" /> },
    { label: "Financeiro", href: "/financeiro", icon: <CircleDollarSign className="w-5 h-5" /> },
    { label: "WhatsApp IA", href: "/whatsapp-ia", icon: <MessageSquare className="w-5 h-5" /> },
  ];

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full bg-[#111114]">
      <div className="p-6 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          {(!isCollapsed || mobile) && (
            <div className="flex items-center gap-2 font-bebas text-2xl text-[#F5F5F0] tracking-[2px]">
              <img src="/favicon.png" alt="FitDesk Logo" className="w-8 h-8 rounded-lg" />
              <span>FIT<span className="text-[#FF5C00]">DESK</span></span>
            </div>
          )}
          {isCollapsed && !mobile && (
            <div className="w-full flex justify-center">
              <img src="/favicon.png" alt="FitDesk Logo" className="w-8 h-8 rounded-lg" />
            </div>
          )}
          {!mobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 hover:bg-[#16161A] rounded-md text-[#7A7A85] transition-colors"
            >
              <ChevronLeft className={`w-4 h-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
            </button>
          )}
          {mobile && (
             <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 text-[#7A7A85] hover:text-[#F5F5F0]"
             >
                <X className="w-6 h-6" />
             </button>
          )}
        </div>

        {(!isCollapsed || mobile) && isMaster && (
          <div className="flex items-center gap-1.5 px-1 pb-2">
            <div className="bg-[#FF5C00]/10 border border-[#FF5C00]/30 rounded-full px-2 py-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#FF5C00]" />
              <span className="text-[0.6rem] font-bold text-[#FF5C00] uppercase tracking-wider">MODO MASTER</span>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${pathname === item.href
              ? "bg-[#FF5C00]/10 text-[#FF5C00] border border-[#FF5C00]/20"
              : "text-[#7A7A85] hover:text-[#F5F5F0] hover:bg-[#16161A]"
              }`}
          >
            <div className={`flex-shrink-0 ${pathname === item.href ? "text-[#FF5C00]" : "group-hover:text-[#F5F5F0]"}`}>
              {item.icon}
            </div>
            {(!isCollapsed || mobile) && <span className="text-[0.875rem] font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[#222228] space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#7A7A85] hover:text-[#F5F5F0] hover:bg-[#16161A] transition-all group"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {(!isCollapsed || mobile) && <span className="text-[0.875rem] font-medium">Configurações</span>}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#7A7A85] hover:text-[#FF4444] hover:bg-[#FF4444]/5 transition-all group w-full text-left cursor-pointer"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {(!isCollapsed || mobile) && <span className="text-[0.875rem] font-medium">Sair</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar (Branding Only) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#111114] border-b border-[#222228] flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-2 font-bebas text-xl text-[#F5F5F0] tracking-[2px]">
          <img src="/favicon.png" alt="FitDesk Logo" className="w-6 h-6 rounded-lg" />
          <span>FIT<span className="text-[#FF5C00]">DESK</span></span>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex h-screen bg-[#111114] border-r border-[#222228] transition-all duration-300 flex-col ${isCollapsed ? "w-20" : "w-64"}`}>
        <SidebarContent />
      </aside>
    </>
  );
}
