#!/usr/bin/env node

const { Client } = require('pg');

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

async function testConnection(connectionString, label) {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`Testing: ${label}`, 'cyan');
  log(`URL: ${connectionString.replace(/:[^:@]+@/, ':****@')}`, 'cyan');
  log(`${'='.repeat(60)}`, 'cyan');

  const results = [];

  try {
    const start = Date.now();
    await client.connect();
    const connectTime = Date.now() - start;
    log(`\n✓ Connected in ${connectTime}ms`, 'green');

    // Test 1: Simple query
    log('\n📊 Running 10 simple queries...', 'blue');
    for (let i = 0; i < 10; i++) {
      const start = Date.now();
      const res = await client.query('SELECT 1 as test');
      const duration = Date.now() - start;
      results.push({ test: 'simple', duration });
      const color = duration < 100 ? 'green' : 'yellow';
      log(`  Query ${i + 1}: ${duration.toFixed(2)}ms`, color);
      await new Promise(r => setTimeout(r, 100));
    }

    // Test 2: Complex query
    log('\n📊 Running 5 complex queries...', 'blue');
    for (let i = 0; i < 5; i++) {
      const start = Date.now();
      try {
        const res = await client.query('SELECT COUNT(*) as count FROM "users"');
        const duration = Date.now() - start;
        results.push({ test: 'complex', duration });
        const color = duration < 200 ? 'green' : 'yellow';
        log(`  Query ${i + 1}: ${duration.toFixed(2)}ms (Count: ${res.rows[0].count})`, color);
      } catch (err) {
        log(`  Query ${i + 1}: Table doesn't exist - skipping`, 'yellow');
      }
      await new Promise(r => setTimeout(r, 200));
    }

    await client.end();

    // Statistics
    const simpleResults = results.filter(r => r.test === 'simple');
    const complexResults = results.filter(r => r.test === 'complex');

    const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
    const min = arr => Math.min(...arr);
    const max = arr => Math.max(...arr);

    log(`\n${'='.repeat(60)}`, 'cyan');
    log(`📈 RESULTS`, 'cyan');

    if (simpleResults.length > 0) {
      log('\n🔹 Simple Query:', 'yellow');
      log(`  Average: ${avg(simpleResults).toFixed(2)}ms`, 'green');
      log(`  Min: ${min(simpleResults).toFixed(2)}ms`, 'green');
      log(`  Max: ${max(simpleResults).toFixed(2)}ms`, 'green');
    }

    if (complexResults.length > 0) {
      log('\n🔹 Complex Query:', 'yellow');
      log(`  Average: ${avg(complexResults).toFixed(2)}ms`, 'green');
      log(`  Min: ${min(complexResults).toFixed(2)}ms`, 'green');
      log(`  Max: ${max(complexResults).toFixed(2)}ms`, 'green');
    }

    return { success: true, simple: simpleResults, complex: complexResults };

  } catch (error) {
    log(`\n✗ Connection failed:`, 'red');
    log(`  ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function main() {
  log('\n🚀 Supabase Database Connection Test', 'cyan');

  // Test direct connection
  const directUrl = 'postgresql://postgres:7QmuVLiKZrPyO0TJ@db.dbvtkxrbvjplakkvfjho.supabase.co:5432/postgres';
  const result1 = await testConnection(directUrl, 'Direct Connection (Port 5432)');

  // Test pooler connection
  const poolerUrl = 'postgresql://postgres:7QmuVLiKZrPyO0TJ@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';
  const result2 = await testConnection(poolerUrl, 'Pooler Connection (Port 6543)');

  log('\n' + '='.repeat(60), 'cyan');
  log('✅ Tests completed!', 'green');

  // Recommendations
  if (result1.success && result1.simple) {
    const avg = result1.simple.reduce((a, b) => a + b.duration, 0) / result1.simple.length;
    if (avg < 100) {
      log('\n💡 Direct connection performance is EXCELLENT', 'green');
      log('  → No proxy needed', 'green');
    } else if (avg < 200) {
      log('\n💡 Direct connection performance is GOOD', 'yellow');
      log('  → Acceptable for development', 'yellow');
    } else {
      log('\n💡 Consider using proxy for better performance', 'yellow');
    }
  } else if (result2.success && result2.simple) {
    log('\n💡 Pooler connection works! Use this URL:', 'green');
    log('  DATABASE_URL="postgresql://postgres:****@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"', 'green');
  } else {
    log('\n💡 Both connections failed. Check:', 'red');
    log('  1. Database credentials', 'red');
    log('  2. Network/firewall settings', 'red');
    log('  3. Supabase project status', 'red');
  }

  log('\n' + '='.repeat(60), 'cyan');
}

main().catch(console.error);
