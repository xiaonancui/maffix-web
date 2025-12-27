import { PrismaClient } from '@prisma/client';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

const PASSWORD = '7QmuVLiKZrPyO0TJ';
const PROJECT_REF = 'dbvtkxrbvjplakkvfjho';
const POOLER_HOST = 'aws-0-ap-southeast-1.pooler.supabase.com';
const DIRECT_HOST = `db.${PROJECT_REF}.supabase.co`;

const testCases = [
  {
    name: '1. Direct Connection (Port 5432)',
    connectionString: `postgresql://postgres:${PASSWORD}@${DIRECT_HOST}:5432/postgres`,
  },
  {
    name: '2. Pooler Session Mode - No Prefix (Port 6543)',
    connectionString: `postgresql://postgres:${PASSWORD}@${POOLER_HOST}:6543/postgres`,
  },
  {
    name: '3. Pooler Session Mode - With Prefix (Port 6543)',
    connectionString: `postgresql://postgres.${PROJECT_REF}:${PASSWORD}@${POOLER_HOST}:6543/postgres`,
  },
  {
    name: '4. Pooler Transaction Mode - No Prefix (Port 6543)',
    connectionString: `postgresql://postgres:${PASSWORD}@${POOLER_HOST}:6543/postgres?pgbouncer=true`,
  },
  {
    name: '5. Pooler Transaction Mode - With Prefix (Port 6543)',
    connectionString: `postgresql://postgres.${PROJECT_REF}:${PASSWORD}@${POOLER_HOST}:6543/postgres?pgbouncer=true`,
  },
];

async function testConnection(name: string, connectionString: string) {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: connectionString,
      },
    },
  });

  try {
    const start = Date.now();
    await prisma.$connect();
    const connectTime = Date.now() - start;

    const result = await prisma.$queryRaw`SELECT current_database(), current_user`;
    const queryTime = Date.now() - start - connectTime;

    await prisma.$disconnect();

    return {
      success: true,
      connectTime,
      queryTime,
      totalTime: connectTime + queryTime,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

async function main() {
  log('\n🔍 Supabase 连接诊断测试', 'cyan');
  log('='.repeat(60), 'cyan');

  let successCount = 0;
  const results: any[] = [];

  for (const testCase of testCases) {
    log(`\n${testCase.name}`, 'yellow');
    log(`连接字符串: ${testCase.connectionString.replace(/:[^:@]+@/, ':****@')}`, 'blue');

    const result = await testConnection(testCase.name, testCase.connectionString);
    results.push({ ...testCase, result });

    if (result.success) {
      successCount++;
      log(`✅ 成功!`, 'green');
      log(`   连接时间: ${result.connectTime}ms`, 'green');
      log(`   查询时间: ${result.queryTime}ms`, 'green');
      log(`   总时间: ${result.totalTime}ms`, 'green');
    } else {
      log(`❌ 失败:`, 'red');
      log(`   ${result.error}`, 'red');
    }

    // Delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  log('\n' + '='.repeat(60), 'cyan');
  log(`测试完成! ${successCount}/${testCases.length} 成功`, 'cyan');

  // 推荐
  if (successCount > 0) {
    log('\n💡 推荐配置:', 'cyan');
    const successful = results.filter(r => r.result.success);
    const best = successful.sort((a, b) => a.result.totalTime - b.result.totalTime)[0];

    log(`\n✨ 最快的连接方式:`, 'green');
    log(`   名称: ${best.name}`, 'green');
    log(`   连接字符串:`, 'green');
    log(`   DATABASE_URL="${best.connectionString.replace(/:[^:@]+@/, ':****@')}"`, 'green');
    log(`   总延迟: ${best.result.totalTime}ms`, 'green');

    log('\n📝 将此配置添加到 .env.local:', 'yellow');
    log(`   DATABASE_URL="${best.connectionString}"`, 'yellow');
  } else {
    log('\n❌ 所有连接都失败了!', 'red');
    log('\n可能的原因:', 'yellow');
    log('   1. 密码不正确', 'yellow');
    log('   2. Supabase 项目已暂停', 'yellow');
    log('   3. 网络问题', 'yellow');
    log('   4. 数据库不存在', 'yellow');
  }

  log('\n' + '='.repeat(60), 'cyan');

  process.exit(successCount > 0 ? 0 : 1);
}

main().catch(console.error);
