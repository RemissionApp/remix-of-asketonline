import React from 'react';

interface ProfileSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children, className = '' }) => {
  return (
    <section className={`w-full ${className}`}>
      {title && (
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-cosmic-secondary/90 mb-2 px-1">
          {title}
        </h2>
      )}
      <div className="flex flex-col gap-[2px]">{children}</div>
    </section>
  );
};