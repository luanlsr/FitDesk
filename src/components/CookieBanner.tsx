"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import Link from "next/link";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already accepted
    const consent = localStorage.getItem("fitdesk_cookie_consent");
    if (!consent) {
      // Delay slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("fitdesk_cookie_consent", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-5xl mx-auto bg-[#16161A] border border-[#222228] shadow-2xl p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-[#7A7A85] hover:text-[#F5F5F0] md:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start md:items-center gap-4 flex-1">
              <div className="bg-[#FF5C00]/10 p-3 rounded-full hidden md:flex shrink-0">
                <Cookie className="w-6 h-6 text-[#FF5C00]" />
              </div>
              <div>
                <h3 className="text-[#F5F5F0] font-bold mb-1 flex items-center gap-2">
                  <Cookie className="w-4 h-4 text-[#FF5C00] md:hidden" />
                  Nós usamos cookies essenciais
                </h3>
                <p className="text-[#7A7A85] text-sm leading-relaxed max-w-3xl">
                  Utilizamos cookies <strong>estritamente necessários</strong> para garantir sua segurança e manter sua sessão ativa. Não usamos cookies de publicidade ou rastreamento de terceiros. Ao continuar navegando, você concorda com o uso de cookies. Leia nossa <Link href="/privacidade" className="text-[#FF5C00] hover:underline font-bold">Política de Privacidade</Link> para mais detalhes.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
              <button 
                onClick={handleAccept}
                className="w-full md:w-auto bg-[#FF5C00] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#FF7A2E] transition-all whitespace-nowrap shadow-[0_0_20px_rgba(255,92,0,0.2)]"
              >
                Entendi e Aceito
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
