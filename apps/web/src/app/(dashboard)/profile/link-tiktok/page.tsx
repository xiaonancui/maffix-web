import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import TikTokLinkButton from '@/components/dashboard/TikTokLinkButton'
import TikTokUnlinkButton from '@/components/dashboard/TikTokUnlinkButton'

export default async function LinkTikTokPage() {
  // Dynamic import to avoid build-time database connection
  const { db } = await import('@/lib/db')

  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Fetch user's TikTok connection status
  let user: any = null

  const isTestAccount =
    process.env.NODE_ENV === 'development' &&
    (session.user.id?.includes('test-') ||
      session.user.id?.includes('demo-') ||
      session.user.id?.includes('admin-'))

  if (isTestAccount) {
    // Mock data for test accounts
    user = {
      id: session.user.id,
      tiktokUsername: '@testuser',
      tiktokUserId: 'test-tiktok-id',
      email: session.user.email,
    }
  } else {
    try {
      user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          email: true,
          tiktokUsername: true,
          tiktokUserId: true,
        },
      })
    } catch (error) {
      console.error('Database fetch failed:', error)
      user = {
        id: session.user.id,
        email: session.user.email,
        tiktokUsername: null,
        tiktokUserId: null,
      }
    }
  }

  const isLinked = !!user?.tiktokUsername

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/profile"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-gray-700"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to Profile
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 text-6xl">📱</div>
        <h1 className="text-4xl font-bold text-gray-900">Link TikTok Account</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Connect your TikTok account to complete missions and earn rewards
        </p>
      </div>

      {/* Status Card */}
      <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Connection Status</h2>
          {isLinked ? (
            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
              ✓ Connected
            </span>
          ) : (
            <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800">
              ⚠ Not Connected
            </span>
          )}
        </div>

        {isLinked ? (
          // Connected State
          <div>
            <div className="mb-6 rounded-lg bg-green-50 p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-green-800">
                    TikTok Account Connected
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      Your TikTok account <strong>{user.tiktokUsername}</strong> is
                      successfully linked. You can now complete TikTok missions and earn
                      diamonds!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Connected Account
              </h3>
              <div className="flex items-center justify-between rounded-lg border border-border bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-2xl text-foreground">
                    📱
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {user.tiktokUsername}
                    </div>
                    <div className="text-sm text-muted-foreground">TikTok Account</div>
                  </div>
                </div>
                <TikTokUnlinkButton />
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-[#FF5656]"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-blue-800">What&apos;s Next?</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Head over to the Missions page to start completing TikTok missions
                      and earning diamonds. Each mission you complete will be automatically
                      verified!
                    </p>
                  </div>
                  <div className="mt-4">
                    <Link
                      href="/missions"
                      className="inline-flex items-center rounded-md bg-[#FF5656] px-4 py-2 text-sm font-semibold text-foreground hover:bg-[#FF5656]/90"
                    >
                      Browse Missions →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Not Connected State
          <div>
            <div className="mb-6 rounded-lg bg-yellow-50 p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-yellow-800">
                    TikTok Account Required
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      You need to link your TikTok account to complete missions and earn
                      diamonds. This is a one-time setup that takes less than a minute.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Why Link Your TikTok Account?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-700">
                    <strong>Complete TikTok Missions:</strong> Follow artists, like videos,
                    repost content, and use audio tracks to earn diamonds
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-700">
                    <strong>Automatic Verification:</strong> Your mission completions are
                    verified automatically - no manual approval needed
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-700">
                    <strong>Earn More Diamonds:</strong> Access exclusive TikTok missions
                    with higher rewards
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-700">
                    <strong>Safe & Secure:</strong> We only request read-only access to
                    verify your mission completions
                  </span>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <TikTokLinkButton />
            </div>

            <div className="rounded-lg border border-border bg-gray-50 p-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                How It Works
              </h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2 font-semibold">1.</span>
                  <span>Click the &quot;Link TikTok Account&quot; button above</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-semibold">2.</span>
                  <span>You&apos;ll be redirected to TikTok to authorize the connection</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-semibold">3.</span>
                  <span>
                    After authorization, you&apos;ll be redirected back to Maffix
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-semibold">4.</span>
                  <span>Start completing missions and earning diamonds!</span>
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
