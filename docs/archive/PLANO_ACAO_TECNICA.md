# 🎯 Plano de Ação Técnica - AptaFlow Studio

**Data:** 2026-01-08  
**Status:** Análise Técnica Validada  
**Prioridade:** Alta

---

## 📊 Diagnóstico Validado

### ✅ Pontos Fortes Confirmados

1. **Arquitetura Sólida**
   - Next.js 15.3.3 com App Router (`/src/app`)
   - Stack moderno: Radix UI + Tailwind + CVA
   - Genkit AI integrado com Gemini 2.5 Flash
   - Firebase configurado corretamente

2. **Estrutura de Código**
   - TypeScript com `strict: true` ✅
   - Path aliases configurados (`@/*`)
   - Separação clara: `/ai`, `/app`, `/components`, `/firebase`

3. **Design System**
   - Tailwind bem configurado com design tokens
   - Radix UI modular e atualizado
   - CVA + clsx + tailwind-merge (padrão profissional)

---

## 🚨 Problemas Críticos Identificados

### 🔴 **CRÍTICO 1: Build Configuration Insegura**

**Problema:**
```json
// next.config.ts
typescript: {
  ignoreBuildErrors: true,  // ❌ MUITO PERIGOSO
},
eslint: {
  ignoreDuringBuilds: true, // ❌ MUITO PERIGOSO
}
```

**Impacto:**
- Erros de TypeScript e ESLint são **ignorados em produção**
- Bugs podem ir para produção sem detecção
- Qualidade de código comprometida

**Ação Imediata:**
```typescript
// next.config.ts - CORRIGIR AGORA
typescript: {
  ignoreBuildErrors: false, // ✅ Forçar correção de erros
},
eslint: {
  ignoreDuringBuilds: false, // ✅ Forçar lint
}
```

**Prazo:** IMEDIATO (antes de qualquer deploy)

---

### 🔴 **CRÍTICO 2: Compatibilidade React + Next.js**

**Problema Detectado:**
- Next.js 15.3.3 + React 18.3.1
- Next 15 foi projetado para React 19 (ou RC)
- Pode causar problemas com Server Components e Server Actions

**Sintomas Possíveis:**
- Warnings de hydration
- Server Actions inconsistentes
- Problemas com `'use server'` e `'use client'`

**Ação Recomendada:**

**Opção A - Estabilidade (Recomendado):**
```bash
# Downgrade para Next.js 14 (mais estável)
npm install next@14.2.18
```

**Opção B - Modernidade (Mais arriscado):**
```bash
# Upgrade para React 19
npm install react@19 react-dom@19
# Testar TUDO após upgrade
```

**Prazo:** Curto prazo (1-2 dias de testes)

---

### 🟡 **IMPORTANTE 3: Scripts Não Cross-Platform**

**Problema:**
```json
"build": "NODE_ENV=production next build"
```

**Impacto:**
- Quebra em Windows
- CI/CD pode falhar

**Solução:**
```bash
npm install -D cross-env
```

```json
// package.json
"build": "cross-env NODE_ENV=production next build",
"dev:webpack": "next dev -p 9002"
```

**Prazo:** Curto prazo

---

### 🟡 **IMPORTANTE 4: patch-package Não Configurado**

**Problema:**
- `patch-package` está instalado mas não roda automaticamente

**Solução:**
```json
// package.json
"scripts": {
  "postinstall": "patch-package"
}
```

**Prazo:** Curto prazo

---

### 🟡 **IMPORTANTE 5: ESLint Não Explícito**

**Problema:**
- `eslint-config-prettier` presente
- Mas `eslint` não está em devDependencies
- Pode quebrar em CI

**Solução:**
```bash
npm install -D eslint
```

**Prazo:** Curto prazo

---

## 📋 Plano de Ação Priorizado

### 🔥 **FASE 1: Correções Críticas (HOJE)**

**Tempo estimado:** 2-3 horas

1. **Remover `ignoreBuildErrors` e `ignoreDuringBuilds`**
   ```bash
   # Editar next.config.ts
   # Rodar build para ver erros reais
   npm run build
   ```

2. **Corrigir erros de TypeScript revelados**
   ```bash
   npm run typecheck
   # Corrigir todos os erros
   ```

3. **Adicionar ESLint explicitamente**
   ```bash
   npm install -D eslint
   npm run lint
   ```

---

### ⚡ **FASE 2: Estabilização (1-2 DIAS)**

**Tempo estimado:** 1 dia

1. **Decidir estratégia React/Next**
   - [ ] Testar compatibilidade atual
   - [ ] Escolher: Next 14 ou React 19
   - [ ] Executar migração
   - [ ] Testar todas as rotas

2. **Tornar build cross-platform**
   ```bash
   npm install -D cross-env
   # Atualizar scripts
   ```

3. **Configurar patch-package**
   ```json
   "postinstall": "patch-package"
   ```

4. **Adicionar script de fallback**
   ```json
   "dev:webpack": "next dev -p 9002"
   ```

---

### 🚀 **FASE 3: Qualidade e Governança (1 SEMANA)**

**Tempo estimado:** 3-5 dias

1. **Adicionar Testes**
   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom
   npm install -D @playwright/test
   ```

2. **Configurar Pre-commit Hooks**
   ```bash
   npm install -D husky lint-staged
   npx husky init
   ```

   ```json
   // package.json
   "lint-staged": {
     "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
     "*.{json,md}": ["prettier --write"]
   }
   ```

3. **Adicionar Commitlint**
   ```bash
   npm install -D @commitlint/cli @commitlint/config-conventional
   ```

4. **Bundle Analysis**
   ```bash
   npm install -D @next/bundle-analyzer
   ```

---

## 🎯 Verificações Específicas Necessárias

### Firebase Integration

**Verificar:**
1. Firebase é importado apenas em `'use client'` components?
2. Existe separação `firebase/client.ts` vs `firebase/admin.ts`?
3. Bundle size do Firebase está otimizado?

**Ação:**
```bash
# Verificar imports
grep -r "import.*firebase" src/
```

---

### Genkit AI

**Verificar:**
1. Variável `GOOGLE_GENAI_API_KEY` está configurada?
2. Flows estão funcionando corretamente?

**Ação:**
```bash
# Criar .env.local se não existe
echo "GOOGLE_GENAI_API_KEY=your_key_here" > .env.local

# Testar Genkit
npm run genkit:dev
```

---

## 📊 Métricas de Sucesso

### Antes das Correções
- ❌ Build ignora erros
- ❌ TypeScript não validado
- ❌ ESLint não validado
- ⚠️ Compatibilidade React/Next incerta
- ⚠️ Sem testes automatizados

### Depois das Correções
- ✅ Build falha em erros (segurança)
- ✅ TypeScript 100% validado
- ✅ ESLint 100% validado
- ✅ Compatibilidade garantida
- ✅ Testes básicos implementados
- ✅ Pre-commit hooks ativos

---

## 🔍 Pontos de Atenção Contínua

### 1. **Radix UI Updates**
- Muitos pacotes Radix separados
- Atualizar sempre em bloco
- Verificar pacotes não usados

### 2. **Firebase Bundle Size**
- Monitorar tamanho do bundle
- Usar imports específicos
- Evitar importar no server

### 3. **Turbopack Stability**
- Turbopack ainda é experimental
- Ter fallback para Webpack
- Monitorar discrepâncias dev/build

---

## 📝 Checklist de Implementação

### Fase 1 - Crítico (Hoje)
- [ ] Remover `ignoreBuildErrors` do next.config.ts
- [ ] Remover `ignoreDuringBuilds` do next.config.ts
- [ ] Rodar `npm run build` e documentar erros
- [ ] Corrigir todos os erros de TypeScript
- [ ] Instalar `eslint` explicitamente
- [ ] Rodar `npm run lint` e corrigir warnings

### Fase 2 - Estabilização (1-2 dias)
- [ ] Decidir estratégia React/Next (14 ou 19)
- [ ] Executar migração escolhida
- [ ] Testar todas as rotas principais
- [ ] Instalar `cross-env`
- [ ] Atualizar script `build`
- [ ] Adicionar script `postinstall`
- [ ] Adicionar script `dev:webpack`
- [ ] Testar em Windows (se aplicável)

### Fase 3 - Qualidade (1 semana)
- [ ] Instalar Vitest
- [ ] Criar testes básicos (3-5 componentes)
- [ ] Instalar Playwright
- [ ] Criar teste E2E básico (login flow)
- [ ] Configurar Husky
- [ ] Configurar lint-staged
- [ ] Configurar commitlint
- [ ] Adicionar bundle analyzer
- [ ] Documentar processo de contribuição

---

## 🚀 Próximos Passos Imediatos

1. **AGORA:** Corrigir next.config.ts
2. **HOJE:** Completar Fase 1
3. **Esta Semana:** Completar Fase 2
4. **Próxima Semana:** Iniciar Fase 3

---

## 📞 Recursos e Documentação

- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading)
- [React 19 Beta Docs](https://react.dev/blog/2024/04/25/react-19)
- [Vitest Getting Started](https://vitest.dev/guide/)
- [Playwright Docs](https://playwright.dev/)

---

**Última Atualização:** 2026-01-08  
**Responsável:** Equipe de Desenvolvimento  
**Status:** 🔴 Ação Imediata Necessária
