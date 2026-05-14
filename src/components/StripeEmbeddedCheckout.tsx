import React from 'react';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';

interface StripeEmbeddedCheckoutProps {
  priceId: string;
  quantity?: number;
  customerEmail?: string;
  userId?: string;
  returnUrl?: string;
}

export const StripeEmbeddedCheckoutForm: React.FC<
  StripeEmbeddedCheckoutProps
> = ({ priceId, quantity, customerEmail, userId, returnUrl }) => {
  const fetchClientSecret = React.useCallback(async (): Promise<string> => {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: {
        priceId,
        quantity,
        customerEmail,
        userId,
        returnUrl:
          returnUrl ??
          `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
        environment: getStripeEnvironment(),
      },
    });
    if (error || !data?.clientSecret) {
      throw new Error(error?.message || 'Failed to create checkout session');
    }
    return data.clientSecret as string;
  }, [priceId, quantity, customerEmail, userId, returnUrl]);

  const checkoutOptions = React.useMemo(
    () => ({ fetchClientSecret }),
    [fetchClientSecret],
  );

  return (
    <div id="checkout" className="w-full">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={checkoutOptions}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};