#!/bin/bash

cd /Users/xiaonan/Projects/web/maffix-web/apps/web

export DATABASE_URL="postgresql://postgres:jYUM1YIwhi5DOzTc@db.dbvtkxrbvjplakkvfjho.supabase.co:5432/postgres?sslmode=require"

echo "🔍 Testing with direct Prisma Client..."
echo "DATABASE_URL: ${DATABASE_URL/:*}:****@${DATABASE_URL/*@*/}"
echo ""

npx tsx test-db-direct.ts
