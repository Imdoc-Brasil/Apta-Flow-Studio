# Checklist de Staging e Deploy (Solo)

Objetivo:
Garantir que toda mudança passe por staging com validação antes de ir para produção.

📌 Regra:
✅ Sempre fazer staging antes do deploy final em produção.

## 🧱 1) Preparação (antes de qualquer deploy)
✅ 1.1 Repo limpo e atualizado
```bash
git checkout dev
git pull
git status
```

✅ git status deve estar limpo.

✅ 1.2 Instalar dependências (se necessário)
```bash
npm install
```

✅ 1.3 Validação local obrigatória
```bash
npm run validate
```

✅ Deve passar:

typecheck

lint

build

Se falhar, não faça deploy.

## 🌿 2) Garantir que staging está separado de produção
✅ 2.1 Projeto Firebase staging (recomendado)

Tenha um Firebase Project separado, por exemplo:

meu-app-staging

meu-app-prod

📌 Nunca use staging apontando para a mesma base do prod.

✅ 2.2 Env vars corretas para staging

Confirme que staging usa:

NEXT_PUBLIC_FIREBASE_API_KEY

NEXT_PUBLIC_FIREBASE_PROJECT_ID

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID

NEXT_PUBLIC_FIREBASE_APP_ID

✅ E que elas pertencem ao projeto de staging.

✅ 2.3 Genkit / AI (server-only) em staging

Se houver secrets:

GOOGLE_API_KEY (ou equivalente)

segredos de Genkit

✅ staging pode ter chaves separadas de prod.

## 🚀 3) Deploy em staging
✅ 3.1 Fazer merge para dev (se necessário)

Se você estava em uma branch do Antigravity:

```bash
git checkout dev
git pull
git merge fix/<assunto>
git push
```

✅ 3.2 Deploy staging (Firebase Hosting)

Use o comando padrão do seu projeto.

Exemplo (caso use Firebase Hosting):

```bash
firebase use staging
firebase deploy
```

Ou se usar preview channel:

```bash
firebase hosting:channel:deploy staging-preview
```

✅ Anote o URL de staging/preview.

## 🧪 4) Rodar smoke tests no staging (obrigatório)
✅ 4.1 Executar docs/smoke-tests.md

Use o Antigravity para rodar os testes descritos.

✅ Resultado esperado:

sem erros de console críticos

sem falhas em fluxos básicos

regras Firestore funcionando

## 🔍 5) Revisão pós-staging (antes do deploy prod)
✅ 5.1 Conferir logs e erros

Verifique:

erros no console do navegador

falhas no network

permission denied inesperado

loops de re-render/hydration

✅ 5.2 Confirmar custo e queries

Se o app faz consultas grandes:

verifique se as queries têm limit

evite carregar coleções completas

✅ 5.3 Conferir regras Firestore

Confirme:

staging não está com regras permissivas

staging e prod não têm diferença “perigosa”

📌 Se staging tiver regras mais permissivas, você pode ser enganado.

## 6) Deploy em produção
✅ 6.1 Garantir que main está estável

Opção A (recomendada):

merge dev → main depois do staging aprovado

```bash
git checkout main
git pull
git merge dev
git push
```

✅ 6.2 Deploy produção

Exemplo (Firebase):

```bash
firebase use production
firebase deploy
```

## 7) Pós-deploy (produção)
✅ 7.1 Smoke tests rápidos em produção

Somente os testes “seguros”:

abrir home

login

navegação geral

ver se não há erro crítico

📌 Não rode testes que criam muita massa em produção.

✅ 7.2 Monitorar por 15 minutos

erros no console

erro no analytics/logs

permission denied altos

performance regressions

## 🆘 Plano de rollback (essencial)

Se deu problema:

✅ Rollback do Hosting (se estiver usando):

voltar para versão anterior do release

✅ Rollback de código

reverter merge

redeploy

📌 Mantenha um tag de release:

v0.1.0

v0.1.1

## ✅ Checklist final (antes de marcar como “deploy concluído”)

 npm run validate passou

 staging separado confirmado

 deploy staging feito

 smoke tests staging aprovados

 deploy prod feito

 smoke tests prod básicos aprovados

 monitoramento pós deploy ok
