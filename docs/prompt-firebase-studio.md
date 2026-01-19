# 🚀 Prompt para Firebase Studio - Implementação Firestore (Clientes)

**Copie e cole este prompt completo para o Firebase Studio:**

---

Olá, Firebase Studio!

O Antigravity concluiu a validação da integração Firestore no módulo de Tickets. Aqui está o status:

## ✅ STATUS ATUAL

**Módulo de Tickets:**
- ✅ Integração Firestore **APROVADA PARA PRODUÇÃO**
- ✅ Todos os testes de persistência passaram (6/6)
- ✅ Sincronização em tempo real funcionando
- ✅ Drag-and-drop persistente
- ✅ Nenhuma regressão detectada

**Bugs Corrigidos pelo Antigravity:**
- ✅ Re-exports faltando em `tickets-store.ts` (commit `39989a0`)
- ✅ Import `DialogTrigger` faltando em `ticket-details-dialog.tsx` (commit `39989a0`)

## 🎯 PRÓXIMA MISSÃO

**Implementar Persistência Firestore no Módulo de CLIENTES**

**Por quê Clientes?**
1. ✅ Collection `clients` já existe no Firestore
2. ✅ Auto-fill de CNPJ já implementado (busca ReceitaWS)
3. ✅ Tickets dependem de dados de clientes
4. ✅ Maior valor para o produto (dados reais vs mocks)

**Estimativa:** 4-6 horas

## 📚 DOCUMENTAÇÃO DISPONÍVEL

Leia ANTES de começar:

1. **`docs/handoff-firestore-clientes.md`** ⭐ **PRINCIPAL**
   - Guia passo a passo completo (8 passos)
   - Exemplos de código
   - Checklist de implementação
   - Testes obrigatórios
   - Critérios de sucesso

2. **`docs/qa-firestore-tickets-2026-01-19.md`**
   - Relatório de QA do módulo Tickets
   - Análise técnica da implementação
   - Padrões de sucesso

3. **`docs/resumo-qa-2026-01-19.md`**
   - Resumo executivo da sessão

## 🏗️ ARQUITETURA (Padrão de Sucesso)

Siga o mesmo padrão usado em Tickets:

```typescript
// 1. Configurar hooks Firestore
const firestore = useFirestore()
const clientsRef = useMemoFirebase(
  () => (firestore ? collection(firestore, 'clients') : null),
  [firestore]
)

// 2. Leitura em tempo real
const { data: clientsData, isLoading } = useCollection<Client>(clientsRef)

// 3. Sincronizar com estado local
useEffect(() => {
  if (clientsData) {
    setClients(clientsData)
  }
}, [clientsData])

// 4. Criar cliente
const handleAddClient = (formData) => {
  if (!clientsRef) return
  
  const newClient: Omit<Client, 'id'> = {
    name: formData.get('name'),
    cnpj: formData.get('cnpj'),
    // ... outros campos
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  addDocumentNonBlocking(clientsRef, newClient)
}

// 5. Atualizar cliente
const handleUpdateClient = (clientId, data) => {
  if (!firestore) return
  
  const clientDocRef = doc(firestore, 'clients', clientId)
  updateDocumentNonBlocking(clientDocRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  })
}
```

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### **Fase 1: Setup (30 min)**
- [ ] Adicionar imports do Firebase em `clients/page.tsx`
- [ ] Configurar hooks `useFirestore`, `useMemoFirebase`, `useCollection`
- [ ] Adicionar estado local e `useEffect` para sincronização
- [ ] Adicionar loading state com `<Loader2>`

### **Fase 2: CRUD (2-3 horas)**
- [ ] Modificar `handleAddClient` para usar `addDocumentNonBlocking`
- [ ] Modificar `handleUpdateClient` para usar `updateDocumentNonBlocking`
- [ ] Atualizar tipo `Client` com `createdAt` e `updatedAt`
- [ ] Comentar (não deletar) dados mockados

### **Fase 3: Integração CNPJ (1 hora)**
- [ ] Garantir que auto-fill CNPJ funciona com Firestore
- [ ] Adicionar validação de CNPJ duplicado (opcional)
- [ ] Testar busca e criação de cliente

### **Fase 4: Testes (1-2 horas)**
- [ ] Testar criação de cliente
- [ ] Testar atualização de cliente
- [ ] Testar auto-fill CNPJ
- [ ] Testar reload da página (persistência)
- [ ] Verificar sincronização com módulo Tickets

### **Fase 5: Refinamento (30 min)**
- [ ] Adicionar error handling
- [ ] Adicionar toasts de sucesso/erro
- [ ] Validar TypeScript: `npm run typecheck`
- [ ] Validar build: `npm run build`

## 🧪 TESTES OBRIGATÓRIOS

Execute TODOS estes testes antes de chamar o Antigravity:

### **Teste 1: Criar Cliente**
1. Clique em "Adicionar Cliente"
2. Preencha CNPJ: `00.000.000/0001-91`
3. Aguarde auto-fill
4. Preencha campos restantes
5. Salve
6. ✅ Verifique se cliente aparece na lista
7. ✅ Verifique no Firestore Console se documento foi criado

### **Teste 2: Persistência**
1. Recarregue a página (F5)
2. ✅ Verifique se cliente criado ainda aparece
3. ✅ Verifique se dados estão corretos

### **Teste 3: Integração com Tickets**
1. Vá para "Tickets"
2. Clique em "Novo Ticket"
3. Abra dropdown de "Cliente"
4. ✅ Verifique se cliente criado aparece na lista

### **Teste 4: Atualização**
1. Edite um cliente existente
2. Modifique algum campo
3. Salve
4. ✅ Verifique se mudança foi persistida
5. Recarregue a página
6. ✅ Verifique se mudança permanece

## ⚠️ ARMADILHAS COMUNS

Evite estes erros:

1. **Esquecer de Re-exportar Tipos**
   ```typescript
   // Se criar clients-store.ts
   import type { Client } from './data'
   export type { Client } // ← Re-exportar!
   ```

2. **Não Validar Referências**
   ```typescript
   if (!firestore || !clientsRef) return
   ```

3. **Esquecer Timestamps**
   ```typescript
   createdAt: new Date().toISOString(),
   updatedAt: new Date().toISOString(),
   ```

4. **Não Remover ID ao Criar**
   ```typescript
   // ❌ ERRADO
   const newClient: Client = { id: 'CLI-123', ... }
   
   // ✅ CORRETO
   const newClient: Omit<Client, 'id'> = { ... }
   ```

## 📚 ARQUIVOS DE REFERÊNCIA

Use como exemplo:

```bash
# Ver implementação completa de Firestore
src/app/dashboard/(main)/tickets/page.tsx

# Ver tipos e estrutura de dados
src/app/dashboard/(main)/tickets/data.ts

# Ver store simplificado
src/app/dashboard/(main)/tickets/tickets-store.ts
```

## ✅ CRITÉRIOS DE SUCESSO

A implementação será aprovada quando:

- [ ] ✅ Clientes são criados e salvos no Firestore
- [ ] ✅ Clientes são carregados em tempo real do Firestore
- [ ] ✅ Reload da página mantém todos os dados
- [ ] ✅ Auto-fill de CNPJ funciona e salva no Firestore
- [ ] ✅ Clientes aparecem no dropdown de "Novo Ticket"
- [ ] ✅ `npm run typecheck` passa sem erros
- [ ] ✅ `npm run build` compila com sucesso
- [ ] ✅ Nenhuma regressão em outras funcionalidades

## 🚀 QUANDO CONCLUIR

Após implementação e testes:

1. Commit suas mudanças
2. Push para o repositório
3. Chame o Antigravity para validação:

```
Olá, Antigravity!

Concluí a implementação de persistência Firestore no módulo de Clientes.

Resumo das Implementações:
- ✅ Configurados hooks Firestore (useCollection, useMemoFirebase)
- ✅ Implementado CREATE (addDocumentNonBlocking)
- ✅ Implementado UPDATE (updateDocumentNonBlocking)
- ✅ Integrado auto-fill CNPJ com Firestore
- ✅ Adicionados timestamps (createdAt, updatedAt)
- ✅ Todos os testes obrigatórios executados

Status dos Testes:
- [ ] Teste 1 (Criar Cliente): PASS/FAIL
- [ ] Teste 2 (Persistência): PASS/FAIL
- [ ] Teste 3 (Integração Tickets): PASS/FAIL
- [ ] Teste 4 (Atualização): PASS/FAIL

Commits:
- [hash] - descrição

Pronto para validação de QA!
```

## 📞 SUPORTE

Se encontrar problemas:

1. **TypeScript Errors:** Verifique re-exports em `data.ts`
2. **Firestore não conecta:** Verifique `.env.local` e Firebase config
3. **Dados não aparecem:** Verifique Firestore Console e regras de segurança
4. **Performance lenta:** Verifique se está usando `useMemoFirebase`

**Leia a documentação completa em:** `docs/handoff-firestore-clientes.md`

---

**Boa sorte! Estou aguardando sua implementação para validação.** 🚀

**Antigravity (QA Agent)**
