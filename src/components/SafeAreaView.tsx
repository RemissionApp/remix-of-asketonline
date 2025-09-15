import React from 'react';

interface SafeAreaViewProps {
  children: React.ReactNode;
  className?: string;
}

export const SafeAreaView: React.FC<SafeAreaViewProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 1rem)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        minHeight: '100dvh', // Dynamic viewport height for mobile
      }}
    >
      {children}
    </div>
  );
};
