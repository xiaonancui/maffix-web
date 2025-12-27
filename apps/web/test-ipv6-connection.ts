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

const PASSWORD = '7QmuVLiKZrPyO0TJ'; // 替换为新密码
const PROJECT_REF = 'dbvtkxrbvjplakkvfjho';
const IPV6_ADDRESS = '2600:1f18:2e13:9d28:178e:604b:5b07:7fce';

const testCases = [
  {
    name: '1. IPv4 直连 (域名)',
    connectionString: `postgresql://postgres:${PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres`,
  },
  {
    name: '2. IPv6 直连 (使用方括号)',
    connectionString: `postgresql://postgres:${PASSWORD}@[${IPV6_ADDRESS}]:5432/postgres`,
  },
  {
    name: '3. IPv6 + 主机名验证禁用',
    connectionString: `postgresql://postgres:${PASSWORD}@[${IPV6_ADDRESS}]:5432/postgres?sslmode=require`,
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
      data: result as any,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

async function main() {
  log('\n🔍 IPv6 连接测试', 'cyan');
  log('='.repeat(60), 'cyan');

  log('\n📋 IPv6 地址信息:', 'yellow');
  log(`   IPv6: ${IPV6_ADDRESS}`, 'blue');
  log(`   域名: db.${PROJECT_REF}.supabase.co`, 'blue');

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
      if (result.data && result.data[0]) {
        log(`   数据库: ${result.data[0].current_database}`, 'green');
        log(`   用户: ${result.data[0].current_user}`, 'green');
      }
    } else {
      log(`❌ 失败:`, 'red');
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
    log(`   连接字符串:`, 'green');
    log(`   ${best.connectionString.replace(/:[^:@]+@/, ':****@')}`, 'green');
    log(`   总延迟: ${best.result.totalTime}ms`, 'green');

    log('\n📝 将此配置添加到 .env.local:', 'yellow');
    log(`   DATABASE_URL="${best.connectionString}"`, 'yellow');

    log('\n⚠️ 重要提示:', 'yellow');
    log('   - IPv6 地址可能会变化', 'yellow');
    log('   - 建议在 Supabase 中启用免费的 IPv4', 'yellow');
    log('   - 或使用 Pooler 连接（如果支持 IPv6）', 'yellow');
  } else {
    log('\n❌ IPv6 连接也失败了', 'red');
    log('\n🔧 推荐解决方案:', 'yellow');
    log('   1. 在 Supabase Dashboard 启用 IPv4（免费）', 'yellow');
    log('   2. 检查 Node.js 版本是否支持 IPv6', 'yellow');
    log('   3. 使用 Supabase CLI 本地开发', 'yellow');
  }

  log('\n' + '='.repeat(60), 'cyan');

  process.exit(successCount > 0 ? 0 : 1);
}

main().catch(console.error);
