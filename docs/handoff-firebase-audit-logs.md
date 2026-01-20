# 🔐 Handoff para Firebase Studio: Configuração de Audit Logs

**Data:** 20 de Janeiro de 2026  
**Prioridade:** Alta  
**Módulo:** Sistema de Logs de Auditoria

---

## 📋 Contexto

Acabamos de implementar um sistema completo de **Audit Logs** no AptaFlow Studio que registra automaticamente todas as ações críticas realizadas pelos usuários (arquivamento de tickets, suspensão de membros, alteração de permissões, etc.).

A coleção `audit_logs` foi criada no Firestore e está sendo populada pelo código da aplicação. Agora precisamos **proteger essa coleção com regras de segurança adequadas**.

---

## 🎯 Objetivo

Configurar as **Firestore Security Rules** para a coleção `audit_logs` com os seguintes requisitos:

1. ✅ **Leitura**: Apenas usuários com perfil `super_admin` podem visualizar os logs
2. ✅ **Criação**: Qualquer usuário autenticado pode criar logs (via código da aplicação)
3. ✅ **Atualização**: Ninguém pode atualizar logs (imutabilidade)
4. ✅ **Exclusão**: Ninguém pode deletar logs (preservação de histórico)

---

## 🔧 Regras de Segurança Propostas

### Opção 1: Usando a coleção `roles_admin`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Coleção de Audit Logs
    match /audit_logs/{logId} {
      // Apenas super_admins podem ler os logs
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/roles_admin/$(request.auth.uid));
      
      // Qualquer usuário autenticado pode criar logs
      allow create: if request.auth != null &&
        request.resource.data.userId == request.auth.uid &&
        request.resource.data.userEmail == request.auth.token.email;
      
      // Logs são imutáveis - ninguém pode atualizar ou deletar
      allow update, delete: if false;
    }
  }
}
```

### Opção 2: Usando a coleção `staffs` com campo `perfilId`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Coleção de Audit Logs
    match /audit_logs/{logId} {
      // Apenas usuários com perfilId 'super_admin' podem ler
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/staffs/$(request.auth.uid)).data.perfilId == 'super_admin';
      
      // Qualquer usuário autenticado pode criar logs
      allow create: if request.auth != null &&
        request.resource.data.userId == request.auth.uid &&
        request.resource.data.userEmail == request.auth.token.email;
      
      // Logs são imutáveis
      allow update, delete: if false;
    }
  }
}
```

---

## 📊 Estrutura da Coleção `audit_logs`

### Campos Obrigatórios

```typescript
{
  userId: string;        // UID do Firebase Auth
  userEmail: string;     // Email do usuário
  userName?: string;     // Nome de exibição (opcional)
  action: string;        // Tipo de ação (ex: 'archive', 'suspend', 'deactivate')
  module: string;        // Módulo afetado (ex: 'tickets', 'staffs', 'clients')
  entityId: string;      // ID da entidade afetada
  entityName?: string;   // Nome da entidade (opcional)
  details?: any;         // Detalhes adicionais (JSON)
  timestamp: Timestamp;  // Timestamp do servidor
}
```

### Exemplo de Documento

```json
{
  "userId": "abc123xyz",
  "userEmail": "admin@imdoc.com.br",
  "userName": "João Silva",
  "action": "archive",
  "module": "tickets",
  "entityId": "TKT-2026-001",
  "entityName": "Problema no sistema de login",
  "details": {
    "previousStatus": "Em Progresso"
  },
  "timestamp": "2026-01-20T13:00:00.000Z"
}
```

---

## 🔍 Validações Recomendadas

### Validação de Campos (Opcional - Mais Seguro)

```javascript
match /audit_logs/{logId} {
  // Função auxiliar para validar estrutura
  function isValidAuditLog() {
    let data = request.resource.data;
    return data.keys().hasAll(['userId', 'userEmail', 'action', 'module', 'entityId', 'timestamp']) &&
           data.userId is string &&
           data.userEmail is string &&
           data.action is string &&
           data.module is string &&
           data.entityId is string &&
           data.timestamp is timestamp;
  }
  
  allow read: if request.auth != null && 
    exists(/databases/$(database)/documents/roles_admin/$(request.auth.uid));
  
  allow create: if request.auth != null &&
    isValidAuditLog() &&
    request.resource.data.userId == request.auth.uid &&
    request.resource.data.userEmail == request.auth.token.email;
  
  allow update, delete: if false;
}
```

---

## 📝 Índices Recomendados

Para otimizar as consultas na página de Audit Logs, crie os seguintes índices compostos:

### Índice 1: Ordenação por Timestamp
```
Collection: audit_logs
Fields: 
  - timestamp (Descending)
Query Scope: Collection
```

### Índice 2: Filtro por Módulo + Timestamp
```
Collection: audit_logs
Fields:
  - module (Ascending)
  - timestamp (Descending)
Query Scope: Collection
```

### Índice 3: Filtro por Ação + Timestamp
```
Collection: audit_logs
Fields:
  - action (Ascending)
  - timestamp (Descending)
Query Scope: Collection
```

### Índice 4: Busca por Usuário + Timestamp
```
Collection: audit_logs
Fields:
  - userEmail (Ascending)
  - timestamp (Descending)
Query Scope: Collection
```

---

## 🧪 Testes de Validação

### Teste 1: Super Admin pode ler logs
```javascript
// Como: super_admin@imdoc.com.br
// Ação: Acessar /dashboard/audit-logs
// Resultado Esperado: ✅ Visualiza todos os logs
```

### Teste 2: Usuário comum NÃO pode ler logs
```javascript
// Como: usuario@cliente.com.br (perfil 'cliente')
// Ação: Tentar acessar /dashboard/audit-logs
// Resultado Esperado: ❌ Permissão negada
```

### Teste 3: Qualquer usuário pode criar logs (via código)
```javascript
// Como: qualquer usuário autenticado
// Ação: Arquivar um ticket (ação que gera log)
// Resultado Esperado: ✅ Log criado com sucesso
```

### Teste 4: Ninguém pode atualizar logs
```javascript
// Como: super_admin@imdoc.com.br
// Ação: Tentar editar um log existente via console
// Resultado Esperado: ❌ Permissão negada
```

### Teste 5: Ninguém pode deletar logs
```javascript
// Como: super_admin@imdoc.com.br
// Ação: Tentar deletar um log via console
// Resultado Esperado: ❌ Permissão negada
```

---

## 🚨 Considerações de Segurança

### 1. Imutabilidade
- Logs **NUNCA** devem ser editáveis ou deletáveis
- Isso garante a integridade do histórico de auditoria
- Essencial para compliance e investigações

### 2. Controle de Acesso
- Apenas super_admins devem visualizar logs
- Evita que usuários vejam ações de outros usuários
- Protege informações sensíveis

### 3. Validação de Criação
- Garante que `userId` e `userEmail` correspondem ao usuário autenticado
- Previne falsificação de logs
- Mantém rastreabilidade confiável

### 4. Retenção de Dados
- Considere implementar uma política de retenção (ex: 1 ano)
- Arquive logs antigos em Cloud Storage
- Mantenha apenas logs recentes no Firestore para performance

---

## 📦 Checklist de Implementação

- [ ] Aplicar regras de segurança para `audit_logs`
- [ ] Criar índices compostos recomendados
- [ ] Testar acesso como super_admin (deve funcionar)
- [ ] Testar acesso como usuário comum (deve falhar)
- [ ] Testar criação de logs via aplicação (deve funcionar)
- [ ] Testar tentativa de edição de logs (deve falhar)
- [ ] Testar tentativa de exclusão de logs (deve falhar)
- [ ] Verificar performance das queries com índices
- [ ] Documentar regras aplicadas
- [ ] Notificar equipe de desenvolvimento

---

## 🔗 Referências

- **Documentação da Implementação:** `docs/AUDIT_LOGS_IMPLEMENTATION.md`
- **Código do Utilitário:** `src/firebase/audit.tsx`
- **Página de Visualização:** `src/app/dashboard/(main)/audit-logs/page.tsx`
- **Firebase Security Rules:** https://firebase.google.com/docs/firestore/security/get-started

---

## 💬 Perguntas Frequentes

### Q: Por que não podemos deletar logs?
**A:** Logs de auditoria devem ser imutáveis para manter a integridade do histórico. Se houver necessidade de "remover" um log, considere adicionar um campo `archived: true` em vez de deletar.

### Q: E se precisarmos corrigir um log incorreto?
**A:** Como logs são imutáveis, a abordagem recomendada é criar um novo log de "correção" que referencia o log original e explica a correção.

### Q: Como lidar com logs muito antigos?
**A:** Implemente uma Cloud Function que periodicamente arquiva logs com mais de X meses para Cloud Storage, mantendo apenas logs recentes no Firestore.

### Q: Posso adicionar mais campos aos logs?
**A:** Sim! A interface `AuditLog` é extensível. Apenas certifique-se de atualizar as validações nas Security Rules se adicionar campos obrigatórios.

---

## ✅ Próximos Passos Após Implementação

1. **Monitoramento**: Configure alertas para falhas de permissão em `audit_logs`
2. **Backup**: Implemente backup automático da coleção
3. **Relatórios**: Crie relatórios mensais de atividade para compliance
4. **Expansão**: Adicione mais ações e módulos ao sistema de auditoria

---

**Preparado por:** Antigravity AI  
**Para:** Firebase Studio Agent  
**Status:** 🟢 Pronto para Implementação  
**Urgência:** Alta - Sistema já está gerando logs, precisa de proteção
