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

const PASSWORD = 'jYUM1YIwhi5DOzTc';
const IPV4_ADDRESS = '44.214.218.140';
const HOSTNAME = 'db.dbvtkxrbvjplakkvfjho.supabase.co';

const testCases = [
  {
    name: '1. 域名连接 (标准)',
    connectionString: `postgresql://postgres:${PASSWORD}@${HOSTNAME}:5432/postgres`,
  },
  {
    name: '2. 直接 IP 地址',
    connectionString: `postgresql://postgres:${PASSWORD}@${IPV4_ADDRESS}:5432/postgres`,
  },
  {
    name: '3. 域名 + sslmode=require',
    connectionString: `postgresql://postgres:${PASSWORD}@${HOSTNAME}:5432/postgres?sslmode=require`,
  },
  {
    name: '4. 直接 IP + sslmode=require',
    connectionString: `postgresql://postgres:${PASSWORD}@${IPV4_ADDRESS}:5432/postgres?sslmode=require`,
  },
  {
    name: '5. 域名 + sslmode=no-verify (调试)',
    connectionString: `postgresql://postgres:${PASSWORD}@${HOSTNAME}:5432/postgres?sslmode=no-verify`,
  },
];

async function testConnection(name: string, connectionString: string) {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: connectionString,
      },
    },
    log: ['error', 'warn'],
  });

  try {
    const start = Date.now();
    await prisma.$connect();
    const connectTime = Date.now() - start;

    const result = await prisma.$queryRaw`SELECT current_database(), current_user, version()`;
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
      code: error.code,
    };
  }
}

async function main() {
  log('\n🔍 Supabase 连接诊断（启用 IPv4 后）', 'cyan');
  log('='.repeat(60), 'cyan');

  log('\n📋 网络信息:', 'yellow');
  log(`   IPv4 地址: ${IPV4_ADDRESS}`, 'blue');
  log(`   域名: ${HOSTNAME}`, 'blue');
  log(`   密码: ${PASSWORD}`, 'blue');

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
      if (result.code) {
        log(`   错误代码: ${result.code}`, 'red');
      }
      log(`   ${result.error}`, 'red');
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  log('\n' + '='.repeat(60), 'cyan');
  log(`测试完成! ${successCount}/${testCases.length} 成功`, 'cyan');

  if (successCount > 0) {
    log('\n💡 推荐配置:', 'cyan');
    const successful = results.filter(r => r.result.success);
    const best = successful.sort((a, b) => a.result.totalTime - b.result.totalTime)[0];

    log(`\n✨ 最快的连接方式:`, 'green');
    log(`   ${best.name}`, 'green');
    log(`   总延迟: ${best.result.totalTime}ms`, 'green');

    log('\n📝 更新 .env.local:', 'yellow');
    log(`   DATABASE_URL="${best.connectionString.replace(/:[^:@]+@/, ':****@')}"`, 'yellow');
  } else {
    log('\n❌ 所有连接都失败了', 'red');
    log('\n🔧 可能的原因:', 'yellow');
    log('   1. 密码错误（请再次确认）', 'yellow');
    log('   2. IPv4 地址还未完全生效（需要等待）', 'yellow');
    log('   3. 本地防火墙阻止 5432 端口', 'yellow');
    log('   4. Node.js/Prisma 版本问题', 'yellow');

    log('\n💡 建议:', 'yellow');
    log('   1. 在 Supabase SQL Editor 确认密码正确', 'yellow');
    log('   2. 等待 5-10 分钟后重试', 'yellow');
    log('   3. 尝试重启开发服务器', 'yellow');
  }

  log('\n' + '='.repeat(60), 'cyan');

  process.exit(successCount > 0 ? 0 : 1);
}

main().catch(console.error);
