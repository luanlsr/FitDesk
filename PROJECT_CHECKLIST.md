# 📋 FitDesk: Backlog & Roadmap Estratégico

> **Status:** Refinamento Inicial (Mês 1)
> **Prioridade:** Estabilização de Core & CRUD

Este checklist detalha todas as funcionalidades pendentes e bugs identificados para transformar o FitDesk em um MVP (Minimum Viable Product) funcional e pronto para produção.

---

## 🛠️ 1. Estabilização Técnica (CRÍTICO)

A base tecnológica precisa estar sólida antes de escalar as funcionalidades.

- [ ] **Correção do Prisma Client**: Resolver o erro de inicialização `PrismaClientInitializationError` (Mismatch de versões ou configuração de Prisma 7).
- [ ] **Configuração do Ambiente de Prod**:
  - [ ] Provisionar banco de dados **Supabase** (PostgreSQL).
  - [ ] Configurar variáveis de ambiente na **Vercel**.
  - [ ] Integrar **OpenAI API Key** para os recursos de IA.
- [ ] **Logoff Real**: Implementar a lógica de logout removendo tokens/sessões (se aplicável com NextAuth).

---

## 🗓️ 2. Módulo de Agenda (Módulo 2)

A agenda é o coração do sistema para o personal.

- [ ] **Novas Visões**: Implementar visualização por **Dia** e **Mês** (atualmente apenas semanal).
- [ ] **Slot de Agendamento**:
  - [ ] Corrigir botão "Novo Horário" (atualmente inativo).
  - [ ] Implementar Modal de detalhes ao clicar em um aluno ou agendamento existente.
  - [ ] Possibilidade de editar/reagendar/cancelar aulas.

---

## 👥 3. Gestão de Alunos & CRM (Módulo 4 & 5)

Gestão completa e conformidade total.

- [ ] **CRUD Completo de Alunos**:
  - [ ] Implementar campos de **Anamnese** (Lesões, Condições, Medicamentos, Restrições).
  - [ ] Implementar campos de **LGPD** (Termo de consentimento e proteção de dados).
- [ ] **Funil de Leads (CRM)**:
  - [ ] Tornar o quadro Kanban funcional (Drag & Drop com persistência no DB).
  - [ ] Implementar filtros por origem do lead e temperatura.

---

## 🏋️ 4. Treinos & Biblioteca (Módulo 6)

O valor agregado do personal para o aluno.

- [ ] **Criação de Treinos**: Implementar o fluxo de montagem de ficha de treino.
- [ ] **Biblioteca de Exercícios**: 
  - [ ] Finalizar o "Catálogo Completo" com vídeos e descrições.
  - [ ] Funcionalidade de busca e anexação rápida ao treino.
- [ ] **Visão do Aluno (Módulo 10)**:
  - [ ] Criar a interface exclusiva para o aluno acessar sua ficha.
  - [ ] Possibilitar edição de perfil e visualização de evolução.

---

## 💳 5. Financeiro & Relatórios (Módulo 8 & 9)

O controle de CEO da academia pessoal.

- [ ] **Lançamentos**: Criar CRUD completo de entradas (receitas) e saídas (despesas).
- [ ] **Exportação**: Implementar geração de relatório em **XLSX**.
- [ ] **Dashboards**: Implementar visualização completa de inadimplência e projeção de caixa.
- [ ] **Relatórios Customizados**: Gerar PDFs conforme filtros de período.

---

## 🤖 6. Inteligência Artificial & WhatsApp (Módulo 3)

O diferencial futurista do sistema.

- [ ] **Evolution API (Backend Python)**: 
  - [ ] Integrar com backend Python para gestão de instâncias de WhatsApp.
  - [ ] Implementar assistente de IA para responder dúvidas, agendar e converter leads automaticamente.
- [ ] **Dashboard IA**: Configurações de "Tom de Voz" e templates de resposta.

---

## 🔑 7. Controle de Acesso & Roles (Módulo 1)

Multi-tenancy e Governança.

- [ ] **Implementar Roles Reais**:
  - [ ] **MASTER**: Visão completa do sistema, gestão de Tenants (personals), reset de senhas.
  - [ ] **ADMIN (Personal)**: Gestão total apenas dos SEUS próprios alunos e financeiro.
  - [ ] **ALUNO**: Acesso restrito apenas aos seus treinos e perfil.
- [ ] **Gestão de Tenants**: Painel para o Master criar novos profissionais no sistema.

---

## ⚙️ 8. Configurações & Perfil

- [ ] **Página de Configurações**: Implementar campos de perfil, logo da marca, links de redes sociais e preferências do sistema.

---

## 🔒 9. Segurança & LGPD (A03:2025 OWASP)
*Review by: @security-auditor*

- [ ] **Termos de Consentimento**: Salvar data/hora e versão dos termos aceitos pelo aluno.
- [ ] **Anonimização**: Implementar *Soft Delete* (campo `deletedAt`) para excluir dados mantendo integridade mas respeitando o "Direito ao Esquecimento".
- [ ] **Segurança de API**: Validar todos os `Server Actions` com `auth()` para evitar Broken Access Control (**A01**).
- [ ] **OWASP 2025**: Implementar tratamento de exceções robusto (A10) nas chamadas de banco.

## 🚀 10. Performance & SEO (Lighthouse Focus)
*Review by: @seo-specialist & @performance-optimizer*

- [ ] **Core Web Vitals**:
  - [ ] **LCP**: Otimizar imagens da landing page (WebP + lazy loading).
  - [ ] **CLS**: Definir dimensões explícitas em todos os ícones e imagens.
- [ ] **SEO & Metadata**:
  - [ ] Gerar `robots.txt` e `sitemap.xml`.
  - [ ] Implementar **Json-LD Schema** para a Academia/Personal.
- [ ] **Performance**: Memoizar os cards de treinos e alunos com grande volume de dados.

---

### 💡 Recomendações dos Especialistas
> **Segurança:** Nunca exponha o `userId` em requisições de Client-side. Use JWT ou Sessão segura.
> **Performance:** Utilize `revalidatePath` inteligentemente para não invalidar o cache de toda a aplicação em ações simples.

**Última atualização:** 23/03/2026 - Sprint Initial Refinement
