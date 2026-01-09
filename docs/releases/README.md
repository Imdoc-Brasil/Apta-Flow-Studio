# Releases — Registro e Organização (Solo)

Este diretório contém o histórico de releases do projeto, incluindo:

objetivos de cada release

mudanças (features/fixes/refactors)

validações (typecheck/lint/build)

staging (deploy + smoke tests)

produção (deploy + pós-deploy)

plano de rollback

notas finais e tarefas futuras

✅ Mesmo sendo um projeto solo, este registro facilita:

rastreabilidade

rollback rápido

controle de qualidade

histórico de decisões

auditoria simples de mudanças

## 📁 Estrutura Recomendada
docs/
  releases/
    README.md
    release-notes-template.md
    2026-01-09-v0.1.1.md
    2026-01-12-v0.1.2.md

✅ Regras

Sempre criar um arquivo novo por release

Não editar releases antigos (evita reescrever história)

Cada release deve conter staging + smoke tests (quando aplicável)

## 🏷️ Padrão de Nome (Naming)

Use este formato:

YYYY-MM-DD-vX.Y.Z.md


Exemplos:

2026-01-09-v0.1.1.md

2026-02-01-v0.2.0.md

📌 Se você não usa versionamento formal, pode usar:

YYYY-MM-DD-release.md

YYYY-MM-DD-hotfix.md

Mas recomenda-se usar versões.

## ✅ Como criar um novo release
1) Copiar o template

Crie um novo arquivo e copie o conteúdo do:

docs/release-notes-template.md

Para dentro de:

docs/releases/YYYY-MM-DD-vX.Y.Z.md

Exemplo:

cp docs/release-notes-template.md docs/releases/2026-01-09-v0.1.1.md

2) Preencher os campos principais

Comece preenchendo:

Data

Versão

Branch

Commit/Tag

Objetivo do release

Mudanças incluídas

3) Rodar validações localmente
```bash
npm run validate
```

Marque os itens correspondentes no documento.

4) Deploy em staging

Faça deploy em staging/preview

Cole o link do staging

Rode os smoke tests (preferencialmente no Antigravity)

Marque PASS/FAIL

5) Decidir Go/No-Go

Somente vá para produção se staging estiver aprovado.

✅ se aprovado:

merge para main

deploy prod

smoke test pós-deploy

monitorar

❌ se reprovado:

registrar o motivo

registrar o plano de correção

## 🧪 Política de Staging (recomendado)
✅ Todos os releases passam por staging

Motivo: você usa Firebase Auth + Firestore no client, então:

regras são críticas

regressões de UX são comuns

vazamento ou permissões erradas custam caro

📌 Exceções (raras):

alterações de documentação

mudanças internas sem impacto

Mesmo assim, rode npm run validate.

## 🔥 Hotfixes (produção)

Quando algo quebra em produção:

✅ Procedimento

criar branch: hotfix/<assunto>

corrigir

npm run validate

deploy staging rápido (se possível)

deploy prod

registrar no release notes

Nome sugerido:

YYYY-MM-DD-vX.Y.(Z+1)-hotfix.md

## 🧭 Qual versão usar? (sem overthinking)

Sugestão simples:

v0.1.0 → base inicial estável

v0.1.1 → fix e ajustes pequenos

v0.2.0 → features grandes ou mudanças estruturais

v1.0.0 → produto estável e pronto

📌 Padrão bem comum:

PATCH (Z): correções pequenas

MINOR (Y): features novas

MAJOR (X): mudanças quebrando compatibilidade

### ✅ Benefício prático (por que isso vale a pena)

Com esse histórico você consegue:

entender rapidamente o que entrou em produção e quando

identificar quais releases tiveram mudanças em rules Firestore

voltar a uma versão “segura” rapidamente

medir a estabilidade do projeto ao longo do tempo

## 💡 Dica final (para ficar ainda melhor)

✅ Depois do deploy, crie um tag para cada release:

```bash
git tag v0.1.1
git push origin v0.1.1
```

E preencha no release notes:

Commit / Tag: v0.1.1
