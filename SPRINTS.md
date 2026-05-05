# 🏃‍♂️ FitDesk: Planejamento de Sprints & Roadmap MVP

🚀 **Objetivo**: Sistema Operacional para Personal Trainers (Tenancy) com IA integrada.

---

## 📅 Sprint 1: Estabilização & Governança (Foco: Core & Security)
*   **Status**: ✅ CONCLUÍDA
*   **Foco**: Backend Sólido & LGPD
*   **Entregas**:
    - [x] **Fix**: Prisma v5.22.0 estabilizado com constructor simplificado.
    - [x] **Security**: Middleware NextAuth v5 protegendo `/dashboard`.
    - [x] **LGPD**: Checkbox de consentimento obrigatório no Login.
    - [x] **Roles**: Dashboard Master vs Personal e menu "Gestão Tenants" funcional.
    - [x] **Auth**: Integração completa com Auth.js (v5) e Prisma Adapter.

---

## 📅 Sprint 2: Gestão Operacional (Foco: CRM & Operação)
*   **Status**: ✅ CONCLUÍDA
*   **Foco**: Alunos & Leads
*   **Entregas**:
    - [x] **Agenda CRUD**: Modais de Novo Horário e Detalhes salvando no SQLite via Server Actions.
    - [x] **Agenda Views**: Navegação por datas real com `date-fns` (Semanas e Dias).
    - [x] **CRM de Leads**: Funil estilo Kanban para gestão de prospects com transição de status.
    - [x] **DB**: Novos modelos `Appointment` e `Lead` integrados com Tenancy.

---

## 🏋️ Sprint 3: Prescrição & Aluno (Foco: Treinos & Mobilidade)
*   **Status**: ✅ CONCLUÍDA
*   **Foco**: Alunos & Treinos
*   **Entregas**:
    - [x] **Treinos**: Criador de fichas A/B/C com exercícios dinâmicos e campos técnicos.
    - [x] **Biblioteca de Exercícios**: 20+ exercícios padrão (Seed) e suporte a vídeos/categorias.
    - [x] **App do Aluno**: Dashboard mobile-first para o aluno ver treino e agenda.
    - [x] **Relacionamentos**: Vínculo real entre User (Login) e Student (Perfil) via `associatedUserId`.

---

## 💰 Sprint 4: Gestão Financeira (Foco: Retenção & Receita)
*   **Status**: ✅ CONCLUÍDA
*   **Foco**: Fluxo de Caixa & Cobrança
*   **Entregas**:
    - [x] **Financeiro**: Dashboard completo com Entradas/Saídas e Saldo Mensal.
    - [x] **Mensalidades**: Status Automático (Pago/Pendente/Atrasado) vinculando alunos a transações.
    - [x] **Cobrança Ativa**: Atalho direto para WhatsApp com lembrete de pagamento personalizado.
    - [x] **Cadastro Financeiro**: Novos campos em Aluno (Valor do Plano/Dia Vencimento) para automação.
    - [ ] **Audit**: Logs de acesso Master (Quem acessou o quê).

---

## 🤖 Sprint 5: Inteligência Digital (Foco: Automação)
*   **Duração**: 2 Semanas
*   **Foco**: WhatsApp IA (Evolution API)
*   **Metas**:
    - [ ] **Evolution API**: Integração com servidor Python nativo para gestão de instâncias.
    - [ ] **IA Assistente**: Responder dúvidas de alunos e leads usando RAG (base de conhecimentos do profissional).
    - [ ] **WhatsApp Sync**: Marcar horários na agenda via conversa natural no Whats.

---

## 📈 Sprint 6: Final Polish & Lançamento (Foco: Growth)
*   **Duração**: 1 Semana
*   **Foco**: SEO, Performance & GEO
*   **Metas**:
    - [ ] **SEO**: Meta-tags dinâmicas, Sitemap e Robots.txt.
    - [ ] **Performance**: LCP < 2.5s, Otimização de Imagens (WebP) e Code Splitting.
    - [ ] **GEO**: FAQ Estruturado para o Google e Citation-ready Content (E-E-A-T).
    - [ ] **Config**: Página de configurações finalizada.

---

### 🔥 Prioridade Atual (Sprint 0.5)
Estamos na transição para a Sprint 1. Prioridade máxima: **Prisma Core** e **Ambiente de Prod**.
