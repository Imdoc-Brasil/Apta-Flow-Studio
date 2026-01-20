# 🚀 Quick Deploy Guide - AptaFlow Studio

## Deploy Automático via GitHub Actions

### ✅ Pré-requisitos
- [x] Código commitado no GitHub
- [x] Secrets configurados (FIREBASE_SERVICE_ACCOUNT, GOOGLE_GENAI_API_KEY)
- [x] Build local validado

### 📦 Deploy para Produção

```bash
# 1. Certifique-se de estar na branch main
git checkout main

# 2. Faça suas alterações e commit
git add .
git commit -m "feat: sua mensagem aqui"

# 3. Push para disparar deploy automático
git push origin main

# 4. Acompanhe em:
# https://github.com/Imdoc-Brasil/Apta-Flow-Studio/actions
```

**Tempo de deploy**: ~3-5 minutos  
**Canal**: Live (Produção)

---

### 🧪 Deploy para Desenvolvimento

```bash
# 1. Mude para branch dev
git checkout dev

# 2. Merge ou cherry-pick suas alterações
git merge main
# OU
git cherry-pick <commit-hash>

# 3. Push para disparar deploy
git push origin dev
```

**Canal**: Dev (Preview)

---

## 🔧 Deploy Manual (Emergência)

```bash
# 1. Instalar Firebase CLI (se necessário)
npm install -g firebase-tools

# 2. Login no Firebase
firebase login

# 3. Build local
npm run build

# 4. Deploy
firebase deploy --only hosting

# 5. Deploy para canal específico
firebase hosting:channel:deploy preview-name
```

---

## 📊 Verificar Status

### Via GitHub Actions
```bash
# Abrir no navegador
open https://github.com/Imdoc-Brasil/Apta-Flow-Studio/actions
```

### Via Firebase Console
```bash
# Abrir no navegador
open https://console.firebase.google.com/project/studio-9804515494-e1a53/apphosting
```

### Via CLI
```bash
# Listar deploys recentes
firebase hosting:channel:list

# Ver logs
firebase functions:log --only hosting
```

---

## 🐛 Troubleshooting Rápido

### Build Falhando?
```bash
# Testar build local
npm run build

# Limpar cache e reinstalar
rm -rf node_modules .next
npm ci
npm run build
```

### Erro de Permissão?
1. Verificar secrets no GitHub
2. Regenerar FIREBASE_SERVICE_ACCOUNT
3. Ver: `docs/FIREBASE_PERMISSION_FIX.md`

### Deploy Lento?
- Verificar tamanho do bundle
- Otimizar imagens
- Implementar code splitting

---

## 🔄 Rollback Rápido

### Via Firebase Console
1. App Hosting → Rollouts
2. Selecionar versão anterior
3. Clicar em "Rollback"

### Via CLI
```bash
firebase hosting:clone SOURCE:live TARGET:live --only hosting
```

---

## 📝 Checklist Pré-Deploy

- [ ] `npm run build` passou sem erros
- [ ] `npm run lint` sem warnings
- [ ] Testes manuais realizados
- [ ] Changelog atualizado
- [ ] Equipe notificada

---

## 📚 Documentação Completa

- **Guia Completo**: `docs/DEPLOY_GUIDE.md`
- **Correções**: `docs/DEPLOY_FIXES.md`
- **Validação**: `docs/BUILD_VALIDATION.md`

---

**Projeto**: AptaFlow Studio  
**Deploy**: Firebase App Hosting  
**CI/CD**: GitHub Actions  
**Status**: ✅ Produção
