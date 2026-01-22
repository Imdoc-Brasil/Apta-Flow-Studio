# AptaFlow Studio - Plano de Refatoração

**Data:** 21 de Janeiro de 2026
**Responsável:** Firebase Studio / Antigravity
**Objetivo:** Melhorar a qualidade, manutenibilidade e escalabilidade do código do AptaFlow Studio.

---

## 🎯 Visão Geral

O projeto possui uma base de código moderna e funcional. Esta refatoração foi dividida em fases para garantir uma abordagem incremental e segura, melhorando a organização e padronização da estrutura do projeto.

---

### ✅ **Fase 1: Centralização de Tipos e Utilitários (Concluída)**

*   **Status:** ✅ Concluído
*   **Objetivo:** Criar uma "única fonte da verdade" para todas as definições de dados e lógicas de negócio reutilizáveis.
*   **Ações Realizadas:**
    1.  [✅] Criado o diretório `src/lib/types` e todos os tipos de `data.ts` foram movidos para lá.
    2.  [✅] Funções utilitárias (ex: `getRiskLevel`, `getClientPendingFields`) foram movidas para um diretório central `src/lib/utils/`.
    3.  [✅] Todos os `imports` no projeto foram atualizados para os novos caminhos centralizados.
    4.  [✅] Os arquivos `data.ts` e `utils.ts` obsoletos foram removidos das pastas das páginas.
*   **Benefício:** Redução de duplicidade, código mais limpo e manutenibilidade drasticamente melhorada.

---

### ✅ **Fase 2: Refatoração e Divisão de Componentes (Concluída)**

*   **Status:** ✅ Concluído
*   **Objetivo:** Quebrar componentes monolíticos em componentes menores, reutilizáveis e focados.
*   **Ações Realizadas:**
    1.  [✅] Extraído `AddClientDialog` de `clients/page.tsx`.
    2.  [✅] Extraído `TicketDetailsDialog` de `tickets/page.tsx`.
    3.  [✅] Extraído `AddUnitDialog` de `units/page.tsx`.
    4.  [✅] Extraído `AddPgrRiskDialog` de `pgr/page.tsx`.
    5.  [✅] Extraído `AddClientEmployeeDialog` de `employees/page.tsx`.
    6.  [✅] Extraído `EditPermissionsDialog` de `profiles/page.tsx`.
*   **Benefício:** Componentes reutilizáveis, testes unitários facilitados e código muito mais fácil de ler e dar manutenção.

---

### ✅ **Fase 3: Consolidação do Gerenciamento de Estado (Concluída)**

*   **Status:** ✅ Concluído
*   **Objetivo:** Unificar e otimizar a estratégia de gerenciamento de estado.
*   **Ações Realizadas:**
    1.  [✅] Removida a store `Zustand` (`useTicketStore`) para simplificar o fluxo de dados dos tickets.
    2.  [✅] Criado o hook customizado `useAllSectors` para centralizar a busca de setores.
    3.  [✅] Criado o hook customizado `useStaffProfile` para buscar dados do usuário logado.
    4.  [✅] Criado o hook customizado `useAllEnvironments` para buscar postos de trabalho.
    5.  [✅] Componentes das páginas foram refatorados para usar os novos hooks, eliminando lógica de busca de dados duplicada.
*   **Benefício:** Fluxo de dados claro e previsível, eliminação de código repetido e desacoplamento da lógica de estado da UI.

---

## 🚀 Próximos Passos Sugeridos

Com a base do código agora sólida e organizada, as próximas fases podem focar em:

### **Fase 4: Testes Automatizados**
*   **Objetivo:** Aumentar a confiabilidade do código e prevenir regressões.
*   **Ações:**
    *   Implementar testes unitários com `vitest` para hooks customizados e funções utilitárias.
    *   Implementar testes de integração com `React Testing Library` para componentes complexos.
    *   Configurar testes E2E com `Playwright` para os fluxos de usuário mais críticos (login, criação de cliente, etc.).

### **Fase 5: Otimização de Performance**
*   **Objetivo:** Garantir que a aplicação continue rápida e responsiva à medida que cresce.
*   **Ações:**
    *   Analisar o bundle da aplicação com `@next/bundle-analyzer` para identificar e otimizar pacotes pesados.
    *   Implementar `React.lazy` para componentes que não são críticos para a renderização inicial.
    *   Revisar e otimizar as consultas ao Firestore, garantindo o uso correto de índices.

