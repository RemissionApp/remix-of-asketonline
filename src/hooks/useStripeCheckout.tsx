import React, { useCallback, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { StripeEmbeddedCheckoutForm } from '@/components/StripeEmbeddedCheckout';

interface CheckoutOptions {
  priceId: string;
  quantity?: number;
  customerEmail?: string;
  userId?: string;
  returnUrl?: string;
}

/**
 * Web-only Stripe checkout. Opens a modal with embedded Stripe checkout form.
 * Native (iOS/Android) flows continue to use RevenueCat.
 */
export function useStripeCheckout() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<CheckoutOptions | null>(null);

  const openCheckout = useCallback((opts: CheckoutOptions) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const closeCheckout = useCallback(() => {
    setIsOpen(false);
    setOptions(null);
  }, []);

  const checkoutElement =
    isOpen && options ? (
      <Dialog open={isOpen} onOpenChange={open => !open && closeCheckout()}>
        <DialogContent className="max-w-2xl w-[95vw] max-h-[92vh] overflow-y-auto p-0 bg-cosmic-dark border-cosmic-accent/30">
          <StripeEmbeddedCheckoutForm {...options} />
        </DialogContent>
      </Dialog>
    ) : null;

  return { openCheckout, closeCheckout, isOpen, checkoutElement };
}