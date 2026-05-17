# 🔐 Plano de Ação LGPD — FitDesk
> **Auditoria de Segurança e Conformidade** · Gerado em: Maio/2026

---

> [!CAUTION]
> Este documento contém vulnerabilidades críticas identificadas no sistema. Trate as informações com confidencialidade. Implemente as correções conforme a ordem de prioridade das sprints.

---

## 📊 Resumo Executivo

| Categoria | Contagem | Status |
|-----------|----------|--------|
| 🔴 Crítico | 3 | Requer ação imediata |
| 🟠 Alto | 5 | Sprint 1 |
| 🟡 Médio | 6 | Sprint 2–3 |
| 🟢 Baixo | 5 | Sprint 4 |
| **Total** | **19** | — |

**Dados protegidos sob LGPD:**  
- 📋 Dados pessoais de Personal Trainers (nome, e-mail, CPF, telefone)
- 🏋️ Dados pessoais de Alunos (nome, e-mail, telefone, dados de pagamento)
- 💳 Dados financeiros (valores de mensalidade, histórico de pagamentos)
- 🏥 Dados de saúde sensíveis (fichas de treino, avaliações físicas — **dado sensível LGPD Art. 11**)
- 🔑 Credenciais de acesso (senhas hashadas, tokens JWT)

---

## 🗺️ Mapa de Superfície de Ataque

```
[Internet]
    │
    ├── /login              → Autenticação (Credentials Provider)
    ├── /checkout           → Dados de cartão + CPF (CRÍTICO)
    ├── /recuperar-senha    → Reset de senha
    ├── /privacidade        → Política de Privacidade (incompleta)
    │
    ▼
[Next.js Server - Vercel]
    │
    ├── Server Actions (src/app/actions/)
    │   ├── checkout.ts     → Recebe número de cartão completo (CRÍTICO)
    │   ├── students.ts     → Dados de alunos
    │   ├── finance.ts      → Dados financeiros
    │   ├── appointments.ts → Agenda (dados com alunos)
    │   ├── leads.ts        → Dados de prospects
    │   └── tenants.ts      → Gestão de usuários
    │
    ├── Services (src/services/) — TODOS usam supabaseAdmin (bypass RLS)
    │
    ▼
[Supabase - Banco de Dados]
    │   ← RLS completamente ignorado pela aplicação
    ├── users (dados de personal trainers)
    ├── students (dados pessoais de alunos)
    ├── financial_entries (dados financeiros)
    ├── appointments (agenda + dados de alunos)
    └── library_exercises

[Asaas - Gateway de Pagamento]
    ← Dados de cartão transitam via servidor (não PCI-DSS compliant)
```

---

## 🔴 ACHADOS CRÍTICOS

### CRÍTICO-01 — Segredo de Autenticação Hardcoded e Fraco
**Arquivo:** `src/auth.ts` · linha 9  
**Arquivo:** `.env` · linha 4

```typescript
// ❌ PROBLEMA: fallback hardcoded com valor previsível
secret: process.env.AUTH_SECRET || "FitDeskSecretToken2026-SuperSecure!",
```

```env
# ❌ PROBLEMA: segredo fraco e não rotacionado
AUTH_SECRET="FitDeskSecretToken2026-SuperSecure!"
```

**Impacto LGPD:** Comprometimento total de todas as sessões JWT → acesso indevido a dados pessoais de todos os usuários.  
**OWASP:** A04 (Cryptographic Failures) + A07 (Authentication Failures)  
**Correção:**
```bash
# Gerar segredo forte (32+ bytes aleatórios)
openssl rand -base64 32
```
```typescript
// ✅ CORRETO: nunca ter fallback hardcoded
secret: process.env.AUTH_SECRET, // Lança erro se não configurado
```

---

### CRÍTICO-02 — Bypass Total de RLS (Row Level Security) no Supabase
**Arquivos:** Todos em `src/services/` (11 arquivos)

```typescript
// ❌ PROBLEMA: supabaseAdmin ignora RLS em TODAS as operações
// Um bug de autorização expõe dados de TODOS os personais/alunos
import { supabaseAdmin } from "@/lib/supabase"; // service_role key
```

**Impacto LGPD:** Qualquer falha de autorização nas Server Actions expõe dados de **todos** os usuários — violação do Art. 46 LGPD (medidas de segurança adequadas).  
**OWASP:** A01 (Broken Access Control)  

**Risco concreto identificado:** A autorização é feita na camada de Server Action, mas o banco não tem uma segunda linha de defesa. Se uma Server Action falhar em validar `session.user.id`, o banco retornará dados de qualquer tenant.

**Correção:** Habilitar RLS nas tabelas do Supabase, e usar o cliente `supabase` (anon) com contexto de usuário:
```typescript
// ✅ CORRETO: usar cliente com contexto do usuário autenticado
import { createServerClient } from '@supabase/ssr';
// supabaseAdmin reservado APENAS para: criar usuários, operações de sistema
```

---

### CRÍTICO-03 — Dados de Cartão de Crédito Transitando pelo Servidor
**Arquivo:** `src/app/actions/checkout.ts` · linhas 15–18

```typescript
// ❌ PROBLEMA: número de cartão, CVV e validade chegam ao servidor Next.js
const cardNumber = formData.get("cardNumber") as string;
const cardCvv    = formData.get("cardCvv") as string;
```

**Impacto LGPD:** Dado financeiro sensível (Art. 5, XIV) trafegando e potencialmente logado. Viola PCI-DSS. Se os logs da Vercel forem comprometidos, dados de cartão são expostos.  
**OWASP:** A04 (Cryptographic Failures) + A06 (Insecure Design)  
**Correção:** Usar tokenização client-side do Asaas (Asaas.js / SDK) — o cartão nunca deve chegar ao servidor.

---

## 🟠 ACHADOS ALTOS

### ALTO-01 — Vazamento de E-mail e ID em Logs de Produção
**Arquivo:** `src/auth.ts` · linhas 17, 27, 36

```typescript
// ❌ PROBLEMA: e-mail e ID de usuário logados em texto claro
console.log("AUTHORIZE START", credentials?.email);
console.log("AUTH DATA:", authData?.user?.id, "ERROR:", authError?.message);
console.log("USER PROFILE DB:", userProfile?.id || "NULL");
```

**Impacto LGPD:** Logs da Vercel/servidor contêm dados pessoais (e-mail). Viola princípio da necessidade (Art. 6, III) e segurança (Art. 46).  
**Correção:** Remover logs de dados pessoais. Em produção, usar logger estruturado que sanitiza PIIs.

---

### ALTO-02 — Ausência de Rate Limiting na Autenticação
**Arquivo:** `src/middleware.ts`

O middleware não implementa nenhuma limitação de tentativas de login. Um atacante pode fazer ataques de força bruta contra qualquer conta sem bloqueio.

**Impacto LGPD:** Comprometimento de contas → acesso não autorizado a dados pessoais de alunos.  
**OWASP:** A07 (Authentication Failures)  
**Correção:** Implementar rate limiting via `@upstash/ratelimit` ou configuração no Vercel.

---

### ALTO-03 — Ausência de Validação de Input nas Server Actions
**Arquivos:** `src/app/actions/students.ts`, `finance.ts`, `leads.ts`

```typescript
// ❌ PROBLEMA: dados do formulário usados diretamente sem validação
const name = formData.get("name") as string;      // pode ser null, undefined, string vazia
const amount = parseFloat(formData.get("amount") as string); // NaN não tratado
```

**Impacto LGPD:** Risco de injeção de dados malformados, corrupção de dados pessoais.  
**Correção:** Usar `zod` para validação de schema em todas as Server Actions.

---

### ALTO-04 — Segredos do Supabase Expostos no Bundle do Cliente
**Arquivo:** `src/lib/supabase.ts` · linhas 3–4

```typescript
// ⚠️ ATENÇÃO: NEXT_PUBLIC_ expõe ao bundle do cliente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
```

A `anon key` tem escopo limitado pelo RLS (quando ativado), mas a arquitetura atual sem RLS torna isso perigoso. A refatoração do CRÍTICO-02 resolve este ponto.

---

### ALTO-05 — Ausência de Cabeçalhos de Segurança HTTP
**Arquivo:** `next.config.js` (sem configuração)

O sistema não possui os seguintes cabeçalhos HTTP obrigatórios:
- `Content-Security-Policy` (CSP)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- `Permissions-Policy`
- `Strict-Transport-Security` (HSTS)

**Impacto LGPD:** Facilita ataques XSS, clickjacking, e MITM que comprometem dados pessoais.  
**OWASP:** A02 (Security Misconfiguration)

---

## 🟡 ACHADOS MÉDIOS

### MÉDIO-01 — Política de Privacidade Incompleta (Não-conformidade LGPD direta)
**Arquivo:** `src/app/privacidade/page.tsx`

Itens obrigatórios pela LGPD ausentes:
- ❌ Identidade e contato do **Controlador** (nome da empresa/CNPJ, endereço, DPO)
- ❌ Identidade do **Encarregado (DPO)** e canal de contato — **Art. 41 LGPD (OBRIGATÓRIO)**
- ❌ Base legal para cada tipo de tratamento (Art. 7 e Art. 11)
- ❌ Período de retenção dos dados
- ❌ Procedimento concreto para exercer direitos (Art. 18): acesso, correção, exclusão, portabilidade
- ❌ Política de cookies
- ❌ Informação sobre transferência internacional de dados (Supabase/AWS/Vercel)
- ❌ Menção a dados sensíveis de saúde (dados de treino)

---

### MÉDIO-02 — Ausência de Mecanismo de Exclusão de Dados (Direito ao Esquecimento)
**Impacto LGPD:** Art. 18, IV — O titular tem direito à **anonimização ou exclusão** dos dados desnecessários.

Atualmente não existe:
- Funcionalidade de "excluir minha conta" para Personal Trainers
- Funcionalidade de exclusão de dados do aluno quando solicitado
- Política de retenção implementada no banco

---

### MÉDIO-03 — Ausência de Log de Auditoria para Operações sobre Dados Pessoais
**Impacto LGPD:** Art. 37 — O controlador deve manter registro das atividades de tratamento.

Não há registro de:
- Quem acessou quais dados de alunos
- Criação/exclusão de registros de alunos
- Alterações em dados financeiros
- Tentativas de login falhas

---

### MÉDIO-04 — Consentimento no Login Não Persiste no Banco
**Arquivo:** `src/app/login/page.tsx` · linha 21–24

```typescript
// ⚠️ PROBLEMA: acceptedTerms é state local, reiniciado a cada sessão
// Não há registro no banco de quando/como o usuário consentiu
if (!acceptedTerms) {
  setError("Você precisa aceitar os termos de tratamento de dados.");
```

**Impacto LGPD:** Art. 8 — O consentimento deve ser registrável e auditável. Não basta bloquear o botão — é preciso armazenar evidência do consentimento com data/hora.

---

### MÉDIO-05 — Endereço de CEP Placeholder nos Dados de Pagamento
**Arquivo:** `src/app/actions/checkout.ts` · linha 53

```typescript
// ❌ PROBLEMA: dado falso enviado ao Asaas
postalCode: "01001000", // placeholder
```

Envia CEP falso para o gateway de pagamento — pode causar problemas de conformidade com a Asaas.

---

### MÉDIO-06 — Ausência de Política de Senhas Mínima
**Arquivo:** `src/app/actions/checkout.ts` e `tenants.ts`

Não há validação de complexidade mínima de senha ao criar contas.

---

## 🟢 ACHADOS BAIXOS

### BAIXO-01 — Dependências sem Auditoria de Segurança
Não há script automatizado de auditoria de dependências (`npm audit`) no pipeline CI/CD.

### BAIXO-02 — Página de Termos de Uso Incompleta
**Arquivo:** `src/app/termos/` — precisa de revisão jurídica com base nos serviços oferecidos.

### BAIXO-03 — Ausência de Logout Automático por Inatividade
A sessão JWT tem 30 dias fixos. Não há logout automático por inatividade no cliente.

### BAIXO-04 — CORS não Configurado Explicitamente
As rotas de API não têm política CORS definida — confia no padrão do Next.js.

### BAIXO-05 — Sem Plano de Resposta a Incidentes
**LGPD Art. 48** — A ANPD e os titulares afetados devem ser notificados em até **72 horas** em caso de incidente. Não há plano documentado.

---

## 📅 Plano de Sprints

---

## ⚡ Sprint 1 — Críticos e Altos de Segurança (Semana 1)
> **Objetivo:** Eliminar vulnerabilidades exploráveis imediatamente.

### 🔐 Autenticação e Segredos

- [ ] **[CRÍTICO-01]** Gerar `AUTH_SECRET` criptograficamente seguro com `openssl rand -base64 32` e configurar na Vercel como variável de ambiente
- [ ] **[CRÍTICO-01]** Remover o fallback hardcoded do `auth.ts` — se `AUTH_SECRET` não estiver definido, a aplicação deve recusar iniciar
- [ ] **[ALTO-01]** Remover TODOS os `console.log` com dados de usuário do `auth.ts` (linhas 17, 27, 36, 39, 43)
- [ ] **[ALTO-01]** Remover `console.log` do `nova-senha/page.tsx`
- [ ] **[ALTO-02]** Implementar rate limiting no endpoint de login usando `@upstash/ratelimit` + `@upstash/redis` (max 5 tentativas/15min por IP)

### 💳 Pagamentos e Dados de Cartão

- [ ] **[CRÍTICO-03]** Implementar tokenização client-side do cartão via Asaas.js/SDK — o cartão nunca deve chegar ao servidor
- [ ] **[MÉDIO-05]** Coletar CEP real do usuário no formulário de checkout, remover placeholder `"01001000"`
- [ ] **[MÉDIO-06]** Adicionar validação de senha mínima (8 caracteres, letras + números) no checkout e na criação de tenants

### 🛡️ Cabeçalhos HTTP

- [ ] **[ALTO-05]** Criar/atualizar `next.config.js` com os seguintes cabeçalhos de segurança:
  ```js
  const securityHeaders = [
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-DNS-Prefetch-Control', value: 'on' },
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  ];
  ```

---

## 🛡️ Sprint 2 — Controle de Acesso e Banco de Dados (Semana 2)
> **Objetivo:** Corrigir a falta de RLS e implementar defesa em profundidade no banco de dados.

### 🗄️ Row Level Security (Supabase)

- [ ] **[CRÍTICO-02]** Ativar RLS nas tabelas: `students`, `financial_entries`, `appointments`, `workouts`, `workout_exercises`, `leads`, `student_groups`
- [ ] **[CRÍTICO-02]** Criar política RLS para `students`:
  ```sql
  ALTER TABLE students ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Personal vê apenas seus alunos"
  ON students FOR ALL
  USING (auth.uid() = "personalId");
  ```
- [ ] **[CRÍTICO-02]** Criar políticas RLS para `financial_entries`, `appointments`, `leads` (padrão: `auth.uid() = "personalId"`)
- [ ] **[CRÍTICO-02]** Criar política RLS para `workouts` (join via `personalId`)
- [ ] **[CRÍTICO-02]** Refatorar `src/lib/supabase.ts` — criar factory de cliente server-side com contexto de sessão
- [ ] **[CRÍTICO-02]** Restringir `supabaseAdmin` (service_role) somente a: `auth.ts` (login/criação de usuário), `checkout.ts`
- [ ] **[CRÍTICO-02]** Migrar todos os services (`studentService`, `financialService`, etc.) para usar cliente com RLS ativo

### ✅ Validação de Inputs

- [ ] **[ALTO-03]** Instalar `zod`: `npm install zod`
- [ ] **[ALTO-03]** Criar schemas Zod para: `createStudent`, `createTransaction`, `createLead`, `createAppointment`
- [ ] **[ALTO-03]** Aplicar schemas de validação em todas as Server Actions antes de chamar services
- [ ] **[ALTO-03]** Tratar casos de `NaN` no campo `amount` (finance.ts linha 43)
- [ ] **[ALTO-03]** Validar `type` da transação (`IN` | `OUT`) para evitar injeção de valores inválidos

---

## 📋 Sprint 3 — Conformidade LGPD Legal e Direitos dos Titulares (Semana 3)
> **Objetivo:** Implementar os requisitos legais que afetam diretamente os direitos dos titulares.

### 📄 Documentação Legal

- [ ] **[MÉDIO-01]** Atualizar `src/app/privacidade/page.tsx` com:
  - Nome completo da empresa controladora e CNPJ
  - Nome e e-mail do Encarregado (DPO) — **Art. 41 LGPD** ← OBRIGATÓRIO
  - Base legal para cada tipo de tratamento de dados
  - Período de retenção de dados por categoria
  - Direitos dos titulares com procedimento concreto de solicitação
  - Informação sobre transferência internacional (Supabase/Vercel/Asaas = dados fora do Brasil)
  - Política de cookies
  - Data da última atualização

- [ ] **[BAIXO-02]** Revisar e completar `src/app/termos/` com termos de uso adequados ao SaaS

### 🔑 Consentimento Rastreável

- [ ] **[MÉDIO-04]** Criar campos `lgpd_consent_at` (timestamp) e `lgpd_consent_version` (string) na tabela `users`
- [ ] **[MÉDIO-04]** Ao aceitar os termos no login/checkout, registrar no banco: `{ lgpd_consent_at: now(), lgpd_consent_version: "v1.0" }`
- [ ] **[MÉDIO-04]** Exibir no painel de configurações quando e qual versão dos termos foi aceita

### 🗑️ Direito ao Esquecimento (Art. 18, IV LGPD)

- [ ] **[MÉDIO-02]** Criar Server Action `deleteAccount(userId)` que:
  - Anonimiza dados do `users` (nome → "Usuário Removido", email → hash)
  - Exclui/anonimiza dados de alunos associados
  - Anonimiza dados financeiros associados (mantendo registros contábeis obrigatórios)
  - Desabilita o usuário no Supabase Auth
- [ ] **[MÉDIO-02]** Criar página `/settings/privacidade` com botão "Excluir minha conta e dados"
- [ ] **[MÉDIO-02]** Documentar prazo de retenção de dados contábeis (5 anos — obrigação fiscal)

### 📦 Portabilidade de Dados (Art. 18, V LGPD)

- [ ] **[MÉDIO-02]** Criar funcionalidade "Exportar meus dados" (JSON/CSV): perfil, alunos, fichas, financeiro
- [ ] **[MÉDIO-02]** Disponibilizar na página `/settings/privacidade`

---

## 📊 Sprint 4 — Monitoramento, Auditoria e Hardening Final (Semana 4)
> **Objetivo:** Implementar observabilidade de segurança e finalizar hardening.

### 📝 Log de Auditoria

- [ ] **[MÉDIO-03]** Criar tabela `audit_logs` no Supabase:
  ```sql
  CREATE TABLE audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "userId" UUID NOT NULL,
    action TEXT NOT NULL,          -- ex: 'student.create', 'student.delete'
    "resourceId" UUID,
    "resourceType" TEXT,
    metadata JSONB,
    "ipAddress" INET,
    "createdAt" TIMESTAMPTZ DEFAULT now()
  );
  ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
  -- Apenas o próprio usuário e MASTER podem ver seus logs
  ```
- [ ] **[MÉDIO-03]** Registrar eventos críticos: login, logout, criação/edição/exclusão de alunos, acesso a dados financeiros
- [ ] **[MÉDIO-03]** Criar visualização de logs no painel do MASTER

### ⏱️ Sessão e Inatividade

- [ ] **[BAIXO-03]** Implementar logout automático após 60 minutos de inatividade no cliente
- [ ] **[BAIXO-03]** Exibir aviso "Você será desconectado em 5 minutos" antes de expirar

### 🔍 Dependências e CI/CD

- [ ] **[BAIXO-01]** Adicionar `npm audit --audit-level=high` ao pipeline CI (GitHub Actions)
- [ ] **[BAIXO-01]** Configurar `dependabot` para alertas de segurança automáticos
- [ ] **[BAIXO-04]** Configurar CORS explicitamente nas rotas de API em `next.config.js`

### 🚨 Plano de Resposta a Incidentes

- [ ] **[BAIXO-05]** Criar documento `SECURITY.md` com:
  - Canal de reporte de vulnerabilidades (e-mail de segurança)
  - Procedimento de notificação de incidentes (72h — LGPD Art. 48)
  - Contatos da ANPD: [www.gov.br/anpd](https://www.gov.br/anpd)
  - Checklist: contenção → análise → notificação → remediação → post-mortem
- [ ] **[BAIXO-05]** Configurar alerta automático de falhas de autenticação suspeitas (>10 falhas/hora por IP)

---

## 🏁 Critérios de Conclusão por Sprint

| Sprint | Critério de Aceite |
|--------|--------------------|
| **Sprint 1** | Zero secrets hardcoded · Rate limiting ativo · Sem dados PII em logs · Headers HTTP configurados |
| **Sprint 2** | RLS ativo em todas as tabelas com dados pessoais · Zod validando todas as Server Actions |
| **Sprint 3** | Política de Privacidade completa e juridicamente válida · Consentimento rastreável · Mecanismo de exclusão funcionando |
| **Sprint 4** | Audit log registrando operações sensíveis · `npm audit` sem HIGH/CRITICAL · Plano de incidentes documentado |

---

## 📚 Referências Legais

| Artigo LGPD | Descrição | Items Relacionados |
|-------------|-----------|-------------------|
| Art. 5, II | Definição de dado sensível (saúde) | CRÍTICO-02, MÉDIO-01 |
| Art. 6, III | Princípio da Necessidade | ALTO-01 |
| Art. 7 | Hipóteses de tratamento lícito | MÉDIO-01 |
| Art. 8 | Requisitos do consentimento | MÉDIO-04 |
| Art. 11 | Tratamento de dados sensíveis (saúde) | CRÍTICO-02 |
| Art. 18, I–VIII | Direitos dos titulares | MÉDIO-01, MÉDIO-02 |
| Art. 37 | Registro de atividades de tratamento | MÉDIO-03 |
| Art. 41 | Encarregado (DPO) — obrigatório | MÉDIO-01 |
| Art. 46 | Segurança e medidas técnicas | CRÍTICO-02, ALTO-01 |
| Art. 48 | Comunicação de incidentes (72h) | BAIXO-05 |

---

## 🔗 Ferramentas e Recursos Recomendados

- **Validação:** [Zod](https://zod.dev) para schemas TypeScript
- **Rate Limiting:** [Upstash Rate Limit](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)
- **Headers:** [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers)
- **Auditoria de Deps:** `npm audit` + [Snyk](https://snyk.io)
- **ANPD:** [Portal da Autoridade Nacional de Proteção de Dados](https://www.gov.br/anpd/pt-br)
- **Ferramenta de DPO:** [Privacy Tools](https://www.privacytools.com.br) (empresa brasileira)

---

*Plano gerado pela auditoria de segurança do FitDesk em conformidade com a LGPD (Lei nº 13.709/2018) e OWASP Top 10:2025.*
