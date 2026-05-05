"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Mockup from "@/components/Mockup";
import Features from "@/components/Features";
import WhatsApp from "@/components/WhatsApp";
import Workout from "@/components/Workout";
import Aluno from "@/components/Aluno";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function LandingPage() {
  // Scroll para seção via ?scrollTo= ou volta ao topo por padrão
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const target = params.get("scrollTo");
    if (target) {
      // Aguarda render antes de rolar
      const el = document.getElementById(target);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
          window.history.replaceState(null, "", "/");
        }, 80);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      <Navbar />
      <Hero />
      <div className="relative z-10 -mt-24 md:-mt-48 pointer-events-none">
        <Mockup />
      </div>
      <Features />
      <WhatsApp />
      <Workout />
      <Aluno />
      <Pricing />
      <Footer />
    </main>
  );
}
