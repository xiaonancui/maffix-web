#!/usr/bin/env node

/**
 * Database Latency Test Script
 * Tests direct connection vs proxy connection to Supabase
 */

const { PrismaClient } = require('@prisma/client');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function formatTime(ms) {
  return `${ms.toFixed(2)}ms`;
}

async function testPrismaConnection(label) {
  const prisma = new PrismaClient();
  const results = [];

  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`Testing: ${label}`, 'cyan');
  log(`${'='.repeat(60)}`, 'cyan');

  // Warm up
  try {
    await prisma.$queryRaw`SELECT 1`;
    log('✓ Connection successful', 'green');
  } catch (error) {
    log(`✗ Connection failed: ${error.message}`, 'red');
    await prisma.$disconnect();
    return null;
  }

  // Test 1: Simple query (10 times)
  log('\n📊 Test 1: Simple Query (SELECT 1) - 10 iterations', 'blue');
  for (let i = 0; i < 10; i++) {
    const start = Date.now();
    try {
      await prisma.$queryRaw`SELECT 1 as test`;
      const duration = Date.now() - start;
      results.push({ test: 'simple', duration });
      log(`  Iteration ${i + 1}: ${formatTime(duration)}`, duration < 100 ? 'green' : 'yellow');
    } catch (error) {
      log(`  Iteration ${i + 1}: FAILED - ${error.message}`, 'red');
      results.push({ test: 'simple', duration: null, error: error.message });
    }
    // Small delay between queries
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Test 2: Complex query (count users)
  log('\n📊 Test 2: Complex Query (COUNT users) - 5 iterations', 'blue');
  for (let i = 0; i < 5; i++) {
    const start = Date.now();
    try {
      const result = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "users"`;
      const duration = Date.now() - start;
      results.push({ test: 'complex', duration });
      log(`  Iteration ${i + 1}: ${formatTime(duration)} (Count: ${result[0].count})`, duration < 200 ? 'green' : 'yellow');
    } catch (error) {
      log(`  Iteration ${i + 1}: FAILED - ${error.message}`, 'red');
      results.push({ test: 'complex', duration: null, error: error.message });
    }
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Test 3: Transaction test
  log('\n📊 Test 3: Transaction (SELECT + rollback) - 3 iterations', 'blue');
  for (let i = 0; i < 3; i++) {
    const start = Date.now();
    try {
      await prisma.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT 1`;
        await tx.$queryRaw`SELECT NOW()`;
      });
      const duration = Date.now() - start;
      results.push({ test: 'transaction', duration });
      log(`  Iteration ${i + 1}: ${formatTime(duration)}`, duration < 300 ? 'green' : 'yellow');
    } catch (error) {
      log(`  Iteration ${i + 1}: FAILED - ${error.message}`, 'red');
      results.push({ test: 'transaction', duration: null, error: error.message });
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  await prisma.$disconnect();

  // Calculate statistics
  const simpleResults = results.filter(r => r.test === 'simple' && r.duration !== null);
  const complexResults = results.filter(r => r.test === 'complex' && r.duration !== null);
  const transactionResults = results.filter(r => r.test === 'transaction' && r.duration !== null);

  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const min = (arr) => Math.min(...arr);
  const max = (arr) => Math.max(...arr);

  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`📈 RESULTS: ${label}`, 'cyan');
  log(`${'='.repeat(60)}`, 'cyan');

  if (simpleResults.length > 0) {
    log('\n🔹 Simple Query:', 'yellow');
    log(`  Average: ${formatTime(avg(simpleResults))}`, 'green');
    log(`  Min: ${formatTime(min(simpleResults))}`, 'green');
    log(`  Max: ${formatTime(max(simpleResults))}`, 'green');
  }

  if (complexResults.length > 0) {
    log('\n🔹 Complex Query:', 'yellow');
    log(`  Average: ${formatTime(avg(complexResults))}`, 'green');
    log(`  Min: ${formatTime(min(complexResults))}`, 'green');
    log(`  Max: ${formatTime(max(complexResults))}`, 'green');
  }

  if (transactionResults.length > 0) {
    log('\n🔹 Transaction:', 'yellow');
    log(`  Average: ${formatTime(avg(transactionResults))}`, 'green');
    log(`  Min: ${formatTime(min(transactionResults))}`, 'green');
    log(`  Max: ${formatTime(max(transactionResults))}`, 'green');
  }

  return {
    label,
    simple: simpleResults.length > 0 ? {
      avg: avg(simpleResults),
      min: min(simpleResults),
      max: max(simpleResults)
    } : null,
    complex: complexResults.length > 0 ? {
      avg: avg(complexResults),
      min: min(complexResults),
      max: max(complexResults)
    } : null,
    transaction: transactionResults.length > 0 ? {
      avg: avg(transactionResults),
      min: min(transactionResults),
      max: max(transactionResults)
    } : null,
  };
}

async function main() {
  log('\n🚀 Supabase Database Latency Test', 'cyan');
  log('Testing connection from local development environment\n', 'cyan');

  // Test direct connection
  const directResults = await testPrismaConnection('Direct Connection (No Proxy)');

  log('\n\n✅ Tests completed!', 'green');
  log('\n💡 Recommendations:', 'cyan');

  if (directResults && directResults.simple) {
    if (directResults.simple.avg < 100) {
      log('  ✓ Direct connection latency is EXCELLENT (< 100ms)', 'green');
      log('  → No proxy needed for development', 'green');
    } else if (directResults.simple.avg < 200) {
      log('  ✓ Direct connection latency is GOOD (100-200ms)', 'yellow');
      log('  → Usable for development', 'yellow');
    } else if (directResults.simple.avg < 400) {
      log('  ⚠ Direct connection latency is ACCEPTABLE (200-400ms)', 'yellow');
      log('  → Consider using connection pooling', 'yellow');
    } else {
      log('  ✗ Direct connection latency is HIGH (> 400ms)', 'red');
      log('  → Consider using a proxy or VPN', 'red');
    }
  }

  log('\n' + '='.repeat(60), 'cyan');
}

main().catch(console.error);
