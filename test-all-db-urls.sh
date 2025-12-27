#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

cd /Users/xiaonan/Projects/web/maffix-web/apps/web

echo -e "${CYAN}==================================================${NC}"
echo -e "${CYAN}Testing All Possible Supabase URL Formats${NC}"
echo -e "${CYAN}==================================================${NC}\n"

PASSWORD="7QmuVLiKZrPyO0TJ"
PROJECT_REF="dbvtkxrbvjplakkvfjho"
POOLER_HOST="aws-0-ap-southeast-1.pooler.supabase.com"
DIRECT_HOST="db.${PROJECT_REF}.supabase.co"

# Test different URL formats
test_url() {
  local name=$1
  local url=$2

  echo -e "\n${YELLOW}Testing: ${name}${NC}"
  echo -e "${CYAN}URL: ${url/:$PASSWORD/:****}${NC}\n"

  DATABASE_URL="$url" npm run test:db 2>&1 | grep -E "(Testing|successful|FAILED|error)" | head -5

  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ SUCCESS${NC}\n"
    return 0
  else
    echo -e "${RED}❌ FAILED${NC}\n"
    return 1
  fi
}

# Test 1: Direct connection (baseline)
test_url "Direct Connection (5432)" \
  "postgresql://postgres:${PASSWORD}@${DIRECT_HOST}:5432/postgres"

# Test 2: Pooler with postgres. prefix
test_url "Pooler Transaction (postgres. prefix)" \
  "postgresql://postgres.${PROJECT_REF}:${PASSWORD}@${POOLER_HOST}:6543/postgres?pgbouncer=true"

# Test 3: Pooler without prefix
test_url "Pooler Transaction (no prefix)" \
  "postgresql://postgres:${PASSWORD}@${POOLER_HOST}:6543/postgres?pgbouncer=true"

# Test 4: Pooler Session mode with prefix
test_url "Pooler Session (postgres. prefix)" \
  "postgresql://postgres.${PROJECT_REF}:${PASSWORD}@${POOLER_HOST}:6543/postgres"

# Test 5: Pooler Session mode without prefix
test_url "Pooler Session (no prefix)" \
  "postgresql://postgres:${PASSWORD}@${POOLER_HOST}:6543/postgres"

# Test 6: Direct with different port
test_url "Direct Non-Standard Port (5433)" \
  "postgresql://postgres:${PASSWORD}@${DIRECT_HOST}:5433/postgres"

echo -e "${CYAN}==================================================${NC}"
echo -e "${CYAN}Test Complete!${NC}"
echo -e "${CYAN}==================================================${NC}"
