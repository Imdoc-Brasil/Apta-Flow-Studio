# Release Notes — Template (Solo)

Copie este arquivo para um novo documento a cada release.
Exemplo de nome: docs/releases/2026-01-09-v0.1.1.md

## 📌 Informações Gerais

**Data:** YYYY-MM-DD

**Versão:** vX.Y.Z

**Branch:** main

**Commit / Tag:** <hash ou tag>

**Autor:** <seu nome ou “solo”>

**Status:** ☐ Em andamento ☐ Staging aprovado ☐ Deploy em produção ☐ Finalizado

## 🎯 Objetivo do Release

Descreva rapidamente o propósito dessa versão (1–2 frases).

Exemplo:

Ajustes de UX no fluxo de tickets, correções de permissões Firestore e melhoria na performance da tela de serviços.

## ✅ Mudanças Incluídas
### ✨ Features

 - feat: …

 - feat: …

### 🐛 Fixes

 - fix: …

 - fix: …

### 🔁 Refactors

 - refactor: …

 - refactor: …

### 🧹 Chores / Infra

 - chore: …

 - chore: …

### 📝 Docs

 - docs: …

### 🧩 Arquivos / Módulos Impactados (opcional)

- src/app/...

- src/services/...

- src/lib/firebase/...

- docs/...

## 🔐 Mudanças de Segurança / Regras Firestore

 - Regras Firestore alteradas? ☐ Sim ☐ Não

 - App Check alterado? ☐ Sim ☐ Não

 - Alterações em permissões/roles? ☐ Sim ☐ Não

### Resumo (se sim)

Descreva o que mudou nas regras e por quê.

## 🧪 Validações (Obrigatório)
### ✅ Validação Local

 - npm run typecheck passou

 - npm run lint passou

 - npm run build passou

 - npm run validate passou

## 🚀 Staging
### ✅ Deploy em Staging

 - Deploy realizado? ☐ Sim ☐ Não

URL Staging/Preview: <cole aqui o link>

Projeto Firebase: <nome do projeto staging>

### ✅ Smoke Tests (Antigravity)

 - Login/Logout

 - CRUD (entidade principal)

 - Regras/permissões (A não acessa B)

 - UI crítica (Dialog/Popover/Drag&Drop)

 - Console/Network limpos

Resultado dos Smoke Tests: ☐ PASS ☐ FAIL

### Observações de Staging

Erros encontrados:

…

Ajustes aplicados:

…

Link de evidências (prints/logs):

…

### ✅ Decisão de Go/No-Go

 - Aprovado para produção? ☐ Sim ☐ Não

Se NÃO:

Explique o motivo e o próximo passo.

…

## 🌍 Produção
### ✅ Deploy em Produção

 - Deploy realizado? ☐ Sim ☐ Não

URL Produção: <cole aqui o link>

Projeto Firebase: <nome do projeto prod>

### ✅ Smoke Tests Pós-deploy (rápidos)

 - Página principal abre

 - Login funciona

 - Navegação geral ok

 - Sem erros críticos no console

Resultado pós-deploy: ☐ PASS ☐ FAIL

### 📊 Monitoramento Pós-Deploy (15 minutos)

 - Sem spikes de erros

 - Sem loops de requests

 - Sem custos anormais no Firestore

 - Sem regressão de performance

Observações:

…

## 🆘 Plano de Rollback
### 🔙 Como reverter

Método principal: Rollback do Hosting (se aplicável)

Método alternativo: Reverter merge / retornar tag anterior

### ✅ Release anterior segura

Versão: vX.Y.Z

Tag: <tag>

Commit: <hash>

### Critérios de rollback

 - Vazamento de dados (rules)

 - Crash em rotas principais

 - Auth quebrado

 - Erros críticos no console

## 📌 Post-Release (tarefas futuras)

 - Criar ticket para melhoria X

 - Criar refactor Y

 - Ajustar regras Z

 - Escrever testes unitários/E2E

 - Otimização de performance

## 🏁 Resumo Final

### 📌 Status final do release:
☐ Concluído com sucesso
☐ Concluído com rollback
☐ Cancelado antes de produção

### 📌 Notas finais:

…
