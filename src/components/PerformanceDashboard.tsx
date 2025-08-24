// Performance dashboard component for development
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { performanceMonitor } from '@/utils/performance';
import { Button } from '@/components/ui/button';

interface PerformanceStats {
  slowOperations: Array<{
    name: string;
    duration: number;
    timestamp: number;
  }>;
  averageRenderTime: number;
  memoryUsage?: number;
  fcp?: number;
  lcp?: number;
}

const MemoizedPerformanceDashboard: React.FC = () => {
  const [stats, setStats] = useState<PerformanceStats>({
    slowOperations: [],
    averageRenderTime: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (import.meta.env.DEV) {
      setIsVisible(true);
    }
  }, []);

  const updateStats = () => {
    // Get performance entries
    const paintEntries = performance.getEntriesByType('paint');
    const measureEntries = performance.getEntriesByType('measure');

    const newStats: PerformanceStats = {
      slowOperations: measureEntries
        .filter(entry => entry.duration > 100)
        .slice(-10)
        .map(entry => ({
          name: entry.name,
          duration: Math.round(entry.duration * 100) / 100,
          timestamp: Date.now(),
        })),
      averageRenderTime: measureEntries.length > 0 
        ? Math.round((measureEntries.reduce((sum, entry) => sum + entry.duration, 0) / measureEntries.length) * 100) / 100
        : 0,
    };

    // Add paint metrics if available
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    const lcp = paintEntries.find(entry => entry.name === 'largest-contentful-paint');

    if (fcp) newStats.fcp = Math.round(fcp.startTime);
    if (lcp) newStats.lcp = Math.round(lcp.startTime);

    // Memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      newStats.memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
    }

    setStats(newStats);
  };

  const clearPerformanceData = () => {
    performance.clearMarks();
    performance.clearMeasures();
    setStats({
      slowOperations: [],
      averageRenderTime: 0,
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <Card className="w-80 bg-cosmic-dark/95 backdrop-blur-sm border-cosmic-accent/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-cosmic-accent flex items-center justify-between">
            Performance Monitor
            <div className="flex gap-2">
              <Button
                onClick={updateStats}
                size="sm"
                variant="outline"
                className="h-6 px-2 text-xs"
              >
                Refresh
              </Button>
              <Button
                onClick={clearPerformanceData}
                size="sm"
                variant="outline"
                className="h-6 px-2 text-xs"
              >
                Clear
              </Button>
              <Button
                onClick={() => setIsVisible(false)}
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-xs"
              >
                ×
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {/* Core Web Vitals */}
          <div className="space-y-1">
            <h4 className="text-xs font-medium text-white">Core Web Vitals</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {stats.fcp && (
                <div className="flex justify-between">
                  <span className="text-cosmic-secondary">FCP:</span>
                  <span className={`${stats.fcp > 1800 ? 'text-red-400' : stats.fcp > 1000 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {stats.fcp}ms
                  </span>
                </div>
              )}
              {stats.lcp && (
                <div className="flex justify-between">
                  <span className="text-cosmic-secondary">LCP:</span>
                  <span className={`${stats.lcp > 2500 ? 'text-red-400' : stats.lcp > 1500 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {stats.lcp}ms
                  </span>
                </div>
              )}
              {stats.memoryUsage && (
                <div className="flex justify-between">
                  <span className="text-cosmic-secondary">Memory:</span>
                  <span className={`${stats.memoryUsage > 50 ? 'text-red-400' : stats.memoryUsage > 25 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {stats.memoryUsage}MB
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-cosmic-secondary">Avg Render:</span>
                <span className={`${stats.averageRenderTime > 50 ? 'text-red-400' : stats.averageRenderTime > 20 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {stats.averageRenderTime}ms
                </span>
              </div>
            </div>
          </div>

          {/* Slow Operations */}
          {stats.slowOperations.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-xs font-medium text-white">Slow Operations</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {stats.slowOperations.map((op, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="text-cosmic-secondary truncate flex-1 mr-2">
                      {op.name}
                    </span>
                    <span className={`${op.duration > 500 ? 'text-red-400' : op.duration > 200 ? 'text-yellow-400' : 'text-orange-400'}`}>
                      {op.duration}ms
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Tips */}
          <div className="space-y-1">
            <h4 className="text-xs font-medium text-white">Optimization</h4>
            <div className="text-xs text-cosmic-secondary space-y-1">
              {stats.averageRenderTime > 50 && (
                <p className="text-yellow-400">• Consider using React.memo for components</p>
              )}
              {stats.slowOperations.length > 5 && (
                <p className="text-yellow-400">• Multiple slow operations detected</p>
              )}
              {stats.memoryUsage && stats.memoryUsage > 50 && (
                <p className="text-red-400">• High memory usage detected</p>
              )}
              {stats.slowOperations.length === 0 && stats.averageRenderTime < 20 && (
                <p className="text-green-400">• Performance looks good!</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Export memoized component
export const PerformanceDashboard = React.memo(MemoizedPerformanceDashboard);

// Toggle function for development
export const togglePerformanceDashboard = () => {
  const event = new CustomEvent('toggle-performance-dashboard');
  window.dispatchEvent(event);
};