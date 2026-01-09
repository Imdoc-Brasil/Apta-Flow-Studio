# 🚀 Correções Urgentes - AptaFlow Studio

**Status:** 🔴 Ação Imediata Necessária  
**Tempo:** 30 minutos  
**Última atualização:** 2026-01-08

---

## ⚡ Correção Rápida (3 Passos)

### **Problema:** 5 erros de TypeScript impedindo o build

### **Solução:**

#### **1. Adicionar export em sectors/data.ts** (2 min)

**Arquivo:** `src/app/dashboard/(main)/clients/[contractId]/sectors/data.ts`

Adicionar no final:
```typescript
export const sectors: Sector[] = []
```

---

#### **2. Corrigir import de EpiDelivery** (5 min)

**Arquivo:** `src/app/dashboard/(main)/clients/[contractId]/employees/[employeeId]/page.tsx`

**Linha 48 - Substituir:**
```typescript
// ❌ ANTES:
import type { EpiDelivery } from '../../epis/data'

// ✅ DEPOIS:
import type { EpiDelivery } from '@/app/dashboard/(main)/risks/page'
```

---

#### **3. Corrigir import de Hazard** (5 min)

**Arquivo:** `src/app/dashboard/(main)/clients/[contractId]/pgr/history/page.tsx`

**Linha 73 - Substituir:**
```typescript
// ❌ ANTES:
import type { Hazard } from '../../../risks/page'

// ✅ DEPOIS:
import type { Hazard } from '@/app/dashboard/(main)/risks/page'
```

---

## ✅ Validação

```bash
npm run typecheck
# ✅ Deve passar sem erros
```

---

## 📚 Documentação Completa

Para detalhes completos, veja:
- **[GUIA_CORRECAO.md](./GUIA_CORRECAO.md)** - Guia detalhado
- **[ANALISE_TECNICA.md](./ANALISE_TECNICA.md)** - Análise técnica
- **[../README.md](../README.md)** - Documentação do projeto

---

## 🔄 Próximos Passos (Depois das Correções)

### Esta Semana
1. Instalar `cross-env`: `npm install -D cross-env`
2. Adicionar em package.json: `"postinstall": "patch-package"`
3. Remover `ignoreBuildErrors` do `next.config.ts`

### Futuro
1. Refatorar para `src/domain/`
2. Adicionar testes
3. Configurar CI/CD

---

**Tempo total:** 30 minutos  
**Impacto:** 🔴 Crítico
