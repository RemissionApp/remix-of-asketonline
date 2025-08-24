// Database optimization utilities for Supabase
import { supabase } from '@/lib/supabase';
import { performanceMonitor } from '@/utils/performance';

// Batch operations for better performance
export class DatabaseOptimizer {
  private static batchSize = 100;
  private static batchTimeout = 1000; // 1 second
  private static pendingOperations: Map<string, any[]> = new Map();
  private static batchTimers: Map<string, NodeJS.Timeout> = new Map();

  // Batch insert operations
  static async batchInsert<T>(
    table: string,
    records: T[],
    options?: { 
      upsert?: boolean;
      onConflict?: string;
    }
  ): Promise<{ data: T[] | null; error: any }> {
    return performanceMonitor.measureAsyncFunction(
      `batch_insert_${table}`,
      async () => {
        const chunks: T[][] = [];
        for (let i = 0; i < records.length; i += this.batchSize) {
          chunks.push(records.slice(i, i + this.batchSize));
        }

        const results: T[] = [];
        let lastError = null;

        for (const chunk of chunks) {
          try {
            const query = options?.upsert 
              ? supabase.from(table).upsert(chunk, { onConflict: options.onConflict })
              : supabase.from(table).insert(chunk);

            const { data, error } = await query.select();
            
            if (error) {
              lastError = error;
              continue;
            }
            
            if (data) {
              results.push(...data);
            }
          } catch (error) {
            lastError = error;
          }
        }

        return { data: results.length > 0 ? results : null, error: lastError };
      }
    );
  }

  // Optimized bulk delete
  static async batchDelete(
    table: string,
    ids: string[],
    idColumn: string = 'id'
  ): Promise<{ error: any }> {
    return performanceMonitor.measureAsyncFunction(
      `batch_delete_${table}`,
      async () => {
        const chunks: string[][] = [];
        for (let i = 0; i < ids.length; i += this.batchSize) {
          chunks.push(ids.slice(i, i + this.batchSize));
        }

        let lastError = null;

        for (const chunk of chunks) {
          try {
            const { error } = await supabase
              .from(table)
              .delete()
              .in(idColumn, chunk);
            
            if (error) {
              lastError = error;
            }
          } catch (error) {
            lastError = error;
          }
        }

        return { error: lastError };
      }
    );
  }

  // Optimized bulk update
  static async batchUpdate<T>(
    table: string,
    updates: Array<{ id: string; data: Partial<T> }>,
    idColumn: string = 'id'
  ): Promise<{ data: T[] | null; error: any }> {
    return performanceMonitor.measureAsyncFunction(
      `batch_update_${table}`,
      async () => {
        // For small batches, use individual updates
        if (updates.length <= 10) {
          const results: T[] = [];
          let lastError = null;

          for (const update of updates) {
            try {
              const { data, error } = await supabase
                .from(table)
                .update(update.data)
                .eq(idColumn, update.id)
                .select()
                .single();

              if (error) {
                lastError = error;
                continue;
              }

              if (data) {
                results.push(data);
              }
            } catch (error) {
              lastError = error;
            }
          }

          return { data: results.length > 0 ? results : null, error: lastError };
        }

        // For larger batches, use upsert
        const upsertData = updates.map(update => ({
          [idColumn]: update.id,
          ...update.data
        }));

        const { data, error } = await supabase
          .from(table)
          .upsert(upsertData)
          .select();

        return { data, error };
      }
    );
  }

  // Optimized pagination with count
  static async paginatedQuery<T>(
    table: string,
    page: number = 1,
    pageSize: number = 20,
    options?: {
      select?: string;
      filters?: Array<{ column: string; operator: string; value: any }>;
      orderBy?: { column: string; ascending?: boolean };
    }
  ): Promise<{
    data: T[] | null;
    count: number | null;
    error: any;
    totalPages: number;
  }> {
    return performanceMonitor.measureAsyncFunction(
      `paginated_query_${table}_page_${page}`,
      async () => {
        let query = supabase
          .from(table)
          .select(options?.select || '*', { count: 'exact' });

        // Apply filters
        if (options?.filters) {
          for (const filter of options.filters) {
            query = query.filter(filter.column, filter.operator, filter.value);
          }
        }

        // Apply ordering
        if (options?.orderBy) {
          query = query.order(options.orderBy.column, { 
            ascending: options.orderBy.ascending ?? true 
          });
        }

        // Apply pagination
        const start = (page - 1) * pageSize;
        const end = start + pageSize - 1;
        query = query.range(start, end);

        const { data, error, count } = await query;

        const totalPages = count ? Math.ceil(count / pageSize) : 0;

        return { 
          data: data as T[] | null, 
          count, 
          error, 
          totalPages 
        };
      }
    );
  }

  // Cached query with TTL
  static async cachedQuery<T>(
    cacheKey: string,
    queryFn: () => Promise<{ data: T | null; error: any }>,
    ttlMs: number = 300000 // 5 minutes default
  ): Promise<{ data: T | null; error: any; fromCache: boolean }> {
    const cached = this.getFromCache<T>(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < ttlMs) {
      return { data: cached.data, error: null, fromCache: true };
    }

    const result = await performanceMonitor.measureAsyncFunction(
      `cached_query_${cacheKey}`,
      queryFn
    );

    if (result.data && !result.error) {
      this.setCache(cacheKey, result.data);
    }

    return { ...result, fromCache: false };
  }

  // Simple in-memory cache
  private static cache: Map<string, { data: any; timestamp: number }> = new Map();

  private static getFromCache<T>(key: string): { data: T; timestamp: number } | null {
    return this.cache.get(key) || null;
  }

  private static setCache<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
    
    // Simple cleanup - remove old entries if cache gets too large
    if (this.cache.size > 100) {
      const oldestKeys = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)
        .slice(0, 20)
        .map(([key]) => key);
      
      oldestKeys.forEach(key => this.cache.delete(key));
    }
  }

  // Clear specific cache entries
  static clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const keysToDelete = Array.from(this.cache.keys())
      .filter(key => key.includes(pattern));
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Get cache statistics
  static getCacheStats(): {
    size: number;
    keys: string[];
    oldestEntry: number;
    newestEntry: number;
  } {
    const entries = Array.from(this.cache.entries());
    const timestamps = entries.map(([, value]) => value.timestamp);
    
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : 0,
      newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : 0,
    };
  }
}

// Export singleton instance
export const dbOptimizer = DatabaseOptimizer;