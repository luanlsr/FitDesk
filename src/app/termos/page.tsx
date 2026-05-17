import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F0] py-20 px-[5%]">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-[#7A7A85] text-sm mb-12 hover:text-[#FF5C00] transition-colors no-underline">
          <ArrowLeft className="w-4 h-4" /> Voltar para a página inicial
        </Link>
        
        <div className="flex items-center gap-4 mb-4">
          <FileText className="w-8 h-8 text-[#FF5C00]" />
          <h1 className="font-bebas text-5xl tracking-tight">Termos de <span className="text-[#FF5C00]">Uso</span></h1>
        </div>
        <p className="text-[#7A7A85] text-sm mb-12 font-mono uppercase tracking-widest">Última atualização: Maio de 2026</p>

        <div className="space-y-8 text-[#CFCFC8] leading-relaxed font-light">
          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar a plataforma SaaS FitDesk, operada pela FitDesk Tecnologia e Gestão Ltda., você concorda em cumprir e estar vinculado a estes Termos de Uso e à nossa Política de Privacidade. Se você não concordar, não deverá usar nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">2. Descrição do Serviço e Licença de Uso</h2>
            <p>
              O FitDesk fornece uma plataforma em nuvem para gestão de personal trainers (alunos, treinos, agenda e financeiro). Concedemos a você uma licença limitada, não exclusiva, intransferível e revogável para usar o software, estritamente para seus fins comerciais/profissionais internos, de acordo com o plano de assinatura escolhido.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">3. Cadastro e Segurança (Autenticação)</h2>
            <p>
              Você é responsável por manter a confidencialidade de suas credenciais de acesso. O FitDesk adota medidas técnicas robustas para proteção (criptografia e hashing), mas não se responsabiliza por invasões decorrentes do compartilhamento ou uso de senhas fracas por parte do usuário. Você deve notificar-nos imediatamente sobre qualquer uso não autorizado da sua conta.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">4. Assinaturas, Pagamentos e Cancelamento</h2>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Cobrança:</strong> As assinaturas são cobradas de forma recorrente e antecipada (mensal, semestral ou anual).</li>
              <li><strong>Inadimplência:</strong> O atraso superior a 5 (cinco) dias pode resultar na suspensão temporária do acesso à plataforma. Após 30 dias de inadimplência, a conta poderá ser encerrada.</li>
              <li><strong>Cancelamento:</strong> Você pode cancelar sua assinatura a qualquer momento através do painel de configurações. O cancelamento interrompe a cobrança do próximo ciclo, mas não gera reembolso proporcional do período já pago.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">5. Propriedade Intelectual</h2>
            <p>
              O código-fonte, design, logotipos e algoritmos da plataforma FitDesk são de propriedade exclusiva da FitDesk Tecnologia e Gestão Ltda. Os dados que você insere na plataforma (ex: fichas de treino que você criou) pertencem a você.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">6. Limitação de Responsabilidade Técnica e Clínica</h2>
            <p>
              O FitDesk é uma ferramenta de gestão e <strong>NÃO</strong> fornece aconselhamento médico ou de saúde. A responsabilidade técnica e legal pelas prescrições de treinos, exercícios e orientações dadas aos alunos através da plataforma é <strong>exclusivamente do Personal Trainer</strong> (profissional de Educação Física habilitado).
            </p>
            <p className="mt-4">
              Em nenhuma circunstância o FitDesk será responsável por lesões, danos à saúde ou prejuízos sofridos por alunos decorrentes de treinos prescritos usando nosso software.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">7. Disponibilidade e SLA</h2>
            <p>
              Trabalhamos para manter a plataforma online 99.9% do tempo, porém o software é fornecido "no estado em que se encontra", sem garantias explícitas de ausência total de interrupções, que podem ocorrer por manutenções programadas ou falhas de provedores terceirizados.
            </p>
          </section>
          
          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">8. Foro e Legislação Aplicável</h2>
            <p>
              Estes termos são regidos pelas leis da República Federativa do Brasil, em especial a Lei Geral de Proteção de Dados (LGPD). Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer controvérsias decorrentes deste instrumento.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
