# Correções de Deploy - GitHub Actions

## 📋 Problemas Identificados

Durante o deploy automático via GitHub Actions, foram identificados os seguintes erros:

### 1. **Erro de Build do Next.js**
- **Causa**: Variável de ambiente `GOOGLE_GENAI_API_KEY` não estava disponível durante o build
- **Impacto**: Build falhava ao tentar compilar módulos que dependem do Genkit AI

### 2. **Warning do React Hook**
- **Arquivo**: `src/app/dashboard/(main)/clients/page.tsx`
- **Linha**: 205
- **Causa**: `useMemo` com dependência faltando (`statusFilter`)
- **Impacto**: Possível comportamento inconsistente do filtro de status

## ✅ Soluções Implementadas

### 1. Configuração do GitHub Actions

**Arquivo**: `.github/workflows/firebase-deploy.yml`

```yaml
env:
  FIREBASE_CLI_EXPERIMENTS: webframeworks
  GOOGLE_GENAI_API_KEY: ${{ secrets.GOOGLE_GENAI_API_KEY }}
```

- Adicionada variável de ambiente no nível do job
- Garante que a API key está disponível durante todo o processo

### 2. Configuração do Next.js

**Arquivo**: `next.config.ts`

Adicionadas as seguintes configurações:

```typescript
env: {
  GOOGLE_GENAI_API_KEY: process.env.GOOGLE_GENAI_API_KEY || '',
},
reactStrictMode: true,
output: 'standalone',
```

- `env`: Expõe a variável para o runtime do Next.js
- `reactStrictMode`: Ativa verificações adicionais em desenvolvimento
- `output: 'standalone'`: Otimiza para deploy no Firebase Hosting

### 3. Correção do React Hook

**Arquivo**: `src/app/dashboard/(main)/clients/page.tsx`

```typescript
const clientsToDisplay = useMemo(() => {
  // ... lógica de filtro
}, [allClients, staffProfile, isLoading, searchTerm, statusFilter])
```

- Adicionado `statusFilter` às dependências do `useMemo`
- Garante que o componente re-renderiza quando o filtro muda

### 4. Documentação de Variáveis de Ambiente

**Arquivo**: `.env.example`

Criado arquivo de exemplo com todas as variáveis necessárias:

```env
GOOGLE_GENAI_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
# ... outras variáveis
```

## 🔐 Configuração de Secrets no GitHub

Para que o deploy funcione, certifique-se de que os seguintes secrets estão configurados no repositório:

1. **GOOGLE_GENAI_API_KEY**
   - Obtenha em: https://aistudio.google.com/app/apikey
   - Caminho: Settings → Secrets and variables → Actions → New repository secret

2. **FIREBASE_SERVICE_ACCOUNT**
   - Gerado automaticamente pelo Firebase
   - Formato JSON com credenciais de service account

3. **GITHUB_TOKEN**
   - Fornecido automaticamente pelo GitHub Actions

## 🚀 Próximos Passos

1. Fazer commit dessas alterações
2. Push para o repositório
3. Verificar se o GitHub Actions executa com sucesso
4. Monitorar o deploy no Firebase Console

## 📝 Checklist de Verificação

- [x] Variáveis de ambiente configuradas no workflow
- [x] Next.js configurado para aceitar variáveis
- [x] Warning do React Hook corrigido
- [x] Arquivo `.env.example` criado
- [ ] Secrets configurados no GitHub
- [ ] Deploy testado e validado

## 🔍 Monitoramento

Após o commit, acompanhe:

1. **GitHub Actions**: https://github.com/Imdoc-Brasil/Apta-Flow-Studio/actions
2. **Firebase Console**: https://console.firebase.google.com/
3. **Logs de Build**: Verificar se não há mais erros ou warnings

---

**Data**: 2026-01-20  
**Versão**: 1.5.0  
**Autor**: Firebase Studio + Antigravity
