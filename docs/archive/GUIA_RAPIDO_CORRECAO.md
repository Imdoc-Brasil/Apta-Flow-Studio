# ⚡ Guia Rápido de Correção - AptaFlow Studio

**Tempo estimado:** 2-3 horas  
**Dificuldade:** Média  
**Impacto:** 🔴 Crítico

---

## 🎯 Objetivo

Corrigir os **5 erros de TypeScript** detectados e habilitar validação de código para evitar bugs em produção.

---

## 📝 Passo a Passo

### PASSO 1: Criar Arquivos de Dados Faltantes (20 min)

#### 1.1 Criar estrutura de pastas

```bash
cd /Users/mimaejack/Antigrafity/Apta-Flow-Studio-main/Apta-Flow-Studio

# Criar pastas necessárias
mkdir -p src/app/dashboard/\(main\)/clients/\[contractId\]/roles
mkdir -p src/app/dashboard/\(main\)/clients/\[contractId\]/sectors
mkdir -p src/app/dashboard/\(main\)/clients/\[contractId\)/units
mkdir -p src/app/dashboard/\(main\)/clients/\[contractId\]/epis
```

#### 1.2 Criar arquivo `roles/data.ts`

Criar: `src/app/dashboard/(main)/clients/[contractId]/roles/data.ts`

```typescript
/**
 * Roles (Cargos) - Definições e dados
 */

export interface Role {
  id: string
  name: string
  description?: string
  department?: string
  level?: 'junior' | 'pleno' | 'senior' | 'coordenador' | 'gerente'
  createdAt?: Date
  updatedAt?: Date
}

// Mock data - substituir por dados reais do Firestore
export const roles: Role[] = [
  {
    id: '1',
    name: 'Analista de Segurança',
    description: 'Responsável por análises de segurança do trabalho',
    department: 'Segurança',
    level: 'pleno',
  },
  {
    id: '2',
    name: 'Técnico em Enfermagem',
    description: 'Atendimento e cuidados de saúde ocupacional',
    department: 'Saúde',
    level: 'pleno',
  },
]

// Função helper para buscar role por ID
export function getRoleById(id: string): Role | undefined {
  return roles.find((role) => role.id === id)
}

// Função helper para buscar roles por departamento
export function getRolesByDepartment(department: string): Role[] {
  return roles.filter((role) => role.department === department)
}
```

#### 1.3 Criar arquivo `sectors/data.ts`

Criar: `src/app/dashboard/(main)/clients/[contractId]/sectors/data.ts`

```typescript
/**
 * Sectors (Setores) - Definições e dados
 */

export interface Sector {
  id: string
  name: string
  description?: string
  unitId?: string
  riskLevel?: 'baixo' | 'medio' | 'alto'
  employeeCount?: number
  createdAt?: Date
  updatedAt?: Date
}

// Mock data - substituir por dados reais do Firestore
export const sectors: Sector[] = [
  {
    id: '1',
    name: 'Produção',
    description: 'Setor de produção industrial',
    riskLevel: 'alto',
    employeeCount: 50,
  },
  {
    id: '2',
    name: 'Administrativo',
    description: 'Setor administrativo e escritório',
    riskLevel: 'baixo',
    employeeCount: 20,
  },
  {
    id: '3',
    name: 'Manutenção',
    description: 'Setor de manutenção de equipamentos',
    riskLevel: 'medio',
    employeeCount: 15,
  },
]

// Função helper para buscar sector por ID
export function getSectorById(id: string): Sector | undefined {
  return sectors.find((sector) => sector.id === id)
}

// Função helper para buscar sectors por nível de risco
export function getSectorsByRiskLevel(
  riskLevel: 'baixo' | 'medio' | 'alto'
): Sector[] {
  return sectors.filter((sector) => sector.riskLevel === riskLevel)
}
```

#### 1.4 Criar arquivo `units/data.ts`

Criar: `src/app/dashboard/(main)/clients/[contractId]/units/data.ts`

```typescript
/**
 * Units (Unidades) - Definições e dados
 */

export interface Unit {
  id: string
  name: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  clientId?: string
  employeeCount?: number
  active?: boolean
  createdAt?: Date
  updatedAt?: Date
}

// Mock data - substituir por dados reais do Firestore
export const units: Unit[] = [
  {
    id: '1',
    name: 'Unidade São Paulo - Centro',
    address: 'Av. Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
    employeeCount: 150,
    active: true,
  },
  {
    id: '2',
    name: 'Unidade Rio de Janeiro',
    address: 'Av. Rio Branco, 500',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zipCode: '20040-001',
    employeeCount: 80,
    active: true,
  },
]

// Função helper para buscar unit por ID
export function getUnitById(id: string): Unit | undefined {
  return units.find((unit) => unit.id === id)
}

// Função helper para buscar units ativas
export function getActiveUnits(): Unit[] {
  return units.filter((unit) => unit.active === true)
}

// Função helper para buscar units por estado
export function getUnitsByState(state: string): Unit[] {
  return units.filter((unit) => unit.state === state)
}
```

#### 1.5 Criar arquivo `epis/data.ts`

Criar: `src/app/dashboard/(main)/clients/[contractId]/epis/data.ts`

```typescript
/**
 * EPI Deliveries (Entregas de EPI) - Definições e dados
 */

export interface EpiDelivery {
  id: string
  employeeId: string
  epiId: string
  epiName: string
  ca: string // Certificado de Aprovação
  quantity: number
  deliveryDate: Date
  expirationDate?: Date
  status: 'entregue' | 'vencido' | 'pendente'
  signature?: string
  observations?: string
  createdAt?: Date
  updatedAt?: Date
}

// Mock data - substituir por dados reais do Firestore
export const epiDeliveries: EpiDelivery[] = [
  {
    id: '1',
    employeeId: 'emp-001',
    epiId: 'epi-001',
    epiName: 'Capacete de Segurança',
    ca: '12345',
    quantity: 1,
    deliveryDate: new Date('2024-01-15'),
    expirationDate: new Date('2025-01-15'),
    status: 'entregue',
  },
  {
    id: '2',
    employeeId: 'emp-001',
    epiId: 'epi-002',
    epiName: 'Luvas de Proteção',
    ca: '67890',
    quantity: 2,
    deliveryDate: new Date('2024-02-01'),
    expirationDate: new Date('2024-08-01'),
    status: 'vencido',
  },
]

// Função helper para buscar deliveries por employee
export function getDeliveriesByEmployee(employeeId: string): EpiDelivery[] {
  return epiDeliveries.filter((delivery) => delivery.employeeId === employeeId)
}

// Função helper para buscar deliveries vencidas
export function getExpiredDeliveries(): EpiDelivery[] {
  const now = new Date()
  return epiDeliveries.filter(
    (delivery) =>
      delivery.expirationDate && delivery.expirationDate < now
  )
}

// Função helper para buscar deliveries por status
export function getDeliveriesByStatus(
  status: 'entregue' | 'vencido' | 'pendente'
): EpiDelivery[] {
  return epiDeliveries.filter((delivery) => delivery.status === status)
}
```

---

### PASSO 2: Validar TypeScript (5 min)

```bash
# Rodar typecheck para verificar se os erros foram corrigidos
npm run typecheck
```

**Resultado esperado:** ✅ Sem erros

---

### PASSO 3: Habilitar Validação no Build (10 min)

#### 3.1 Editar `next.config.ts`

Abrir: `next.config.ts`

**ANTES:**
```typescript
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,  // ❌ REMOVER
  },
  eslint: {
    ignoreDuringBuilds: true, // ❌ REMOVER
  },
  // ...
}
```

**DEPOIS:**
```typescript
const nextConfig: NextConfig = {
  // ✅ Remover as linhas de ignore
  // Ou deixar explícito:
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // ...
}
```

---

### PASSO 4: Testar Build (10 min)

```bash
# Rodar build para garantir que tudo está funcionando
npm run build
```

**Resultado esperado:** ✅ Build completo sem erros

---

### PASSO 5: Melhorias Adicionais (30 min - Opcional)

#### 5.1 Instalar cross-env

```bash
npm install -D cross-env
```

#### 5.2 Atualizar scripts no `package.json`

```json
{
  "scripts": {
    "dev": "next dev --turbopack -p 9002",
    "dev:webpack": "next dev -p 9002",
    "build": "cross-env NODE_ENV=production next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "postinstall": "patch-package"
  }
}
```

#### 5.3 Criar `.env.local` (se não existe)

```bash
# Criar arquivo .env.local
cat > .env.local << 'EOF'
# Google AI API Key (para Genkit)
GOOGLE_GENAI_API_KEY=your_api_key_here

# Ambiente
NODE_ENV=development
EOF
```

---

## ✅ Checklist de Validação

Após completar todos os passos, verificar:

- [ ] `npm run typecheck` - ✅ Sem erros
- [ ] `npm run lint` - ✅ Sem erros críticos
- [ ] `npm run build` - ✅ Build completo
- [ ] `npm run dev` - ✅ App rodando
- [ ] Testar rota: `/dashboard/clients/[id]/employees/[id]` - ✅ Sem erros
- [ ] Testar rota: `/dashboard/clients/[id]/pgr/history` - ✅ Sem erros

---

## 🎯 Resultado Final

### Antes
```
❌ 5 erros de TypeScript
❌ Build ignora erros
⚠️ Código pode quebrar em produção
```

### Depois
```
✅ 0 erros de TypeScript
✅ Build valida código
✅ Código seguro para produção
```

---

## 📞 Próximos Passos

Após completar este guia:

1. ✅ Commit das mudanças
2. ✅ Push para repositório
3. ✅ Fazer novo deploy
4. 📋 Revisar [PLANO_ACAO_TECNICA.md](./PLANO_ACAO_TECNICA.md) para próximas melhorias

---

## 🆘 Problemas?

Se encontrar problemas:

1. Verificar se todas as pastas foram criadas corretamente
2. Verificar se os imports nos arquivos estão corretos
3. Rodar `npm install` novamente
4. Limpar cache: `rm -rf .next && npm run dev`

---

**Tempo total estimado:** 2-3 horas  
**Dificuldade:** ⭐⭐⭐ (Média)  
**Impacto:** 🔴 Crítico para produção
