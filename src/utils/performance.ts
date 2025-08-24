// Performance monitoring utilities
import React from 'react';
import { createLogger } from './logger';

const logger = createLogger('Performance');

export interface PerformanceMetrics {
  name: string;
  duration: number;
  type: 'navigation' | 'resource' | 'measure' | 'paint';
  timestamp: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private isProduction: boolean;

  private constructor() {
    this.isProduction = import.meta.env.PROD;
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Measure function execution time
  measureAsyncFunction<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    
    return fn().then(
      (result) => {
        const duration = performance.now() - startTime;
        this.recordMetric({
          name,
          duration,
          type: 'measure',
          timestamp: Date.now(),
        });
        return result;
      },
      (error) => {
        const duration = performance.now() - startTime;
        this.recordMetric({
          name: `${name}_error`,
          duration,
          type: 'measure',
          timestamp: Date.now(),
        });
        throw error;
      }
    );
  }

  // Measure synchronous function execution time
  measureFunction<T>(name: string, fn: () => T): T {
    const startTime = performance.now();
    try {
      const result = fn();
      const duration = performance.now() - startTime;
      this.recordMetric({
        name,
        duration,
        type: 'measure',
        timestamp: Date.now(),
      });
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.recordMetric({
        name: `${name}_error`,
        duration,
        type: 'measure',
        timestamp: Date.now(),
      });
      throw error;
    }
  }

  // Record custom metric
  recordMetric(metric: PerformanceMetrics): void {
    if (!this.isProduction && metric.duration > 100) {
      logger.warn(`Slow operation detected: ${metric.name}`, {
        duration: `${metric.duration.toFixed(2)}ms`,
        type: metric.type,
      });
    }

    // In production, send to monitoring service
    if (this.isProduction && metric.duration > 1000) {
      this.sendToMonitoring(metric);
    }
  }

  // Get Web Vitals metrics
  initWebVitals(): void {
    if (typeof window === 'undefined') return;

    // First Paint (FP)
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-paint') {
          this.recordMetric({
            name: 'first_paint',
            duration: entry.startTime,
            type: 'paint',
            timestamp: Date.now(),
          });
        } else if (entry.name === 'first-contentful-paint') {
          this.recordMetric({
            name: 'first_contentful_paint',
            duration: entry.startTime,
            type: 'paint',
            timestamp: Date.now(),
          });
        }
      }
    });

    try {
      paintObserver.observe({ entryTypes: ['paint'] });
    } catch (error) {
      // Browser doesn't support paint timing
    }

    // Navigation timing
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.recordMetric({
          name: 'page_load',
          duration: navigation.loadEventEnd - navigation.fetchStart,
          type: 'navigation',
          timestamp: Date.now(),
        });
      }
    });
  }

  private sendToMonitoring(metric: PerformanceMetrics): void {
    // В будущем можно интегрировать с сервисом мониторинга
    // Например, отправлять данные в Google Analytics, DataDog, etc.
    try {
      // fetch('/api/metrics', {
      //   method: 'POST',
      //   body: JSON.stringify(metric)
      // });
    } catch (error) {
      // Ignore monitoring errors
    }
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Decorator for React components
export function withPerformanceMonitoring<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> {
  return (props: P) => {
    const startTime = performance.now();
    
    React.useEffect(() => {
      const duration = performance.now() - startTime;
      performanceMonitor.recordMetric({
        name: `component_render_${componentName}`,
        duration,
        type: 'measure',
        timestamp: Date.now(),
      });
    });

    return React.createElement(WrappedComponent, props);
  };
}

// Hook for component performance monitoring
export function usePerformanceMonitoring(componentName: string) {
  const startTime = React.useRef(performance.now());
  
  React.useEffect(() => {
    const duration = performance.now() - startTime.current;
    performanceMonitor.recordMetric({
      name: `component_mount_${componentName}`,
      duration,
      type: 'measure',
      timestamp: Date.now(),
    });
    
    return () => {
      const unmountDuration = performance.now() - startTime.current;
      performanceMonitor.recordMetric({
        name: `component_lifecycle_${componentName}`,
        duration: unmountDuration,
        type: 'measure',
        timestamp: Date.now(),
      });
    };
  }, [componentName]);
}