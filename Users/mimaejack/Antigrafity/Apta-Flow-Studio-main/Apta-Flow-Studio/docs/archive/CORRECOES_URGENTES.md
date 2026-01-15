# 🚀 Correções Urgentes - AptaFlow Studio (ARQUIVADO)

**Status:** ✅ Concluído - **OBSOLETO**
**Tempo:** 30 minutos  
**Última atualização:** 2026-01-08

**NOTA: Este documento foi arquivado. As correções foram implementadas e o status atual do projeto está em `docs/STATUS_ATUAL.md`.**

---

## ⚡ Correção Rápida (3 Passos)

### **Problema:** 5 erros de TypeScript impedindo o build

### **Solução:**

#### **1. Adicionar export em sectors/data.ts** (2 min)

**Arquivo:** `src/app/dashboard/(main)/clients/[contractId]/sectors/data.ts`

Adicionar no final:
`´´´typescript
export const sectors: Sector[] = []
`´´´

---

#### **2. Corrigir import de EpiDelivery** (5 min)

**Arquivo:** `src/app/dashboard/(main)/clients/[contractId]/employees/[employeeId]/page.tsx`

**Linha 48 - Substituir:**
`´´´typescript
// ❌ ANTES:
import type { EpiDelivery } from '../../epis/data'

// ✅ DEPOIS:
import type { EpiDelivery } from '@/app/dashboard/(main)/risks/page'
`´´´

---

#### **3. Corrigir import de Hazard** (5 min)

**Arquivo:** `src/app/dashboard/(main)/clients/[contractId]/pgr/history/page.tsx`

**Linha 73 - Substituir:**
`´´´typescript
// ❌ ANTES:
import type { Hazard } from '../../../risks/page'

// ✅ DEPOIS:
import type { Hazard } from '@/app/dashboard/(main)/risks/page'
`´´´
... (Restante do conteúdo original mantido para registro histórico)
