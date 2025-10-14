import { NextResponse } from 'next/server'

/**
 * Test endpoint to check environment variables
 * This helps diagnose why test accounts might not be working
 * 
 * Access: /api/test-env
 */
export async function GET() {
  const envInfo = {
    nodeEnv: process.env.NODE_ENV,
    enableTestAccounts: process.env.ENABLE_TEST_ACCOUNTS,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    
    // Computed values
    allowTestAccounts: 
      process.env.NODE_ENV === 'development' || 
      process.env.ENABLE_TEST_ACCOUNTS === 'true',
    
    // Diagnostic info
    timestamp: new Date().toISOString(),
    vercelEnv: process.env.VERCEL_ENV,
    vercelUrl: process.env.VERCEL_URL,
  }

  return NextResponse.json({
    message: 'Environment check',
    environment: envInfo,
    testAccountsEnabled: envInfo.allowTestAccounts,
    diagnosis: {
      canUseTestAccounts: envInfo.allowTestAccounts,
      reason: envInfo.allowTestAccounts 
        ? 'Test accounts are enabled' 
        : `Test accounts disabled. NODE_ENV=${envInfo.nodeEnv}, ENABLE_TEST_ACCOUNTS=${envInfo.enableTestAccounts}`,
      nextSteps: envInfo.allowTestAccounts 
        ? 'Test accounts should work. Try logging in with admin@maffix.com / password123'
        : 'Add ENABLE_TEST_ACCOUNTS=true to Vercel environment variables and redeploy',
    }
  })
}

