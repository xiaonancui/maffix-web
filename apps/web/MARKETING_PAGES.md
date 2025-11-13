# Maffix Marketing Pages Documentation

## Overview

This document describes the marketing pages implementation for Maffix, including architecture, components, and customization guidelines.

## Architecture

### Route Structure

All marketing pages are organized under the `(marketing)` route group:

```
apps/web/src/app/
├── (marketing)/
│   ├── layout.tsx              # Shared layout with Navbar & Footer
│   ├── page.tsx                # Homepage (/)
│   ├── features/
│   │   ├── page.tsx            # Features overview (/features)
│   │   ├── gacha/page.tsx      # Gacha feature (/features/gacha)
│   │   ├── missions/page.tsx   # Missions feature (/features/missions)
│   │   ├── store/page.tsx      # Store feature (/features/store)
│   │   └── community/page.tsx  # Community feature (/features/community)
│   ├── how-it-works/page.tsx   # How it works guide
│   └── faq/page.tsx            # FAQ page
```

### Shared Components

Located in `apps/web/src/components/marketing/`:

- **Navbar.tsx** - Sticky navigation with mobile menu
- **Footer.tsx** - Site footer with links and social media
- **Hero.tsx** - Hero section with CTA buttons
- **FeatureCard.tsx** - Feature showcase cards
- **SectionHeading.tsx** - Consistent section titles
- **CTA.tsx** - Call-to-action sections
- **AnimatedSection.tsx** - Scroll-triggered animations
- **Testimonial.tsx** - User testimonial cards

## Key Features

### 1. SEO Optimization

All pages include:
- Unique meta titles and descriptions
- Open Graph tags for social sharing
- Twitter Card metadata
- JSON-LD structured data (homepage)
- Sitemap and robots.txt

**SEO Helper**: `apps/web/src/lib/seo.ts`

```typescript
import { generateMetadata } from '@/lib/seo'

export const metadata = generateMetadata({
  title: 'Your Page Title',
  description: 'Your page description',
  keywords: ['keyword1', 'keyword2'],
  url: '/your-page',
})
```

### 2. Animations

Using Framer Motion for smooth animations:
- Scroll-triggered fade-ins
- Staggered element animations
- Hover effects on cards

**Usage**:
```tsx
import AnimatedSection from '@/components/marketing/AnimatedSection'

<AnimatedSection delay={0.2}>
  <YourContent />
</AnimatedSection>
```

### 3. Responsive Design

All pages are mobile-first and fully responsive:
- Mobile: Single column layouts
- Tablet: 2-column grids
- Desktop: 3-4 column grids

### 4. Performance

- Static Site Generation (SSG) for all marketing pages
- Optimized bundle sizes (1.97-4.3 kB per page)
- Lazy loading for animations
- Efficient CSS with Tailwind

## Customization Guide

### Adding a New Marketing Page

1. Create the page file:
```bash
touch apps/web/src/app/(marketing)/your-page/page.tsx
```

2. Use the template:
```tsx
import Hero from '@/components/marketing/Hero'
import SectionHeading from '@/components/marketing/SectionHeading'
import CTA from '@/components/marketing/CTA'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata = generateSEOMetadata({
  title: 'Your Page Title',
  description: 'Your page description',
  url: '/your-page',
})

export default function YourPage() {
  return (
    <div className="bg-white">
      <Hero
        badge="🎉 Badge Text"
        title="Your Page Title"
        subtitle="Subtitle"
        description="Description"
        primaryCTA={{ text: 'Get Started', href: '/register' }}
      />
      
      {/* Your content sections */}
      
      <CTA
        title="Ready to Start?"
        description="Join us today!"
        primaryButton={{ text: 'Sign Up', href: '/register' }}
      />
    </div>
  )
}
```

3. Add to navigation (if needed):
```tsx
// apps/web/src/components/marketing/Navbar.tsx
const navigation = [
  // ... existing items
  { name: 'Your Page', href: '/your-page' },
]
```

4. Add to sitemap:
```tsx
// apps/web/src/app/sitemap.ts
const routes = [
  // ... existing routes
  '/your-page',
]
```

### Customizing Colors

Edit `apps/web/tailwind.config.ts`:

```typescript
colors: {
  neon: {
    cyan: '#00f5ff',
    magenta: '#ff00ff',
    // Add your colors
  },
}
```

### Customizing Animations

Edit `apps/web/tailwind.config.ts`:

```typescript
animation: {
  'your-animation': 'yourKeyframe 1s ease-in-out',
},
keyframes: {
  yourKeyframe: {
    '0%': { /* start state */ },
    '100%': { /* end state */ },
  },
}
```

## Content Management

### Current Content Status

⚠️ **All content is currently placeholder text**. Update with real content:

1. **Statistics** (Homepage, feature pages)
   - Update user counts, mission counts, etc.
   - Source from database or analytics

2. **Testimonials** (Homepage)
   - Replace with real user testimonials
   - Add real user photos

3. **Feature Descriptions**
   - Refine based on actual product features
   - Add screenshots/videos

### Adding Real Images

1. Add images to `apps/web/public/`
2. Use Next.js Image component:

```tsx
import Image from 'next/image'

<Image
  src="/your-image.jpg"
  alt="Description"
  width={1200}
  height={630}
  priority // for above-the-fold images
/>
```

## Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"  # Production URL
```

## Testing Checklist

- [ ] All pages load without errors
- [ ] Navigation works on all pages
- [ ] Mobile menu functions correctly
- [ ] All links work (internal and external)
- [ ] Forms submit correctly (contact, newsletter)
- [ ] Animations trigger on scroll
- [ ] SEO metadata is correct (check with browser inspector)
- [ ] Social sharing works (test with Facebook Debugger, Twitter Card Validator)
- [ ] Page loads fast (test with Lighthouse)
- [ ] Responsive on mobile, tablet, desktop
- [ ] Works in Chrome, Safari, Firefox, Edge

## Performance Optimization

Current status: ✅ All pages are statically generated

Future optimizations:
- [ ] Add image optimization with next/image
- [ ] Implement lazy loading for below-fold content
- [ ] Add loading skeletons
- [ ] Optimize font loading
- [ ] Add service worker for offline support

## Next Steps

1. **Content**: Replace placeholder content with real data
2. **Images**: Add brand assets and feature screenshots
3. **Phase 3**: Build trust pages (About, Artists, Membership, Contact)
4. **Phase 4**: Implement blog system
5. **Phase 5**: Add legal pages (Terms, Privacy)
6. **Phase 6**: Final SEO optimization and testing

## Support

For questions or issues, contact the development team or refer to:
- Next.js Documentation: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion/

