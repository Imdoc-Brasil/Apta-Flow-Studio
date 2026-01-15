# 🚀 Deploy Policy (Verdade Absoluta)

Este documento define a **política oficial e definitiva de deploy** do projeto.

> **Objetivo:** garantir deploys consistentes, seguros, rastreáveis e sem risco desnecessário.
> Este projeto é solo, mas opera com padrões de equipe.

---

## ✅ Regra #1 — Quem faz deploy (autoridade máxima)

### ✅ Firebase Studio é o ÚNICO responsável por deploys
O **Firebase Studio** é o ambiente que tem autoridade para executar deploys em:

- **staging**
- **produção**
- **rollback**

📌 O Firebase Studio é o *"dono do botão de deploy"*.

---

## ❌ Regra #2 — Antigravity nunca executa deploy

O **Antigravity NÃO executa deploy**, por padrão.

Ele pode:
- testar
- validar
- aprovar
- identificar regressões
- corrigir problemas pequenos

Mas **não deve apertar o botão de deploy**, pois deploy envolve responsabilidade total sobre:

- ambiente (staging/prod)
- variáveis e secrets
- risco de indisponibilidade
- risco de vazamento de dados (Firestore no client)

---

## ✅ Por que o Firebase Studio deploya?

Deploy deve ser executado pelo Firebase Studio porque ele é responsável por:

- integração final do código
- controle da branch `dev`
- controle do fluxo `dev → main`
- configuração de staging/prod
- execução do checklist de release
- decisão final de Go/No-Go
- rollback

**Deploy é uma decisão de risco e integração, não uma tarefa mecânica.**

---

## ✅ Por que o Antigravity NÃO deploya?

O Antigravity é ótimo para automação e execução, mas não deve realizar deploy porque:

1) **Firestore está no client**
   - regras do Firestore são o "backend"
   - um deploy errado pode vazar dados

2) **Genkit e IA têm secrets server-only**
   - risco de expor chaves indevidamente
   - risco de runtime incorreto

3) **Staging e produção devem ser sempre controlados**
   - evitar deploy no projeto errado
   - evitar chaves erradas
   - evitar custos acidentais

📌 O Antigravity funciona como validação independente do deploy.

---

# 🧩 Responsabilidades por ambiente

## 🔵 Firebase Studio (Build & Deploy)
Responsabilidades:

- implementar features (mudanças grandes e criativas)
- integrar código completo
- executar `npm run validate`
- realizar deploy staging
- realizar deploy produção
- controlar merge `dev → main`
- criar tag/release no GitHub
- executar rollback se necessário

---

## 🟣 Antigravity (QA & Approval)
Responsabilidades:

- executar smoke tests em staging (browser-first)
- validar fluxos críticos (Auth + Firestore)
- validar UI crítica (Radix, DnD, etc.)
- registrar PASS/FAIL
- fornecer evidências (prints/logs)
- sugerir fixes e refactors mecânicos

📌 Antigravity é o **responsável pela aprovação técnica do deploy**, mas não por executá-lo.

---

# ✅ Regras obrigatórias antes de qualquer deploy

## ✅ Checklist mínimo obrigatório (Gate de deploy)
Antes do Firebase Studio deployar, obrigatoriamente:

1) `git checkout dev && git pull`
2) `npm install`
3) `npm run validate`

✅ Somente se tudo passar o deploy pode seguir.

---

# 🌿 Processo oficial: Staging → Produção

## ✅ Etapa 1: Deploy Staging (Firebase Studio)
O Firebase Studio deve:

1) Garantir build e validações ok:
   - `npm run validate`

2) Executar deploy para staging
3) Anotar o URL de staging
4) Informar o Antigravity que staging está pronto para testes

---

## ✅ Etapa 2: Smoke Tests Staging (Antigravity)
O Antigravity deve executar o roteiro de:
- `docs/smoke-tests.md`

Resultado obrigatório:
- ✅ PASS → pode ir para produção
- ❌ FAIL → bloqueia produção

📌 Sem PASS em staging, não existe deploy em produção.

---

## ✅ Etapa 3: Go/No-Go (decisão final)
A decisão segue esta regra:

- Antigravity aprovou staging (PASS) ✅
- Firebase Studio valida integração ✅
- Release Notes atualizado ✅

➡️ Então o deploy em produção é autorizado.

---

## ✅ Etapa 4: Deploy Produção (Firebase Studio)
O Firebase Studio deve:

1) Garantir que `main` está pronta (merge final)
2) Deploy para produção
3) Smoke test rápido pós-deploy
4) Monitoramento de 15 minutos

---

# 🔙 Rollback Policy (obrigatório existir)

Se ocorrer qualquer um desses casos:

- vazamento de dados ou permissão incorreta
- crash em rotas principais
- falha crítica de Auth
- loops de erro no console/network
- deploy em projeto errado

➡️ Rollback deve ser iniciado imediatamente pelo Firebase Studio.

📌 Rollback é responsabilidade exclusiva do Firebase Studio.

---

# ✅ Diagrama Oficial do Fluxo (ASCII)

```
┌──────────────────────────┐
│   Firebase Studio        │
│ (dev principal / build)  │
└─────────────┬────────────┘
              │
              │ npm run validate ✅
              ▼
┌──────────────────────────┐
│  Deploy STAGING (Studio) │
│  - ambiente controlado   │
└─────────────┬────────────┘
              │ URL staging
              ▼
┌──────────────────────────┐
│      Antigravity         │
│   Smoke Tests + QA       │
│ (docs/smoke-tests.md)    │
└─────────────┬────────────┘
              │
   PASS ✅    │    FAIL ❌
              │
              ▼
┌──────────────────────────┐
│   Go/No-Go Decision      │
│ PASS obrigatório p/ prod │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│ Deploy PRODUÇÃO (Studio) │
│ + pós-deploy + monitor   │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│  Release finalizado ✅   │
│   Tag / GitHub Release   │
└──────────────────────────┘
```

---

# ✅ Regras finais (não negociáveis)

1) **Somente Firebase Studio executa deploy**
2) **Somente Antigravity aprova staging com smoke tests**
3) **Sem PASS em staging = sem deploy em produção**
4) **Sem `npm run validate` = sem deploy**
5) **Rollback é obrigatório existir e pertence ao Firebase Studio**
