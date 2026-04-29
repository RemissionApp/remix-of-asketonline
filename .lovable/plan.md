# Fix onboarding/login crash ("Что-то пошло не так")

## Root cause

The runtime error from the console is:

```
Uncaught Error: cannot add `postgres_changes` callbacks for
realtime:profiles:trial:<user.id> after `subscribe()`.
  at useEntitlement.ts:28
```

`useEntitlement` is mounted simultaneously by several components on the
main app screens (`TrialBanner`, `PaywallButton`, `ProFeatureOverlay`,
`UniverseChatProWrapper`). Each instance does:

```ts
supabase.channel(`profiles:trial:${user.id}`)   // same name every time
  .on('postgres_changes', ..., handler)
  .subscribe();
```

`supabase.channel(name)` returns the **existing** channel if one with
that name already exists in the client. The first hook subscribes it,
then the second hook gets that same already-subscribed channel and calls
`.on(...)` on it — which is forbidden and throws. The throw happens
inside a React effect, bubbles up, and the global `ErrorBoundary`
(`src/App.tsx` / `src/components/ui/ErrorBoundary.tsx`) catches it and
renders the "Что-то пошло не так / Обновить страницу" screen the user is
seeing right after login/onboarding.

This is the only place in the codebase where a channel name can collide
across mounts — `chat-${sessionId}` and `session-${sessionId}` are tied
to a single owning component, so they are fine.

## Fix

### 1. `src/hooks/useEntitlement.ts` — make the channel per-instance

- Generate a unique suffix per hook instance (e.g. via `useId()` from
  React or `crypto.randomUUID()` captured in a `useRef`).
- Use it in the channel name:
  `profiles:trial:${user.id}:${instanceId}`.
- Keep the existing cleanup (`supabase.removeChannel(channel)`) so each
  instance tears down its own channel on unmount / user change.

This guarantees each component mounting `useEntitlement` gets its own
channel object and `.on(...)` is always called before `.subscribe()`.

### 2. Verification pass on the rest of the flow

- Re-check onboarding (`src/pages/OnboardingPage.tsx`), login
  (`src/pages/LoginPage.tsx`, `src/components/AuthCallback.tsx`,
  `src/hooks/useAuthFlow.ts`) and `AppRouter` only to confirm no other
  effect throws synchronously after auth. The console only reports the
  channel error, so no other code changes are expected here — this is
  just a read-through to confirm.
- After the fix, reload the preview and confirm:
  - No "cannot add `postgres_changes` callbacks ... after `subscribe()`"
    error in the console.
  - The "Что-то пошло не так" ErrorBoundary screen no longer appears
    after login / on `/main`.

## Files to change

- `src/hooks/useEntitlement.ts` (only file that needs a code change).

No DB changes, no auth changes, no new dependencies.
