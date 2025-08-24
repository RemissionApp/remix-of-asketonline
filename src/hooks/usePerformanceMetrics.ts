import { useState, useEffect, useCallback } from 'react';
import { createLogger } from '@/utils/logger';

const logger = createLogger('PerformanceMetrics');

interface PerformanceMetrics {
  // Database metrics
  dbQueryCount: number;
  dbQueryTime: number;
  avgQueryTime: number;
  
  // React Query cache metrics
  cacheHitRate: number;
  cachedQueries: number;
  staleCacheCount: number;
  
  // Component render metrics
  renderCount: number;
  reRenderCount: number;
  avgRenderTime: number;
  
  // Memory metrics
  memoryUsage: number;
  memoryDelta: number;
  
  // Network metrics
  networkRequests: number;
  networkErrors: number;
  
  // User interaction metrics
  interactionLatency: number;
  slowInteractions: number;
}

interface PerformanceCollector {
  metrics: PerformanceMetrics;
  isCollecting: boolean;
  startCollection: () => void;
  stopCollection: () => void;
  resetMetrics: () => void;
  recordDbQuery: (duration: number) => void;
  recordCacheHit: (hit: boolean) => void;
  recordRender: (duration: number, isReRender?: boolean) => void;
  recordNetworkRequest: (success: boolean) => void;
  recordInteraction: (duration: number) => void;
  getReport: () => PerformanceReport;
}

interface PerformanceReport {
  summary: {
    overallScore: number;
    bottlenecks: string[];
    recommendations: string[];
  };
  details: PerformanceMetrics;
  timestamp: number;
}

const initialMetrics: PerformanceMetrics = {
  dbQueryCount: 0,
  dbQueryTime: 0,
  avgQueryTime: 0,
  cacheHitRate: 0,
  cachedQueries: 0,
  staleCacheCount: 0,
  renderCount: 0,
  reRenderCount: 0,
  avgRenderTime: 0,
  memoryUsage: 0,
  memoryDelta: 0,
  networkRequests: 0,
  networkErrors: 0,
  interactionLatency: 0,
  slowInteractions: 0,
};

export const usePerformanceMetrics = (): PerformanceCollector => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(initialMetrics);
  const [isCollecting, setIsCollecting] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [initialMemory, setInitialMemory] = useState<number>(0);

  // Cache hit tracking
  const [cacheHits, setCacheHits] = useState(0);
  const [cacheRequests, setCacheRequests] = useState(0);

  // Memory monitoring
  const checkMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      return {
        used: memInfo.usedJSHeapSize,
        total: memInfo.totalJSHeapSize,
        limit: memInfo.jsHeapSizeLimit,
      };
    }
    return null;
  }, []);

  // Start performance collection
  const startCollection = useCallback(() => {
    setIsCollecting(true);
    setStartTime(performance.now());
    setMetrics(initialMetrics);
    setCacheHits(0);
    setCacheRequests(0);

    const memInfo = checkMemoryUsage();
    if (memInfo) {
      setInitialMemory(memInfo.used);
    }

    logger.info('Performance metrics collection started');
  }, [checkMemoryUsage]);

  // Stop performance collection
  const stopCollection = useCallback(() => {
    setIsCollecting(false);
    logger.info('Performance metrics collection stopped', { metrics });
  }, [metrics]);

  // Reset metrics
  const resetMetrics = useCallback(() => {
    setMetrics(initialMetrics);
    setCacheHits(0);
    setCacheRequests(0);
    logger.debug('Performance metrics reset');
  }, []);

  // Record database query
  const recordDbQuery = useCallback((duration: number) => {
    if (!isCollecting) return;

    setMetrics(prev => ({
      ...prev,
      dbQueryCount: prev.dbQueryCount + 1,
      dbQueryTime: prev.dbQueryTime + duration,
      avgQueryTime: (prev.dbQueryTime + duration) / (prev.dbQueryCount + 1),
    }));
  }, [isCollecting]);

  // Record cache hit/miss
  const recordCacheHit = useCallback((hit: boolean) => {
    if (!isCollecting) return;

    setCacheRequests(prev => prev + 1);
    if (hit) {
      setCacheHits(prev => prev + 1);
    }

    setMetrics(prev => ({
      ...prev,
      cacheHitRate: cacheRequests > 0 ? (cacheHits / cacheRequests) * 100 : 0,
      cachedQueries: prev.cachedQueries + (hit ? 1 : 0),
    }));
  }, [isCollecting, cacheHits, cacheRequests]);

  // Record component render
  const recordRender = useCallback((duration: number, isReRender = false) => {
    if (!isCollecting) return;

    setMetrics(prev => ({
      ...prev,
      renderCount: prev.renderCount + 1,
      reRenderCount: prev.reRenderCount + (isReRender ? 1 : 0),
      avgRenderTime: ((prev.avgRenderTime * prev.renderCount) + duration) / (prev.renderCount + 1),
    }));
  }, [isCollecting]);

  // Record network request
  const recordNetworkRequest = useCallback((success: boolean) => {
    if (!isCollecting) return;

    setMetrics(prev => ({
      ...prev,
      networkRequests: prev.networkRequests + 1,
      networkErrors: prev.networkErrors + (success ? 0 : 1),
    }));
  }, [isCollecting]);

  // Record user interaction
  const recordInteraction = useCallback((duration: number) => {
    if (!isCollecting) return;

    const isSlowInteraction = duration > 100; // 100ms threshold

    setMetrics(prev => ({
      ...prev,
      interactionLatency: Math.max(prev.interactionLatency, duration),
      slowInteractions: prev.slowInteractions + (isSlowInteraction ? 1 : 0),
    }));
  }, [isCollecting]);

  // Generate performance report
  const getReport = useCallback((): PerformanceReport => {
    const bottlenecks: string[] = [];
    const recommendations: string[] = [];

    // Analyze metrics and identify bottlenecks
    if (metrics.avgQueryTime > 200) {
      bottlenecks.push('Slow database queries');
      recommendations.push('Optimize database queries and add proper indexing');
    }

    if (metrics.cacheHitRate < 70) {
      bottlenecks.push('Low cache hit rate');
      recommendations.push('Improve React Query cache configuration');
    }

    if (metrics.avgRenderTime > 16) {
      bottlenecks.push('Slow component renders');
      recommendations.push('Optimize component rendering with useMemo and useCallback');
    }

    if (metrics.reRenderCount > metrics.renderCount * 0.3) {
      bottlenecks.push('Excessive re-renders');
      recommendations.push('Reduce unnecessary re-renders by improving state management');
    }

    if (metrics.networkErrors > metrics.networkRequests * 0.1) {
      bottlenecks.push('High network error rate');
      recommendations.push('Implement better error handling and retry mechanisms');
    }

    if (metrics.slowInteractions > 5) {
      bottlenecks.push('Slow user interactions');
      recommendations.push('Optimize interaction handlers and use debouncing');
    }

    // Calculate overall score (0-100)
    let score = 100;
    score -= Math.min(metrics.avgQueryTime / 10, 20); // Max -20 for slow queries
    score -= Math.min((100 - metrics.cacheHitRate) / 2, 15); // Max -15 for cache misses
    score -= Math.min(metrics.avgRenderTime, 15); // Max -15 for slow renders
    score -= Math.min(metrics.slowInteractions * 2, 20); // Max -20 for slow interactions
    score -= Math.min(metrics.networkErrors * 5, 10); // Max -10 for network errors

    return {
      summary: {
        overallScore: Math.max(0, Math.round(score)),
        bottlenecks,
        recommendations,
      },
      details: { ...metrics },
      timestamp: Date.now(),
    };
  }, [metrics]);

  // Update memory metrics periodically
  useEffect(() => {
    if (!isCollecting) return;

    const interval = setInterval(() => {
      const memInfo = checkMemoryUsage();
      if (memInfo) {
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memInfo.used,
          memoryDelta: memInfo.used - initialMemory,
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isCollecting, initialMemory, checkMemoryUsage]);

  return {
    metrics,
    isCollecting,
    startCollection,
    stopCollection,
    resetMetrics,
    recordDbQuery,
    recordCacheHit,
    recordRender,
    recordNetworkRequest,
    recordInteraction,
    getReport,
  };
};