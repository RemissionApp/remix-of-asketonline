import React from 'react';

const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as
  | string
  | undefined;

export const PaymentTestModeBanner: React.FC = () => {
  if (!clientToken?.startsWith('pk_test_')) return null;

  return (
    <div className="w-full bg-orange-500/15 border-b border-orange-500/40 px-4 py-1.5 text-center text-[11px] text-orange-200">
      Тестовый режим оплаты — реальные карты не списываются. Используйте 4242 4242 4242 4242.
    </div>
  );
};