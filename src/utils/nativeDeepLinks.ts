import { Capacitor } from '@capacitor/core';
import { App, type URLOpenListenerEvent } from '@capacitor/app';
import { supabase } from '@/integrations/supabase/client';

/**
 * Universal deep-link handler for native (iOS/Android) builds.
 *
 * Handles two Supabase auth callback formats that may arrive via the
 * custom URL scheme (e.g. `app.lovable.5484cc75...://auth/callback`):
 *
 *  1) PKCE / OAuth code flow:    ...?code=XXXX
 *  2) Implicit / recovery hash:  ...#access_token=...&refresh_token=...
 *
 * After the session is set, the user is navigated to `/main` (or
 * `/reset-password` for password-recovery links).
 *
 * Native config (must be added once after `npx cap add ios|android`):
 *  - iOS  → Info.plist `CFBundleURLTypes` with scheme `app.lovable.<id>`
 *  - Android → AndroidManifest.xml `<intent-filter>` with the same scheme
 *
 * Lovable config already uses appId `app.lovable.<projectId>`, so use
 * that string as the URL scheme for OAuth `redirect_uri`:
 *   `app.lovable.<projectId>://auth/callback`
 */
export function initNativeDeepLinks(): void {
  if (!Capacitor.isNativePlatform()) return;

  App.addListener('appUrlOpen', async (event: URLOpenListenerEvent) => {
    try {
      const raw = event?.url;
      if (!raw) return;

      const url = new URL(raw);
      const hash = url.hash?.startsWith('#') ? url.hash.slice(1) : url.hash;
      const hashParams = new URLSearchParams(hash || '');
      const queryParams = url.searchParams;

      const code = queryParams.get('code');
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type') || queryParams.get('type');

      // 1) PKCE / OAuth code exchange
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.warn('[deepLinks] exchangeCodeForSession failed', error);
          return;
        }
      }
      // 2) Implicit / recovery: tokens in hash
      else if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) {
          console.warn('[deepLinks] setSession failed', error);
          return;
        }
      } else {
        return; // not an auth deep link
      }

      // Navigate inside the SPA without a full reload
      const target = type === 'recovery' ? '/reset-password' : '/main';
      if (window.location.pathname !== target) {
        window.history.replaceState({}, '', target);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    } catch (e) {
      console.warn('[deepLinks] handler error', e);
    }
  });
}