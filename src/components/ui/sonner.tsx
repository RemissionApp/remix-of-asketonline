import React from 'react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, toast } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      position="top-center"
      offset="calc(env(safe-area-inset-top) + 1rem)"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-cosmic-dark/90 group-[.toaster]:text-white group-[.toaster]:border-cosmic-accent/30 group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-sm',
          description: 'group-[.toast]:text-cosmic-secondary',
          actionButton:
            'group-[.toast]:bg-cosmic-accent group-[.toast]:text-white',
          cancelButton:
            'group-[.toast]:bg-cosmic-dark/50 group-[.toast]:text-cosmic-secondary',
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
