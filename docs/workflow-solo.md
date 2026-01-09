# Workflow SOLO — Firebase Studio ↔ Antigravity (NPM)

Objetivo:
Manter o projeto sempre consistente, rastreável e sem conflitos, alternando entre:

Firebase Studio → desenvolvimento principal (features grandes e estrutura)

Antigravity → QA, validação, refactors mecânicos, correções pontuais

📌 Regra principal: nunca usar os dois ao mesmo tempo.
Você sempre finaliza um e só depois vai para o outro.

## 🧠 Regras de Ouro
✅ 1) Um ambiente por vez

Você só troca de ambiente se:

tudo estiver commitado

ou tiver sido descartado (git restore .)

ou tiver sido guardado (git stash)

✅ 2) Troca de ambiente = checkpoint obrigatório

Antes de trocar:

commit checkpoint (preferível)

ou stash

ou discard

✅ 3) Git é a fonte da verdade

Firebase Studio e Antigravity são ambientes.
Quem define o estado do projeto é o Git.

## 🌿 Branches

main → somente estável

dev → branch do dia a dia

Antigravity sempre trabalha em branches curtas:

fix/<assunto>

refactor/<assunto>

Exemplos:

fix/dialog-focus

fix/firestore-permission-toast

refactor/move-data-to-data-ts

## ✅ Scripts recomendados (npm)

Adicionar ao package.json:

```json
{
  "scripts": {
    "validate": "npm run typecheck && npm run lint && npm run build"
  }
}
```

✅ Esse comando será seu “gate” antes de trocar de ambiente ou fazer deploy:

```bash
npm run validate
```

## 🔁 Fluxo padrão (o ciclo que você vai repetir sempre)
### ✅ A) Firebase Studio → trabalhar feature
1) Atualizar
```bash
git checkout dev
git pull
npm install
```

2) Rodar dev server
```bash
npm run dev
# ou (fallback)
npm run dev:webpack
```

3) Trabalhar na feature
4) Validar antes de trocar de ambiente
```bash
npm run validate
```

5) Commit checkpoint
```bash
git add .
git commit -m "feat: <descrição curta>"
git push
```

📌 Agora você pode trocar para o Antigravity com segurança.

### ✅ B) Antigravity → QA / correção / refactor mecânico
1) Atualizar
```bash
git checkout dev
git pull
npm install
```

2) Criar branch curta
```bash
git checkout -b fix/<assunto>
# ou
git checkout -b refactor/<assunto>
```

3) Fazer mudanças (pequenas e objetivas)

correção pontual

refactor mecânico

docs

ajustes de import/export

melhorias de organização

4) Validar obrigatoriamente
```bash
npm run validate
```

5) Commit atômico (um assunto por commit)
```bash
git add .
git commit -m "fix: <descrição curta>"
git push -u origin fix/<assunto>
```

6) Merge no dev
```bash
git checkout dev
git pull
git merge fix/<assunto>
git push
```

7) Limpar branch local (opcional)
```bash
git branch -d fix/<assunto>
```

📌 Agora você pode voltar ao Firebase Studio com segurança.

## ✅ Checklist rápido (antes de trocar de ambiente)

Antes de mudar Firebase Studio ↔ Antigravity:

✅ git status precisa estar limpo:

```bash
git status
```

Se aparecer arquivos modificados:

opção 1 — commit:
```bash
git add .
git commit -m "chore: checkpoint"
```

opção 2 — stash:
```bash
git stash -u
```

opção 3 — descartar:
```bash
git restore .
```

Depois disso:

```bash
npm run validate
```

✅ troca autorizada.

## 🧪 Smoke tests recomendados (Antigravity)

Como você usa Firebase Auth + Firestore no cliente, estes testes são prioridade máxima:

✅ 1) Login / Logout

loga

desloga

loga novamente

valida UI e estado

✅ 2) CRUD Firestore (uma entidade principal)

cria doc

edita doc

deleta doc

valida UI e dados

✅ 3) Regras / permissões

usuário A tentando acessar dados do usuário B

verificar permission-denied

garantir UX (toast / alert) e ausência de vazamento

✅ 4) UI complexa (Radix + DnD + ReactFlow)

abrir/fechar dialog/popover

testar foco e teclado (ESC / TAB)

drag-and-drop reorder

salvar e recarregar persistência

✅ 5) Console / Network

sem erros críticos

sem requests falhando em loop

sem warning de hydration persistente

## 🔐 Checklist extra de segurança (Firestore no client)

Antes de staging/prod:

 Regras Firestore revisadas

 Staging separado da produção

 Dados de staging isolados (não poluir prod)

 Tratamento de permission-denied no UI (toast ou alert)

 Queries sempre com paginação/limit

## 🚀 Deploy (recomendação)
✅ Staging primeiro

Sempre:

deploy staging

Antigravity roda smoke tests

deploy produção

## ✅ Convenção de commits (simples e eficiente)

feat: nova funcionalidade

fix: correção

refactor: refatoração sem mudança de comportamento

chore: manutenção (deps, scripts, docs)

docs: documentação

Exemplos:

feat: adicionar fluxo de tickets

fix: corrigir import do pgr/utils

refactor: mover dados para data.ts

docs: adicionar guia de deploy

## ✅ Resumo do dia (em uma frase)

➡️ Firebase Studio cria e estrutura → commit → troca
➡️ Antigravity valida e corrige → commit → merge → troca

📌 Sem simultâneo = sem conflitos = fluxo rápido e confiável.

## ✅ Dicas finais (mantêm a saúde do projeto)

Sempre npm run validate antes de trocar de ambiente

Antigravity só faz mudanças pequenas e atômicas

Use staging separado e sempre teste nele

Nunca edite em dois ambientes sem um commit no meio
