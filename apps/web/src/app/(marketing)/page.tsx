import HomepageGate from '@/components/marketing/HomepageGate'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata = generateSEOMetadata({
  title: 'Maffix - Independent Musician Fan Engagement Platform',
  description:
    'Connect with your favorite independent musicians through gamified missions, exclusive prizes, and community engagement. Earn diamonds, draw prizes, and support artists on TikTok.',
  keywords: [
    'independent musicians',
    'fan engagement',
    'TikTok missions',
    'gacha system',
    'music community',
    'artist support',
  ],
  url: '/',
})

export default function HomePage() {
  return <HomepageGate />
}
