# ⚡ Guia Rápido de Automação

## 🚀 Commit e Push Rápido

```bash
# Método 1: Via npm (recomendado)
npm run commit "feat: adiciona nova funcionalidade"

# Método 2: Via script direto
./scripts/commit-and-push.sh "feat: adiciona nova funcionalidade"
```

## 📦 Deploy

### Staging
```bash
npm run deploy:staging
```

### Produção
```bash
npm run deploy:production
```

## 🤖 Deploy Automático (GitHub Actions)

Basta fazer push para `main` ou `dev`:

```bash
git push origin dev      # Deploy automático para staging
git push origin main     # Deploy automático para produção
```

## 📋 Checklist Diário

```bash
# 1. Desenvolva
# ... faça suas alterações ...

# 2. Valide
npm run validate

# 3. Commit e push
npm run commit "feat: sua mensagem aqui"

# 4. Aguarde deploy automático
# Acesse: https://github.com/seu-usuario/Apta-Flow-Studio/actions
```

## 🔗 URLs

- **Staging:** https://studio-9804515494-e1a53--dev.web.app
- **Produção:** https://studio-9804515494-e1a53.web.app
- **GitHub Actions:** https://github.com/seu-usuario/Apta-Flow-Studio/actions

## 📚 Documentação Completa

Veja `docs/AUTOMATION.md` para detalhes completos.
