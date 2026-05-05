import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0B] border-t border-[#222228] py-12 px-[5%] flex flex-wrap justify-between items-center gap-6">
      <div className="font-bebas text-2xl text-[#F5F5F0] tracking-[2px]">
        FIT<span className="text-[#FF5C00]">DESK</span>
      </div>
      <div className="text-[0.8rem] text-[#7A7A85] font-light italic">
        © 2026 FitDesk. Inteligência para o seu negócio de personal.
      </div>
      <div className="flex gap-6">
        <Link href="/termos" className="text-[0.8rem] text-[#7A7A85] no-underline hover:text-white transition-colors">Termos de Uso</Link>
        <Link href="/privacidade" className="text-[0.8rem] text-[#7A7A85] no-underline hover:text-white transition-colors">Privacidade</Link>
        <Link href="/suporte" className="text-[0.8rem] text-[#7A7A85] no-underline hover:text-white transition-colors">Suporte</Link>
      </div>
    </footer>
  );
}
