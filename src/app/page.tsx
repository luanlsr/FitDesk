"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Mockup from "@/components/Mockup";
import Stats from "@/components/Stats";
import PainPoints from "@/components/PainPoints";
import Features from "@/components/Features";
import WhatsApp from "@/components/WhatsApp";
import Workout from "@/components/Workout";
import Aluno from "@/components/Aluno";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function LandingPage() {
  const router = useRouter();
  // Scroll para seção via ?scrollTo= ou volta ao topo por padrão
  useEffect(() => {
    // Se estiver no modo PWA (instalado), redireciona direto para o login
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');

    if (isStandalone) {
      router.push("/login");
      return;
    }

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
  }, [router]);

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      <Navbar />
      <Hero />
      <div className="relative z-10 -mt-24 md:-mt-48 pointer-events-none">
        <Mockup />
      </div>
      <Stats />
      <PainPoints />
      <Features />
      <WhatsApp />
      <Workout />
      <Aluno />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}
