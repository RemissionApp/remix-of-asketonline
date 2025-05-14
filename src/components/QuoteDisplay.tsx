
import React from 'react';

export interface Quote {
  text: string;
  author: string;
}

interface QuoteDisplayProps {
  quote: Quote;
  className?: string;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, className }) => {
  return (
    <div className={`text-center p-6 max-w-lg mx-auto ${className}`}>
      <p className="cosmic-gradient-text text-xl italic font-serif leading-relaxed">
        "{quote.text}"
      </p>
      <p className="mt-2 text-sm text-cosmic-accent/80">— {quote.author}</p>
    </div>
  );
};
