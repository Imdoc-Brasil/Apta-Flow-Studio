# 🤖 Automação de Commits e Deploys

Este documento descreve o sistema de automação de commits e deploys do AptaFlow Studio.

## 📋 Visão Geral

O projeto possui **2 formas de deploy**:

1. **Deploy Automático** via GitHub Actions (recomendado)
2. **Deploy Manual** via scripts locais (backup/emergência)

---

## 🚀 Deploy Automático (GitHub Actions)

### Como Funciona

Quando você faz push para as branches `main` ou `dev`, o GitHub Actions automaticamente:

1. ✅ Executa `npm run validate` (typecheck + lint + build)
2. ✅ Faz deploy para Firebase App Hosting
3. ✅ Publica no canal correto:
   - `main` → Canal **live** (produção)
   - `dev` → Canal **dev** (staging)

### Configuração Necessária

#### 1. Criar Service Account no Firebase

```bash
# No Firebase Console:
1. Vá para Project Settings > Service Accounts
2. Clique em "Generate New Private Key"
3. Salve o arquivo JSON
```

#### 2. Adicionar Secret no GitHub

```bash
# No repositório GitHub:
1. Vá para Settings > Secrets and variables > Actions
2. Clique em "New repository secret"
3. Nome: FIREBASE_SERVICE_ACCOUNT
4. Valor: Cole o conteúdo completo do arquivo JSON
5. Clique em "Add secret"
```

#### 3. Workflow Já Configurado

O arquivo `.github/workflows/firebase-deploy.yml` já está pronto e será executado automaticamente.

### Usando o Deploy Automático

```bash
# 1. Faça suas alterações
git add .
git commit -m "feat: nova funcionalidade"

# 2. Push para a branch desejada
git push origin dev      # Deploy para staging
# ou
git push origin main     # Deploy para produção

# 3. Acompanhe o deploy
# Acesse: https://github.com/seu-usuario/Apta-Flow-Studio/actions
```

---

## 🛠️ Scripts de Automação Local

### Script 1: Commit e Push Automatizado

**Arquivo:** `scripts/commit-and-push.sh`

**Uso:**
```bash
./scripts/commit-and-push.sh "mensagem do commit"
```

**O que faz:**
1. Verifica se há mudanças
2. Adiciona todos os arquivos (`git add .`)
3. Cria commit com a mensagem fornecida
4. Faz push para a branch atual
5. Informa se deploy automático será iniciado

**Exemplos:**
```bash
# Commit simples
./scripts/commit-and-push.sh "fix: corrige bug no login"

# Commit de feature
./scripts/commit-and-push.sh "feat: adiciona sistema de audit logs"

# Commit de documentação
./scripts/commit-and-push.sh "docs: atualiza README"
```

### Script 2: Deploy Manual

**Arquivo:** `scripts/deploy.sh`

**Uso:**
```bash
./scripts/deploy.sh [staging|production]
```

**O que faz:**
1. Verifica a branch atual
2. Valida que não há mudanças não commitadas
3. Executa `npm run validate`
4. Pede confirmação
5. Faz deploy para o ambiente escolhido

**Exemplos:**
```bash
# Deploy para staging
./scripts/deploy.sh staging

# Deploy para produção
./scripts/deploy.sh production
```

**Regras de Segurança:**
- ✅ Staging pode ser feito de qualquer branch (recomendado: `dev`)
- ✅ Produção **só** pode ser feito da branch `main`
- ✅ Não permite deploy com mudanças não commitadas
- ✅ Executa validações antes do deploy

---

## 📊 Fluxo de Trabalho Recomendado

### Desenvolvimento Diário

```bash
# 1. Trabalhe normalmente
# ... faça suas alterações ...

# 2. Commit e push (dispara deploy automático)
./scripts/commit-and-push.sh "feat: implementa nova funcionalidade"

# 3. Aguarde deploy automático
# GitHub Actions fará o deploy automaticamente
# Acesse: https://github.com/seu-usuario/Apta-Flow-Studio/actions
```

### Deploy para Staging (Testes)

```bash
# Opção 1: Automático (recomendado)
git checkout dev
./scripts/commit-and-push.sh "feat: nova funcionalidade para testes"
# Deploy automático para staging

# Opção 2: Manual
git checkout dev
./scripts/deploy.sh staging
```

### Deploy para Produção

```bash
# 1. Merge dev → main
git checkout main
git merge dev

# 2. Push (dispara deploy automático)
git push origin main

# Ou manual:
./scripts/deploy.sh production
```

---

## 🔐 Segurança e Boas Práticas

### ✅ Sempre Fazer

1. **Validar antes de commit:**
   ```bash
   npm run validate
   ```

2. **Usar mensagens de commit descritivas:**
   ```bash
   # ❌ Ruim
   git commit -m "fix"
   
   # ✅ Bom
   git commit -m "fix: corrige validação de CNPJ no formulário de cliente"
   ```

3. **Testar em staging antes de produção:**
   ```bash
   # Sempre testar em dev primeiro
   git checkout dev
   ./scripts/commit-and-push.sh "feat: nova funcionalidade"
   # Teste em staging
   # Só depois merge para main
   ```

### ❌ Nunca Fazer

1. **Não fazer deploy com erros de validação**
2. **Não fazer push direto para main sem testar**
3. **Não fazer deploy manual sem confirmar a branch**
4. **Não commitar arquivos sensíveis (.env, secrets)**

---

## 🎯 Convenções de Commit

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Features
feat: adiciona sistema de audit logs
feat(tickets): implementa filtro por status

# Correções
fix: corrige bug no login
fix(cnpj): valida formato correto

# Documentação
docs: atualiza README
docs(api): adiciona exemplos de uso

# Refatoração
refactor: simplifica lógica de autenticação
refactor(ui): melhora componente de card

# Testes
test: adiciona testes para audit logs

# Build/CI
build: atualiza dependências
ci: configura GitHub Actions
```

---

## 📍 URLs dos Ambientes

### Staging (Canal dev)
```
https://studio-9804515494-e1a53--dev.web.app
```

### Produção (Canal live)
```
https://studio-9804515494-e1a53.web.app
```

---

## 🐛 Troubleshooting

### Problema: GitHub Actions falha

**Solução:**
1. Verifique se o secret `FIREBASE_SERVICE_ACCOUNT` está configurado
2. Verifique se `npm run validate` passa localmente
3. Veja os logs em: https://github.com/seu-usuario/Apta-Flow-Studio/actions

### Problema: Deploy manual falha

**Solução:**
```bash
# 1. Verifique se está logado no Firebase
firebase login

# 2. Verifique o projeto
firebase projects:list

# 3. Tente novamente
./scripts/deploy.sh staging
```

### Problema: Script não tem permissão

**Solução:**
```bash
chmod +x scripts/commit-and-push.sh
chmod +x scripts/deploy.sh
```

---

## 📚 Referências

- **Deploy Policy:** `docs/deploy-policy.md`
- **Smoke Tests:** `docs/smoke-tests.md`
- **GitHub Actions:** `.github/workflows/firebase-deploy.yml`
- **Firebase Console:** https://console.firebase.google.com/project/studio-9804515494-e1a53

---

## ✅ Checklist de Setup Inicial

- [ ] Criar Service Account no Firebase
- [ ] Adicionar `FIREBASE_SERVICE_ACCOUNT` no GitHub Secrets
- [ ] Testar deploy automático (push para dev)
- [ ] Verificar que staging está acessível
- [ ] Testar scripts locais
- [ ] Documentar URLs dos ambientes

---

**Última Atualização:** 20 de Janeiro de 2026  
**Versão:** 1.0.0
