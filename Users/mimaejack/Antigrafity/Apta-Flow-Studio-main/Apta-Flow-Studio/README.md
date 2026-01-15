# AptaFlow Studio 🚀

**Plataforma tudo-em-um para gerenciar clientes, funcionários e processos com insights alimentados por IA para máxima eficiência.**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.9.1-orange)](https://firebase.google.com/)
[![Genkit](https://img.shields.io/badge/Genkit-1.20.0-blue)](https://firebase.google.com/docs/genkit)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

## 🌟 Principais Recursos

- **Gestão de Clientes** - Gerencie empresas clientes, contratos e acordos de serviço
- **Hub de Funcionários** - Repositório centralizado para dados de funcionários
- **Repositório de Documentos** - Armazene e gerencie documentos com segurança
- **Sistema de Tickets** - Solicitações de serviço e rastreamento
- **Monitoramento de SLA/OKR** - Acompanhamento em tempo real de performance
- **Ferramentas com IA** - Sugestões inteligentes para otimização de processos
- **Análise e Relatórios** - Dashboards personalizados e insights

## 🛠️ Stack Tecnológica

- **Framework:** Next.js 15.5.9 com Turbopack
- **Backend:** Firebase (Firestore + Auth)
- **IA:** Google Genkit com Gemini 2.5 Flash
- **UI:** Radix UI + Tailwind CSS
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **Visualização:** Recharts + ReactFlow

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+ (recomendado: v22.19.0)
- npm ou yarn
- Conta Firebase

### Instalação

`´´´bash
# Clone o repositório
git clone <repository-url>
cd Apta-Flow-Studio

# Instale as dependências
npm install

# Configure o Firebase
firebase login
firebase use studio-9804515494-e1a53

# Inicie o servidor de desenvolvimento
npm run dev
`´´´

O aplicativo estará disponível em `http://localhost:9002`

## 📖 Documentação e Status

Para entender o estado atual do projeto, as políticas e os próximos passos, consulte nossa documentação centralizada:

- **[docs/README.md](./docs/README.md)** - Índice da Documentação
- **[docs/STATUS_ATUAL.md](./docs/STATUS_ATUAL.md)** - Relatório de Status e Próximos Passos
- **[docs/deploy-policy.md](./docs/deploy-policy.md)** - Política Oficial de Deploy

## 📋 Scripts Disponíveis

`´´´bash
# Desenvolvimento
npm run dev              # Inicia servidor Next.js com Turbopack
npm run genkit:dev       # Inicia Genkit Dev UI
npm run genkit:watch     # Genkit com hot reload

# Build e Produção
npm run build            # Build de produção
npm start                # Inicia servidor de produção

# Qualidade de Código
npm run lint             # Executa ESLint
npm run typecheck        # Verifica tipos TypeScript
npm run validate         # Roda typecheck e lint
npm run validate:build   # Roda validação completa com build

# Firebase
firebase emulators:start              # Inicia emuladores locais
firebase deploy --only firestore      # Deploy das regras
firebase deploy --only hosting        # Deploy do site
`´´´

## 🏗️ Estrutura do Projeto

`´´´
Apta-Flow-Studio/
├── .agent/
│   └── workflows/           # Workflows e documentação
├── docs/
│   └── backend.json         # Modelo de dados completo
├── src/
│   ├── ai/                  # Configuração Genkit e flows
│   │   ├── genkit.ts
│   │   ├── dev.ts
│   │   └── flows/
│   ├── app/                 # Páginas Next.js (App Router)
│   ├── components/          # Componentes React reutilizáveis
│   │   └── ui/             # Componentes de UI (Radix + Tailwind)
│   ├── firebase/            # Configuração e providers Firebase
│   ├── hooks/               # React hooks customizados
│   └── lib/                 # Utilitários e helpers
├── .firebaserc              # Configuração do projeto Firebase
├── firebase.json            # Configuração de serviços Firebase
├── firestore.rules          # Regras de segurança
├── firestore.indexes.json   # Índices do Firestore
└── apphosting.yaml          # Configuração App Hosting
`´´´

## 📊 Modelo de Dados

O sistema gerencia as seguintes entidades principais:

### Gestão de Negócios
- **Client** - Empresas clientes
- **Employee** - Funcionários
- **Contract** - Contratos e acordos
- **ServiceRequest** - Solicitações de serviço
- **SLA** - Acordos de nível de serviço
- **OKR** - Objetivos e resultados-chave

### Saúde e Segurança
- **Machine** - Equipamentos (NR-12)
- **Hazard** - Riscos ocupacionais
- **GHE** - Grupos Homogêneos de Exposição
- **EPC/EPI** - Equipamentos de proteção
- **PgrInventoryItem** - Inventário de riscos PGR
- **ASO** - Atestados de Saúde Ocupacional
- **PcmsoRule** - Regras PCMSO

### Processos e Documentação
- **Process** - Processos de negócio (POP, PP, PRS, etc.)
- **Document** - Documentos e arquivos
- **ScheduledTraining** - Treinamentos agendados
- **PsychosocialSurvey** - Pesquisas psicossociais

Veja o esquema completo em [`docs/backend.json`](./docs/backend.json)

## 🤖 Funcionalidades de IA

O AptaFlow utiliza Google Genkit com Gemini 2.5 Flash para:

- **Sugestão de Processos** - Recomendações inteligentes de otimização
- **Análise de ECG** - Processamento de dados de saúde
- Mais flows em desenvolvimento...

### Testando os Flows de IA

`´´´bash
# Inicie o Genkit Dev UI
npm run genkit:dev

# Acesse http://localhost:4000 para testar os flows
`´´´

## 🔐 Autenticação e Segurança

- Firebase Authentication para login seguro
- Proteção de rotas no Next.js
- Regras de segurança do Firestore configuradas
- Validação de dados com Zod

## 🌐 Deploy

### Firebase App Hosting

O projeto está configurado para deploy automático no Firebase App Hosting:

`´´´bash
# Build e deploy
npm run build
firebase deploy
`´´´

**URLs de Produção:**
- App Hosting: `https://studio--studio-9804515494-e1a53.us-central1.hosted.app`
- Firebase Hosting: `https://studio-9804515494-e1a53.web.app`

## 📝 Configuração de Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

`´´´env
# Google AI (Genkit)
GOOGLE_GENAI_API_KEY=your_api_key_here

# Firebase (já configurado em src/firebase/config.ts)
# Adicione outras variáveis conforme necessário
`´´´

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e proprietário.

---

**Desenvolvido com ❤️ usando Antigravity**
