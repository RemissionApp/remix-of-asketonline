
import React from 'react';

interface QuoteDisplayProps {
  quote: string;
  className?: string;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, className }) => {
  return (
    <div className={`text-center p-6 max-w-lg mx-auto ${className}`}>
      <p className="cosmic-gradient-text text-xl italic font-serif leading-relaxed">
        "{quote}"
      </p>
      <p className="mt-2 text-sm text-cosmic-accent/80">— Послание Вселенной</p>
    </div>
  );
};
