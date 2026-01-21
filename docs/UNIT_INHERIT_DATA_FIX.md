# 🔧 Correção: Herança de Dados da Empresa Principal em Unidades

## 📋 Problema Identificado

Ao marcar o checkbox "Herdar dados da empresa principal" no formulário de criação de unidade, os campos não eram preenchidos automaticamente com os dados do cliente.

**Campos que deveriam herdar mas não funcionavam**:
- ❌ Nome (Razão Social)
- ❌ CNPJ
- ❌ CNAE
- ❌ Grau de Risco
- ❌ Endereço Completo

---

## 🔍 Causa Raiz

O problema estava no uso de `defaultValue` nos inputs, que só funciona na montagem inicial do componente. Quando o checkbox era marcado/desmarcado, os campos não atualizavam porque `defaultValue` não é reativo.

### Antes (Não Funcionava)
```typescript
<Input
  defaultValue={inheritData ? client?.name : ''}
  // defaultValue não atualiza quando inheritData muda!
/>
```

---

## ✅ Solução Implementada

### 1. **Estados Controlados**

Adicionados estados para controlar os valores dos campos:

```typescript
const [unitName, setUnitName] = useState('')
const [unitCnpj, setUnitCnpj] = useState('')
const [unitCnae, setUnitCnae] = useState('')
const [unitRiskLevel, setUnitRiskLevel] = useState('')
const [unitAddress, setUnitAddress] = useState('')
```

### 2. **useEffect para Herança Automática**

Criado um `useEffect` que monitora o checkbox e preenche os campos automaticamente:

```typescript
useEffect(() => {
  if (inheritData && client && !editingUnit) {
    // Preenche com dados do cliente
    setUnitName(client.name || '')
    setUnitCnpj(client.cnpj || '')
    setUnitCnae(client.cnae || '')
    setUnitRiskLevel(client.riskLevel || '')
    setUnitAddress(client.address || '')
  } else if (!inheritData && !editingUnit) {
    // Limpa campos ao desmarcar
    setUnitName('')
    setUnitCnpj('')
    setUnitCnae('')
    setUnitRiskLevel('')
    setUnitAddress('')
  }
}, [inheritData, client, editingUnit])
```

### 3. **Inputs Controlados**

Convertidos de `defaultValue` para `value` + `onChange`:

```typescript
// Antes
<Input
  defaultValue={editingUnit?.name}
/>

// Depois
<Input
  value={unitName}
  onChange={(e) => setUnitName(e.target.value)}
/>
```

### 4. **Suporte para Edição**

Adicionado `useEffect` para popular campos ao editar unidade existente:

```typescript
useEffect(() => {
  if (!isAddDialogOpen) {
    resetFormState()
  } else if (editingUnit) {
    // Popula form ao editar
    setUnitName(editingUnit.name || '')
    setUnitCnpj(editingUnit.cnpj || '')
    setUnitCnae(editingUnit.cnae || '')
    setUnitRiskLevel(editingUnit.riskLevel || '')
    setUnitAddress(editingUnit.propertyInfo?.address || '')
  }
}, [isAddDialogOpen, editingUnit])
```

---

## 📊 Comportamento Agora

### Ao Marcar "Herdar dados da empresa principal"
```
✅ Nome → Preenchido com client.name
✅ CNPJ → Preenchido com client.cnpj
✅ CNAE → Preenchido com client.cnae
✅ Grau de Risco → Preenchido com client.riskLevel
✅ Endereço → Preenchido com client.address
```

### Ao Desmarcar
```
✅ Todos os campos são limpos
✅ Usuário pode digitar manualmente
```

### Ao Editar Unidade
```
✅ Campos preenchidos com dados da unidade
✅ Checkbox não interfere (editingUnit tem prioridade)
```

---

## 🧪 Como Testar

### 1. Criar Nova Unidade com Herança
```
1. Acesse /dashboard/clients/[contractId]/units
2. Clique em "Adicionar"
3. Marque "Herdar dados da empresa principal"
4. ✅ Campos devem preencher automaticamente:
   - Nome: "Empresa Teste Padrão LTDA"
   - CNPJ: "12.164.900/0001-09"
   - CNAE: "1921700"
   - Endereço: "Rua Teste, 123..."
5. Desmarque o checkbox
6. ✅ Campos devem limpar
7. Marque novamente
8. ✅ Campos devem preencher novamente
```

### 2. Editar Campos Herdados
```
1. Marque "Herdar dados"
2. ✅ Campos preenchidos
3. Edite o campo "Nome" manualmente
4. ✅ Deve permitir edição
5. Desmarque checkbox
6. ✅ Campos limpam (incluindo edição manual)
```

### 3. Editar Unidade Existente
```
1. Clique em "Editar" em uma unidade
2. ✅ Campos preenchidos com dados da unidade
3. Marque/desmarque checkbox
4. ✅ Não deve afetar (editingUnit tem prioridade)
```

---

## 🎯 Campos Afetados

| Campo | Estado | Herda de |
|-------|--------|----------|
| **Nome** | `unitName` | `client.name` |
| **CNPJ** | `unitCnpj` | `client.cnpj` |
| **CNAE** | `unitCnae` | `client.cnae` |
| **Grau de Risco** | `unitRiskLevel` | `client.riskLevel` |
| **Endereço** | `unitAddress` | `client.address` |

**Campos que NÃO herdam** (mantêm comportamento original):
- Descrição
- CEP, Bairro, Cidade, Estado, País
- Área Total, Área Construída
- Responsáveis (Legal, PGR, LTCAT, PCMSO)

---

## 📝 Código Modificado

### Estados Adicionados
```typescript
const [unitName, setUnitName] = useState('')
const [unitCnpj, setUnitCnpj] = useState('')
const [unitCnae, setUnitCnae] = useState('')
const [unitRiskLevel, setUnitRiskLevel] = useState('')
const [unitAddress, setUnitAddress] = useState('')
```

### useEffect para Herança
```typescript
useEffect(() => {
  if (inheritData && client && !editingUnit) {
    setUnitName(client.name || '')
    setUnitCnpj(client.cnpj || '')
    setUnitCnae(client.cnae || '')
    setUnitRiskLevel(client.riskLevel || '')
    setUnitAddress(client.address || '')
  } else if (!inheritData && !editingUnit) {
    setUnitName('')
    setUnitCnpj('')
    setUnitCnae('')
    setUnitRiskLevel('')
    setUnitAddress('')
  }
}, [inheritData, client, editingUnit])
```

### Inputs Atualizados
```typescript
<Input
  value={unitName}
  onChange={(e) => setUnitName(e.target.value)}
/>
```

---

## 🔄 Fluxo de Dados

```
┌─────────────────────────┐
│ Checkbox Marcado        │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ useEffect Detecta       │
│ inheritData = true      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Preenche Estados:       │
│ - setUnitName(...)      │
│ - setUnitCnpj(...)      │
│ - setUnitCnae(...)      │
│ - setUnitRiskLevel(...) │
│ - setUnitAddress(...)   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Inputs Atualizam        │
│ (value={unitName})      │
└─────────────────────────┘
```

---

## 📊 Antes vs Depois

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Herança ao marcar** | ❌ Não funcionava | ✅ Funciona |
| **Limpeza ao desmarcar** | ❌ Não funcionava | ✅ Funciona |
| **Edição manual** | ✅ Funcionava | ✅ Funcionava |
| **Editar unidade** | ✅ Funcionava | ✅ Funcionava |
| **Reatividade** | ❌ defaultValue estático | ✅ value controlado |

---

## 🚀 Benefícios

1. ✅ **Herança funcional** - Checkbox agora funciona como esperado
2. ✅ **UX melhorada** - Feedback imediato ao marcar/desmarcar
3. ✅ **Menos erros** - Dados preenchidos automaticamente
4. ✅ **Flexibilidade** - Pode editar campos herdados
5. ✅ **Consistência** - Comportamento previsível

---

## 🔍 Observações Técnicas

### Por que `defaultValue` não funcionou?
- `defaultValue` é usado apenas na montagem inicial do componente
- Mudanças no valor não causam re-render
- É útil para forms não-controlados, mas não para dados dinâmicos

### Por que `value` + `onChange`?
- Cria um "controlled component"
- React controla o valor do input via estado
- Mudanças no estado causam re-render automático
- Permite lógica customizada (como herança)

### Por que verificar `!editingUnit`?
- Ao editar, queremos manter os dados da unidade
- Checkbox não deve sobrescrever dados ao editar
- Evita perda de dados acidental

---

## 📁 Arquivo Modificado

**`src/app/dashboard/(main)/clients/[contractId]/units/page.tsx`**

**Mudanças**:
- ✅ 5 novos estados adicionados
- ✅ 2 useEffects criados/modificados
- ✅ 5 inputs convertidos para controlados
- ✅ resetFormState atualizado

---

**Data**: 2026-01-20  
**Status**: ✅ **Implementado e Funcionando**  
**Versão**: 1.0.0
