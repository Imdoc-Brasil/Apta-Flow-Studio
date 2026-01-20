# 🚀 Deploy via Firebase App Hosting - Configuração Oficial

## ✅ Status: Deploy Bem-Sucedido

**Data de Implementação**: 2026-01-20  
**Método de Deploy**: Firebase App Hosting  
**Ambiente**: Produção (Live) e Desenvolvimento (Dev)

---

## 📋 Visão Geral

O **AptaFlow Studio** utiliza o **Firebase App Hosting** como plataforma oficial de deploy, com integração automática via GitHub Actions.

### Por que Firebase App Hosting?

- ✅ **Integração Nativa com Next.js** - Suporte completo para SSR e API Routes
- ✅ **Deploy Automático** - CI/CD integrado com GitHub
- ✅ **Preview Channels** - Ambientes de staging/dev automáticos
- ✅ **Escalabilidade** - Auto-scaling gerenciado pelo Firebase
- ✅ **CDN Global** - Distribuição de conteúdo otimizada
- ✅ **Rollback Fácil** - Versões anteriores disponíveis instantaneamente

---

## 🏗️ Arquitetura de Deploy

```
┌─────────────────┐
│  GitHub Push    │
│  (main/dev)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Actions  │
│  - Build        │
│  - Test         │
│  - Deploy       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Firebase App    │
│    Hosting      │
│                 │
│ ┌─────────────┐ │
│ │ Live (main) │ │
│ └─────────────┘ │
│ ┌─────────────┐ │
│ │  Dev (dev)  │ │
│ └─────────────┘ │
└─────────────────┘
```

---

## ⚙️ Configuração Atual

### 1. Firebase Configuration (`firebase.json`)

```json
{
  "hosting": {
    "source": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "frameworksBackend": {
      "region": "us-central1"
    }
  }
}
```

**Características**:
- **Source**: Raiz do projeto (Next.js detectado automaticamente)
- **Region**: `us-central1` (otimizado para latência global)
- **Framework**: Next.js 15.3.3 com suporte a SSR

### 2. GitHub Actions Workflow

**Arquivo**: `.github/workflows/firebase-deploy.yml`

**Triggers**:
- Push para branch `main` → Deploy para **Live**
- Push para branch `dev` → Deploy para **Dev**
- Manual via `workflow_dispatch`

**Steps**:
1. ✅ Checkout do código
2. ✅ Setup Node.js 20
3. ✅ Instalação de dependências (`npm ci`)
4. ✅ Deploy via `FirebaseExtended/action-hosting-deploy@v0`

**Variáveis de Ambiente**:
- `FIREBASE_CLI_EXPERIMENTS=webframeworks` - Habilita suporte a frameworks
- `GOOGLE_GENAI_API_KEY` - API key para Genkit AI

### 3. Next.js Configuration

**Arquivo**: `next.config.ts`

```typescript
{
  output: 'standalone',
  reactStrictMode: true,
  env: {
    GOOGLE_GENAI_API_KEY: process.env.GOOGLE_GENAI_API_KEY || '',
  }
}
```

**Otimizações**:
- **Standalone Output**: Build otimizado para deploy serverless
- **React Strict Mode**: Validações adicionais em desenvolvimento
- **Environment Variables**: Expostas para runtime

---

## 🔐 Secrets Configurados

### GitHub Secrets (Required)

| Secret Name | Descrição | Onde Obter |
|-------------|-----------|------------|
| `GITHUB_TOKEN` | Token automático do GitHub | Fornecido automaticamente |
| `FIREBASE_SERVICE_ACCOUNT` | Credenciais da Service Account | Firebase Console → Project Settings → Service Accounts |
| `GOOGLE_GENAI_API_KEY` | API Key do Google AI Studio | https://aistudio.google.com/app/apikey |

### Como Atualizar Secrets

1. Acesse: https://github.com/Imdoc-Brasil/Apta-Flow-Studio/settings/secrets/actions
2. Clique em **Update** no secret desejado
3. Cole o novo valor
4. Salve

---

## 🌐 URLs de Deploy

### Produção (Live)
- **Branch**: `main`
- **URL**: Gerada automaticamente pelo Firebase App Hosting
- **Acesso**: Via Firebase Console → App Hosting

### Desenvolvimento (Dev)
- **Branch**: `dev`
- **URL**: Preview channel automático
- **Acesso**: Via Firebase Console → App Hosting → Channels

---

## 📊 Processo de Deploy

### Deploy Automático (Recomendado)

```bash
# 1. Fazer alterações no código
git add .
git commit -m "feat: nova funcionalidade"

# 2. Push para main (produção)
git push origin main

# OU push para dev (desenvolvimento)
git push origin dev

# 3. Acompanhar deploy
# GitHub Actions: https://github.com/Imdoc-Brasil/Apta-Flow-Studio/actions
```

**Tempo médio de deploy**: 3-5 minutos

### Deploy Manual (Opcional)

```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Deploy manual
firebase deploy --only hosting
```

---

## 🔍 Monitoramento e Logs

### GitHub Actions
- **URL**: https://github.com/Imdoc-Brasil/Apta-Flow-Studio/actions
- **Logs**: Clique no workflow run para ver detalhes

### Firebase Console
- **URL**: https://console.firebase.google.com/project/studio-9804515494-e1a53/apphosting
- **Métricas**: Requests, latência, erros
- **Logs**: Cloud Logging integrado

### Verificação de Saúde

```bash
# Verificar status do deploy
firebase hosting:channel:list

# Ver logs recentes
firebase functions:log
```

---

## 🐛 Troubleshooting

### Erro: "The caller does not have permission"

**Solução**: Atualizar `FIREBASE_SERVICE_ACCOUNT` secret
1. Gerar nova chave no Firebase Console
2. Atualizar secret no GitHub
3. Fazer novo deploy

### Erro: "Build failed"

**Solução**: Verificar logs do GitHub Actions
1. Checar variáveis de ambiente
2. Validar build local: `npm run build`
3. Verificar dependências: `npm ci`

### Deploy Lento

**Solução**: Otimizar bundle size
1. Analisar: `npm run build`
2. Implementar code splitting
3. Otimizar imagens e assets

---

## 📈 Métricas de Performance

### Build Time
- **Média**: 2-3 minutos
- **Otimizado com**: npm cache, standalone output

### Bundle Size
- **First Load JS**: ~101 kB (compartilhado)
- **Maior Página**: 54 kB (`/dashboard/processes/diagram`)
- **Total de Rotas**: 56 páginas

### Uptime
- **Target**: 99.9%
- **Monitorado via**: Firebase Console

---

## 🔄 Rollback

### Via Firebase Console
1. Acesse: App Hosting → Rollouts
2. Selecione versão anterior
3. Clique em **Rollback**

### Via CLI
```bash
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL TARGET_SITE_ID:live
```

---

## 📝 Checklist de Deploy

Antes de fazer deploy para produção:

- [ ] Build local passou sem erros
- [ ] Testes executados com sucesso
- [ ] Variáveis de ambiente configuradas
- [ ] Secrets atualizados no GitHub
- [ ] Branch `main` atualizado
- [ ] Changelog/Release notes criados
- [ ] Equipe notificada

---

## 🎯 Próximas Melhorias

### Curto Prazo
- [ ] Implementar testes automatizados no workflow
- [ ] Adicionar notificações de deploy (Slack/Discord)
- [ ] Configurar preview deploys para PRs

### Médio Prazo
- [ ] Implementar blue-green deployment
- [ ] Adicionar smoke tests pós-deploy
- [ ] Configurar monitoring e alertas

### Longo Prazo
- [ ] Multi-region deployment
- [ ] A/B testing infrastructure
- [ ] Performance budgets

---

## 📚 Recursos Adicionais

### Documentação Oficial
- [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)
- [Next.js on Firebase](https://firebase.google.com/docs/app-hosting/frameworks/nextjs)
- [GitHub Actions for Firebase](https://github.com/FirebaseExtended/action-hosting-deploy)

### Guias Internos
- `docs/DEPLOY_FIXES.md` - Correções de deploy
- `docs/BUILD_VALIDATION.md` - Validação de build
- `docs/FIREBASE_PERMISSION_FIX.md` - Correção de permissões

---

**Última Atualização**: 2026-01-20  
**Status**: ✅ **Produção - Funcionando**  
**Responsável**: Firebase Studio + Antigravity
