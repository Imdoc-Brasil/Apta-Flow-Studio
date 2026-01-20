# Sistema de Logs de Auditoria (Audit Trail)

## 📋 Resumo da Implementação

Este documento descreve a implementação completa do sistema de **Audit Logs** no AptaFlow Studio, que registra automaticamente todas as ações críticas realizadas pelos usuários no sistema.

## 🎯 Objetivo

Criar um sistema de rastreabilidade que permite aos administradores:
- Saber **quem** realizou uma ação
- Saber **o quê** foi feito
- Saber **quando** foi feito
- Ter **detalhes** sobre a mudança (estado anterior/novo)

## 🏗️ Arquitetura

### 1. Utilitário de Audit (`/src/firebase/audit.tsx`)

**Interface AuditLog:**
```typescript
interface AuditLog {
  id?: string;
  userId: string;
  userEmail: string;
  userName?: string;
  action: string;
  module: string;
  entityId: string;
  entityName?: string;
  details?: any;
  timestamp: any;
}
```

**Função Principal:**
- `createAuditLog()`: Cria um registro de auditoria na coleção `audit_logs` do Firestore
- Operação **non-blocking** (não trava a UI)
- Timestamp automático via `serverTimestamp()`

### 2. Integração nos Módulos

#### ✅ Tickets
**Locais:**
- `src/app/dashboard/(main)/tickets/page.tsx`
- `src/components/ticket-details-dialog.tsx`

**Ações Registradas:**
- `archive`: Quando um ticket é arquivado
- Registra: status anterior, ID do ticket, assunto

#### ✅ Equipe (Staffs)
**Local:**
- `src/app/dashboard/(main)/employees/page.tsx`

**Ações Registradas:**
- `suspend`: Quando um membro é suspenso
- `change_status`: Quando o status de um membro é alterado
- Registra: status anterior, novo status, nome do membro

#### ✅ Clientes
**Local:**
- `src/app/dashboard/(main)/clients/page.tsx`

**Ações Registradas:**
- `deactivate`: Quando um cliente é desativado
- Registra: status anterior, nome do cliente

#### ✅ Perfis (Permissões)
**Local:**
- `src/app/dashboard/(main)/profiles/page.tsx`

**Ações Registradas:**
- `update_permissions`: Quando as permissões de um perfil são alteradas
- Registra: permissões anteriores, novas permissões

#### ✅ Processos
**Local:**
- `src/app/dashboard/(main)/clients/[contractId]/processes/page.tsx`

**Ações Registradas:**
- `archive`: Quando um processo é arquivado
- `restore`: Quando um processo é restaurado
- Registra: status anterior, ID do contrato, nome do processo

### 3. Página de Visualização

**Rota:** `/dashboard/audit-logs`
**Arquivo:** `src/app/dashboard/(main)/audit-logs/page.tsx`

**Funcionalidades:**
- ✅ Listagem dos últimos 100 logs (ordenados por data decrescente)
- ✅ **Busca** por usuário ou entidade
- ✅ **Filtro por Módulo** (Tickets, Equipe, Clientes, Perfis, Processos)
- ✅ **Filtro por Ação** (Arquivar, Suspender, Desativar, etc.)
- ✅ Exibição de:
  - Data/Hora formatada (pt-BR)
  - Usuário (nome + email)
  - Ação com ícone visual
  - Módulo (badge)
  - Entidade afetada
  - Detalhes da mudança (JSON)

**Design:**
- Interface limpa e profissional
- Ícones contextuais para cada tipo de ação
- Badges para categorização visual
- Responsivo e otimizado

### 4. Navegação

**Adicionado ao Menu Principal:**
- Ícone: `ShieldAlert`
- Label: "Logs de Auditoria"
- Posição: Após "Perfis" no menu lateral

## 🔐 Segurança e Permissões

### Firestore Rules Recomendadas

```javascript
// Coleção audit_logs
match /audit_logs/{logId} {
  // Apenas super_admins podem ler
  allow read: if request.auth != null && 
    exists(/databases/$(database)/documents/roles_admin/$(request.auth.uid));
  
  // Qualquer usuário autenticado pode criar (via código)
  allow create: if request.auth != null;
  
  // Ninguém pode atualizar ou deletar logs
  allow update, delete: if false;
}
```

## 📊 Estrutura de Dados no Firestore

**Coleção:** `audit_logs`

**Exemplo de Documento:**
```json
{
  "userId": "abc123",
  "userEmail": "admin@example.com",
  "userName": "João Silva",
  "action": "archive",
  "module": "tickets",
  "entityId": "TKT-001",
  "entityName": "Problema no sistema de login",
  "details": {
    "previousStatus": "Em Progresso"
  },
  "timestamp": "2026-01-20T13:00:00.000Z"
}
```

## 🎨 Tipos de Ações Suportadas

| Ação | Descrição | Módulos |
|------|-----------|---------|
| `archive` | Arquivar item | Tickets, Processos |
| `restore` | Restaurar item arquivado | Processos |
| `suspend` | Suspender membro | Equipe |
| `change_status` | Alterar status | Equipe |
| `deactivate` | Desativar | Clientes |
| `update_permissions` | Atualizar permissões | Perfis |

## 🚀 Próximos Passos Sugeridos

### Curto Prazo
1. ✅ **Implementado**: Sistema básico de audit logs
2. 🔄 **Pendente**: Adicionar mais ações (criar, editar, deletar)
3. 🔄 **Pendente**: Exportação de logs (CSV/PDF)

### Médio Prazo
1. Filtro por período de tempo
2. Paginação (atualmente limitado a 100 registros)
3. Visualização detalhada (modal com diff de mudanças)
4. Gráficos de atividade por usuário/módulo

### Longo Prazo
1. Alertas automáticos para ações suspeitas
2. Integração com sistema de notificações
3. Retenção de logs com arquivamento automático
4. Dashboard de compliance e auditoria

## 📝 Notas Técnicas

### Performance
- Operações **non-blocking** não impactam a UX
- Índice composto recomendado: `timestamp DESC`
- Limite de 100 registros para evitar sobrecarga

### Manutenção
- Logs são **imutáveis** (não podem ser editados/deletados)
- Considerar política de retenção (ex: 1 ano)
- Backup regular da coleção `audit_logs`

### Extensibilidade
- Interface `AuditLog` pode ser estendida
- Fácil adicionar novos módulos/ações
- Sistema modular e desacoplado

## ✅ Checklist de Implementação

- [x] Criar utilitário `createAuditLog`
- [x] Integrar em Tickets
- [x] Integrar em Equipe
- [x] Integrar em Clientes
- [x] Integrar em Perfis
- [x] Integrar em Processos
- [x] Criar página de visualização
- [x] Adicionar ao menu de navegação
- [x] Implementar filtros e busca
- [x] Formatação de datas (pt-BR)
- [x] Ícones contextuais
- [ ] Configurar Firestore Rules
- [ ] Testes de integração
- [ ] Documentação para usuários finais

## 🎓 Como Usar

### Para Desenvolvedores

```typescript
import { createAuditLog } from '@/firebase';

// Em qualquer função que realize uma ação crítica:
createAuditLog(firestore, {
  userId: user?.uid || '',
  userEmail: user?.email || '',
  userName: user?.displayName || '',
  action: 'archive',
  module: 'tickets',
  entityId: ticket.id,
  entityName: ticket.subject,
  details: { previousStatus: ticket.status }
});
```

### Para Administradores

1. Acesse **Dashboard > Logs de Auditoria**
2. Use os filtros para encontrar ações específicas
3. Revise o histórico de mudanças
4. Exporte relatórios (quando implementado)

---

**Data de Implementação:** 20 de Janeiro de 2026  
**Versão:** 1.0.0  
**Status:** ✅ Implementado e Funcional
