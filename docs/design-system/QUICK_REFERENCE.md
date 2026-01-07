# Maffix Design System - Quick Reference

> **Cheat sheet for developers** - Copy-paste ready code snippets.

---

## 🎨 Colors

```tsx
// Brand Colors (use with square brackets)
className="text-[#FF1F7D]"  // Hot Pink
className="text-[#8B5CF6]"  // Purple
className="text-[#FFC700]"  // Gold
className="text-[#00F5FF]"  // Cyan
className="text-[#B200FF]"  // Electric Purple

// Or use Tailwind config names
className="bg-maffix-hot-pink"
className="border-maffix-purple"
className="text-maffix-gold"

// Surface Colors
className="bg-surface-base"   // #0A0A0F - Page background
className="bg-surface-card"   // #16161F - Card backgrounds
className="bg-surface-raised" // #1E1E2D - Elevated elements

// Text Opacity
className="text-white"      // 100% - Primary
className="text-white/70"   // 70% - Secondary
className="text-white/50"   // 50% - Tertiary
className="text-white/40"   // 40% - Muted
```

---

## ✍️ Typography

```tsx
// Headings - always use font-display + font-black
<h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white">
<h2 className="font-display text-3xl font-black text-white">
<h3 className="font-display text-2xl font-black text-white">
<h4 className="font-display text-xl font-bold text-white">

// Labels - uppercase + wide tracking
<div className="font-display text-xs font-bold uppercase tracking-[0.3em] text-white/50">

// Body text
<p className="text-base text-white/70">
<p className="text-sm text-white/60">
<p className="text-xs text-white/50">

// Numbers - use tabular-nums
<div className="font-display text-5xl font-black tabular-nums text-white">
```

---

## 📦 Card Base

```tsx
<div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#FF1F7D]/60 hover:shadow-[0_0_60px_rgba(255,31,125,0.5)]">
  {/* Glow */}
  <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#FF1F7D]/20 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />

  {/* Overlay */}
  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FF1F7D]/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

  {/* Content */}
  <div className="relative">
    {/* Your content */}
  </div>
</div>
```

---

## 🔘 Buttons

```tsx
// Primary
<button className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF1F7D] to-[#B200FF] px-8 py-3 font-display text-sm font-bold text-white shadow-lg shadow-[#FF1F7D]/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#FF1F7D]/60">

// Secondary
<button className="group inline-flex items-center gap-2 rounded-full border-2 border-[#00F5FF]/50 bg-[#00F5FF]/10 px-8 py-3 font-display text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#00F5FF] hover:bg-[#00F5FF]/20 hover:shadow-lg hover:shadow-[#00F5FF]/30">

// Small
<button className="group inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/10 px-5 py-2.5 font-display text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#00F5FF]/60 hover:bg-[#00F5FF]/20">
```

---

## 🏷️ Badges

```tsx
// Status Badge
<div className="inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/10 px-4 py-1.5 backdrop-blur-sm">
  <div className="h-2 w-2 animate-pulse rounded-full bg-[#00F5FF]" />
  <span className="font-display text-sm font-bold text-white">LIVE</span>
</div>

// Label Pill
<span className="rounded-full bg-[#FF1F7D]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FF1F7D] ring-1 ring-[#FF1F7D]/40">NEW</span>

// Metric
<div className="rounded-xl bg-[#FFC700]/10 px-3 py-1.5 font-display text-base font-black tabular-nums text-[#FFC700] ring-1 ring-[#FFC700]/20">+200 💎</div>
```

---

## 🎯 Icons

```tsx
// Standard
<div className="rounded-xl bg-[#FF1F7D]/20 p-3 ring-1 ring-[#FF1F7D]/30 transition-transform duration-300 group-hover:scale-110">
  <Icon className="h-6 w-6 text-[#FF1F7D]" />
</div>

// Rotation on hover
<Icon className="h-5 w-5 transition-transform group-hover:rotate-12" />

// Arrow slide
<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
```

---

## 🌊 Shadows & Glows

```tsx
// Base shadow
className="shadow-xl"

// Neon glows (replace color values)
className="shadow-[0_0_40px_rgba(255,31,125,0.4)]"                    // Hot Pink
className="hover:shadow-[0_0_60px_rgba(255,31,125,0.5)]"             // Hot Pink hover
className="shadow-[0_0_40px_rgba(139,92,246,0.4)]"                    // Purple
className="shadow-[0_0_40px_rgba(255,199,0,0.4)]"                     // Gold
className="shadow-[0_0_40px_rgba(0,245,255,0.3)]"                     // Cyan

// Button shadow
className="shadow-lg shadow-[#FF1F7D]/40 hover:shadow-xl hover:shadow-[#FF1F7D]/60"
```

---

## 🎬 Animations

```tsx
// Fade in on load
<section className="animate-fade-in-up">

// Staggered (use inline style)
<section className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>

// Hover effects
className="transition-all duration-300 hover:scale-[1.02]"
className="transition-all duration-500 hover:border-[#FF1F7D]/60"
className="transition-transform group-hover:rotate-12"

// Pulsing
<div className="h-2 w-2 animate-pulse rounded-full bg-[#00F5FF]" />
```

---

## 📐 Spacing

```tsx
// Padding (use 8px scale)
p-4   // 16px
p-6   // 24px - Standard card padding
p-8   // 32px - Large card padding

// Gaps
gap-4   // 16px
gap-6   // 24px - Standard
gap-8   // 32px

// Margins between sections
mb-16   // 64px

// Vertical spacing
space-y-4   // 16px
space-y-6   // 24px
```

---

## 🔘 Border Radius

```tsx
rounded-xl     // 12px - Small elements
rounded-2xl    // 16px - Medium cards
rounded-3xl    // 24px - Large cards (standard)
rounded-full   // Pills, badges
```

---

## 🎨 Gradients

```tsx
// Background gradients
className="bg-gradient-to-br from-surface-card/90 to-surface-raised/80"
className="bg-gradient-to-r from-[#FF1F7D] to-[#B200FF]"
className="bg-gradient-to-r from-[#FF1F7D] to-[#FFC700]"

// Overlay gradients
className="bg-gradient-to-br from-[#FF1F7D]/10 via-transparent to-transparent"
className="bg-gradient-to-t from-black/90 via-black/40 to-transparent"

// Top line
<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF1F7D]/50 to-transparent" />
```

---

## 🌌 Background Effects

```tsx
// Page ambient glows
<div className="pointer-events-none fixed inset-0 overflow-hidden">
  <div className="absolute -left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-[#FF1F7D]/10 blur-3xl" />
  <div className="absolute -right-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-[#8B5CF6]/10 blur-3xl" style={{ animationDelay: '2s' }} />
</div>

// Card glow
<div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#FF1F7D]/20 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />
```

---

## 📋 Layout Grids

```tsx
// Hero bento
<div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">

// Two-column
<div className="grid gap-8 lg:grid-cols-[2fr_1fr]">

// Three-column
<div className="grid gap-6 lg:grid-cols-3">

// Stats grid
<div className="grid grid-cols-2 gap-6">
  <div className="col-span-2">{/* Full width */}</div>
  <div>{/* Half */}</div>
  <div>{/* Half */}</div>
</div>
```

---

## 🎯 Common Patterns

### Section Header
```tsx
<div>
  <div className="font-display text-sm font-bold uppercase tracking-wider text-white/50">
    Label
  </div>
  <h2 className="font-display text-3xl font-black text-white">Title</h2>
</div>
```

### Progress Bar
```tsx
<div className="h-3 overflow-hidden rounded-full bg-white/10">
  <div className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#FF1F7D] transition-all duration-1000" style={{ width: `${percent}%` }} />
</div>
```

### Pulsing Indicator
```tsx
<span className="relative flex h-2 w-2">
  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00F5FF] opacity-75"></span>
  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00F5FF]"></span>
</span>
```

---

## 🚨 Don't Forget

✅ Always use `group` on parent for `group-hover:`
✅ Add `pointer-events-none` to decorative overlays
✅ Use `relative` on content wrapper inside cards
✅ Include `backdrop-blur-xl` on cards
✅ Add transitions to interactive elements
✅ Use `tabular-nums` for numbers
✅ Scale hover states: `hover:scale-[1.02]` or `hover:scale-105`
✅ Include neon glow on hover for cards

---

## 📚 Full Documentation

- **Complete Guide**: `/docs/design-system/MAFFIX_DESIGN_SYSTEM.md`
- **Component Patterns**: `/docs/design-system/COMPONENT_PATTERNS.md`
- **CSS Tokens**: `/apps/web/src/styles/design-tokens.css`
- **Tailwind Config**: `/apps/web/tailwind.config.ts`
