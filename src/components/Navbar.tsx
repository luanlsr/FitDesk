"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Navbar() {
  const pathname = usePathname();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-[5%] py-4.5 bg-[#0A0A0B]/85 backdrop-blur-md border-b border-[#222228]">
      <Link href="/" onClick={handleLogoClick} className="font-bebas text-2xl text-[#F5F5F0] tracking-[2px] no-underline">
        FIT<span className="text-[#FF5C00]">DESK</span>
      </Link>

      <ul className="hidden md:flex gap-8 list-none">
        <li>
          <button onClick={() => scrollTo("funcionalidades")} className="text-[#7A7A85] text-xs font-medium hover:text-[#F5F5F0] transition-colors bg-transparent border-none cursor-pointer">
            Funcionalidades
          </button>
        </li>
        <li>
          <button onClick={() => scrollTo("treinos")} className="text-[#7A7A85] text-xs font-medium hover:text-[#F5F5F0] transition-colors bg-transparent border-none cursor-pointer">
            Treinos
          </button>
        </li>
        <li>
          <button onClick={() => scrollTo("alunos")} className="text-[#7A7A85] text-xs font-medium hover:text-[#F5F5F0] transition-colors bg-transparent border-none cursor-pointer">
            Alunos
          </button>
        </li>
        <li>
          <button onClick={() => scrollTo("precos")} className="text-[#7A7A85] text-xs font-medium hover:text-[#F5F5F0] transition-colors bg-transparent border-none cursor-pointer">
            Preços
          </button>
        </li>
      </ul>

      <div className="flex items-center gap-6">
        <Link href="/login" className="text-[#7A7A85] no-underline text-xs font-medium hover:text-[#F5F5F0] transition-colors">
          Login
        </Link>
        <button
          onClick={() => scrollTo("precos")}
          className="bg-[#FF5C00] text-white px-5.5 py-2.5 rounded-md text-[0.875rem] font-semibold hover:bg-[#FF7A2E] cursor-pointer transition-all hover:-translate-y-0.5"
        >
          Começar agora →
        </button>
      </div>
    </nav>
  );
}
