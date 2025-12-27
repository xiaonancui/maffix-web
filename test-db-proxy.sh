#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}==================================================${NC}"
echo -e "${CYAN}Testing Supabase Connection with Proxy${NC}"
echo -e "${CYAN}==================================================${NC}"

# Set proxy
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
export all_proxy=socks5://127.0.0.1:7891

echo -e "\n${YELLOW}Proxy settings:${NC}"
echo "  https_proxy=$https_proxy"
echo "  http_proxy=$http_proxy"
echo "  all_proxy=$all_proxy"

cd /Users/xiaonan/Projects/web/maffix-web/apps/web

echo -e "\n${CYAN}Running database test...${NC}"
npm run test:db

if [ $? -eq 0 ]; then
  echo -e "\n${GREEN}✅ SUCCESS: Connection works with proxy!${NC}"
else
  echo -e "\n${RED}❌ FAILED: Connection still failing${NC}"
fi

echo -e "${CYAN}==================================================${NC}"
