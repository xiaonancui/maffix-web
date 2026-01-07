# Maffix Design System

> **Vibrant. Energetic. Unforgettable.**
> A maximalist design system for the next generation of music fans.

---

## 🎨 Design Philosophy

Maffix's design language is built for **energy, engagement, and excitement**. We embrace:

- **Bold maximalism** - Layered effects, neon glows, and vibrant gradients
- **High contrast** - Dark backgrounds with electric accent colors
- **Fluid motion** - Smooth transitions and staggered animations
- **Depth & atmosphere** - Backdrop blur, layered transparency, dramatic shadows
- **Asymmetric confidence** - Breaking grids, unexpected layouts

This is not minimal. This is not subtle. This is **intentionally loud** because our audience expects it.

---

## 🌈 Color Palette

### Primary Colors

```css
--maffix-hot-pink: #FF1F7D;      /* Primary CTA, urgent actions */
--maffix-purple: #8B5CF6;        /* Secondary actions, cool accents */
--maffix-gold: #FFC700;          /* Rewards, achievements, value */
--maffix-cyan: #00F5FF;          /* New, live, attention */
--maffix-electric-purple: #B200FF; /* Premium, exclusive */
```

### Semantic Usage

| Color | Use Cases | Examples |
|-------|-----------|----------|
| **Hot Pink** `#FF1F7D` | Primary CTAs, borders on hover, missions, featured items | Continue Missions button, promo card border |
| **Purple** `#8B5CF6` | Secondary actions, level/XP, cool-tone cards | Level card, mission progress |
| **Gold** `#FFC700` | Currency (diamonds/points), rewards, pricing | Diamond count, price display |
| **Cyan** `#00F5FF` | Live indicators, new badges, tertiary actions | LIVE NOW badge, stock indicators |
| **Electric Purple** `#B200FF` | Premium features, Aura Zone, gacha | Aura Zone button, premium packs |

### Surface Colors

```css
--maffix-surface-base: #0A0A0F;       /* Page background */
--maffix-surface-card: #16161F;       /* Card backgrounds */
--maffix-surface-raised: #1E1E2D;     /* Elevated elements */
```

### Text Colors

```css
--maffix-text-primary: #FFFFFF;       /* Primary text */
--maffix-text-secondary: rgba(255, 255, 255, 0.70);  /* Secondary text */
--maffix-text-tertiary: rgba(255, 255, 255, 0.50);   /* Tertiary text */
--maffix-text-muted: rgba(255, 255, 255, 0.40);      /* Muted text */
```

---

## ✍️ Typography

### Font Stack

```css
--font-sans: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
--font-display: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'Space Mono', 'Courier New', monospace;
```

### Type Scale

| Element | Class | Size | Weight | Usage |
|---------|-------|------|--------|-------|
| **Hero H1** | `text-4xl md:text-5xl lg:text-6xl` | 36-60px | 900 (Black) | Welcome headings |
| **H2** | `text-3xl` | 30px | 900 (Black) | Section headers |
| **H3** | `text-2xl` | 24px | 900 (Black) | Subsection headers |
| **H4** | `text-xl` | 20px | 700 (Bold) | Card titles |
| **Body Large** | `text-base` | 16px | 400 (Regular) | Descriptions |
| **Body** | `text-sm` | 14px | 600 (Semibold) | UI text |
| **Caption** | `text-xs` | 12px | 700 (Bold) | Labels, badges |

### Typography Rules

1. **Headings** always use `font-display` (Montserrat) with `font-black` (900 weight)
2. **Body text** uses `font-sans` (Outfit)
3. **Data/numbers** use `tabular-nums` for alignment
4. **ALL CAPS labels** use `uppercase tracking-wider` (0.3em letter-spacing)
5. **Tight leading** on headings: `leading-tight` for impact

### Examples

```tsx
// Hero heading
<h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">

// Section header
<h2 className="font-display text-3xl font-black text-white">

// Uppercase label
<div className="font-display text-xs font-bold uppercase tracking-[0.3em] text-white/50">

// Numeric display
<div className="font-display text-5xl font-black tabular-nums text-white">
```

---

## 📐 Spacing System

Based on **8px scale** for consistency:

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight gaps |
| `space-2` | 8px | Small gaps |
| `space-3` | 12px | Default gaps |
| `space-4` | 16px | Medium spacing |
| `space-5` | 20px | -- |
| `space-6` | 24px | Standard padding |
| `space-8` | 32px | Large padding |
| `space-12` | 48px | Extra large |
| `space-16` | 64px | Section gaps |

### Spacing Guidelines

- **Card padding**: `p-6` (24px) standard, `p-8` (32px) for hero cards
- **Section gaps**: `gap-6` (24px) mobile, `gap-8` (32px) desktop
- **Between sections**: `mb-16` (64px)
- **Component gaps**: `space-y-4` (16px) or `space-y-6` (24px)

---

## 🔘 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-xl` | 12px | Small cards, buttons |
| `rounded-2xl` | 16px | Medium cards |
| `rounded-3xl` | 24px | Large cards, main components |
| `rounded-full` | 9999px | Pills, badges, circular elements |

**Standard**: All cards use `rounded-3xl` (24px) for consistent look.

---

## ✨ Shadows & Glows

### Elevation System

```css
/* Subtle elevation */
shadow-xl

/* Neon glow - Hot Pink */
shadow-[0_0_40px_rgba(255,31,125,0.4)]
hover:shadow-[0_0_60px_rgba(255,31,125,0.5)]

/* Neon glow - Purple */
shadow-[0_0_40px_rgba(139,92,246,0.4)]

/* Neon glow - Gold */
shadow-[0_0_40px_rgba(255,199,0,0.4)]

/* Neon glow - Cyan */
shadow-[0_0_40px_rgba(0,245,255,0.3)]

/* Button shadow */
shadow-lg shadow-[#FF1F7D]/40
hover:shadow-xl hover:shadow-[#FF1F7D]/60
```

### Glow Pattern

Every interactive card should have:
1. Base shadow: `shadow-xl`
2. Colored border: `border-[COLOR]/30`
3. Hover glow: `hover:shadow-[0_0_60px_rgba(R,G,B,0.5)]`
4. Hover border: `hover:border-[COLOR]/60`

---

## 🎬 Animation & Motion

### Timing Functions

- **Default transitions**: `transition-all duration-300`
- **Hover effects**: `duration-300`
- **Complex animations**: `duration-500` or `duration-700`
- **Ease**: Use default Tailwind easing (ease-in-out)

### Standard Animations

```css
/* Fade in on load */
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

/* Staggered delays */
animation-delay-100  /* 100ms */
animation-delay-200  /* 200ms */
animation-delay-300  /* 300ms */
animation-delay-400  /* 400ms */
```

### Hover Patterns

```tsx
// Scale on hover
className="transition-all duration-300 hover:scale-[1.02]"

// Glow on hover
className="transition-all duration-500 hover:border-[#FF1F7D]/60 hover:shadow-[0_0_60px_rgba(255,31,125,0.5)]"

// Icon rotation
className="transition-transform group-hover:rotate-12"

// Arrow slide
className="transition-transform group-hover:translate-x-1"
```

### Pulse Animations

```tsx
// Pulsing badge
<div className="h-2 w-2 animate-pulse rounded-full bg-[#00F5FF]" />

// Pulsing glow
<div className="absolute inset-0 animate-pulse rounded-full bg-[#00F5FF] blur-lg opacity-60" />
```

---

## 🃏 Component Patterns

### Card Pattern

All cards follow this structure:

```tsx
<div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[ACCENT]/60 hover:shadow-[0_0_60px_rgba(R,G,B,0.5)]">
  {/* Ambient glow */}
  <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[ACCENT]/20 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />

  {/* Hover gradient overlay */}
  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[ACCENT]/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

  {/* Content */}
  <div className="relative">
    {/* Your content here */}
  </div>
</div>
```

**Key elements:**
- `group` - Enable group-hover for child elements
- `relative overflow-hidden` - Container for absolute positioned glows
- `rounded-3xl` - Consistent border radius
- `border border-white/10` - Subtle base border
- `bg-gradient-to-br from-surface-card/90 to-surface-raised/80` - Gradient background
- `backdrop-blur-xl` - Frosted glass effect
- Ambient glow div (absolute positioned, scaled on hover)
- Hover gradient overlay (opacity transition)
- `relative` wrapper for content (ensures proper z-index)

### Button Variants

#### Primary Gradient Button

```tsx
<button className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF1F7D] to-[#B200FF] px-8 py-3 font-display text-sm font-bold text-white shadow-lg shadow-[#FF1F7D]/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#FF1F7D]/60">
  <Icon className="h-5 w-5 transition-transform group-hover:rotate-12" />
  Button Text
  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
</button>
```

#### Secondary Ghost Button

```tsx
<button className="group inline-flex items-center gap-2 rounded-full border-2 border-[#00F5FF]/50 bg-[#00F5FF]/10 px-8 py-3 font-display text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#00F5FF] hover:bg-[#00F5FF]/20 hover:shadow-lg hover:shadow-[#00F5FF]/30">
  <Icon className="h-5 w-5 transition-transform group-hover:rotate-12" />
  Button Text
</button>
```

#### Small Pill Button

```tsx
<Link className="group inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/10 px-5 py-2.5 font-display text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#00F5FF]/60 hover:bg-[#00F5FF]/20 hover:shadow-lg hover:shadow-[#00F5FF]/30">
  View all
  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
</Link>
```

### Badge/Pill Pattern

#### Status Badge

```tsx
<div className="inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/10 px-4 py-1.5 backdrop-blur-sm">
  <div className="h-2 w-2 animate-pulse rounded-full bg-[#00F5FF]" />
  <span className="font-display text-sm font-bold text-white">LIVE NOW</span>
</div>
```

#### Label Badge

```tsx
<span className="rounded-full bg-[#FF1F7D]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FF1F7D] ring-1 ring-[#FF1F7D]/40">
  NEW
</span>
```

#### Metric Pill

```tsx
<div className="rounded-xl bg-[#FFC700]/10 px-3 py-1.5 font-display text-base font-black tabular-nums text-[#FFC700] ring-1 ring-[#FFC700]/20">
  +200 💎
</div>
```

### Icon Containers

```tsx
<div className="rounded-xl bg-[#FF1F7D]/20 p-3 ring-1 ring-[#FF1F7D]/30 transition-transform duration-300 group-hover:scale-110">
  <Icon className="h-6 w-6 text-[#FF1F7D]" />
</div>
```

---

## 🎯 Layout Patterns

### Hero Section (Bento Grid)

```tsx
<div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
  {/* Large hero card */}
  <div>{/* ... */}</div>

  {/* Stats grid */}
  <div className="grid grid-cols-2 gap-6">
    <div className="col-span-2">{/* Full width stat */}</div>
    <div>{/* Half width stat */}</div>
    <div>{/* Half width stat */}</div>
  </div>
</div>
```

### Two-Column Layout

```tsx
<div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
  {/* Main content */}
  <div>{/* ... */}</div>

  {/* Sidebar */}
  <div>{/* ... */}</div>
</div>
```

### Card Grid

```tsx
<div className="grid gap-6 lg:grid-cols-3">
  <div>{/* Card */}</div>
  <div>{/* Card */}</div>
  <div>{/* Card */}</div>
</div>
```

---

## 🌊 Background Effects

### Ambient Glows

```tsx
{/* Animated background accents */}
<div className="pointer-events-none fixed inset-0 overflow-hidden">
  <div className="absolute -left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-[#FF1F7D]/10 blur-3xl" />
  <div className="absolute -right-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-[#8B5CF6]/10 blur-3xl" style={{ animationDelay: '2s' }} />
  <div className="absolute bottom-0 left-1/3 h-96 w-96 animate-pulse rounded-full bg-[#00F5FF]/10 blur-3xl" style={{ animationDelay: '4s' }} />
</div>
```

### Top Gradient Line

```tsx
<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF1F7D]/50 via-[#8B5CF6]/50 to-transparent" />
```

---

## 📋 Usage Checklist

When creating a new page/component, ensure:

- [ ] Dark background (`bg-surface-base`)
- [ ] Cards use `rounded-3xl` with `border-white/10`
- [ ] Backdrop blur on cards (`backdrop-blur-xl`)
- [ ] Hover states have neon glow shadows
- [ ] Headings use `font-display font-black`
- [ ] Transitions are `duration-300` or `duration-500`
- [ ] Interactive elements scale on hover (`hover:scale-[1.02]`)
- [ ] Icons have rotation/translation on hover
- [ ] Proper color semantics (pink=action, gold=value, cyan=new)
- [ ] Staggered animations if multiple elements load together
- [ ] Ambient glows for atmosphere
- [ ] Proper spacing (8px scale)

---

## 🚀 Quick Start Examples

### Basic Page Structure

```tsx
export default function Page() {
  return (
    <div className="relative min-h-screen">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-[#FF1F7D]/10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Your sections here */}
      </div>
    </div>
  )
}
```

### Section with Cards

```tsx
<section className="mb-16">
  <div>
    <div className="font-display text-sm font-bold uppercase tracking-wider text-white/50">
      Section Label
    </div>
    <h2 className="font-display text-3xl font-black text-white">Section Title</h2>
  </div>

  <div className="mt-6 grid gap-6 lg:grid-cols-3">
    {/* Cards here */}
  </div>
</section>
```

---

**Last Updated**: 2026-01-07
**Version**: 1.0.0
**Maintained by**: Maffix Design Team
