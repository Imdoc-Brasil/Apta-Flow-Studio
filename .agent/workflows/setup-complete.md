---
description: Configuração completa do AptaFlow Studio no Antigravity
---

# ✅ Configuração Completa do AptaFlow Studio

## 🎯 Status Atual

### ✅ CLIs Conectados

#### 1. **Firebase CLI** 
- ✅ Instalado: `firebase-tools@14.20.0`
- ✅ Autenticado com sucesso
- ✅ Projeto conectado: `studio-9804515494-e1a53` (AptaFlow-Firebase)
- ✅ Arquivos de configuração criados:
  - `.firebaserc` - Define o projeto padrão
  - `firebase.json` - Configuração de Firestore, Hosting e Emulators
  - `firestore.indexes.json` - Índices do Firestore

#### 2. **Genkit CLI**
- ✅ Instalado: `genkit-cli@1.20.0` (local)
- ✅ Configurado com Google AI (Gemini 2.5 Flash)
- ✅ Flows implementados:
  - `suggest-process-tool.ts` - Sugestões de processos com IA
  - `analyze-ecg-flow.ts` - Análise de ECG

### 🚀 Ambiente de Desenvolvimento

#### Aplicação Local
- ✅ Dependências instaladas (1035 packages)
- ✅ Servidor Next.js rodando em: `http://localhost:9002`
- ✅ Turbopack habilitado para builds rápidos
- ✅ Interface funcionando perfeitamente

#### Versão Publicada
- 🔴 URL: `https://studio--studio-9804515494-e1a53.us-central1.hosted.app`
- ⚠️ Status: Erro 500 (provavelmente devido a dependências não instaladas no deploy anterior)
- 📝 Ação necessária: Novo deploy após configuração local completa

### 📊 Recursos do Firebase

#### Firestore Database
- ✅ Database ativo: `projects/studio-9804515494-e1a53/databases/(default)`
- ✅ Regras configuradas em: `firestore.rules`
- 📋 Modelo de dados completo em: `docs/backend.json`

#### Firebase Hosting
- ✅ Site ID: `studio-9804515494-e1a53`
- ✅ URL padrão: `https://studio-9804515494-e1a53.web.app`

#### App Hosting
- ✅ Backend: `studio`
- ✅ Região: `us-central1`
- 📅 Último deploy: 2025-11-18 08:17:17

### 🛠️ Comandos Úteis

#### Desenvolvimento Local
```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Iniciar Genkit Dev UI
npm run genkit:dev

# Iniciar Genkit com watch mode
npm run genkit:watch

# Iniciar emuladores do Firebase
firebase emulators:start
```

#### Firebase CLI
```bash
# Ver projeto atual
firebase use

# Listar projetos
firebase projects:list

# Deploy do Firestore rules
firebase deploy --only firestore:rules

# Deploy do Hosting
firebase deploy --only hosting

# Ver logs do App Hosting
firebase apphosting:backends:list
```

#### Build e Deploy
```bash
# Build de produção
npm run build

# Iniciar servidor de produção
npm start

# Type checking
npm run typecheck

# Lint
npm run lint
```

### 📁 Estrutura do Projeto

```
Apta-Flow-Studio/
├── .firebaserc              # Configuração do projeto Firebase
├── firebase.json            # Configuração de serviços Firebase
├── firestore.rules          # Regras de segurança do Firestore
├── firestore.indexes.json   # Índices do Firestore
├── apphosting.yaml          # Configuração do App Hosting
├── docs/
│   └── backend.json         # Modelo de dados completo
├── src/
│   ├── ai/                  # Configuração e flows do Genkit
│   │   ├── genkit.ts
│   │   ├── dev.ts
│   │   └── flows/
│   ├── app/                 # Páginas Next.js
│   ├── components/          # Componentes React
│   ├── firebase/            # Configuração Firebase
│   ├── hooks/               # React hooks
│   └── lib/                 # Utilitários
└── package.json
```

### 🎨 Entidades do Sistema

O sistema gerencia as seguintes entidades (definidas em `docs/backend.json`):

**Gestão de Clientes:**
- Client, Employee, Contract
- ServiceRequest, SLA, OKR

**Documentação:**
- Document, Machine (NR-12)

**Treinamentos:**
- ScheduledTraining

**Saúde e Segurança:**
- PcmsoRule, GHE, Hazard
- EPC, EPI, PgrInventoryItem
- PsychosocialSurvey, ASO

**Processos:**
- Process (POP, PP, PRS, PRT, PI)

### 🔐 Autenticação

- ✅ Firebase Auth configurado
- ✅ Proteção de rotas implementada
- 📝 Login necessário para acessar `/dashboard`

### 🚨 Próximos Passos Sugeridos

1. **Corrigir Deploy em Produção**
   - Fazer novo deploy com dependências corretas
   - Verificar logs de erro do App Hosting

2. **Configurar Variáveis de Ambiente**
   - Criar `.env.local` com chaves da API do Gemini
   - Configurar secrets no Firebase

3. **Implementar CRUD das Entidades**
   - Criar páginas para cada entidade
   - Implementar formulários com validação

4. **Testar Genkit Flows**
   - Abrir Genkit Dev UI
   - Testar flows de IA

5. **Configurar Emuladores**
   - Testar localmente com emuladores Firebase
   - Validar regras do Firestore

### 📞 Suporte

Para mais informações sobre as ferramentas:
- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Genkit Docs](https://firebase.google.com/docs/genkit)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Última atualização:** 2026-01-08
**Status:** ✅ Ambiente de desenvolvimento configurado e funcionando
