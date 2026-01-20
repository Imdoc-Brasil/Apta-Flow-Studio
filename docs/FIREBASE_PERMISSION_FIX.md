# 🔐 Guia de Correção - Erro de Permissão Firebase (403)

## ❌ Problema Identificado

```
Error: The caller does not have permission
Status: PERMISSION_DENIED (403)
```

O **GitHub Actions** não consegue fazer deploy porque a **Service Account** do Firebase não tem as permissões necessárias.

---

## 🔍 Diagnóstico

### Erro Completo
```json
{
  "error": {
    "code": 403,
    "message": "The caller does not have permission",
    "status": "PERMISSION_DENIED"
  }
}
```

### Causa Raiz
A Service Account configurada no secret `FIREBASE_SERVICE_ACCOUNT` não possui as **roles/permissões** necessárias para:
- Fazer deploy no Firebase Hosting
- Criar/atualizar Cloud Functions
- Acessar o Firebase App Hosting

---

## ✅ Solução: Configurar Permissões Corretas

### Opção 1: Recriar a Service Account (Recomendado)

#### Passo 1: Acessar o Firebase Console
1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto: **studio-9804515494-e1a53**
3. Vá em **Configurações do Projeto** (ícone de engrenagem)

#### Passo 2: Gerar Nova Service Account
1. Clique na aba **Contas de Serviço**
2. Role até **Firebase Admin SDK**
3. Clique em **Gerar nova chave privada**
4. Confirme e baixe o arquivo JSON

#### Passo 3: Atualizar Secret no GitHub
1. Acesse: https://github.com/Imdoc-Brasil/Apta-Flow-Studio/settings/secrets/actions
2. Encontre o secret: **FIREBASE_SERVICE_ACCOUNT**
3. Clique em **Update**
4. Cole o **conteúdo completo** do arquivo JSON baixado
5. Salve

---

### Opção 2: Adicionar Permissões à Service Account Existente

#### Passo 1: Identificar a Service Account
1. Acesse o Google Cloud Console: https://console.cloud.google.com/
2. Selecione o projeto: **studio-9804515494-e1a53**
3. Vá em **IAM & Admin** → **Service Accounts**
4. Encontre a service account usada (geralmente termina com `@studio-9804515494-e1a53.iam.gserviceaccount.com`)

#### Passo 2: Adicionar Roles Necessárias
Clique na service account e adicione as seguintes **roles**:

**Roles Obrigatórias:**
- ✅ `Firebase Hosting Admin` - Para deploy no Hosting
- ✅ `Cloud Functions Developer` - Para Cloud Functions
- ✅ `Service Account User` - Para executar como service account
- ✅ `Firebase App Hosting Admin` - Para App Hosting

**Roles Recomendadas (Opcionais):**
- `Cloud Build Editor` - Para builds
- `Cloud Run Admin` - Para Cloud Run (se usar)
- `Artifact Registry Writer` - Para armazenar artifacts

#### Passo 3: Aplicar as Permissões
1. Clique em **+ ADD ANOTHER ROLE** para cada role
2. Pesquise pelo nome da role
3. Selecione e clique em **SAVE**
4. Aguarde 1-2 minutos para propagação

---

## 🔧 Opção 3: Usar Firebase CLI para Gerar Token

Se preferir usar um método mais simples:

### Passo 1: Instalar Firebase CLI (se ainda não tiver)
```bash
npm install -g firebase-tools
```

### Passo 2: Fazer Login
```bash
firebase login:ci
```

Isso abrirá o navegador para autenticação e gerará um **token**.

### Passo 3: Configurar Token no GitHub
1. Copie o token gerado
2. Vá em: https://github.com/Imdoc-Brasil/Apta-Flow-Studio/settings/secrets/actions
3. Crie um novo secret: **FIREBASE_TOKEN**
4. Cole o token

### Passo 4: Atualizar o Workflow
Modifique `.github/workflows/firebase-deploy.yml`:

```yaml
- name: Deploy to Firebase App Hosting
  run: |
    npm install -g firebase-tools
    firebase deploy --only hosting --token ${{ secrets.FIREBASE_TOKEN }}
```

---

## 📋 Checklist de Verificação

Após aplicar a solução, verifique:

- [ ] Service Account tem as roles necessárias
- [ ] Secret `FIREBASE_SERVICE_ACCOUNT` está atualizado no GitHub
- [ ] Projeto Firebase correto: `studio-9804515494-e1a53`
- [ ] Aguardou 1-2 minutos para propagação de permissões
- [ ] Executou novo commit para testar

---

## 🧪 Teste Rápido

Após configurar as permissões, faça um teste:

```bash
# Faça um commit vazio para disparar o workflow
git commit --allow-empty -m "test: validar permissões do Firebase"
git push origin main
```

Acompanhe em: https://github.com/Imdoc-Brasil/Apta-Flow-Studio/actions

---

## 🎯 Solução Recomendada

**Para resolver rapidamente**, recomendo a **Opção 1**:

1. ✅ Gerar nova Service Account no Firebase Console
2. ✅ Atualizar o secret no GitHub
3. ✅ Fazer novo commit para testar

**Tempo estimado**: 5 minutos

---

## 📞 Suporte Adicional

Se o erro persistir, verifique:

1. **Billing**: Projeto tem billing ativo?
2. **APIs**: Firebase Hosting API está habilitada?
3. **Quotas**: Não excedeu limites do Firebase?

### Habilitar APIs Necessárias

Acesse: https://console.cloud.google.com/apis/library

Habilite:
- ✅ Firebase Hosting API
- ✅ Cloud Functions API
- ✅ Cloud Build API
- ✅ Cloud Run API

---

## 📝 Notas Importantes

⚠️ **Segurança**: Nunca commite o arquivo JSON da service account no repositório!

⚠️ **Permissões**: Use o princípio do menor privilégio - dê apenas as permissões necessárias.

⚠️ **Rotação**: Considere rotacionar as chaves periodicamente por segurança.

---

**Última Atualização**: 2026-01-20  
**Status**: Aguardando correção de permissões
