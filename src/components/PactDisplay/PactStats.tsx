import React from 'react';
import { Pact } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { Target, CheckCircle, XCircle, Clock } from 'lucide-react';

interface PactStatsProps {
  pacts: Pact[];
  className?: string;
  variant?: 'compact' | 'full' | 'mini';
}

export interface PactStatistics {
  active: number;
  completed: number;
  failed: number;
  planned: number;
  total: number;
}

export const PactStats: React.FC<PactStatsProps> = ({
  pacts,
  className,
  variant = 'compact'
}) => {
  const { language } = useAppStore();

  // Calculate statistics
  const stats: PactStatistics = pacts.reduce(
    (acc, pact) => {
      acc.total++;
      switch (pact.status) {
        case 'active':
          acc.active++;
          break;
        case 'completed':
          acc.completed++;
          break;
        case 'failed':
          acc.failed++;
          break;
        case 'planned':
          acc.planned++;
          break;
      }
      return acc;
    },
    { active: 0, completed: 0, failed: 0, planned: 0, total: 0 }
  );

  // Get text labels based on language
  const getLabels = () => {
    switch (language) {
      case 'ru':
        return {
          active: 'Активные',
          completed: 'Завершённые',
          failed: 'Прерванные',
          planned: 'Запланированные',
          total: 'Всего'
        };
      case 'es':
        return {
          active: 'Activas',
          completed: 'Completadas',
          failed: 'Interrumpidas',
          planned: 'Planificadas',
          total: 'Total'
        };
      default:
        return {
          active: 'Active',
          completed: 'Completed',
          failed: 'Failed',
          planned: 'Planned',
          total: 'Total'
        };
    }
  };

  const labels = getLabels();

  if (variant === 'mini') {
    return (
      <div className={cn("flex items-center space-x-2 text-xs", className)}>
        <div className="flex items-center space-x-1">
          <Target className="w-3 h-3 text-cosmic-accent" />
          <span className="text-cosmic-accent font-medium">{stats.active}</span>
        </div>
        <span className="text-cosmic-secondary/60">•</span>
        <div className="flex items-center space-x-1">
          <CheckCircle className="w-3 h-3 text-green-400" />
          <span className="text-green-400">{stats.completed}</span>
        </div>
        {stats.failed > 0 && (
          <>
            <span className="text-cosmic-secondary/60">•</span>
            <div className="flex items-center space-x-1">
              <XCircle className="w-3 h-3 text-red-400" />
              <span className="text-red-400">{stats.failed}</span>
            </div>
          </>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn(
        "flex items-center justify-center space-x-4 text-sm",
        "bg-cosmic-dark/40 backdrop-blur-sm border border-cosmic-accent/20 rounded-lg px-4 py-2",
        className
      )}>
        <div className="flex items-center space-x-1">
          <Target className="w-4 h-4 text-cosmic-accent" />
          <span className="text-cosmic-accent font-medium">{stats.active}</span>
        </div>
        <div className="flex items-center space-x-1">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-green-400">{stats.completed}</span>
        </div>
        {stats.failed > 0 && (
          <div className="flex items-center space-x-1">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-400">{stats.failed}</span>
          </div>
        )}
        {stats.planned > 0 && (
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-cosmic-secondary" />
            <span className="text-cosmic-secondary">{stats.planned}</span>
          </div>
        )}
      </div>
    );
  }

  // Full variant
  return (
    <div className={cn(
      "grid grid-cols-2 md:grid-cols-4 gap-4 p-4",
      "bg-cosmic-dark/40 backdrop-blur-sm border border-cosmic-accent/20 rounded-lg",
      className
    )}>
      <div className="text-center">
        <Target className="w-6 h-6 text-cosmic-accent mx-auto mb-1" />
        <div className="text-2xl font-bold text-cosmic-accent">{stats.active}</div>
        <div className="text-xs text-cosmic-secondary">{labels.active}</div>
      </div>
      
      <div className="text-center">
        <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-1" />
        <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
        <div className="text-xs text-cosmic-secondary">{labels.completed}</div>
      </div>
      
      {stats.failed > 0 && (
        <div className="text-center">
          <XCircle className="w-6 h-6 text-red-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-red-400">{stats.failed}</div>
          <div className="text-xs text-cosmic-secondary">{labels.failed}</div>
        </div>
      )}
      
      {stats.planned > 0 && (
        <div className="text-center">
          <Clock className="w-6 h-6 text-cosmic-secondary mx-auto mb-1" />
          <div className="text-2xl font-bold text-cosmic-secondary">{stats.planned}</div>
          <div className="text-xs text-cosmic-secondary">{labels.planned}</div>
        </div>
      )}
    </div>
  );
};

// Hook to get pact statistics
export const usePactStats = (pacts: Pact[]): PactStatistics => {
  return pacts.reduce(
    (acc, pact) => {
      acc.total++;
      switch (pact.status) {
        case 'active':
          acc.active++;
          break;
        case 'completed':
          acc.completed++;
          break;
        case 'failed':
          acc.failed++;
          break;
        case 'planned':
          acc.planned++;
          break;
      }
      return acc;
    },
    { active: 0, completed: 0, failed: 0, planned: 0, total: 0 }
  );
};