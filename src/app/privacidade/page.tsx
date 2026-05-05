import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F0] py-20 px-[5%]">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-[#7A7A85] text-sm mb-12 hover:text-[#FF5C00] transition-colors no-underline">
          <ArrowLeft className="w-4 h-4" /> Voltar para a página inicial
        </Link>
        
        <div className="flex items-center gap-4 mb-4">
          <ShieldCheck className="w-8 h-8 text-[#FF5C00]" />
          <h1 className="font-bebas text-5xl tracking-tight">Política de <span className="text-[#FF5C00]">Privacidade</span></h1>
        </div>
        <p className="text-[#7A7A85] text-sm mb-12 font-mono uppercase tracking-widest">Última atualização: Março de 2026</p>

        <div className="space-y-8 text-[#CFCFC8] leading-relaxed font-light">
          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">1. Compromisso com a Privacidade</h2>
            <p>
              O FitDesk valoriza a privacidade dos seus usuários. Esta política descreve como coletamos, usamos e protegemos os dados pessoais de profissionais e alunos cadastrados na plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">2. Coleta de Dados</h2>
            <p>
              Coletamos dados necessários para a prestação do serviço, como: nome, e-mail, telefone, dados de saúde dos alunos (prescritos pelo personal), e informações de pagamento. Todo o tratamento de dados de saúde é feito conforme as diretrizes da LGPD (Lei Geral de Proteção de Dados).
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">3. Uso das Informações</h2>
            <p>
              As informações são utilizadas exclusivamente para:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Identificação e autenticação na plataforma;</li>
              <li>Gestão técnica de treinos e alunos;</li>
              <li>Processamento de pagamentos;</li>
              <li>Envio de notificações importantes sobre o serviço;</li>
              <li>Melhoria contínua da experiência do usuário via IA.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">4. Compartilhamento de Dados</h2>
            <p>
              Não vendemos dados para terceiros. O compartilhamento ocorre apenas com parceiros essenciais (ex: processadores de pagamento como Stripe/Asaas) e sempre sob rigorosos contratos de confidencialidade.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">5. Segurança</h2>
            <p>
              Utilizamos criptografia de ponta a ponta para dados sensíveis de saúde e armazenamos informações em servidores de alta segurança (AWS/Google Cloud). Possuímos protocolos de backup e recuperação de desastres.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">6. Seus Direitos (LGPD)</h2>
            <p>
              Você tem direito a solicitar o acesso, correção ou exclusão de seus dados a qualquer momento através de nossas configurações ou canal de suporte.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
