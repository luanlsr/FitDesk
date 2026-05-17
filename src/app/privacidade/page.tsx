import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F0] py-20 px-[5%]">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-[#7A7A85] text-sm mb-12 hover:text-[#FF5C00] transition-colors no-underline">
          <ArrowLeft className="w-4 h-4" /> Voltar para a página inicial
        </Link>
        
        <div className="flex items-center gap-4 mb-4">
          <ShieldCheck className="w-8 h-8 text-[#FF5C00]" />
          <h1 className="font-bebas text-5xl tracking-tight">Política de <span className="text-[#FF5C00]">Privacidade</span></h1>
        </div>
        <p className="text-[#7A7A85] text-sm mb-12 font-mono uppercase tracking-widest">Última atualização: Maio de 2026</p>

        <div className="space-y-8 text-[#CFCFC8] leading-relaxed font-light">
          
          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">1. Identificação do Controlador e Encarregado (DPO)</h2>
            <p className="mb-2"><strong>Controlador:</strong> FitDesk Tecnologia e Gestão Ltda. (CNPJ: 00.000.000/0001-00)</p>
            <p className="mb-2"><strong>Endereço:</strong> Avenida Paulista, 1000 - São Paulo, SP, Brasil.</p>
            <p><strong>Encarregado pelo Tratamento de Dados Pessoais (DPO):</strong> Michel Silva — <a href="mailto:dpo@fitdesk.com.br" className="text-[#FF5C00] hover:underline">dpo@fitdesk.com.br</a></p>
          </section>

          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">2. Dados Pessoais e Bases Legais (Art. 7º e 11º da LGPD)</h2>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#2C2C35] text-[#F5F5F0]">
                    <th className="py-3 pr-4">Categoria de Dado</th>
                    <th className="py-3 pr-4">Finalidade</th>
                    <th className="py-3">Base Legal</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-[#2C2C35]">
                    <td className="py-3 pr-4">Cadastrais (Nome, E-mail, CPF, Telefone)</td>
                    <td className="py-3 pr-4">Criação de conta, identificação e contato.</td>
                    <td className="py-3">Execução de Contrato</td>
                  </tr>
                  <tr className="border-b border-[#2C2C35]">
                    <td className="py-3 pr-4">Financeiros (Cartão tokenizado, Histórico)</td>
                    <td className="py-3 pr-4">Processamento de assinaturas e mensalidades.</td>
                    <td className="py-3">Execução de Contrato e Obrigação Legal</td>
                  </tr>
                  <tr className="border-b border-[#2C2C35]">
                    <td className="py-3 pr-4">Saúde e Biométricos (Fichas, Avaliações, Gênero)</td>
                    <td className="py-3 pr-4">Prescrição e acompanhamento de treinos pelos Personais.</td>
                    <td className="py-3 text-[#FF5C00] font-semibold">Consentimento Explícito (Dado Sensível)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Navegação (IP, User Agent)</td>
                    <td className="py-3 pr-4">Segurança, prevenção à fraude e logs de auditoria.</td>
                    <td className="py-3">Legítimo Interesse e Obrigação Legal</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">3. Retenção de Dados</h2>
            <p>Os dados pessoais serão armazenados pelo tempo necessário para cumprir com as finalidades para as quais foram coletados:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Dados de Conta e Treino:</strong> Mantidos enquanto a conta estiver ativa. Ao solicitar exclusão, são apagados ou anonimizados em até 15 dias.</li>
              <li><strong>Dados Financeiros e de Faturamento:</strong> Armazenados por 5 (cinco) anos para cumprimento de obrigações tributárias e fiscais (Art. 7º, II).</li>
              <li><strong>Logs de Acesso (IP, Data/Hora):</strong> Armazenados por 6 (seis) meses, conforme o Marco Civil da Internet (Lei nº 12.965/2014).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">4. Transferência Internacional de Dados</h2>
            <p>
              O FitDesk utiliza infraestrutura de nuvem global de parceiros rigorosamente selecionados (Supabase, Vercel e Asaas), o que pode envolver o armazenamento de dados em servidores nos Estados Unidos. Garantimos que todas as transferências ocorrem mediante adoção de cláusulas contratuais padrão de proteção de dados, em conformidade com o Art. 33 da LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">5. Compartilhamento com Terceiros</h2>
            <p>
              Seus dados não são vendidos. Compartilhamos estritamente o necessário com processadores de pagamento (Asaas) e provedores de infraestrutura cloud. Todos os parceiros estão vinculados a contratos de processamento de dados adequados à LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">6. Política de Cookies</h2>
            <p>
              Utilizamos cookies essenciais para manter você autenticado (sessão) e proteger sua conta contra falsificação de solicitações. Não utilizamos cookies de rastreamento ou publicidade de terceiros sem o seu consentimento prévio.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F0] font-bold text-xl mb-4">7. Seus Direitos (Art. 18 da LGPD)</h2>
            <p>Você pode exercer seus direitos a qualquer momento. Em sua conta, na seção <strong>Configurações &gt; Privacidade</strong>, você pode:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Acesso e Confirmação:</strong> Visualizar todos os seus dados cadastrados.</li>
              <li><strong>Portabilidade:</strong> Exportar seus dados em formato JSON/CSV legível por máquina.</li>
              <li><strong>Exclusão/Anonimização:</strong> Excluir sua conta e anonimizar dados de treino.</li>
              <li><strong>Revogação de Consentimento:</strong> Retirar consentimento para dados de saúde (o que pode impedir o uso de partes da plataforma).</li>
            </ul>
            <p className="mt-4">
              Caso não consiga pelo painel, envie um e-mail com o assunto "Direitos do Titular" para <a href="mailto:dpo@fitdesk.com.br" className="text-[#FF5C00] hover:underline">dpo@fitdesk.com.br</a>. Prazo legal de resposta é de até 15 dias.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

