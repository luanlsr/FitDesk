"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 60 minutos
const WARNING_BEFORE = 5 * 60 * 1000; // 5 minutos antes

export function AutoLogout() {
  const { data: session } = useSession();
  const [showWarning, setShowWarning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!session) return;

    let timeoutId: NodeJS.Timeout;
    let warningId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      clearTimeout(warningId);
      setShowWarning(false);

      warningId = setTimeout(() => {
        setShowWarning(true);
      }, INACTIVITY_TIMEOUT - WARNING_BEFORE);

      timeoutId = setTimeout(() => {
        signOut({ callbackUrl: "/login?reason=inactivity" });
      }, INACTIVITY_TIMEOUT);
    };

    // Listen for user activity
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(warningId);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [session, router]);

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#FF5C00] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-medium text-sm"
        >
          <AlertTriangle className="w-5 h-5" />
          Sua sessão expirará em breve por inatividade. Mexa o mouse para continuar conectado.
        </motion.div>
      )}
    </AnimatePresence>
  );
}
