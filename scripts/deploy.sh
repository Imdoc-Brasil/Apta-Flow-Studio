#!/bin/bash

# 🚀 Script de Deploy Manual para Firebase App Hosting
# Uso: ./scripts/deploy.sh [staging|production]

set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 AptaFlow Studio - Deploy Manual${NC}"
echo ""

# Verificar ambiente
ENVIRONMENT=${1:-staging}

if [[ "$ENVIRONMENT" != "staging" ]] && [[ "$ENVIRONMENT" != "production" ]]; then
  echo -e "${RED}❌ Ambiente inválido: $ENVIRONMENT${NC}"
  echo "Uso: ./scripts/deploy.sh [staging|production]"
  exit 1
fi

echo -e "${BLUE}🎯 Ambiente: ${YELLOW}${ENVIRONMENT}${NC}"
echo ""

# Verificar branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${BLUE}📍 Branch atual: ${YELLOW}${CURRENT_BRANCH}${NC}"

if [[ "$ENVIRONMENT" == "production" ]] && [[ "$CURRENT_BRANCH" != "main" ]]; then
  echo -e "${RED}❌ Deploy para produção só é permitido na branch 'main'${NC}"
  echo -e "${YELLOW}Branch atual: $CURRENT_BRANCH${NC}"
  exit 1
fi

if [[ "$ENVIRONMENT" == "staging" ]] && [[ "$CURRENT_BRANCH" != "dev" ]]; then
  echo -e "${YELLOW}⚠️  Recomendado usar branch 'dev' para staging${NC}"
  echo -e "${YELLOW}Branch atual: $CURRENT_BRANCH${NC}"
  read -p "Deseja continuar? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Verificar mudanças não commitadas
if [[ -n $(git status -s) ]]; then
  echo -e "${RED}❌ Há mudanças não commitadas${NC}"
  echo -e "${YELLOW}Execute 'git status' para ver as mudanças${NC}"
  exit 1
fi

# Executar validações
echo -e "${BLUE}🔍 Executando validações...${NC}"
npm run validate

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Validações falharam${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Validações passaram${NC}"
echo ""

# Confirmar deploy
echo -e "${YELLOW}⚠️  Você está prestes a fazer deploy para ${ENVIRONMENT}${NC}"
read -p "Confirmar deploy? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Deploy cancelado${NC}"
  exit 0
fi

# Executar deploy
echo -e "${BLUE}🚀 Iniciando deploy...${NC}"

if [[ "$ENVIRONMENT" == "production" ]]; then
  # Deploy para produção (canal live)
  firebase hosting:channel:deploy live --project studio-9804515494-e1a53
else
  # Deploy para staging (canal dev)
  firebase hosting:channel:deploy dev --project studio-9804515494-e1a53
fi

if [ $? -eq 0 ]; then
  echo ""
  echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
  echo -e "${BLUE}🌍 Ambiente: ${YELLOW}${ENVIRONMENT}${NC}"
  
  if [[ "$ENVIRONMENT" == "staging" ]]; then
    echo -e "${BLUE}🔗 URL: ${YELLOW}https://studio-9804515494-e1a53--dev.web.app${NC}"
  else
    echo -e "${BLUE}🔗 URL: ${YELLOW}https://studio-9804515494-e1a53.web.app${NC}"
  fi
else
  echo -e "${RED}❌ Deploy falhou${NC}"
  exit 1
fi

echo ""
