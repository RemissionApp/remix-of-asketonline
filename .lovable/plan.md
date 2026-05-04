# Liquid Glass redesign — Asceta

Visual-only refresh in iOS "Liquid Glass" style. Logic, routes, data and hooks remain untouched. Work is grouped into 4 stages so each can be reviewed independently.

## Stage 1 — Design tokens + core chrome

Foundation that every other screen relies on.

- `src/styles/base.css`
  - Add `:root` glass tokens: `--glass-bg`, `--glass-bg-medium`, `--glass-bg-strong`, `--glass-border`, `--glass-border-bright`, `--glass-shadow`, `--glass-blur`, `--glass-blur-heavy`, plus accent variants `--glass-purple`, `--glass-purple-border`, `--glass-gold`, `--glass-gold-border`, `--glass-green`, `--glass-red`.
- `src/styles/components.css`
  - Add utility classes `.glass`, `.glass-medium`, `.glass-strong`, `.glass-purple`, `.glass-gold` with both `backdrop-filter` and `-webkit-backdrop-filter`.
  - Add `.glass-shine::before` highlight stripe.
- `src/components/BottomNavigation.tsx`
  - Floating `mx-3 mb-3 rounded-2xl glass-strong` pill, 16px tab buttons, active tab pill (`bg-white/10`), inactive icons `text-white/40`, `active:scale-95`. Preserve existing tab list, routes and `pb-safe`.
- `src/components/TopBar.tsx`
  - Replace dark bar with three floating glass pills: avatar (left), rank (center, `Star` + label), energy (right, ⚡ + value). Use `glass-medium` / `glass` + `glass-shine`.

## Stage 2 — Card template + main hub screens

Standardise the card-button pattern, then re-skin Main / Universe / Cosmos.

- New helper `src/components/ui/GlassCard.tsx`
  - Reusable button with: `glass-medium glass-shine`, colored left-side glow, 56px icon container, title + subtitle, `ChevronRight`, `active:scale-[0.98]`. Accepts `variant: 'purple' | 'gold' | 'green' | 'blue' | 'amber' | 'violet'`.
- `src/pages/MainPage.tsx` and `src/components/MainPageComponents/*`
  - Keep greeting block as-is.
  - "Заключить договор" → glass CTA with subtle gold gradient overlay.
  - `CallHero` → `GlassCard` purple variant linking to `/lyra` (route unchanged).
  - `DailyAdviceDisplay` → amber `GlassCard` with advice text in inner block separated by `border-t border-white/8`.
  - `AffirmationsBlock`, `CosmicMissionsEntryPoint` → glass cards via template.
- `src/pages/UniverseHubPage.tsx` (Lyra hub)
  - Two existing action cards re-skinned via `GlassCard`.
  - Add "Последние разговоры" section: read existing `call_summaries` already loaded by current hooks (do not add new queries unless trivially via existing hook); render glass cards with date + duration + summary, plus empty state.
  - Add monthly minutes indicator using the existing `useCallMinutes` hook.
- `src/pages/CosmosPage.tsx`
  - Remove the "Космические миссии" entry from this page (visual move only — route stays).
  - Add top astro mini-card (`glass-gold glass-shine`) with zodiac emoji watermark, sign name, element · ruler — using already available `getZodiacSign` + `zodiacData`.
  - Re-skin Horoscope / Numerology / Affirmations entries via `GlassCard` (violet / gold / green glows).

## Stage 3 — Profile, banner, buttons, modals

- `src/components/profile/ProfileTabs.tsx`
  - Sticky pill bar with `glass` background, active pill `bg-white/15 border border-white/20`, inactive `text-white/40`.
- `src/components/profile/ui/ProfileRow.tsx`
  - Switch to `glass glass-shine` rows, 32px icon tile with per-color glass background, `text-white/90` label, `text-white/40` sublabel, `ChevronRight text-white/25`. Toggle/value rendering preserved.
- `src/components/profile/ui/ProfileSection.tsx`
  - Section title styled as `text-[10px] uppercase tracking-[0.15em] text-white/30`.
- `src/components/TrialBanner.tsx`
  - Normal state: emerald glass (`bg-emerald-500/8 border-emerald-400/20 backdrop-blur-xl glass-shine`).
  - Critical (<24 h left) state: red glass (`bg-red-500/10 border-red-400/30`). Reuse existing condition.
- `src/components/ui/button.tsx`
  - Add three variants without removing existing ones:
    - `primary-glass` — `bg-white/15 border-white/25 backdrop-blur-xl glass-shine`.
    - `gold` — solid `bg-cosmic-gold/90 text-[#0d0d12]` with shadow.
    - `ghost-glass` — `glass border-white/10 text-white/60`.
  - All include `active:scale-[0.98] transition-all duration-150`.
- `src/components/ui/dialog.tsx` and `src/components/ui/drawer.tsx`
  - Overlay: `bg-black/50 backdrop-blur-sm`.
  - Content: bottom-sheet `glass-strong glass-shine rounded-t-3xl pb-safe max-h-[85vh]` with handle bar.

## Stage 4 — Polish & consistency pass

- Search for legacy `bg-cosmic-dark/40 border border-cosmic-accent/15 backdrop-blur-sm` patterns and replace with `glass` utility for visual consistency (no behavior change).
- Verify `overflow-hidden` is present on every glass element with rounded corners.
- Confirm no text drops below `text-white/40`.
- Manual visual QA on 390×740 viewport: Main, Lyra hub, Cosmos, Profile (all 6 tabs), TrialBanner states, a sample dialog.

## Technical notes

- All `backdrop-filter` rules duplicated with `-webkit-backdrop-filter` for iOS Safari.
- `StarField` remains untouched — it's the background under the glass.
- No DB, no hooks, no routes touched. Imports stay the same; only JSX class names and a few small wrappers change.
- Existing semantic color tokens (`cosmic-gold`, `cosmic-accent`, etc.) are preserved; new glass tokens are additive.

## Out of scope

- Onboarding, login, legal, achievements, mission detail screens (can be done in a follow-up using the same `GlassCard` and tokens).
- Animations beyond the existing `active:scale-[0.98]` tactile feedback.
