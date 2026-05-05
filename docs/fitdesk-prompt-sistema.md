# FITDESK — PROMPT DE DESENVOLVIMENTO DO SISTEMA

## 📌 VISÃO GERAL DO PRODUTO

Desenvolva o **FitDesk**, um SaaS completo de gestão para personal trainers independentes e studios de personal training. O sistema deve ser moderno, intuitivo e cobrir todo o ciclo de vida do negócio do personal: da captação de leads à gestão de treinos, passando por agenda inteligente com IA via WhatsApp e controle financeiro.

**Paleta de cores oficial:**
- Primária: `#FF5C00` (laranja vibrante)
- Background: `#0A0A0B` (quase preto)
- Cards/Surface: `#16161A`
- Texto principal: `#F5F5F0`
- Texto secundário: `#7A7A85`
- Sucesso/Verde: `#00E676`
- Alerta: `#FFD600`
- Erro: `#FF4444`

**Tipografia:** Bebas Neue (títulos/headings) + Sora (corpo) + Space Mono (dados/números)

---

## 🔐 MÓDULO 1 — AUTENTICAÇÃO & MULTI-TENANCY

### 1.1 Cadastro de Personal Trainer
- Nome completo, e-mail, telefone, CREF, especialidades
- Upload de foto de perfil
- Definição de senha com requisitos de segurança (mín. 8 chars, maiúscula, número, especial)
- Verificação de e-mail obrigatória
- Aceite dos Termos de Uso e Política de Privacidade (LGPD)

### 1.2 Login
- E-mail + senha
- "Lembrar dispositivo" (30 dias)
- Recuperação de senha via e-mail
- 2FA opcional via TOTP (Google Authenticator)
- Bloqueio após 5 tentativas erradas (15 min)

### 1.3 Multi-Tenancy
- Cada personal tem seu próprio ambiente isolado (tenant)
- Subdomínio personalizado: `seuname.fitdesk.app`
- Dados completamente segregados entre tenants
- Logs de acesso auditáveis

### 1.4 Planos & Billing
- Integração com Stripe ou Iugu para pagamentos recorrentes
- Upgrade/downgrade de plano em tempo real
- Trial de 14 dias sem cartão
- Notificação de vencimento 7, 3 e 1 dia antes
- Suspensão automática ao vencer (modo leitura por 7 dias antes de deletar)

---

## 📅 MÓDULO 2 — AGENDA INTELIGENTE

### 2.1 Visualizações
- **Semanal** (padrão): blocos coloridos por tipo de aula/aluno
- **Diária**: timeline por hora com slots de 30min
- **Mensal**: visão macro com contadores por dia
- Código de cor por aluno (configurável)

### 2.2 Cadastro de Horários
- Definir dias/horários de trabalho (ex: Seg-Sex 06:00–22:00)
- Bloqueios recorrentes (almoço, folga fixa)
- Bloqueios pontuais (viagem, compromisso pessoal)
- Duração padrão de aula (30, 45, 60, 90 min)
- Intervalo entre aulas (buffer de 10–30 min)

### 2.3 Agendamento Manual
- Busca de aluno por nome ou CPF
- Seleção de data + horário disponível
- Tipo de aula (individual, dupla, avaliação, reposição)
- Observações da aula
- Envio automático de confirmação via WhatsApp

### 2.4 Reagendamento & Cancelamento
- Interface drag-and-drop para mover aulas (desktop)
- Botão de cancelar com motivo (aluno, personal, emergência)
- Política de cancelamento configurável (ex: mínimo 24h de antecedência)
- Histórico completo de reagendamentos por aluno

### 2.5 Recorrência
- Agendamento de série (ex: toda segunda e quarta por 3 meses)
- Edição de uma ocorrência ou de toda a série
- Pausa da série (férias do aluno ou personal)

### 2.6 Notificações Automáticas
- Lembrete 24h antes da aula (WhatsApp + push)
- Lembrete 2h antes da aula
- Alerta de não-confirmação (follow-up automático)
- Notificação ao personal de novo agendamento

---

## 🤖 MÓDULO 3 — IA NO WHATSAPP

### 3.1 Configuração
- Conexão via WhatsApp Business API ou Evolution API (self-hosted)
- QR Code para vincular número
- Personalização do nome do assistente (ex: "Assistente da Carol")
- Tom de voz configurável (formal / amigável / direto)

### 3.2 Fluxos Automatizados
**Agendamento:**
1. Aluno envia mensagem solicitando aula
2. IA verifica disponibilidade em tempo real
3. Oferece opções de horário (máximo 3)
4. Confirma escolha e registra no sistema
5. Envia confirmação com resumo

**Cancelamento:**
1. Aluno solicita cancelamento
2. IA verifica política de cancelamento
3. Cancela e pergunta se quer reagendar
4. Se sim, retorna ao fluxo de agendamento
5. Notifica o personal

**Remarcação:**
1. Aluno pede novo horário
2. IA oferece opções disponíveis
3. Move a aula sem conflitos
4. Confirma para ambos

**Dúvidas Frequentes:**
- Horários disponíveis
- Próxima aula
- Histórico recente
- Pagamento pendente

### 3.3 Limites da IA
- Mensagens fora de escopo são encaminhadas ao personal com contexto
- Personal pode assumir a conversa a qualquer momento
- Modo "não perturbe" com horários configuráveis
- Histórico de conversas armazenado no sistema

### 3.4 Painel de Conversas
- Lista de todas as conversas ativas
- Indicador de conversa com IA vs. pessoal
- Busca por aluno ou palavra-chave
- Marcação de conversas (resolvido, pendente, urgente)

---

## 💪 MÓDULO 4 — FICHAS DE TREINO DIGITAIS

### 4.1 Biblioteca de Exercícios
- Cadastro de exercícios com:
  - Nome
  - Grupo muscular(es) trabalhado(s)
  - Equipamento necessário
  - Descrição de execução
  - Vídeo demonstrativo (URL do YouTube ou upload)
  - Imagem ilustrativa
  - Nível (iniciante / intermediário / avançado)
  - Observações de segurança
- Biblioteca pré-populada com 200+ exercícios
- Personal pode adicionar exercícios personalizados
- Busca por nome, grupo muscular ou equipamento

### 4.2 Montagem de Treinos
- Nome do treino (ex: "Treino A — Peito e Tríceps")
- Objetivo (hipertrofia, resistência, emagrecimento, reabilitação, etc.)
- Para cada exercício:
  - Número de séries
  - Repetições ou tempo (ex: "12 reps" ou "45 seg")
  - Carga prescrita (kg)
  - Carga realizada (preenchido pelo aluno ou personal na hora)
  - Tempo de descanso
  - Cadência (ex: 2-1-2)
  - Técnica especial (dropset, biset, pirâmide, etc.)
  - Observações do personal
- Reordenação por drag-and-drop
- Duplicar exercício ou treino inteiro
- Grupos de exercícios (bisets, trisets)

### 4.3 Atribuição ao Aluno
- Cada aluno pode ter múltiplos treinos ativos (Treino A, B, C, D)
- Definir periodicidade (ex: Treino A na segunda e quinta)
- Vincular treino a período de mesociclo
- Histórico de treinos anteriores por aluno
- Comparativo de evolução de carga ao longo do tempo

### 4.4 Execução do Treino (App do Aluno)
- Aluno acessa treino do dia
- Marca série por série como concluída
- Registra carga real utilizada
- Timer de descanso integrado
- Registra percepção de esforço (RPE 1–10)
- Observações livres por exercício
- Histórico do último treino igual para referência de carga

### 4.5 Progressão Automática
- Sugestão de aumento de carga baseada em performance (atingiu todas as reps? +5%)
- Alerta para o personal quando aluno atinge plateau
- Relatório de evolução de cargas por exercício

---

## 👤 MÓDULO 5 — CADASTRO DE ALUNOS

### 5.1 Dados Pessoais (com controle LGPD)
- Nome completo
- CPF (criptografado)
- Data de nascimento / Idade
- Gênero
- E-mail
- Telefone / WhatsApp
- Endereço completo
- Foto de perfil
- Contato de emergência (nome + telefone)
- Como conheceu o personal (Google, indicação, Instagram, etc.)
- Data de início
- Status: Ativo / Pausado / Ex-aluno / Lead

### 5.2 Anamnese & Informações de Saúde
⚠️ **ATENÇÃO LGPD**: Estes campos são dados sensíveis. Só podem ser preenchidos após consentimento expresso do aluno (termo digital assinado). Visibilidade restrita ao personal responsável.

- **Objetivos:** Emagrecimento, hipertrofia, condicionamento, reabilitação, saúde geral, performance esportiva, preparação para competição
- **Nível de atividade:** Sedentário, levemente ativo, moderadamente ativo, muito ativo
- **Histórico de atividade física**
- **Lesões/cirurgias anteriores** (campo texto + checkboxes comuns: joelho, ombro, coluna, quadril, tornozelo)
- **Lesões atuais / restrições de movimento**
- **Condições médicas:**
  - Doença cardiovascular
  - Hipertensão
  - Diabetes (tipo 1 ou 2)
  - Dislipidemia
  - Asma / DPOC
  - Osteoporose / Osteopenia
  - Hérnia de disco
  - Escoliose
  - Outras (campo aberto)
- **Uso de medicamentos** (campo texto)
- **Liberação médica para atividade física** (Sim/Não + upload do documento)
- **Restrições alimentares** (para eventual integração com nutricionista)
- **Observações especiais**
- **Última consulta médica**

### 5.3 Avaliação Física
- Data da avaliação
- **Antropometria:**
  - Peso (kg)
  - Altura (cm)
  - IMC (calculado automaticamente com classificação)
  - Circunferências: Pescoço, Tórax, Cintura, Quadril, Braço D/E, Coxa D/E, Panturrilha D/E
  - Dobras cutâneas (protocolo Jackson & Pollock ou Pollock 3 dobras)
- **Composição Corporal:**
  - % Gordura (calculado ou inserido de exame)
  - Massa Gorda (kg)
  - Massa Magra (kg)
  - Massa Muscular (kg)
  - Massa Óssea (estimada)
- **Metabólico:**
  - TMB — Taxa Metabólica Basal (Harris-Benedict ou Mifflin-St Jeor)
  - GET — Gasto Energético Total (com fator de atividade)
  - VO2max (teste de campo ou estimativa)
- **Postural:** Campo texto + upload de fotos posturais (frente, lado D/E, costas)
- Histórico de todas as avaliações com comparativo visual (gráfico de evolução)
- Geração de relatório de avaliação em PDF com marca do personal

### 5.4 Histórico Completo do Aluno
- Todas as aulas realizadas (data, duração, observações)
- Faltou (justificado / sem justificativa)
- Treinos executados com cargas
- Avaliações físicas
- Pagamentos
- Conversas relevantes do WhatsApp (marcadas pelo personal)
- Notas do personal (campo privado, só o personal vê)

---

## 💰 MÓDULO 6 — CONTROLE FINANCEIRO

### 6.1 Planos de Pagamento
- Cadastro de planos: mensal, quinzenal, por pacote (8, 12, 16 aulas)
- Valor personalizado por aluno
- Desconto ou acréscimo sobre plano padrão
- Observações (ex: "Valor especial — indicação do Rafael")

### 6.2 Lançamentos
- Receitas: mensalidade, pacote de aulas, avaliação, material
- Despesas: aluguel de espaço, equipamentos, marketing, plataformas
- Contas a receber (previsão)
- Contas a pagar (previsão)
- Importação via extrato bancário (OFX/CSV)

### 6.3 Cobranças Automáticas
- Geração de link de pagamento (Pix, cartão) via Pagar.me, Stripe ou MP
- Envio automático de cobrança no vencimento via WhatsApp
- Lembrete 3 dias antes do vencimento
- Lembrete 1 dia antes
- Aviso de atraso (D+1, D+3, D+7)
- Atualização automática do status ao confirmar pagamento

### 6.4 Relatórios Financeiros
- Receita bruta mensal/anual
- Receita por aluno
- Inadimplência (valor e percentual)
- Ticket médio
- MRR (Monthly Recurring Revenue)
- Churn de receita
- Comparativo mês a mês (gráfico)
- Projeção de receita (baseado em contratos ativos)
- Exportação em XLS e PDF

---

## 📊 MÓDULO 7 — DASHBOARD & RELATÓRIOS

### 7.1 Dashboard Principal
KPIs visíveis ao fazer login:
- Total de alunos ativos
- Aulas do dia (com lista)
- Receita do mês (vs. meta)
- Alunos inadimplentes
- Taxa de comparecimento (últimos 30 dias)
- Leads em aberto
- Próximos aniversariantes (7 dias)
- Alertas importantes (cancelamentos, pagamentos, etc.)

### 7.2 Relatório de Alunos
- Lista completa com filtros (status, plano, frequência, fidelidade)
- **Ranking de fidelidade:** Score baseado em frequência, tempo de casa e pontualidade de pagamento
- Alunos em risco de churn (baixa frequência + próximo do vencimento)
- Alunos com aniversário no mês
- Novos alunos por período
- Ex-alunos (para campanha de retorno)

### 7.3 Relatório de Aulas
- Total de aulas realizadas por período
- Taxa de comparecimento geral e por aluno
- Horários mais populares (heatmap)
- Dias com mais cancelamentos
- Evolução de aulas ao longo do tempo

### 7.4 Relatório de Evolução Física
- Seleção de aluno + métrica + período
- Gráfico de evolução (peso, % gordura, cargas, medidas)
- Comparativo entre avaliações
- Exportação de relatório personalizado para enviar ao aluno

### 7.5 Relatório de Leads
- Leads por fonte (Instagram, Google, indicação, WhatsApp orgânico)
- Taxa de conversão por fonte
- Tempo médio para conversão
- Leads perdidos (motivo)
- Pipeline atual

---

## 🎯 MÓDULO 8 — GESTÃO DE LEADS & CRM

### 8.1 Cadastro de Lead
- Nome, telefone, e-mail
- Como chegou até o personal
- Interesse manifestado (tipo de treino, horários)
- Origem (formulário do site, Instagram DM, indicação, evento)

### 8.2 Pipeline Kanban
- Colunas configuráveis (ex: Novo Lead → Contato Feito → Avaliação Agendada → Proposta Enviada → Convertido → Perdido)
- Cards arrastáveis entre colunas
- Prazo e responsável por card
- Notas internas

### 8.3 Follow-up Automático via WhatsApp
- Sequência de mensagens configurável (ex: +1h, +1 dia, +3 dias, +7 dias)
- Templates editáveis pelo personal
- Pausa automática quando lead responde
- Histórico de interações

### 8.4 Conversão
- Ao converter, cria aluno com dados do lead automaticamente
- Mantém histórico de onde veio
- Relatório de ROI por canal de captação

---

## 🔒 MÓDULO 9 — LGPD & SEGURANÇA

### 9.1 Dados Sensíveis
- Informações de saúde classificadas como dados sensíveis (Art. 11 LGPD)
- Criptografia AES-256 em repouso
- TLS 1.3 em trânsito
- Acesso com autenticação dupla para exportar dados sensíveis

### 9.2 Consentimento
- Termo de consentimento digital gerado automaticamente ao cadastrar aluno
- Assinatura via e-mail (link de confirmação) ou WhatsApp
- Registro de IP, data/hora e dispositivo da assinatura
- Aluno pode revogar consentimento a qualquer momento
- Revogação gera anonimização automática dos dados sensíveis

### 9.3 Direitos do Titular (LGPD)
- Acesso: aluno pode solicitar relatório de todos os dados armazenados
- Correção: personal atualiza, aluno confirma
- Exclusão: solicitação de esquecimento com prazo de 30 dias
- Portabilidade: exportação em formato legível (PDF/CSV)
- Todas as solicitações registradas com protocolo

### 9.4 Auditoria
- Log de acesso: quem acessou quais dados, quando e de onde
- Log de alterações: o que mudou, por quem, quando (antes/depois)
- Retenção de logs por 5 anos
- Relatório de auditoria exportável

### 9.5 Política de Retenção
- Dados de ex-alunos: retidos por 5 anos (prazo contratual/fiscal)
- Dados de saúde: retidos por 20 anos (recomendação CFM adaptada)
- Leads não convertidos: deletados após 2 anos de inatividade
- Configurável pelo personal dentro dos limites legais

---

## 📱 MÓDULO 10 — APLICATIVO DO ALUNO (PWA ou App)

- Acesso via link personalizado do personal (sem necessidade de login no FitDesk)
- Visualizar treino do dia
- Executar treino com registro de cargas e check de séries
- Ver histórico de treinos
- Ver avaliação física e evolução
- Solicitar reagendamento (integra com módulo de agenda)
- Visualizar financeiro pessoal (mensalidades, status de pagamento)
- Chat com personal (integrado ao WhatsApp ou interno)
- Notificações push

---

## ⚙️ ESPECIFICAÇÕES TÉCNICAS RECOMENDADAS

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **UI:** Tailwind CSS + Shadcn/UI customizado com paleta FitDesk
- **Charts:** Recharts ou Chart.js
- **Drag and Drop:** dnd-kit
- **Formulários:** React Hook Form + Zod
- **Estado:** Zustand ou Jotai

### Backend
- **API:** Node.js + Fastify ou tRPC
- **Banco de dados:** PostgreSQL (dados relacionais) + Redis (cache/sessões)
- **ORM:** Prisma
- **Autenticação:** NextAuth.js ou Auth.js com JWT
- **Multi-tenancy:** Schema por tenant no PostgreSQL
- **Filas:** BullMQ (notificações, cobranças automáticas)

### Integrações
- **WhatsApp:** Evolution API (self-hosted) ou Meta Cloud API
- **IA:** OpenAI GPT-4o ou Anthropic Claude (para o assistente de WhatsApp)
- **Pagamentos:** Pagar.me, Stripe ou Mercado Pago
- **E-mail:** Resend ou SendGrid
- **SMS:** Twilio (fallback)
- **Storage:** AWS S3 ou Cloudflare R2 (fotos, documentos)

### Infraestrutura
- **Hospedagem:** Vercel (frontend) + Railway ou Fly.io (backend)
- **Banco:** Supabase ou Neon (PostgreSQL gerenciado)
- **CDN:** Cloudflare
- **Monitoramento:** Sentry (erros) + Datadog (infraestrutura)

---

## 🎨 IDENTIDADE VISUAL DO SISTEMA

- Logo: "FIT**DESK**" — Bebas Neue, laranja no "DESK"
- Ícone: símbolo de haltere estilizado dentro de um quadrado arredondado
- Favicon: "FD" laranja em fundo escuro
- Sidebar escura com ícones de linha finos
- Cards com borda sutil e hover com brilho laranja
- Tabelas com linhas alternadas (dark/darker)
- Badges coloridos para status (verde=ativo, amarelo=atenção, vermelho=urgente)
- Gráficos com tema escuro, barras e linhas na cor laranja primária
- Animações de entrada suaves (fade + slide up) com Framer Motion

---

## 📋 FLUXO DE ONBOARDING

1. **Cadastro** → Verificação de e-mail
2. **Perfil profissional** → Nome, CREF, foto, especialidades
3. **Configurar agenda** → Horários de trabalho, duração de aula
4. **Conectar WhatsApp** → QR Code + teste de mensagem
5. **Importar/cadastrar primeiro aluno** → Wizard guiado
6. **Criar primeiro treino** → Template sugerido
7. **Tour interativo** → Tooltips nos principais módulos
8. **Convidar aluno para o app** → Link automático gerado

---

## 📈 MÉTRICAS DE SUCESSO DO PRODUTO

- NPS dos personals (meta: >60)
- Taxa de retenção mensal (meta: >92%)
- Tempo médio até primeiro agendamento via IA (meta: <15 min)
- Redução de tempo em gestão administrativa por semana (meta: -3h)
- Taxa de adoção do módulo financeiro (meta: >75%)

---

*Desenvolvido para substituir planilhas, cadernos, apps genéricos de agenda e fichas de papel. Um produto feito por quem entende a realidade do personal trainer brasileiro.*
