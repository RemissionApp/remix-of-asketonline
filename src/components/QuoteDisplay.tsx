
import { DailyQuote } from '@/types';
import { cn } from '@/lib/utils';
import { QuoteIcon } from 'lucide-react';

interface QuoteDisplayProps {
  quote: DailyQuote;
  className?: string;
}

export const QuoteDisplay = ({ quote, className }: QuoteDisplayProps) => {
  return (
    <div
      className={cn(
        "relative max-w-md bg-gradient-to-br from-cosmic-dark/50 to-cosmic-dark/80 backdrop-blur-sm",
        "border border-cosmic-accent/20 p-6 rounded-md quote-card",
        className
      )}
    >
      <div className="absolute left-3 top-3 text-cosmic-accent opacity-50">
        <QuoteIcon size={18} />
      </div>

      <p className="text-white/90 italic font-serif text-center">
        "{quote.text}"
      </p>

      <p className="text-cosmic-accent text-xs mt-3 text-right">
        — {quote.author}
      </p>
    </div>
  );
};
