import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { supabase } from '@/integrations/supabase/client';

const SESSION_KEY = 'sb-native-session-v1';

/**
 * On native platforms (iOS / Android), localStorage inside the WebView is
 * not always persisted reliably across cold starts. We mirror the Supabase
 * session into Capacitor Preferences (which uses Keychain / SharedPrefs)
 * so the user stays logged in between app launches.
 *
 * Call this ONCE, as early as possible, before any code that reads
 * `supabase.auth.getSession()`.
 */
export async function initNativeSessionBridge(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    // 1) Restore any previously persisted session into Supabase memory.
    const { value } = await Preferences.get({ key: SESSION_KEY });
    if (value) {
      try {
        const parsed = JSON.parse(value);
        if (parsed?.access_token && parsed?.refresh_token) {
          await supabase.auth.setSession({
            access_token: parsed.access_token,
            refresh_token: parsed.refresh_token,
          });
        }
      } catch (e) {
        console.warn('[nativeSessionBridge] failed to parse stored session', e);
        await Preferences.remove({ key: SESSION_KEY });
      }
    }
  } catch (e) {
    console.warn('[nativeSessionBridge] restore failed', e);
  }

  // 2) Keep Preferences in sync with future auth changes.
  supabase.auth.onAuthStateChange(async (_event, session) => {
    try {
      if (session?.access_token && session?.refresh_token) {
        await Preferences.set({
          key: SESSION_KEY,
          value: JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          }),
        });
      } else {
        await Preferences.remove({ key: SESSION_KEY });
      }
    } catch (e) {
      console.warn('[nativeSessionBridge] persist failed', e);
    }
  });
}