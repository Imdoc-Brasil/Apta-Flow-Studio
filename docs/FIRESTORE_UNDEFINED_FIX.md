# 🔧 Correção: Erro de Undefined no Firestore

## 📋 Problema Identificado

```
FirebaseError: Function addDoc() called with invalid data. 
Unsupported field value: undefined (found in field cno in document 
clients/CTR-2025-002/units/NMnMZkCJzE4Zq4GTsWad)
```

### Causa
O Firestore **não aceita valores `undefined`** em documentos. Quando criávamos uma unidade do tipo "Unidade" (não "Obra"), o campo `cno` era definido como `undefined`, causando erro ao salvar.

```typescript
// ❌ Problema
cno: unitType === 'Obra' ? (formData.get('cno') as string) : undefined
contractingCompany: unitType === 'Contrato' ? {...} : undefined
```

---

## ✅ Solução Implementada

### Função Helper para Remover `undefined`

Criamos uma função recursiva que remove todos os campos `undefined` e `null` antes de salvar no Firestore:

```typescript
const removeUndefined = (obj: any): any => {
  const cleaned: any = {}
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined && obj[key] !== null) {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        // Recursivo para objetos aninhados
        const nested = removeUndefined(obj[key])
        if (Object.keys(nested).length > 0) {
          cleaned[key] = nested
        }
      } else {
        cleaned[key] = obj[key]
      }
    }
  })
  return cleaned
}
```

### Aplicação Antes de Salvar

```typescript
// Criar objeto com possíveis undefined
const newUnitData: Omit<Unit, 'id'> = {
  name: formData.get('name') as string,
  type: unitType,
  cno: unitType === 'Obra' ? (formData.get('cno') as string) : undefined,
  contractingCompany: unitType === 'Contrato' ? {...} : undefined,
  // ... outros campos
}

// Limpar antes de salvar
const cleanedData = removeUndefined(newUnitData)

// Salvar dados limpos
addDocumentNonBlocking(unitsRef, cleanedData)
```

---

## 📊 Exemplo de Transformação

### Antes da Limpeza
```json
{
  "name": "Unidade Teste",
  "type": "Unidade",
  "cnpj": "12.164.900/0001-09",
  "cno": undefined,                    // ❌ Firestore rejeita
  "contractingCompany": undefined,     // ❌ Firestore rejeita
  "propertyInfo": {
    "address": "Rua Teste, 123",
    "zipCode": "",                     // String vazia OK
    "city": ""
  }
}
```

### Depois da Limpeza
```json
{
  "name": "Unidade Teste",
  "type": "Unidade",
  "cnpj": "12.164.900/0001-09",
  // cno removido ✅
  // contractingCompany removido ✅
  "propertyInfo": {
    "address": "Rua Teste, 123",
    "zipCode": "",                     // Mantido (string vazia é válida)
    "city": ""
  }
}
```

---

## 🎯 Campos Afetados

### Campos Condicionais que Podem ser Undefined

| Campo | Quando é undefined | Solução |
|-------|-------------------|---------|
| **cno** | Quando type !== 'Obra' | Removido antes de salvar |
| **contractingCompany** | Quando type !== 'Contrato' | Removido antes de salvar |

### Campos que Permanecem (mesmo vazios)

| Campo | Tipo | Comportamento |
|-------|------|---------------|
| **name** | string | Sempre presente (required) |
| **description** | string | Pode ser string vazia |
| **cnpj** | string | Pode ser string vazia |
| **propertyInfo.*** | string | Podem ser strings vazias |

---

## 🧪 Como Testar

### 1. Criar Unidade (tipo "Unidade")
```
1. Acesse /dashboard/clients/[contractId]/units
2. Clique em "Adicionar"
3. Selecione tipo: "Unidade"
4. Preencha Nome e Endereço
5. Clique em "Salvar"
6. ✅ Deve salvar sem erro
7. Verifique console: "New unit data (cleaned)"
8. ✅ Não deve ter campos "cno" ou "contractingCompany"
```

### 2. Criar Obra (tipo "Obra")
```
1. Selecione tipo: "Obra"
2. Preencha campo CNO
3. Clique em "Salvar"
4. ✅ Deve salvar com campo "cno"
5. ✅ Não deve ter "contractingCompany"
```

### 3. Criar Contrato (tipo "Contrato")
```
1. Selecione tipo: "Contrato"
2. Preencha dados da contratante
3. Clique em "Salvar"
4. ✅ Deve salvar com "contractingCompany"
5. ✅ Não deve ter "cno"
```

---

## 🔍 Validação no Console

### Log Antes da Limpeza
```javascript
Form data: {
  name: "Unidade Teste",
  type: "Unidade",
  address: "Rua Teste, 123"
}
```

### Log Depois da Limpeza
```javascript
New unit data (cleaned): {
  name: "Unidade Teste",
  type: "Unidade",
  description: "",
  cnpj: "12.164.900/0001-09",
  // cno: REMOVIDO ✅
  // contractingCompany: REMOVIDO ✅
  propertyInfo: {
    address: "Rua Teste, 123",
    zipCode: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "",
    totalArea: "",
    builtArea: ""
  },
  cnae: "1921700",
  riskLevel: "",
  legalResponsible: "",
  pgrResponsible: "",
  ltcatResponsible: "",
  pcmsoResponsible: "",
  status: "Ativa"
}
```

---

## 📝 Regras do Firestore

### ✅ Valores Aceitos
- `string` (incluindo vazias: `""`)
- `number`
- `boolean`
- `object` (sem undefined)
- `array`
- `null` (mas removemos por segurança)
- `Timestamp`
- `GeoPoint`

### ❌ Valores Rejeitados
- `undefined` ← **Nosso problema**
- `NaN`
- `Infinity`
- Funções
- Símbolos

---

## 🔄 Fluxo de Dados

```
┌─────────────────────────┐
│ Formulário Submetido    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Criar newUnitData       │
│ (pode ter undefined)    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ removeUndefined()       │
│ - Remove undefined      │
│ - Remove null           │
│ - Recursivo p/ objetos  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ cleanedData             │
│ (sem undefined)         │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Salvar no Firestore     │
│ ✅ Sucesso!             │
└─────────────────────────┘
```

---

## 🚀 Benefícios

1. ✅ **Sem erros de validação** - Firestore aceita os dados
2. ✅ **Dados limpos** - Apenas campos relevantes salvos
3. ✅ **Flexível** - Funciona para qualquer tipo de unidade
4. ✅ **Recursivo** - Limpa objetos aninhados (propertyInfo, contractingCompany)
5. ✅ **Reutilizável** - Função helper pode ser usada em outros lugares

---

## 📊 Antes vs Depois

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Salvar Unidade** | ❌ Erro de undefined | ✅ Sucesso |
| **Salvar Obra** | ❌ Erro de undefined | ✅ Sucesso |
| **Salvar Contrato** | ❌ Erro de undefined | ✅ Sucesso |
| **Dados no Firestore** | ❌ Com undefined | ✅ Apenas campos válidos |
| **Tamanho do documento** | Maior (campos vazios) | Menor (só necessários) |

---

## 🔧 Melhorias Futuras

### Curto Prazo
- [ ] Extrair `removeUndefined` para um utilitário compartilhado
- [ ] Adicionar testes unitários para a função
- [ ] Aplicar em outros formulários (clientes, setores, etc.)

### Médio Prazo
- [ ] Criar tipo TypeScript genérico para dados limpos
- [ ] Validação de schema antes de salvar
- [ ] Logging de campos removidos para debug

### Longo Prazo
- [ ] Biblioteca de validação customizada
- [ ] Middleware para limpeza automática
- [ ] Testes E2E para validação de dados

---

## 📁 Arquivo Modificado

**`src/app/dashboard/(main)/clients/[contractId]/units/page.tsx`**

**Mudanças**:
- ✅ Função `removeUndefined` adicionada
- ✅ Aplicação de limpeza antes de salvar
- ✅ Log de dados limpos para debug
- ✅ Funciona para create e update

---

## 💡 Lições Aprendidas

### Por que Firestore não aceita undefined?
- **Consistência**: Diferença entre "campo não existe" e "campo é undefined"
- **Serialização**: undefined não existe em JSON
- **Performance**: Campos undefined ocupam espaço desnecessário
- **Queries**: Dificulta consultas e índices

### Alternativas Consideradas

1. **Não enviar campos opcionais** ❌
   - Difícil manter sincronizado com tipo TypeScript
   - Código verboso e repetitivo

2. **Usar null em vez de undefined** ❌
   - Ainda ocupa espaço no documento
   - Não é semântico (null = "valor nulo", não "campo ausente")

3. **Limpar undefined antes de salvar** ✅
   - Mantém tipos TypeScript corretos
   - Código limpo e reutilizável
   - Documentos otimizados

---

**Data**: 2026-01-20  
**Status**: ✅ **Corrigido e Testado**  
**Versão**: 1.0.0
