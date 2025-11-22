#!/bin/bash

# Admin Pages Testing Script
# This script helps you quickly test all admin pages

echo "🧪 Admin Pages Testing Helper"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:3000"

echo -e "${BLUE}📋 Admin Pages to Test:${NC}"
echo ""

# List all admin pages
pages=(
  "/admin|Admin Home"
  "/admin/missions|Mission Management"
  "/admin/missions/new|Create Mission"
  "/admin/releases|Release Management"
  "/admin/releases/new|Create Release"
  "/admin/gacha|Gacha Dashboard"
  "/admin/gacha/items/new|Create Gacha Item"
  "/admin/merchandise|Merchandise Management"
  "/admin/merchandise/new|Create Product"
  "/admin/packs|Premium Packs"
  "/admin/packs/new|Create Pack"
  "/admin/users|User Management"
  "/admin/prizes|Prize Management"
  "/admin/prizes/new|Create Prize"
  "/admin/analytics|Analytics Dashboard"
)

counter=1
for page in "${pages[@]}"; do
  IFS='|' read -r path name <<< "$page"
  echo -e "${GREEN}${counter}.${NC} ${name}"
  echo "   ${BASE_URL}${path}"
  echo ""
  ((counter++))
done

echo ""
echo -e "${YELLOW}🔐 Test Account:${NC}"
echo "   Email: admin@maffix.com"
echo "   Password: password123"
echo ""

echo -e "${YELLOW}📚 Documentation:${NC}"
echo "   Full Testing Guide: docs/testing/MANUAL_TESTING_GUIDE.md"
echo "   Quick URLs: docs/testing/QUICK_TEST_URLS.md"
echo ""

echo -e "${YELLOW}🐛 Check for:${NC}"
echo "   • Console errors (F12 → Console)"
echo "   • Network errors (F12 → Network)"
echo "   • Missing data"
echo "   • Broken functionality"
echo ""

# Ask if user wants to open browser
read -p "Open admin panel in browser? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Opening ${BASE_URL}/admin..."
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "${BASE_URL}/admin"
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "${BASE_URL}/admin"
  else
    echo "Please open ${BASE_URL}/admin manually"
  fi
fi

echo ""
echo -e "${GREEN}✅ Happy Testing!${NC}"

