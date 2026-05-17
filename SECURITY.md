# Política de Segurança e Resposta a Incidentes

Este documento estabelece as diretrizes de segurança, o plano de resposta a incidentes e o canal de contato para relatar vulnerabilidades no FitDesk.

## 1. Relatório de Vulnerabilidades

Se você identificar uma falha de segurança na plataforma FitDesk, solicitamos que nos informe imediatamente. 

- **E-mail para relatos:** [security@fitdesk.com.br](mailto:security@fitdesk.com.br)
- **Prazo de Resposta Inicial:** 24 horas úteis
- **O que incluir:** Descrição detalhada do problema, passos para reproduzir, e impacto potencial (se conhecido).
- **Programa de Recompensa (Bug Bounty):** No momento, não operamos um programa financeiro de recompensas.

Por favor, não divulgue a vulnerabilidade publicamente antes de nos dar tempo hábil para correção (preferencialmente 90 dias após a notificação).

## 2. Plano de Resposta a Incidentes (LGPD Art. 48)

Em caso de violação de dados ou incidente de segurança que possa acarretar risco ou dano relevante aos titulares de dados pessoais, o FitDesk seguirá o seguinte fluxo:

### Fase 1: Identificação e Contenção
1. A equipe técnica investigará imediatamente os sistemas comprometidos.
2. Isolamento de redes, bloqueio de contas comprometidas ou paralisação de serviços temporariamente para conter o vazamento.
3. Desativação de chaves ou senhas expostas e rotação de segredos (`AUTH_SECRET`, chaves Supabase, etc).

### Fase 2: Avaliação de Impacto
1. O DPO e a equipe de segurança farão um levantamento da extensão dos dados afetados (natureza dos dados, número de titulares).
2. Avaliação de severidade: se há risco de fraude, impacto à saúde, discriminação, etc.

### Fase 3: Notificação (Prazo: 72 horas)
Conforme recomendação da ANPD, a comunicação deverá ser feita no prazo de **2 dias úteis (72h)** da data do conhecimento do incidente:
1. **Autoridade Nacional de Proteção de Dados (ANPD):**
   - Notificação oficial através do sistema eletrônico da ANPD informando o incidente.
2. **Titulares Afetados:**
   - E-mail e notificação in-app informando: descrição da natureza dos dados afetados, informações sobre os titulares envolvidos, medidas técnicas adotadas, riscos e como os usuários podem se proteger (ex: alterar senha, cancelar cartão).

### Fase 4: Recuperação e Post-mortem
1. Restauração de sistemas e serviços com correções aplicadas.
2. Reunião de *post-mortem* interno para identificar falhas no processo.
3. Atualização das políticas de segurança (`SECURITY.md`) e treinamento da equipe.

## 3. Contatos Oficiais

- **DPO (Encarregado de Dados):** Michel Silva
- **E-mail DPO:** [dpo@fitdesk.com.br](mailto:dpo@fitdesk.com.br)
- **ANPD:** [www.gov.br/anpd/pt-br](https://www.gov.br/anpd/pt-br)
