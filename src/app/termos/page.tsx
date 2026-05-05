import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F0] py-20 px-[5%]">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-[#7A7A85] text-sm mb-12 hover:text-[#FF5C00] transition-colors no-underline">
          <ArrowLeft className="w-4 h-4" /> Voltar para a página inicial
        </Link>
        
        <h1 className="font-bebas text-5xl mb-4 tracking-tight">Termos de <span className="text-[#FF5C00]">Uso</span></h1>
        <p className="text-[#7A7A85] text-sm mb-12 font-mono uppercase tracking-widest">Última atualização: Março de 2026</p>

        <div className="space-y-8 text-[#CFCFC8] leading-relaxed font-light">
          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar a plataforma FitDesk, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá acessar ou usar nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">2. Descrição do Serviço</h2>
            <p>
              O FitDesk é uma plataforma de gestão para profissionais de educação física (personal trainers). Fornecemos ferramentas para gestão de alunos, treinos, agenda e financeiro.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">3. Cadastro e Segurança</h2>
            <p>
              Para usar certas funcionalidades, você deve se cadastrar. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta. O FitDesk reserva-se o direito de recusar serviço ou cancelar contas a seu exclusivo critério.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">4. Assinaturas e Pagamentos</h2>
            <p>
              Alguns serviços do FitDesk são pagos mediante assinatura. Os valores e condições de pagamento estão descritos no momento da contratação. O atraso no pagamento pode resultar na suspensão temporária do acesso às ferramentas.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">5. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo, design e código da plataforma FitDesk são de nossa propriedade exclusiva. É proibida a reprodução ou uso não autorizado de qualquer parte da plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">6. Limitação de Responsabilidade</h2>
            <p>
              O FitDesk fornece ferramentas de auxílio, mas a responsabilidade técnica pelas prescrições de treinos e orientações de saúde é exclusivamente do profissional (Personal Trainer) cadastrado. Não nos responsabilizamos por danos físicos resultantes do uso indevido das ferramentas ou de orientações profissionais inadequadas.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
