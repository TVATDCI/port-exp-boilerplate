# Design System — framer-port

## Overview

A terminal-inspired portfolio styling system built on **Tailwind CSS v4** with a **tiered token architecture**. The system uses **OKLCH color space** for perceptually uniform colors, **CSS `@theme`** for token registration, and **CSS layers** for cascade control.

**Philosophy:** Nature-meets-terminal aesthetic — forest greens, amber glows, and sage tones combined with monospace typography, CRT effects, and glass morphism. Tokens flow from immutable primitives → semantic roles → component-specific values.

**Tech Stack:**

- Tailwind CSS v4 (`@tailwindcss/vite` plugin)
- CSS `@theme` directive for design token registration
- CSS Cascade Layers (`@layer base`, `@layer components`, `@layer utilities`)
- OKLCH color space throughout
- Relative color math (`oklch(from ...)`) for interaction states

---

## File Structure

| File                     | Responsibility                                                                                                                   | Lines |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ----- |
| `index.css`              | Entry point, font imports, Tailwind import, base resets, View Transitions API                                                    | 59    |
| `colors.css`             | **Tier 1** — Primitive color scales (immutable). 10 scales: primary, teal, ok, warn, fail, fuchsia, red, neutral, brand, avocado | 147   |
| `theme.css`              | **Tier 2+3** — Semantic mappings, light/dark theme toggling, gradient library, atmosphere tokens, component tokens               | 370   |
| `typography.css`         | Reusable type classes with responsive sizing (7 classes)                                                                         | 39    |
| `components.css`         | Hero section, button system (BEM), terminal window, status dots, output lines                                                    | 190   |
| `utilities.css`          | Terminal glow, performance hints, a11y, glass morphism, gradient utils, custom cursor, scrollbar                                 | 199   |
| `motion.css`             | Easing curves, keyframes (blink, grain, glow-pulse), transition utilities                                                        | 94    |
| `background-effects.css` | Advanced visual effects: grain, glass, water droplets, forest texture, amber glow, mist, vignette, scanlines, steam              | 268   |

**Import order** (defined in `index.css`):

```
tailwindcss → colors.css → theme.css → typography.css → motion.css → components.css → utilities.css
```

> **Note:** `background-effects.css` is NOT imported in `index.css` — it is orphaned. `stylex/main.css` references non-existent sub-files and is stale.

---

## Design Tokens

### Colors

#### Primitive Scales (Tier 1 — `colors.css`)

All scales use OKLCH and follow a `50–950` naming convention (light → dark):

| Scale               | Hue                     | Use                          |
| ------------------- | ----------------------- | ---------------------------- |
| `--color-primary-*` | 260° (blue)             | Primary UI elements          |
| `--color-teal-*`    | 180–192° (teal)         | Secondary accents, gradients |
| `--color-ok-*`      | 150° (green)            | Success states               |
| `--color-warn-*`    | 90° (yellow)            | Warning states               |
| `--color-fail-*`    | 30° (red-orange)        | Error states                 |
| `--color-fuchsia-*` | 320–325° (pink)         | Accent gradients             |
| `--color-red-*`     | 17–27° (red)            | Error emphasis               |
| `--color-neutral-*` | 48–106° (warm gray)     | Borders, muted text          |
| `--color-avocado-*` | 113–118° (green-yellow) | Light theme surfaces         |
| `--color-lagoon`    | 221° (blue)             | Brand primary                |
| `--color-coral`     | 40.7° (orange)          | Brand secondary              |
| `--color-driftwood` | 74.59° (tan)            | Muted accent                 |
| `--color-tide`      | 205.88° (deep blue)     | Heading color                |
| `--color-dusk`      | 72.09° (gold)           | Highlight, brand accent      |

#### Semantic Mappings (Tier 2 — `theme.css`)

| Token                      | Light Theme                                | Dark Theme                              |
| -------------------------- | ------------------------------------------ | --------------------------------------- |
| `--color-surface-base`     | `--color-base-100` (cream)                 | `--dark-bg-primary`                     |
| `--color-surface-elevated` | `--color-base-200` (warm cream)            | `--dark-card-bg`                        |
| `--color-surface-overlay`  | `--color-outer-glow`                       | `--color-outer-glow`                    |
| `--color-text-base`        | `--light-text-primary` (dark forest green) | `--dark-text-primary` (warm near-white) |
| `--color-text-muted`       | `--light-text-secondary`                   | `--dark-text-secondary` (sage-tinted)   |
| `--color-text-heading`     | `--color-tide`                             | `--color-brand-accent`                  |
| `--color-text-inverted`    | `--light-text-accent-alt` (#f1f1f1)        | `--dark-text-accent-alt`                |
| `--color-brand-primary`    | `--color-lagoon`                           | `--color-lagoon`                        |
| `--color-brand-secondary`  | `--color-coral`                            | `--color-coral`                         |
| `--color-brand-accent`     | `--color-dusk`                             | `--color-dusk`                          |
| `--color-border-default`   | Sage-tinted OKLCH                          | Dark olive OKLCH                        |
| `--color-border-subtle`    | `--color-neutral-100`                      | `--color-neutral-700`                   |

#### Status Tokens

| Token                    | Maps To            |
| ------------------------ | ------------------ |
| `--color-status-success` | `--color-ok-400`   |
| `--color-status-warning` | `--color-warn-400` |
| `--color-status-error`   | `--color-fail-400` |

#### Interaction States (Relative Color Math)

```css
--color-action-hover: oklch(from --color-brand-primary calc(l - 0.1) c h)
  --color-action-active: oklch(from --color-brand-primary calc(l - 0.2) c h)
  --color-surface-hover: oklch(from --color-surface-elevated calc(l + 0.02) c h)
  --color-border-hover: oklch(from --color-border-default calc(l - 0.1) c h)
  --color-text-hover: oklch(from --color-brand-primary calc(l + 0.05) c h);
```

#### Gradient Library

| Token                        | Value                                                    |
| ---------------------------- | -------------------------------------------------------- |
| `--color-grad-primary-stops` | `--color-brand-primary`, `--color-brand-secondary`       |
| `--color-grad-accent-1`      | Fuchsia 400 → 200                                        |
| `--color-grad-accent-2`      | Teal 400 → 200                                           |
| `--color-grad-accent-3`      | Red 400 → 200                                            |
| `--color-grad-accent-4`      | Ok 400 → 200                                             |
| `--color-grad-prime`         | Multi-stop: primary-400 → teal-600 → teal-400 → teal-200 |
| `--color-radial-glow`        | Radial from brand-primary to transparent                 |

#### Atmosphere Tokens (Background Layers)

| Token                 | Light                | Dark            |
| --------------------- | -------------------- | --------------- |
| `--color-atmo-center` | Soft avocado-cream   | Dark amber      |
| `--color-atmo-mid`    | Sage-tinted mid-ring | Dark warm mid   |
| `--color-atmo-edge`   | Deeper sage          | Near-black warm |
| `--color-atmo-deep`   | Subtle green tint    | Pure black      |

### Spacing

No custom spacing tokens defined. Relies on **Tailwind's default spacing scale** (multiples of 0.25rem):

Common values observed in components:

- `gap-2` (0.5rem), `gap-3` (0.75rem), `gap-4` (1rem)
- `px-4` (1rem), `px-8` (2rem)
- `py-3` (0.75rem), `py-4` (1rem), `py-20` (5rem)
- `mb-1` (0.25rem), `mb-6` (1.5rem), `my-2` (0.5rem)
- `mt-6` (1.5rem)
- `p-3` (0.75rem), `p-4` (1rem)

### Typography

#### Font Families

| Token            | Font Stack                               |
| ---------------- | ---------------------------------------- |
| `--font-display` | `'Playfair Display', serif`              |
| `--font-sans`    | `'Inter', ui-sans-serif, system-ui, ...` |
| `--font-zodiak`  | `'Zodiak', sans-serif`                   |
| `--font-mono`    | `'JetBrains Mono', ui-monospace, ...`    |
| `--font-dune`    | `'Dune Rise', sans-serif`                |

#### Type Scale

| Class           | Font           | Weight   | Size (mobile → md)      | Line Height                     |
| --------------- | -------------- | -------- | ----------------------- | ------------------------------- |
| `.terminal-h1`  | Dune Rise      | Bold     | `text-4xl` → `text-7xl` | `leading-tight`                 |
| `.terminal-h2`  | Dune Rise      | Bold     | `text-2xl` → `text-4xl` | `leading-tight`                 |
| `.terminal-h3`  | JetBrains Mono | Semibold | `text-xl` → `text-2xl`  | `leading-normal`                |
| `.body-1`       | JetBrains Mono | Normal   | `text-sm` → `text-base` | `leading-relaxed` → `leading-7` |
| `.body-2`       | JetBrains Mono | Light    | `text-sm` → `text-base` | `leading-6`                     |
| `.caption`      | JetBrains Mono | Normal   | `text-xs`               | —                               |
| `.tagline-mono` | JetBrains Mono | Light    | `text-xs`               | —                               |

Additional modifiers: `tracking-widest uppercase` on `.tagline-mono`

### Motion

#### Duration Tokens

| Token               | Value |
| ------------------- | ----- |
| `--duration-fast`   | 150ms |
| `--duration-normal` | 300ms |
| `--duration-slow`   | 500ms |

#### Easing Curves

| Token           | Value                               | Feel                |
| --------------- | ----------------------------------- | ------------------- |
| `--ease-smooth` | `cubic-bezier(0.42, 0, 0.58, 1)`    | Linear-like, gentle |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy, overshoot   |

#### Keyframes

| Name            | Purpose                                                 |
| --------------- | ------------------------------------------------------- |
| `blink`         | Terminal cursor blink (opacity 1→0, step-end)           |
| `grain`         | Film grain jitter (10-step translate cycle, 8s)         |
| `glow-pulse`    | Ambient glow breathe (opacity 0.6→0.8, scale 1→1.1, 8s) |
| `droplet-float` | Water droplet drift (12–15s ease-in-out)                |
| `forest-sway`   | Vertical line texture shift (20s)                       |
| `mist-drift`    | Fog layer vertical drift (15s)                          |
| `scan`          | CRT scanline sweep (0.5s linear)                        |
| `steam-move`    | Steam displacement drift (20s)                          |

#### Transition Utilities

| Class               | Duration            | Easing          |
| ------------------- | ------------------- | --------------- |
| `.trans-smooth-500` | `--duration-slow`   | `--ease-smooth` |
| `.trans-smooth-300` | `--duration-normal` | `--ease-smooth` |
| `.ease-smooth`      | —                   | `--ease-smooth` |

---

## Layout Rules

### Container Patterns

- **Hero**: `h-screen flex items-center justify-center relative`
- **Hero inner**: `max-w-5xl mx-auto` with responsive padding (`px-4 sm:px-6`)
- **Buttons**: `inline-flex items-center justify-center` or `flex flex-col` for stacked actions

### Grid / Flex

- **Flexbox** is the primary layout tool throughout
- **CSS Grid** is not used in this system
- Alignment: `items-center justify-center` for hero, `gap-*` for spacing between elements

### Section Spacing

- Hero vertical padding: `py-20` → `sm:py-28` → `md:py-40` → `lg:py-56`
- Content margins: `mb-6` between sections
- Action groups: `gap-3` on mobile, `gap-4` on desktop

### Background Layering

The hero uses a multi-layer gradient approach:

```css
bg-linear-to-b from-bg-t from-55% via-bg-md via-50% to-bg-b to-62%
```

Additional layers stacked via absolute positioning with z-index:

- z-5: grain overlay
- z-6: amber glow
- z-8: forest texture
- z-10: mist layer
- z-15: glass overlay
- z-18: steam overlay
- z-20: water droplets
- z-25: vignette

---

## Naming Conventions

### Class Naming Strategy

**Hybrid approach**: BEM-inspired for components + utility-first via Tailwind.

#### BEM Pattern (Components)

```
.block__element--modifier

Examples:
.hero__inner          — element within hero block
.hero__title          — element within hero block
.hero__title-name     — nested element
.hero__actions        — element within hero block
.terminal-window__header  — element within terminal block
.terminal-status__dot     — element within status block
.prime-btn--solid         — modifier variant
.prime-btn--outline       — modifier variant
.prime-btn--primary       — tone modifier
.terminal-output-line--command  — state/type modifier
```

#### Prefix Pattern (Utilities)

```
.category-description

Examples:
.trans-smooth-500    — transition utility
.trans-smooth-300    — transition utility
.bg-grad-brand       — background gradient
.bg-grad-accent-1    — background gradient
.text-grad-brand     — text gradient
.will-change-transform — performance hint
.gpu-accelerate      — performance hint
```

#### Semantic Token Pattern (CSS Variables)

```
--color-[role]-[variant]

Roles: surface, text, brand, status, border, action, grad, atmo
Examples:
--color-surface-base
--color-text-muted
--color-brand-primary
--color-status-success
--color-border-default
--color-action-hover
--color-grad-accent-1
--color-atmo-center
```

---

## Reusable Patterns

### Button System

Two button implementations coexist:

**1. `prime-btn` (BEM-based, Tailwind-driven)**

```
Base:    .prime-btn                    — rounded-full, px-6 py-3, font-dune
Variant: .prime-btn--solid             — shadow-md
         .prime-btn--outline           — border-2, transparent bg
         .prime-btn--gradient          — overflow-hidden for bg
Tone:    .prime-btn--primary           — text-primary-accent
         .prime-btn--secondary         — text-muted-text
         .prime-btn--white             — text-status-error
```

**2. `btn-prime` (standalone, CSS variable-driven)**

```
Base:    .btn-prime                    — px-8 py-4, rounded-full, font-mono,
                                        uppercase, tracking-widest,
                                        border: 1px solid brand-primary
Hover:   background swap + glow box-shadow + translateY(-2px)
Active:  translateY(0)
```

### Terminal Window

```
.terminal-window            — outer shell (rounded-lg, border)
.terminal-window__header    — top bar (px-4 py-3, gap-2, border-b)
.terminal-window__body      — content area (p-4, font-mono)
.terminal-status            — traffic-light row (flex, gap-2)
.terminal-status__dot       — colored dots (w-3 h-3, rounded-full)
```

### Terminal Output Lines

Color-coded line types:

```
.terminal-output-line              — base (mb-1, whitespace-prewrap)
.terminal-output-line--command     — brand-primary color
.terminal-output-line--system      — success green
.terminal-output-line--success     — success green
.terminal-output-line--error       — brand-secondary (coral)
.terminal-output-line--info        — brand-accent (dusk)
.terminal-output-line--easter      — brand-accent (dusk)
```

### Glass Morphism

```
@utility glass            — blur(12px), 10% surface-base tint, subtle border
@utility glass-elevated   — blur(20px), 80% surface-elevated tint, default border, shadow
```

### Gradient Utilities

```
@utility bg-grad-brand    — linear-gradient from primary-stops
@utility bg-grad-accent-1 — fuchsia gradient
@utility bg-grad-accent-2 — teal gradient
@utility text-grad-brand  — text gradient with background-clip
```

### Terminal Effects

```
.terminal-glow   — triple text-shadow with --color-terminal-glow
.cursor-blink    — blink keyframe, 0.8s step-end infinite
.scanlines       — repeating gradient + scan animation
```

### Accessibility Utilities

```
.sr-only              — screen reader only (clip + absolute positioning)
.focus-ring           — 2px brand-primary outline, 2px offset
.focus-ring-invert    — 2px brand-secondary outline, 2px offset
```

### Performance Utilities

```
.will-change-transform  — will-change: transform
.will-change-opacity    — will-change: opacity
.gpu-accelerate         — translateZ(0) + backface-visibility: hidden
```

---

## Responsiveness

### Approach

**Mobile-first** via Tailwind CSS default breakpoints.

### Breakpoints

| Token | Width  |
| ----- | ------ |
| `sm`  | 640px  |
| `md`  | 768px  |
| `lg`  | 1024px |

### Responsive Typography Example

```css
.terminal-h1: text-4xl → sm:text-5xl → md:text-7xl
.terminal-h2: text-2xl → sm:text-3xl → md:text-4xl
.body-1:      text-sm  → md:text-base
```

### Reduced Motion

Global `@media (prefers-reduced-motion: reduce)` rule in `utilities.css`:

- All animations → `0.01ms` duration
- All transitions → `0.01ms` duration
- Scroll behavior → `auto`
- View Transitions → `0.01ms`
- Grain overlay → `display: none`

### High Contrast

`@media (prefers-contrast: high)`:

- Borders → `2px`
- Focus ring → `3px` outline

---

## Strengths

1. **Tiered token architecture** — Clean separation: primitives → semantic → component. Prevents token sprawl and makes theme switching systematic.
2. **OKLCH color space** — Perceptually uniform, making lightness adjustments for hover/active states predictable and accessible.
3. **Relative color math** — `oklch(from ... calc(l - 0.1) c h)` eliminates hardcoded hover colors and ensures consistency across themes.
4. **Comprehensive accessibility** — sr-only, focus-ring, reduced-motion, high-contrast mode, and `prefers-color-scheme` support.
5. **Rich motion system** — Named easing curves (`--ease-smooth`, `--ease-spring`) and duration tokens create consistent animation language.
6. **CSS layer discipline** — `@layer base/components/utilities` ensures correct cascade ordering.
7. **Tailwind v4 `@theme`** — Modern token registration that auto-generates utility classes from CSS custom properties.

---

## Weaknesses

1. **Orphaned file** — `background-effects.css` is not imported in `index.css`. Its classes (grain, glass, mist, etc.) are unusable unless manually imported.
2. **Duplicate keyframes** — `grain` and `glow-pulse` are defined in both `motion.css` and `background-effects.css`, causing redundancy and potential conflicts.
3. **Stale entry point** — `stylex/main.css` references sub-files (`theme/theme.css`, `base/globals.css`, etc.) that don't exist.
4. **No custom spacing scale** — Relies entirely on Tailwind defaults. No design system documentation for spacing decisions.
5. **Deep var() chains** — Some semantic tokens have 3–4 levels of indirection (e.g., `--color-card-bg` → `--color-base-200` → `oklch(...)`).
6. **Dark theme uses hardcoded values** — Unlike light theme's relative color math, dark theme hover states lack `oklch(from ...)` derivations.
7. **Two button systems** — `prime-btn` and `btn-prime` coexist with overlapping purposes, creating confusion.
8. **Custom cursor without fallback component** — `cursor: none` on all interactive elements requires a custom cursor component (not in CSS).

---

## Improvements

1. **Consolidate keyframes** — Move all `@keyframes` to `motion.css`. Remove duplicates from `background-effects.css`.
2. **Import or remove `background-effects.css`** — Either add `@import './background-effects.css'` to `index.css` or delete the file.
3. **Delete `stylex/main.css`** — It references non-existent files and serves no purpose.
4. **Add custom spacing scale** — Define `--space-*` tokens in `@theme` for consistency and documentation.
5. **Flatten var() chains** — Map semantic tokens directly to primitive or Tier 2 values where possible.
6. **Add relative color math to dark theme** — Use `oklch(from ...)` for dark theme hover/active states.
7. **Unify button system** — Choose one approach (`prime-btn` for Tailwind-driven, `btn-prime` for CSS-driven) or clearly differentiate their use cases.
8. **Add a spacing documentation section** — Even if using Tailwind defaults, document which spacing values are used for what (section gaps, component padding, etc.).

---

## How to Apply This System to Another Project

### What to Reuse As-Is

- **Token architecture** (Tier 1 → Tier 2 → Tier 3) — This is the core pattern worth copying.
- **OKLCH color scales** — The perceptual uniformity is universally beneficial.
- **Easing and duration tokens** — `--ease-smooth`, `--ease-spring`, `--duration-fast/normal/slow` are project-agnostic.
- **Accessibility utilities** — `.sr-only`, `.focus-ring`, reduced-motion, high-contrast rules are always needed.
- **Glass morphism utilities** — `@utility glass` and `@utility glass-elevated` are reusable across projects.
- **Gradient utility pattern** — The `@utility bg-grad-*` and `@utility text-grad-*` pattern is portable.

### What to Simplify

- **Reduce from 8 files to 4–5** — Merge `motion.css` into tokens, combine `colors.css` + `theme.css` into a single `tokens.css`.
- **Remove background-effects.css** — Unless the project needs film grain, water droplets, and steam effects, these are overly specific.
- **Pick one button system** — Don't carry forward the dual `prime-btn` / `btn-prime` confusion.
- **Simplify atmosphere tokens** — The `--color-atmo-*` tokens are specific to this portfolio's hero background.

### Suggested Folder Structure

```
styles/
  tokens.css          # colors, spacing, typography, motion (all @theme tokens)
  theme.css           # semantic mappings, light/dark overrides
  components.css      # reusable components (buttons, cards, terminal)
  utilities.css       # glass, gradients, a11y, performance, cursor
  index.css           # imports + base styles + font imports
```

### Technology Recommendation

**Keep Tailwind CSS v4 + `@theme`** — It's the sweet spot between:

- Utility-first flexibility (rapid prototyping, consistent spacing)
- Design system rigor (custom tokens, semantic naming)
- Zero build complexity (no CSS-in-JS runtime, no CSS modules config)

If the target project uses a different framework:

- **Next.js**: Tailwind v4 works natively
- **Astro**: Tailwind v4 works natively
- **Plain HTML**: Use Tailwind CLI to compile
- **Vue/Svelte**: Tailwind v4 works with their respective Vite plugins

### Migration Checklist

1. Copy `colors.css` primitive scales → new `tokens.css`
2. Copy easing/duration tokens → new `tokens.css`
3. Copy font family definitions → new `tokens.css`
4. Create semantic mappings in `theme.css` (adapt colors to new brand)
5. Copy accessibility utilities → new `utilities.css`
6. Copy glass/gradient utilities → new `utilities.css`
7. Rebuild components from scratch using the token system (don't copy-paste)
8. Set up `index.css` with correct import order
9. Test light/dark theme toggle
10. Verify `prefers-reduced-motion` and `prefers-contrast` support
