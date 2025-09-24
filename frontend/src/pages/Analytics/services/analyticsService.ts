// Analytics API service with caching and error handling
import api from '../../../services/api';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class AnalyticsService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(endpoint: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${endpoint}_${paramString}`;
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() > entry.expiry;
  }

  private async fetchWithRetry<T>(
    endpoint: string,
    params?: Record<string, any>,
    retries = 3
  ): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params);
    const cachedEntry = this.cache.get(cacheKey);

    // Return cached data if valid
    if (cachedEntry && !this.isExpired(cachedEntry)) {
      return cachedEntry.data;
    }

    // Build URL with params
    const url = new URL(`/analytics/${endpoint}`, api.defaults.baseURL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url.toString());
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Cache the result
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          expiry: Date.now() + this.CACHE_DURATION
        });

        return data;
      } catch (error) {
        console.warn(`Attempt ${attempt} failed:`, error);
        
        if (attempt === retries) {
          // If all retries failed and we have stale cached data, return it
          if (cachedEntry) {
            console.info('Returning stale cached data due to network error');
            return cachedEntry.data;
          }
          throw error;
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    throw new Error('All retry attempts failed');
  }

  // Clear cache for specific endpoint or all
  clearCache(endpoint?: string): void {
    if (endpoint) {
      const keysToDelete = Array.from(this.cache.keys()).filter(key => 
        key.startsWith(endpoint)
      );
      keysToDelete.forEach(key => this.cache.delete(key));
    } else {
      this.cache.clear();
    }
  }

  // Analytics API methods
  async getOverview() {
    return this.fetchWithRetry('overview');
  }

  async getSalesTrend(days: number) {
    return this.fetchWithRetry('sales-trend', { days });
  }

  async getCategoryPerformance() {
    return this.fetchWithRetry('category-performance');
  }

  async getTopProducts(limit: number = 10) {
    return this.fetchWithRetry('top-products', { limit });
  }

  async getCustomerAnalytics() {
    return this.fetchWithRetry('customer-analytics');
  }

  async getVendorPerformance() {
    return this.fetchWithRetry('vendor-performance');
  }

  async getInventoryAnalysis() {
    return this.fetchWithRetry('inventory-analysis');
  }

  async getPaymentAnalytics() {
    return this.fetchWithRetry('payment-analytics');
  }

  async getJewelryMetrics() {
    return this.fetchWithRetry('jewelry-metrics');
  }

  async getProfitabilityAnalysis() {
    return this.fetchWithRetry('profitability-analysis');
  }

  // Bulk fetch all analytics data
  async fetchAllAnalytics(period: number = 30) {
    try {
      const [
        overview,
        salesTrend,
        categoryPerformance,
        topProducts,
        customerAnalytics,
        vendorPerformance,
        inventoryAnalysis,
        paymentAnalytics,
        jewelryMetrics,
        profitabilityAnalysis
      ] = await Promise.allSettled([
        this.getOverview(),
        this.getSalesTrend(period),
        this.getCategoryPerformance(),
        this.getTopProducts(8),
        this.getCustomerAnalytics(),
        this.getVendorPerformance(),
        this.getInventoryAnalysis(),
        this.getPaymentAnalytics(),
        this.getJewelryMetrics(),
        this.getProfitabilityAnalysis()
      ]);

      return {
        overview: overview.status === 'fulfilled' ? overview.value : null,
        salesTrend: salesTrend.status === 'fulfilled' ? salesTrend.value : null,
        categoryPerformance: categoryPerformance.status === 'fulfilled' ? categoryPerformance.value : null,
        topProducts: topProducts.status === 'fulfilled' ? topProducts.value : null,
        customerAnalytics: customerAnalytics.status === 'fulfilled' ? customerAnalytics.value : null,
        vendorPerformance: vendorPerformance.status === 'fulfilled' ? vendorPerformance.value : null,
        inventoryAnalysis: inventoryAnalysis.status === 'fulfilled' ? inventoryAnalysis.value : null,
        paymentAnalytics: paymentAnalytics.status === 'fulfilled' ? paymentAnalytics.value : null,
        jewelryMetrics: jewelryMetrics.status === 'fulfilled' ? jewelryMetrics.value : null,
        profitabilityAnalysis: profitabilityAnalysis.status === 'fulfilled' ? profitabilityAnalysis.value : null,
      };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
