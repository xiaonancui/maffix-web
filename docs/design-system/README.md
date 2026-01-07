# Maffix Design System

Welcome to the Maffix Design System - a comprehensive, vibrant design language built for the next generation of music fans.

---

## 📚 Documentation

### Quick Start
New to the design system? Start here:
1. **[Quick Reference](./QUICK_REFERENCE.md)** - Copy-paste ready snippets
2. **[Component Patterns](./COMPONENT_PATTERNS.md)** - Common UI patterns
3. **[Full Design System](./MAFFIX_DESIGN_SYSTEM.md)** - Complete guidelines

### File Structure

```
docs/design-system/
├── README.md                    # This file - Overview and getting started
├── MAFFIX_DESIGN_SYSTEM.md     # Complete design system documentation
├── COMPONENT_PATTERNS.md        # Copy-paste ready component patterns
└── QUICK_REFERENCE.md           # Cheat sheet for developers

apps/web/src/styles/
└── design-tokens.css            # CSS custom properties and utilities

apps/web/
└── tailwind.config.ts           # Tailwind configuration with Maffix extensions
```

---

## 🎨 Design Philosophy

Maffix's design language is:

- **🔥 Vibrant & Energetic** - Bold colors, neon glows, maximalist energy
- **🌊 Layered & Deep** - Backdrop blur, transparency, atmospheric effects
- **⚡ Dynamic** - Smooth transitions, hover effects, micro-interactions
- **🎯 Intentional** - Every design decision serves a purpose
- **💎 Premium** - High-quality aesthetics that feel exclusive

We embrace **maximalism** because our audience expects it. This is not minimal. This is **intentionally loud**.

---

## 🚀 Getting Started

### For New Pages

1. **Read the Quick Reference** - Get familiar with common patterns
2. **Copy the page structure** from `MAFFIX_DESIGN_SYSTEM.md` → Quick Start Examples
3. **Use component patterns** from `COMPONENT_PATTERNS.md`
4. **Follow the checklist** at the end of `MAFFIX_DESIGN_SYSTEM.md`

### For Components

1. **Check Component Patterns** first - Pattern might already exist
2. **Follow the card pattern** - Base structure for most components
3. **Match color semantics** - Pink=action, Gold=value, Cyan=new, Purple=secondary
4. **Add hover states** - Scale, glow, transitions

### Example: Creating a New Card

```tsx
import { Target } from 'lucide-react'

export default function MyCard() {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#8B5CF6]/60 hover:shadow-[0_0_60px_rgba(139,92,246,0.5)]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#8B5CF6]/20 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />

      {/* Hover overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Content */}
      <div className="relative space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="font-display text-xs font-bold uppercase tracking-[0.3em] text-white/50">
              Card Label
            </div>
            <div className="text-sm text-white/40">Subtitle</div>
          </div>
          <div className="rounded-xl bg-[#8B5CF6]/20 p-3 ring-1 ring-[#8B5CF6]/30 transition-transform duration-300 group-hover:scale-110">
            <Target className="h-6 w-6 text-[#8B5CF6]" />
          </div>
        </div>

        <div>
          <div className="font-display text-5xl font-black tabular-nums text-white">
            1,250
          </div>
          <div className="mt-2 font-mono text-sm text-white/60">
            Supporting text
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## 🎨 Core Principles

### Color Usage

| Color | Hex | Usage |
|-------|-----|-------|
| Hot Pink | `#FF1F7D` | Primary CTAs, urgent actions, featured items |
| Purple | `#8B5CF6` | Secondary actions, progress, levels |
| Gold | `#FFC700` | Currency, rewards, pricing |
| Cyan | `#00F5FF` | Live indicators, new badges |
| Electric Purple | `#B200FF` | Premium features, exclusive |

### Typography Rules

1. **Headings**: Always `font-display font-black`
2. **Labels**: Always `uppercase tracking-[0.3em]`
3. **Numbers**: Always `tabular-nums`
4. **Body**: Use `font-sans`

### Spacing Scale

Use the **8px scale**:
- `4px` (space-1) - Tight gaps
- `8px` (space-2) - Small gaps
- `16px` (space-4) - Default gaps
- `24px` (space-6) - Standard padding
- `32px` (space-8) - Large padding
- `64px` (space-16) - Section gaps

### Animation Guidelines

- **Default transition**: `transition-all duration-300`
- **Complex animations**: `duration-500` or `duration-700`
- **Hover scale**: `hover:scale-[1.02]` for cards, `hover:scale-105` for buttons
- **Stagger delays**: Use inline `style={{ animationDelay: '200ms' }}`

---

## ✅ Quality Checklist

Before submitting a page/component, verify:

- [ ] Dark background (`bg-surface-base`)
- [ ] Cards use `rounded-3xl` with `border-white/10`
- [ ] Backdrop blur on cards (`backdrop-blur-xl`)
- [ ] Hover states have neon glow shadows
- [ ] Headings use `font-display font-black`
- [ ] Transitions are smooth (`duration-300` or `duration-500`)
- [ ] Interactive elements scale on hover
- [ ] Icons have rotation/translation on hover
- [ ] Proper color semantics
- [ ] Staggered animations for multiple elements
- [ ] Ambient glows for atmosphere
- [ ] Consistent spacing (8px scale)

---

## 🛠️ Development Workflow

### 1. Planning Phase
- Review similar pages in the dashboard
- Identify required components
- Check if patterns exist in `COMPONENT_PATTERNS.md`

### 2. Implementation
- Start with page structure (background, container)
- Build sections using component patterns
- Add ambient effects and animations
- Test hover states

### 3. Refinement
- Verify spacing consistency
- Test responsive behavior
- Check animation timing
- Validate color usage
- Run quality checklist

### 4. Review
- Compare with dashboard aesthetic
- Test on different screen sizes
- Verify accessibility (contrast, focus states)

---

## 🎯 Common Tasks

### Adding a New Page

```tsx
import React from 'react'

export default function NewPage() {
  return (
    <div className="relative min-h-screen">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-[#FF1F7D]/10 blur-3xl" />
        <div className="absolute -right-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-[#8B5CF6]/10 blur-3xl" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Sections here */}
      </div>
    </div>
  )
}
```

### Creating a Button Variant

1. Choose base style (primary/secondary/tertiary)
2. Copy pattern from `COMPONENT_PATTERNS.md`
3. Replace color with semantic choice
4. Add icon with hover effect
5. Test hover state

### Building a Form

1. Use input pattern from `COMPONENT_PATTERNS.md`
2. Maintain `rounded-xl` consistency
3. Add focus states with neon glow
4. Use `border-[COLOR]/60` on focus
5. Include `ring-2 ring-[COLOR]/20`

---

## 🎨 Using CSS Design Tokens

Import in your global CSS:

```css
@import '../styles/design-tokens.css';
```

Then use in components:

```tsx
<div style={{
  color: 'var(--maffix-hot-pink)',
  boxShadow: 'var(--glow-hot-pink-md)'
}}>
```

Or use utility classes:

```tsx
<div className="glass glow-hot-pink">
```

---

## 🔧 Tailwind Configuration

The Maffix design system extends Tailwind with:

- **Brand colors**: `maffix-hot-pink`, `maffix-purple`, `maffix-gold`, `maffix-cyan`, `maffix-electric-purple`
- **Surface colors**: `surface-base`, `surface-card`, `surface-raised`
- **Custom animations**: `shine`, `gradient-shift`, `enter`
- **Animation delays**: `animation-delay-100` through `animation-delay-1000`

Access via Tailwind classes:

```tsx
className="bg-maffix-hot-pink"
className="text-maffix-purple"
className="border-maffix-gold"
```

---

## 💡 Tips & Best Practices

### DO ✅

- Use `group` class on parent for `group-hover:` utilities
- Add `pointer-events-none` to decorative overlays
- Include `backdrop-blur-xl` on cards for glassmorphism
- Use `relative` on content wrapper inside cards
- Add transitions to all interactive elements
- Use semantic colors (pink=action, gold=value)
- Test hover states on all interactive elements
- Maintain 8px spacing scale
- Use `tabular-nums` for numeric displays

### DON'T ❌

- Mix spacing scales (stick to 8px)
- Skip hover states on interactive elements
- Use generic colors (use semantic palette)
- Forget `group` when using `group-hover:`
- Omit transitions on state changes
- Use default cursor on clickable elements
- Skip backdrop blur on cards
- Use inconsistent border radius

---

## 📖 Examples

### Dashboard Reference
The dashboard (`/apps/web/src/app/(dashboard)/dashboard/page.tsx`) is the **canonical reference** for the design system in practice.

Study these patterns:
- Hero bento grid layout
- Stat cards with color-coded glows
- Activity timeline with animated dots
- Promotional card with image overlay
- Navigation with active states

---

## 🆘 Need Help?

1. **Check Quick Reference** - Most common patterns
2. **Search Component Patterns** - Copy-paste ready code
3. **Review Dashboard** - Real-world examples
4. **Read Full Guidelines** - Comprehensive documentation

---

## 📝 Contributing

When adding new patterns:

1. Document in `COMPONENT_PATTERNS.md`
2. Add to `QUICK_REFERENCE.md` if commonly used
3. Update this README if it affects workflow
4. Include usage examples
5. Test across different contexts

---

## 🎉 You're Ready!

Start building with confidence. The design system provides all the tools you need to create vibrant, energetic, and cohesive interfaces that feel unmistakably **Maffix**.

Remember: **This is intentionally loud**. Embrace the maximalism. 🔥

---

**Version**: 1.0.0
**Last Updated**: 2026-01-07
**Maintained by**: Maffix Design Team
