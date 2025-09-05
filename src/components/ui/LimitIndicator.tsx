import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';

interface LimitIndicatorProps {
  used: number;
  limit: number;
  label: string;
  isPro?: boolean;
  className?: string;
}

export const LimitIndicator: React.FC<LimitIndicatorProps> = ({
  used,
  limit,
  label,
  isPro = false,
  className = ""
}) => {
  const isUnlimited = limit > 100; // Consider > 100 as unlimited
  const percentage = isUnlimited ? 100 : Math.min((used / limit) * 100, 100);
  const isNearLimit = percentage >= 80 && !isUnlimited;
  const isAtLimit = used >= limit && !isUnlimited;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-cosmic-text">{label}</span>
        <div className="flex items-center gap-2">
          {isPro && <Crown size={14} className="text-cosmic-gold" />}
          <Badge variant={isAtLimit ? "destructive" : isNearLimit ? "secondary" : "outline"}>
            {isUnlimited ? "∞" : `${used}/${limit}`}
          </Badge>
        </div>
      </div>
      
      {!isUnlimited && (
        <Progress 
          value={percentage} 
          className="h-2"
        />
      )}
      
      {isAtLimit && (
        <p className="text-xs text-destructive">
          Лимит исчерпан. Обновите до PRO для получения дополнительных возможностей.
        </p>
      )}
    </div>
  );
};