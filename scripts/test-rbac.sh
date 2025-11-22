#!/bin/bash

# RBAC API Testing Script
# This script tests admin API endpoints with different authentication scenarios

BASE_URL="http://localhost:3000"
ADMIN_EMAIL="admin@maffix.com"
USER_EMAIL="user@maffix.com"
PASSWORD="password123"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 RBAC API Testing Script"
echo "=========================="
echo ""

# Function to print test result
print_result() {
    local test_name=$1
    local status=$2
    local details=$3
    
    if [ "$status" == "PASS" ]; then
        echo -e "${GREEN}✅ PASS${NC} - $test_name"
    elif [ "$status" == "FAIL" ]; then
        echo -e "${RED}❌ FAIL${NC} - $test_name"
        echo -e "   ${RED}Details: $details${NC}"
    else
        echo -e "${YELLOW}⏳ SKIP${NC} - $test_name"
    fi
}

# Test 1: Unauthorized Access (No Session)
echo "Test 1: Admin API - Unauthorized Access (No Session)"
echo "-----------------------------------------------------"
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/admin/missions")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "401" ]; then
    if echo "$body" | grep -q "NO_SESSION"; then
        print_result "Unauthorized access returns 401 with NO_SESSION" "PASS"
    else
        print_result "Unauthorized access returns 401 but wrong error code" "FAIL" "Expected NO_SESSION in response"
    fi
else
    print_result "Unauthorized access should return 401" "FAIL" "Got HTTP $http_code"
fi
echo ""

# Test 2: Check if server is running
echo "Test 2: Server Health Check"
echo "----------------------------"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL")
http_code=$(echo "$response" | tail -n 1)

if [ "$http_code" == "200" ] || [ "$http_code" == "307" ]; then
    print_result "Server is running" "PASS"
else
    print_result "Server health check" "FAIL" "Server may not be running (HTTP $http_code)"
fi
echo ""

# Test 3: Admin Endpoints List
echo "Test 3: Admin Endpoints Protection"
echo "-----------------------------------"
echo "Testing the following endpoints without authentication:"
echo ""

endpoints=(
    "GET /api/admin/missions"
    "GET /api/admin/merchandise"
    "GET /api/admin/packs"
)

for endpoint in "${endpoints[@]}"; do
    method=$(echo $endpoint | cut -d' ' -f1)
    path=$(echo $endpoint | cut -d' ' -f2)

    response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$path")
    http_code=$(echo "$response" | tail -n 1)
    
    if [ "$http_code" == "401" ]; then
        print_result "$endpoint" "PASS"
    else
        print_result "$endpoint" "FAIL" "Expected 401, got $http_code"
    fi
done
echo ""

# Summary
echo "=========================="
echo "📊 Test Summary"
echo "=========================="
echo ""
echo "⚠️  Note: This script only tests unauthenticated access."
echo "    For authenticated testing, use the browser or Postman"
echo "    with proper session cookies."
echo ""
echo "📖 See RBAC_TESTING.md for complete testing procedures."
echo ""

