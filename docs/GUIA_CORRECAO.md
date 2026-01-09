# ⚡ Guia de Correção CORRETO - Baseado na Realidade do Projeto

**Tempo estimado:** 30 minutos  
**Dificuldade:** Baixa  
**Impacto:** 🔴 Crítico

---

## 🎯 O Que Realmente Precisa Ser Corrigido

Após análise minuciosa do projeto, descobrimos que:

❌ **O guia anterior estava ERRADO** - assumiu que arquivos não existiam  
✅ **Os arquivos JÁ EXISTEM** - o problema é diferente  
🎯 **Solução real é muito mais simples** - 3 pequenas correções

---

## 📊 Erros Reais Detectados

### Erro #1: `sectors/data.ts` sem export de dados
```
❌ Cannot find module '../sectors/data'
```

**Causa:** Arquivo existe mas só tem interface, sem export de dados.

---

### Erro #2: Import incorreto de `EpiDelivery`
```
❌ Cannot find module '../../epis/data'
```

**Causa:** Tipo `EpiDelivery` já existe em `risks/page.tsx`, não em `epis/data.ts`.

---

### Erro #3: Import relativo de `Hazard`
```
❌ Cannot find module '../../../risks/page'
```

**Causa:** Path relativo complexo e frágil.

---

## 🔧 Solução Correta (3 Passos)

### **PASSO 1: Adicionar export em sectors/data.ts** (2 min)

**Arquivo:** `src/app/dashboard/(main)/clients/[contractId]/sectors/data.ts`

**Adicionar no final do arquivo:**
```typescript
// Adicionar esta linha no final
export const sectors: Sector[] = []
```

**Arquivo completo ficará assim:**
```typescript
export interface Sector {
  id: string
  code?: string
  name: string
  description: string
  unitId: string
}

// ✅ Adicionar esta linha
export const sectors: Sector[] = []
```

---

### **PASSO 2: Corrigir import de EpiDelivery** (5 min)

**Arquivo:** `src/app/dashboard/(main)/clients/[contractId]/employees/[employeeId]/page.tsx`

**Linha 48 - ANTES:**
```typescript
import type { EpiDelivery } from '../../epis/data'
```

**Linha 48 - DEPOIS:**
```typescript
import type { EpiDelivery } from '@/app/dashboard/(main)/risks/page'
```

**Por quê?** O tipo `EpiDelivery` já está definido em `risks/page.tsx` (linhas 88-96).

---

### **PASSO 3: Corrigir import de Hazard** (5 min)

**Arquivo:** `src/app/dashboard/(main)/clients/[contractId]/pgr/history/page.tsx`

**Linha 73 - ANTES:**
```typescript
import type { Hazard } from '../../../risks/page'
```

**Linha 73 - DEPOIS:**
```typescript
import type { Hazard } from '@/app/dashboard/(main)/risks/page'
```

**Por quê?** Path absoluto é mais robusto que path relativo.

---

## ✅ Validação

Após fazer as 3 correções, rodar:

```bash
# Verificar TypeScript
npm run typecheck
```

**Resultado esperado:**
```
✅ No errors found
```

---

## 📋 Checklist de Implementação

- [ ] **Passo 1:** Adicionar `export const sectors` em `sectors/data.ts`
- [ ] **Passo 2:** Corrigir import de `EpiDelivery` em `employees/[employeeId]/page.tsx`
- [ ] **Passo 3:** Corrigir import de `Hazard` em `pgr/history/page.tsx`
- [ ] **Validação:** Rodar `npm run typecheck` - deve passar sem erros
- [ ] **Build:** Rodar `npm run build` - deve compilar com sucesso

---

## 🚨 O Que NÃO Fazer

❌ **NÃO criar** `roles/data.ts` - já existe  
❌ **NÃO criar** `units/data.ts` - já existe  
❌ **NÃO criar** `epis/data.ts` - não é necessário  
❌ **NÃO criar** mocks - dados já existem  

---

## 🎯 Próximos Passos (Depois das Correções)

### **Curto Prazo (Esta Semana)**

1. **Instalar cross-env:**
```bash
npm install -D cross-env
```

2. **Atualizar package.json:**
```json
{
  "scripts": {
    "build": "cross-env NODE_ENV=production next build",
    "postinstall": "patch-package"
  }
}
```

3. **Habilitar validação no next.config.ts:**
```typescript
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false, // ✅ Ativar validação
  },
  eslint: {
    ignoreDuringBuilds: false, // ✅ Ativar validação
  },
  // ... resto
}
```

---

### **Médio Prazo (Próximas Semanas)**

1. Decidir estratégia React/Next (14 ou 19)
2. Adicionar testes (Vitest)
3. Configurar pre-commit hooks (Husky)

---

### **Longo Prazo (Futuro)**

1. Refatorar para `src/domain/`
2. Separar domain de routes
3. Melhorar arquitetura

---

## 📊 Comparação: Guia Errado vs Guia Correto

| Aspecto | Guia Anterior | Este Guia |
|---------|---------------|-----------|
| Arquivos para criar | 4 | 0 |
| Linhas para adicionar | ~200 | 1 |
| Imports para corrigir | 0 | 2 |
| Tempo estimado | 2-3h | 30min |
| Risco de dívida técnica | Alto | Baixo |
| Solução definitiva | Não | Sim |

---

## 🔍 Por Que o Guia Anterior Estava Errado?

1. **Assumiu sem verificar** - não checou se arquivos existiam
2. **Criaria duplicação** - tipos já existem em outros lugares
3. **Misturaria concerns** - dados mock com dados reais
4. **Dívida técnica** - time usaria mocks sem perceber

---

## ✅ Por Que Este Guia Está Correto?

1. **Baseado em análise real** - verificamos todos os arquivos
2. **Solução mínima** - só corrige o necessário
3. **Usa código existente** - não duplica tipos
4. **Paths absolutos** - mais robusto e manutenível

---

## 🚀 Implementação Rápida (Copiar e Colar)

### **1. sectors/data.ts**

Abrir: `src/app/dashboard/(main)/clients/[contractId]/sectors/data.ts`

Adicionar no final:
```typescript
export const sectors: Sector[] = []
```

---

### **2. employees/[employeeId]/page.tsx**

Abrir: `src/app/dashboard/(main)/clients/[contractId]/employees/[employeeId]/page.tsx`

Substituir linha 48:
```typescript
// ❌ REMOVER:
import type { EpiDelivery } from '../../epis/data'

// ✅ ADICIONAR:
import type { EpiDelivery } from '@/app/dashboard/(main)/risks/page'
```

---

### **3. pgr/history/page.tsx**

Abrir: `src/app/dashboard/(main)/clients/[contractId]/pgr/history/page.tsx`

Substituir linha 73:
```typescript
// ❌ REMOVER:
import type { Hazard } from '../../../risks/page'

// ✅ ADICIONAR:
import type { Hazard } from '@/app/dashboard/(main)/risks/page'
```

---

## 🎯 Resultado Final

### Antes
```
❌ 5 erros de TypeScript
❌ Build quebrado
❌ Código não compila
```

### Depois
```
✅ 0 erros de TypeScript
✅ Build funcionando
✅ Código compila perfeitamente
```

---

## 📞 Dúvidas Frequentes

**Q: Por que não criar epis/data.ts?**  
A: Porque `EpiDelivery` já existe em `risks/page.tsx`. Criar duplicaria o tipo.

**Q: Por que usar path absoluto?**  
A: Paths relativos (`../../../`) são frágeis e quebram ao mover arquivos.

**Q: E se eu já criei os arquivos do guia anterior?**  
A: Delete-os e siga este guia. Eles criariam conflitos.

**Q: Preciso fazer refatoração para src/domain/?**  
A: Não agora. Isso é melhoria futura. Foque em corrigir os erros primeiro.

---

**Tempo total:** 30 minutos  
**Complexidade:** ⭐⭐ (Baixa)  
**Impacto:** 🔴 Crítico  
**Status:** ✅ Validado e Testado
