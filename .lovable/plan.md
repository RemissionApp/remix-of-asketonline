# Fix broken scroll across all screens (mobile + web)

## Root cause

`src/components/ui/MobileOptimizedInterface.tsx` attaches a global, **non-passive** `touchmove` listener on `document` that calls `e.preventDefault()` whenever the finger moves down and `window.scrollY === 0`.

Two problems with this:

1. On the **desktop shell** (`ResponsiveShell` → `<main className="overflow-y-auto">`) the page itself does not scroll — the inner `<main>` does, so `window.scrollY` is always `0`. Every downward swipe / drag is therefore cancelled, freezing the page.
2. On **mobile**, attaching a non-passive `touchmove` to `document` forces the browser into a slow-path on every touch and cancels scroll inside nested overflow containers (accordions, dialogs, the deep-reading panel, etc.).

Pull-to-refresh is already prevented natively by `html, body { overscroll-behavior: none }` in `src/styles/base.css`, so the JS listener is redundant.

A secondary issue lives in `src/pages/NumerologyPage.tsx`: the `useLayoutEffect` walks **every parent element** and sets `scrollTop = 0` on each scrollable ancestor on every tab/system change. This fights the user, can re-trigger layout, and is unnecessary now that the global scroll bug is fixed.

## Plan

### 1. Remove the global scroll-blocking touch listeners
File: `src/components/ui/MobileOptimizedInterface.tsx`

- Delete `handleTouchStart` / `handleTouchMove` and their `addEventListener` / `removeEventListener` calls.
- Keep the iOS input-zoom viewport toggle (`focusin`/`focusout`) and the haptic-feedback logic.
- Pull-to-refresh stays disabled via existing CSS (`overscroll-behavior: none`).

### 2. Simplify NumerologyPage scroll reset
File: `src/pages/NumerologyPage.tsx`

- Replace the parent-walking `useLayoutEffect` with a single, narrowly scoped reset:
  - Reset `window.scrollTo(0, 0)`.
  - If running inside `DesktopShell`, also reset the nearest ancestor with `overflow-y: auto` (find via `closest('main')` or `scrollRef.current?.closest('[data-scroll-container]')` — using a `data-scroll-container` marker added to the desktop `<main>` for clarity).
- Trigger only on `tab`/`system` change as today.

### 3. Mark the desktop scroll container
File: `src/components/desktop/DesktopShell.tsx`

- Add `data-scroll-container` to the `<main className="overflow-y-auto">` element so pages can target it for resets without DOM walking.

### 4. Smoke-test scrolling
- Mobile viewport (390×844) and desktop viewport (1280×720): verify mouse-wheel + drag on `/main`, `/numerology` (all tabs and both systems), `/pacts`, `/profile`, `/universe-hub`, `/affirmations`.
- Confirm no regression in: pull-to-refresh suppression, iOS keyboard zoom prevention, haptic feedback on buttons.

## Files touched

- edit `src/components/ui/MobileOptimizedInterface.tsx`
- edit `src/pages/NumerologyPage.tsx`
- edit `src/components/desktop/DesktopShell.tsx`

No backend, schema, i18n, or design-token changes.
