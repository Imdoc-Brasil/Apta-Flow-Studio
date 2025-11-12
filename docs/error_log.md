# Manual de Erros e Aprendizados

Este documento serve como um registro dos erros encontrados durante o desenvolvimento, suas causas e as soluções aplicadas. O objetivo é criar uma base de conhecimento para acelerar a resolução de problemas futuros.

---

## 1. Erro de Compilação Persistente em Formulário React

- **Data:** 23/07/2024
- **Arquivo(s) Afetado(s):** `src/app/dashboard/(main)/employees/page.tsx`
- **Mensagem de Erro:** `Build Error: Parsing ecmascript source code failed. Unexpected token '...'. Expected jsx identifier`

### Descrição do Problema

Durante vários dias, a aplicação falhou em compilar devido a um erro de sintaxe JSX persistente no componente da página de funcionários. O erro sempre apontava para a estrutura dos formulários dentro dos modais de "Adicionar" e "Editar" Membro.

### Causas Raiz Identificadas

O erro foi causado por uma combinação de problemas de sintaxe JSX, que foram abordados em etapas:

1.  **Múltiplos Elementos Raiz:** Inicialmente, a função que renderizava o formulário retornava múltiplos elementos JSX adjacentes, sem um único elemento "pai" para envolvê-los, o que é uma sintaxe inválida em React.
2.  **Sintaxe de Renderização Condicional (Causa Principal):** A causa mais persistente foi o uso de um operador ternário (`condição ? <JSX_A /> : <JSX_B />`) para renderizar blocos grandes e complexos de JSX. O compilador do Next.js/SWC encontrou dificuldades para analisar corretamente essa estrutura, resultando no erro `Unexpected token`. Mesmo com tentativas de envolver os blocos em fragmentos (`<>...</>`), a complexidade da condição ainda causava falhas no parser.

### Solução Definitiva Aplicada

A solução definitiva foi abandonar a renderização condicional complexa dentro do JSX e simplificar a estrutura do componente, seguindo as melhores práticas do React:

1.  **Refatoração dos Diálogos:** Os formulários de "Adicionar" e "Editar" foram separados em componentes mais claros dentro de seus respectivos `DialogContent`.
2.  **Simplificação da Lógica Condicional:** Em vez de usar um operador ternário para alternar entre grandes blocos de formulário (`contractId` vs. `clientIds`), ambos os campos foram incluídos no JSX e sua visibilidade é controlada dinamicamente com base no valor do campo "Perfil", utilizando o `watch` do `react-hook-form`. Isso resultou em um JSX estático e mais simples para o compilador analisar.
3.  **Correção da Estrutura do `FormField`:** Foi garantido que o retorno da função `render` dentro de todos os componentes `FormField` estivesse corretamente envolvido por parênteses `()`, tratando o JSX como uma única expressão.

### Aprendizado

Para formulários complexos com renderização condicional em React/Next.js:

- **Prefira JSX mais simples:** Evite operadores ternários para renderizar blocos de JSX muito grandes ou estruturalmente diferentes.
- **Use Renderização Condicional "Booleana":** Para mostrar ou ocultar elementos, a abordagem `condicao && <Elemento />` é mais segura e legível.
- **Controle a Visibilidade, não a Estrutura:** Quando possível, renderize todos os elementos condicionais e controle sua exibição com CSS (ex: classes `hidden`) em vez de adicioná-los ou removê-los da árvore DOM. Isso simplifica o trabalho do compilador.
- **Atenção à Sintaxe:** Sempre garanta que o retorno de funções de renderização (como em `render` props) seja uma única expressão JSX, geralmente envolta em `()` ou um fragmento.
