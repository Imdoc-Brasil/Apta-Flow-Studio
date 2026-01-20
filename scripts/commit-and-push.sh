#!/bin/bash

# 🚀 Script de Commit e Push Automatizado
# Uso: ./scripts/commit-and-push.sh "mensagem do commit"

set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 AptaFlow Studio - Commit & Push Automatizado${NC}"
echo ""

# Verificar se mensagem foi fornecida
if [ -z "$1" ]; then
  echo -e "${RED}❌ Erro: Mensagem de commit não fornecida${NC}"
  echo "Uso: ./scripts/commit-and-push.sh \"sua mensagem aqui\""
  exit 1
fi

COMMIT_MESSAGE="$1"

# Verificar branch atual
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${BLUE}📍 Branch atual: ${YELLOW}${CURRENT_BRANCH}${NC}"

# Verificar se há mudanças
if [[ -z $(git status -s) ]]; then
  echo -e "${YELLOW}⚠️  Nenhuma mudança detectada para commit${NC}"
  exit 0
fi

# Mostrar status
echo -e "${BLUE}📋 Arquivos modificados:${NC}"
git status -s

# Adicionar todos os arquivos
echo ""
echo -e "${BLUE}➕ Adicionando arquivos...${NC}"
git add .

# Criar commit
echo -e "${BLUE}💾 Criando commit...${NC}"
git commit -m "$COMMIT_MESSAGE"

# Push para o repositório
echo -e "${BLUE}🚀 Enviando para GitHub...${NC}"
git push origin "$CURRENT_BRANCH"

echo ""
echo -e "${GREEN}✅ Commit e push concluídos com sucesso!${NC}"
echo -e "${BLUE}📦 Commit: ${YELLOW}$COMMIT_MESSAGE${NC}"
echo -e "${BLUE}🌿 Branch: ${YELLOW}$CURRENT_BRANCH${NC}"

# Se estiver na branch main ou dev, informar sobre deploy automático
if [[ "$CURRENT_BRANCH" == "main" ]] || [[ "$CURRENT_BRANCH" == "dev" ]]; then
  echo ""
  echo -e "${YELLOW}⚡ Deploy automático será iniciado via GitHub Actions${NC}"
  echo -e "${BLUE}🔗 Acompanhe em: https://github.com/seu-usuario/Apta-Flow-Studio/actions${NC}"
fi

echo ""
