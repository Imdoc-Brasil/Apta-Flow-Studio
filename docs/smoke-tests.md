# Smoke Tests — Staging (Solo + Antigravity)

Objetivo:
Detectar regressões rapidamente, validar regras Firestore/Auth e garantir qualidade antes do deploy em produção.

📌 Sempre rodar isso em staging.

## 🧩 Pré-requisitos

URL de staging disponível

Usuários de teste criados (Auth)

Dados de staging isolados

Console do browser acessível

Network tab acessível

## 🧪 Grupo A — Testes de Acesso (Auth)
✅ A1) Login (usuário válido)

Abrir URL de staging

Fazer login com usuário de staging

Confirmar:

UI de usuário logado

redirecionamento correto

sem erros no console

✅ Passa se:

login funciona

não há erro crítico no console

estado permanece após refresh

✅ A2) Logout

Fazer logout

Confirmar:

estado deslogado

rota de login/home aparece

sem erro

✅ Passa se:

logout funciona

refresh mantém estado deslogado

✅ A3) Persistência de sessão

Logar novamente

Recarregar a página (Ctrl+R)

Confirmar:

usuário continua logado

✅ Passa se:

sessão persiste (ou se sua regra for “não persistir”, validar comportamento esperado)

## 🧪 Grupo B — CRUD Firestore (uma entidade principal)

Escolha uma entidade principal do app (ex.: tickets, employees, services)

✅ B1) Criar registro

Ir para a tela principal (ex.: Tickets)

Criar um novo item

Confirmar:

aparece na UI

não há erro no console/network

item existe após refresh

✅ Passa se:

item persiste corretamente

✅ B2) Atualizar registro

Editar um campo do item criado

Salvar

Confirmar:

mudança aparece na UI

persiste após refresh

não há erro permission denied

✅ Passa se:

update funciona e persiste

✅ B3) Deletar registro

Deletar o item criado

Confirmar:

item desaparece

não há erro

✅ Passa se:

delete funciona

sem “dangling state” (UI travada)

## 🧪 Grupo C — Regras e Permissões (mais importante)

Firestore no client = rules são seu backend.

✅ C1) Usuário A não acessa dados do usuário B

Login como Usuário A

Tentar acessar rota ou item do Usuário B

Confirmar:

bloqueio ocorre

UI mostra mensagem adequada

aparece permission-denied no network

não vaza dados

✅ Passa se:

acesso negado corretamente

✅ C2) Acesso sem login

Logout

Abrir uma rota protegida diretamente (URL)

Confirmar:

redireciona / bloqueia

sem dados carregados

sem crash

✅ Passa se:

proteção funciona sem vazamento

✅ C3) Escrita indevida bloqueada

Logar como usuário sem permissão

Tentar criar ou editar item que não deveria

Confirmar:

bloqueia

erro tratado no UI (toast/alert)

sem inconsistência visual

✅ Passa se:

rules impedem write indevido e UI trata bem

## 🧪 Grupo D — UI crítica (Radix + DnD + ReactFlow)
✅ D1) Dialog / Modal (Radix)

Abrir um dialog

Fechar via:

botão X

clique fora

tecla ESC

Confirmar:

fecha corretamente

foco volta ao botão correto

sem travar scroll

✅ Passa se:

comportamento acessível e consistente

✅ D2) Dropdown / Popover

Abrir dropdown/popover

Interagir e selecionar item

Confirmar:

fecha ao selecionar

sem bugs de foco

sem overlays travados

✅ Passa se:

tudo fecha corretamente

✅ D3) Drag-and-drop (DnD-kit)

Reordenar um item

Confirmar:

UI atualiza

se persistir no Firestore, persiste após refresh

Testar em viewport mobile (simulando)

✅ Passa se:

reorder funciona e não quebra em mobile

✅ D4) ReactFlow (se aplicável)

Criar nó

Mover nó

Criar conexão

Salvar e refresh

Confirmar persistência

✅ Passa se:

estado persiste e UI não quebra

## 🧪 Grupo E — Console / Network / Performance (rápido)
✅ E1) Console

Abrir console

Verificar:

sem erros críticos

warnings aceitáveis (mínimos)

sem erros repetidos em loop

✅ Passa se:

console está limpo (ou com warnings conhecidos/documentados)

✅ E2) Network

Verificar chamadas ao Firestore

Confirmar:

sem 403/401 inesperados

sem “retry loop”

sem requisições excessivas

✅ Passa se:

comportamento normal e sem spam

✅ E3) Performance rápida

Abrir páginas principais

Confirmar:

tempo de carregamento aceitável

sem travamentos ao abrir modais

sem freeze em drag/drop

✅ Passa se:

UX está fluida

## ✅ Resultado do Smoke Test
✅ Aprovado se:

login/logout ok

CRUD ok

rules impedem vazamento e escritas indevidas

UI crítica ok (modais, dropdowns, drag/drop)

console/network ok

❌ Reprovado se:

qualquer vazamento de dados

qualquer permission issue não tratado

crash/hydration error grave

loops de erro no console/network

## 📝 Registro final (recomendado)

Anote:

data e hora

build/version

resultado (PASS/FAIL)

prints dos erros (se houve)
