import { Capacitor } from '@capacitor/core';
import { SignInWithApple, SignInWithAppleOptions } from '@capacitor-community/apple-sign-in';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const APPLE_CLIENT_ID = 'com.asket.cosmicascension';

/**
 * Apple Sign-In с гибридным flow:
 *  • iOS — нативный AuthenticationServices через @capacitor-community/apple-sign-in.
 *    Требуется Apple для соответствия App Store Guideline 4.8.
 *  • Android / web — Lovable Cloud managed OAuth (browser redirect).
 *
 * Возвращает { error?: Error, redirected?: boolean }.
 */
export async function signInWithApple(): Promise<{ error?: Error; redirected?: boolean }> {
  const platform = Capacitor.getPlatform();

  // Native iOS flow.
  if (platform === 'ios' && Capacitor.isNativePlatform()) {
    try {
      const nonce = cryptoRandom();
      const options: SignInWithAppleOptions = {
        clientId: APPLE_CLIENT_ID,
        redirectURI: `${SUPABASE_URL}/auth/v1/callback`,
        scopes: 'email name',
        state: cryptoRandom(),
        nonce,
      };
      const result = await SignInWithApple.authorize(options);
      const idToken = result.response?.identityToken;
      if (!idToken) {
        return { error: new Error('Apple Sign-In: identityToken missing') };
      }
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: idToken,
        nonce,
      });
      if (error) return { error };
      return {};
    } catch (e) {
      return { error: e instanceof Error ? e : new Error(String(e)) };
    }
  }

  // Android + web — managed OAuth через Lovable Cloud.
  try {
    const result = await lovable.auth.signInWithOAuth('apple', {
      redirect_uri: window.location.origin,
    });
    if (result.error) return { error: result.error as Error };
    if (result.redirected) return { redirected: true };
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e : new Error(String(e)) };
  }
}

function cryptoRandom(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}