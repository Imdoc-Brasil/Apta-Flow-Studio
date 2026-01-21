# AptaFlow Studio - Plano de Refatoração

**Data:** 21 de Janeiro de 2026
**Responsável:** Firebase Studio / Antigravity
**Objetivo:** Melhorar a qualidade, manutenibilidade e escalabilidade do código do AptaFlow Studio.

---

## 🎯 Visão Geral

O projeto possui uma base de código moderna e funcional. No entanto, para garantir o crescimento sustentável, é crucial organizar e padronizar a estrutura do projeto. Esta refatoração será dividida em fases, permitindo uma abordagem incremental e segura.

---

### 🔥 **Fase 1: Centralização de Tipos e Utilitários (A Fundação)**

*   **Status:** Em Andamento
*   **Objetivo:** Criar uma "única fonte da verdade" para todas as definições de dados (interfaces TypeScript) e lógicas de negócio reutilizáveis. Atualmente, estas definições estão espalhadas por vários arquivos `data.ts` dentro das pastas de cada página, dificultando a manutenção.
*   **Ações:**
    1.  [✅] Criar o diretório `src/lib/types`.
    2.  [✅] Mover a interface `Client` para `src/lib/types/client.ts`.
    3.  [ ] Mover as interfaces `Employee` e `EmployeeStatus` para `src/lib/types/employee.ts`.
    4.  [ ] Mover as interfaces `Unit`, `Sector`, `Role`, `Environment` e outras para seus respectivos arquivos em `src/lib/types/`.
    5.  [ ] Mover funções utilitárias (ex: `getRiskLevel` em `pgr/utils.ts`) para um diretório central `src/lib/utils/`.
    6.  [ ] Atualizar todos os `imports` no projeto para refletir os novos caminhos.
    7.  [ ] Remover os arquivos `data.ts` e `utils.ts` obsoletos das pastas das páginas.
*   **Benefício:** Redução de duplicidade, código mais limpo e manutenibilidade drasticamente melhorada.

---

### 🧱 **Fase 2: Refatoração e Divisão de Componentes**

*   **Status:** Pendente
*   **Objetivo:** Quebrar componentes monolíticos (páginas que contêm lógica de estado, renderização e manipulação de eventos) em componentes menores, reutilizáveis e focados.
*   **Ações:**
    1.  Analisar páginas complexas como `tickets/page.tsx`, `clients/page.tsx`, e `employees/page.tsx`.
    2.  Extrair componentes de UI, como tabelas, formulários de diálogo, e cartões, para o diretório `src/components/`.
    3.  Garantir que os novos componentes recebam dados via `props` e emitam eventos via callbacks, tornando-os mais puros e testáveis.
*   **Benefício:** Componentes reutilizáveis, testes unitários facilitados e código muito mais fácil de ler e dar manutenção.

---

### ⚙️ **Fase 3: Consolidação do Gerenciamento de Estado**

*   **Status:** Pendente
*   **Objetivo:** Unificar a estratégia de gerenciamento de estado, utilizando `Zustand` para estados globais e `useState`/`useReducer` para estados locais de componentes, de forma padronizada.
*   **Ações:**
    1.  Revisar todos os `useState` para identificar estados que deveriam ser globais ou compartilhados.
    2.  Refatorar `stores` do Zustand para seguir um padrão consistente (ex: `actions`, `state`).
    3.  Criar hooks customizados (ex: `useClientData`, `useUnitSectors`) para encapsular lógicas de busca e manipulação de dados do Firestore, simplificando os componentes das páginas.
*   **Benefício:** Fluxo de dados claro e previsível, eliminação de "prop drilling", e desacoplamento da lógica de estado da UI.

---

## 🚀 Como Proceder (Handoff para Antigravity)

Quando a sessão com o Firebase Studio for encerrada, o agente do Antigravity deve:

1.  **Ler este plano** para entender o status atual.
2.  **Continuar da última tarefa concluída** na fase atual.
3.  **Executar uma tarefa por vez**, de forma atômica (ex: mover um conjunto de tipos, refatorar um componente).
4.  **Validar após cada alteração** com os comandos `npm run typecheck` e `npm run build` para garantir que nenhuma regressão foi introduzida.
5.  **Fazer commits claros** descrevendo a refatoração realizada.

O objetivo é progredir de forma segura e consistente através das fases, sempre deixando o projeto em um estado funcional ao final de cada interação.
