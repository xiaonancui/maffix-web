# Maffix Component Patterns

> **Copy-paste ready component patterns** following the Maffix design system.

All patterns use Tailwind CSS classes and are compatible with Next.js 14 + TypeScript.

---

## 📦 Cards

### Standard Card Pattern

The foundation of all Maffix cards. Use this as your base.

```tsx
<div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#FF1F7D]/60 hover:shadow-[0_0_60px_rgba(255,31,125,0.5)]">
  {/* Ambient glow (top-right) */}
  <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#FF1F7D]/20 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />

  {/* Hover gradient overlay */}
  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FF1F7D]/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

  {/* Content */}
  <div className="relative space-y-6">
    {/* Icon + Label */}
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <div className="font-display text-xs font-bold uppercase tracking-[0.3em] text-white/50">
          Card Label
        </div>
        <div className="text-sm text-white/40">Subtitle</div>
      </div>
      <div className="rounded-xl bg-[#FF1F7D]/20 p-3 ring-1 ring-[#FF1F7D]/30 transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-6 w-6 text-[#FF1F7D]" />
      </div>
    </div>

    {/* Main metric */}
    <div>
      <div className="font-display text-5xl font-black tabular-nums text-white">
        1,250
      </div>
      <div className="mt-2 font-mono text-sm text-white/60">
        Supporting text
      </div>
    </div>

    {/* Additional content */}
    <div className="text-sm text-white/60">
      Optional description or additional information
    </div>
  </div>
</div>
```

### Color Variants

Replace `[#FF1F7D]` with:
- **Purple**: `[#8B5CF6]` and `rgba(139,92,246,0.5)`
- **Gold**: `[#FFC700]` and `rgba(255,199,0,0.5)`
- **Cyan**: `[#00F5FF]` and `rgba(0,245,255,0.4)`

### Compact Card

For sidebars or smaller spaces:

```tsx
<div className="group relative overflow-hidden rounded-2xl border border-[#8B5CF6]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-[#8B5CF6]/60 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]">
  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

  <div className="relative flex items-start gap-4">
    <div className="rounded-xl bg-[#8B5CF6]/20 p-3 ring-1 ring-[#8B5CF6]/30">
      <Icon className="h-6 w-6 text-[#8B5CF6]" />
    </div>
    <div className="flex-1">
      <h4 className="font-display text-lg font-bold text-white">Title</h4>
      <p className="mt-1 text-sm text-white/60">Description text</p>
    </div>
    <ArrowRight className="h-5 w-5 text-white/40 transition-transform group-hover:translate-x-1" />
  </div>
</div>
```

---

## 🔘 Buttons

### Primary Gradient Button

```tsx
<button className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF1F7D] to-[#B200FF] px-8 py-3 font-display text-sm font-bold text-white shadow-lg shadow-[#FF1F7D]/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#FF1F7D]/60">
  <Target className="h-5 w-5 transition-transform group-hover:rotate-12" />
  Continue Missions
  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
</button>
```

### Secondary Ghost Button

```tsx
<button className="group inline-flex items-center gap-2 rounded-full border-2 border-[#00F5FF]/50 bg-[#00F5FF]/10 px-8 py-3 font-display text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#00F5FF] hover:bg-[#00F5FF]/20 hover:shadow-lg hover:shadow-[#00F5FF]/30">
  <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
  Aura Zone
</button>
```

### Tertiary Link Button

```tsx
<Link
  href="/transactions"
  className="group inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/10 px-5 py-2.5 font-display text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#00F5FF]/60 hover:bg-[#00F5FF]/20 hover:shadow-lg hover:shadow-[#00F5FF]/30"
>
  View all
  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
</Link>
```

### Icon Button

```tsx
<button className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-white/30 hover:bg-white/10 hover:text-white">
  <Icon className="h-4 w-4" />
</button>
```

---

## 🏷️ Badges & Pills

### Live Status Badge

```tsx
<div className="inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/10 px-4 py-1.5 backdrop-blur-sm">
  <div className="h-2 w-2 animate-pulse rounded-full bg-[#00F5FF]" />
  <span className="font-display text-sm font-bold text-white">LIVE NOW</span>
</div>
```

### Pulsing Badge (with glow)

```tsx
<div className="relative">
  {/* Pulsing glow behind badge */}
  <div className="absolute inset-0 animate-pulse rounded-full bg-[#00F5FF] blur-lg opacity-60" />

  {/* Badge */}
  <div className="relative flex items-center gap-2 rounded-full border border-[#00F5FF]/50 bg-[#00F5FF]/20 px-4 py-2 backdrop-blur-md">
    <Sparkles className="h-4 w-4 animate-pulse text-[#00F5FF]" />
    <span className="font-display text-xs font-black uppercase tracking-widest text-white">
      New Arrival
    </span>
  </div>
</div>
```

### Label Pill

```tsx
<span className="rounded-full bg-[#FF1F7D]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FF1F7D] ring-1 ring-[#FF1F7D]/40">
  NEW
</span>
```

### Metric Badge

```tsx
<div className="rounded-xl bg-[#FFC700]/10 px-3 py-1.5 font-display text-base font-black tabular-nums text-[#FFC700] ring-1 ring-[#FFC700]/20">
  +200 💎
</div>
```

### Count Badge

```tsx
<div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-semibold text-emerald-300">
  <TrendingUp className="h-4 w-4" />
  +150 today
</div>
```

---

## 🎯 Icon Containers

### Standard Icon Container

```tsx
<div className="rounded-xl bg-[#FF1F7D]/20 p-3 ring-1 ring-[#FF1F7D]/30 transition-transform duration-300 group-hover:scale-110">
  <Gem className="h-6 w-6 text-[#FF1F7D]" />
</div>
```

### Small Icon Container

```tsx
<div className="rounded-lg bg-[#FF1F7D]/20 p-1.5 ring-1 ring-[#FF1F7D]/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#FF1F7D]/30">
  <Shield className="h-3.5 w-3.5 text-[#FF1F7D]" />
</div>
```

### Large Icon Container

```tsx
<div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF1F7D] to-[#8B5CF6] text-white shadow-lg shadow-[#FF1F7D]/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[#FF1F7D]/40">
  <Zap className="h-6 w-6" strokeWidth={2.5} />
  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
</div>
```

---

## 📊 Progress Indicators

### Progress Bar

```tsx
<div className="space-y-2">
  <div className="h-3 overflow-hidden rounded-full bg-white/10">
    <div
      className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#FF1F7D] transition-all duration-1000"
      style={{ width: `${percentage}%` }}
    />
  </div>
  <p className="text-sm text-white/60">
    {completed} of {total} complete
  </p>
</div>
```

### Circular Progress (Level Ring)

```tsx
<div
  className="relative h-16 w-16 shrink-0"
  style={{
    background: `conic-gradient(#8B5CF6 ${gradientDegree}deg, rgba(139,92,246,0.15) 0deg)`,
    borderRadius: '50%',
  }}
>
  <div className="absolute inset-1 flex items-center justify-center rounded-full bg-surface-base">
    <div className="font-display text-2xl font-black text-white">{level}</div>
  </div>
</div>
```

### Pulsing Dot Indicator

```tsx
<span className="relative flex h-2 w-2">
  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00F5FF] opacity-75"></span>
  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00F5FF]"></span>
</span>
```

---

## 🎨 Background Effects

### Page Background with Ambient Glows

```tsx
<div className="relative min-h-screen">
  {/* Animated background accents */}
  <div className="pointer-events-none fixed inset-0 overflow-hidden">
    <div className="absolute -left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-[#FF1F7D]/10 blur-3xl" />
    <div className="absolute -right-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-[#8B5CF6]/10 blur-3xl" style={{ animationDelay: '2s' }} />
    <div className="absolute bottom-0 left-1/3 h-96 w-96 animate-pulse rounded-full bg-[#00F5FF]/10 blur-3xl" style={{ animationDelay: '4s' }} />
  </div>

  {/* Your content */}
  <div className="relative">{/* ... */}</div>
</div>
```

### Top Gradient Line

```tsx
<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF1F7D]/50 via-[#8B5CF6]/50 to-transparent" />
```

### Section Gradient Overlay

```tsx
<div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#8B5CF6]/5 to-transparent" />
```

---

## 📝 Typography Patterns

### Section Header

```tsx
<div>
  <div className="font-display text-sm font-bold uppercase tracking-wider text-white/50">
    Section Label
  </div>
  <h2 className="font-display text-3xl font-black text-white">Section Title</h2>
</div>
```

### Card Header with Icon

```tsx
<div className="flex items-start justify-between">
  <div className="space-y-1">
    <div className="font-display text-xs font-bold uppercase tracking-[0.3em] text-white/50">
      Label
    </div>
    <div className="text-sm text-white/40">Subtitle</div>
  </div>
  <div className="rounded-xl bg-[#FF1F7D]/20 p-3 ring-1 ring-[#FF1F7D]/30">
    <Icon className="h-6 w-6 text-[#FF1F7D]" />
  </div>
</div>
```

### Metric Display

```tsx
<div>
  <div className="font-display text-5xl font-black tabular-nums text-white">
    {value.toLocaleString()}
  </div>
  <div className="mt-2 font-mono text-sm text-white/60">
    Supporting text or label
  </div>
</div>
```

### Price Display

```tsx
<div className="flex items-baseline gap-2">
  <span className="font-display text-3xl font-black tabular-nums text-[#FFC700]">
    $29
  </span>
  <span className="font-display text-lg font-bold text-[#FFC700]/60">
    .99
  </span>
</div>
```

---

## 🗂️ Layout Patterns

### Hero Bento Grid

```tsx
<div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
  {/* Large feature card */}
  <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-card/90 to-surface-card/50 p-8 shadow-2xl backdrop-blur-xl">
    {/* ... */}
  </div>

  {/* Stats grid */}
  <div className="grid grid-cols-2 gap-6">
    <div className="col-span-2">{/* Full width */}</div>
    <div>{/* Half width */}</div>
    <div>{/* Half width */}</div>
  </div>
</div>
```

### Two-Column Activity Layout

```tsx
<div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
  {/* Main content (wider) */}
  <div className="space-y-6">
    {/* ... */}
  </div>

  {/* Sidebar (narrower) */}
  <div className="space-y-6">
    {/* ... */}
  </div>
</div>
```

### Three-Column Grid

```tsx
<div className="grid gap-6 lg:grid-cols-3">
  <div>{/* Card 1 */}</div>
  <div>{/* Card 2 */}</div>
  <div>{/* Card 3 */}</div>
</div>
```

---

## 🎭 Animation Patterns

### Staggered Fade-in on Load

```tsx
<section className="animate-fade-in-up">
  {/* Content */}
</section>

<section className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
  {/* Content */}
</section>

<section className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
  {/* Content */}
</section>
```

### Hover Scale + Glow

```tsx
<div className="transition-all duration-500 hover:scale-[1.02] hover:border-[#FF1F7D]/60 hover:shadow-[0_0_60px_rgba(255,31,125,0.5)]">
  {/* Content */}
</div>
```

### Icon Rotation on Hover

```tsx
<button className="group">
  <Icon className="transition-transform group-hover:rotate-12" />
</button>
```

### Arrow Slide on Hover

```tsx
<Link className="group">
  View all
  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
</Link>
```

---

## 📋 Form Patterns

### Input Field

```tsx
<div className="space-y-2">
  <label className="font-display text-sm font-bold uppercase tracking-wider text-white/70">
    Label
  </label>
  <input
    type="text"
    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-sans text-white backdrop-blur-sm transition-all duration-300 placeholder:text-white/40 focus:border-[#FF1F7D]/60 focus:outline-none focus:ring-2 focus:ring-[#FF1F7D]/20"
    placeholder="Enter value..."
  />
</div>
```

### Select Dropdown

```tsx
<select className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-sans text-white backdrop-blur-sm transition-all duration-300 focus:border-[#8B5CF6]/60 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20">
  <option value="">Select option...</option>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</select>
```

### Textarea

```tsx
<textarea
  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-sans text-white backdrop-blur-sm transition-all duration-300 placeholder:text-white/40 focus:border-[#FF1F7D]/60 focus:outline-none focus:ring-2 focus:ring-[#FF1F7D]/20"
  rows={4}
  placeholder="Enter description..."
/>
```

---

## 🧭 Navigation Patterns

### Active Navigation Link

```tsx
<Link
  href="/dashboard"
  className="group relative inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-bold tracking-tight transition-all duration-300 bg-gradient-to-br from-[#FF1F7D]/20 to-[#8B5CF6]/10 text-white shadow-lg shadow-[#FF1F7D]/20"
>
  Dashboard
  <span className="absolute inset-0 rounded-xl border border-[#FF1F7D]/30" />
</Link>
```

### Inactive Navigation Link

```tsx
<Link
  href="/missions"
  className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-bold tracking-tight text-white/70 transition-all duration-300 hover:bg-white/5 hover:text-white"
>
  Missions
</Link>
```

---

## 🎁 Special Components

### Promotional Card

```tsx
<Link
  href="/store"
  className="group relative block overflow-hidden rounded-3xl border border-[#FF1F7D]/20 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#FF1F7D]/60 hover:shadow-[0_0_60px_rgba(255,31,125,0.5)]"
>
  {/* Ambient glow */}
  <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#FF1F7D]/20 via-[#FFC700]/10 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />

  {/* Image */}
  <div className="relative aspect-[4/3] overflow-hidden">
    <Image
      src={imageSrc}
      alt={title}
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
  </div>

  {/* Content */}
  <div className="relative space-y-4 p-6">
    <h3 className="font-display text-xl font-black text-white">{title}</h3>
    <p className="text-sm text-white/60">{description}</p>

    <div className="flex items-center justify-between gap-4">
      <div className="flex items-baseline gap-2">
        <span className="font-display text-3xl font-black tabular-nums text-[#FFC700]">
          ${price}
        </span>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF1F7D] to-[#FFC700] px-6 py-2.5 font-display text-sm font-bold text-white">
        Shop Now
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  </div>
</Link>
```

---

## 💡 Usage Tips

1. **Always use `group` class** on parent when using `group-hover:` utilities
2. **Maintain consistent spacing** - Use 8px scale (space-2, space-4, space-6, space-8)
3. **Layer effects** - Combine glows, gradients, and blur for depth
4. **Transition everything** - Add `transition-all duration-300` for smooth interactions
5. **Test hover states** - Every interactive element should have a hover state
6. **Use relative positioning** - Parent containers should be `relative` for absolute children
7. **Pointer-events-none** on decorative layers to avoid blocking clicks
8. **Backdrop blur** on cards and overlays for glassmorphism effect

---

**Need more patterns?** Reference `/docs/design-system/MAFFIX_DESIGN_SYSTEM.md` for full guidelines.
