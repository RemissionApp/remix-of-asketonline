import React from 'react';

interface UniverseChatProWrapperProps {
  children: React.ReactNode;
  isPro: boolean;
}

export const UniverseChatProWrapper: React.FC<UniverseChatProWrapperProps> = ({
  children,
  isPro,
}) => {
  return <>{children}</>;
};
