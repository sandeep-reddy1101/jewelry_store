import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';

// Types
interface OverviewData {
  total_sales: number;
  total_orders: number;
  total_products: number;
  active_customers: number;
  low_stock_items: number;
  today_sales: number;
  month_sales: number;
  avg_order_value: number;
}

interface SalesData {
  date: string;
  total_sales: number;
  order_count: number;
}

interface CategoryData {
  category: string;
  total_revenue: number;
  total_sold: number;
  product_count: number;
  avg_price: number;
}

interface ProductData {
  name: string;
  barcode: string;
  category: string;
  type: string;
  total_revenue: number;
  total_sold: number;
}

interface CustomerData {
  name: string;
  email: string;
  total_spent: number;
  order_count: number;
  avg_order_value: number;
  last_order_date: string | null;
}

interface VendorData {
  name: string;
  contact_number: string;
  product_count: number;
  total_sales: number;
  total_inventory: number;
  avg_product_price: number;
}

interface PaymentMethodData {
  method: string;
  total_amount: number;
  transaction_count: number;
}

interface PaymentStatusData {
  status: string;
  total_amount: number;
  transaction_count: number;
}

interface PaymentData {
  payment_methods: PaymentMethodData[];
  payment_status: PaymentStatusData[];
}

interface StockStatus {
  out_of_stock: number;
  low_stock: number;
  in_stock: number;
  total_products: number;
}

interface InventoryValue {
  category: string;
  total_value: number;
  product_count: number;
  total_quantity: number;
}

interface InventoryData {
  stock_status: StockStatus;
  inventory_value: InventoryValue[];
}

interface AnalyticsState {
  // Data
  overview: OverviewData | null;
  salesTrend: SalesData[];
  categoryPerformance: CategoryData[];
  topProducts: ProductData[];
  customerAnalytics: CustomerData[];
  vendorPerformance: VendorData[];
  inventoryAnalysis: InventoryData | null;
  paymentAnalytics: PaymentData | null;
  jewelryMetrics: any | null;
  profitabilityAnalysis: any | null;
  
  // UI State
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  selectedPeriod: number;
  lastUpdated: Date | null;
}

// Actions
type AnalyticsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_REFRESHING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PERIOD'; payload: number }
  | { type: 'SET_ALL_DATA'; payload: Partial<AnalyticsState> }
  | { type: 'SET_OVERVIEW'; payload: OverviewData }
  | { type: 'SET_SALES_TREND'; payload: SalesData[] }
  | { type: 'SET_CATEGORY_PERFORMANCE'; payload: CategoryData[] }
  | { type: 'SET_TOP_PRODUCTS'; payload: ProductData[] }
  | { type: 'SET_CUSTOMER_ANALYTICS'; payload: CustomerData[] }
  | { type: 'SET_VENDOR_PERFORMANCE'; payload: VendorData[] }
  | { type: 'SET_INVENTORY_ANALYSIS'; payload: InventoryData }
  | { type: 'SET_PAYMENT_ANALYTICS'; payload: PaymentData }
  | { type: 'CLEAR_CACHE' };

// Initial state
const initialState: AnalyticsState = {
  overview: null,
  salesTrend: [],
  categoryPerformance: [],
  topProducts: [],
  customerAnalytics: [],
  vendorPerformance: [],
  inventoryAnalysis: null,
  paymentAnalytics: null,
  jewelryMetrics: null,
  profitabilityAnalysis: null,
  loading: true,
  refreshing: false,
  error: null,
  selectedPeriod: 30,
  lastUpdated: null,
};

// Reducer
function analyticsReducer(state: AnalyticsState, action: AnalyticsAction): AnalyticsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_REFRESHING':
      return { ...state, refreshing: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false, refreshing: false };
    
    case 'SET_PERIOD':
      return { ...state, selectedPeriod: action.payload };
    
    case 'SET_ALL_DATA':
      return {
        ...state,
        ...action.payload,
        loading: false,
        refreshing: false,
        error: null,
        lastUpdated: new Date(),
      };
    
    case 'SET_OVERVIEW':
      return { ...state, overview: action.payload };
    
    case 'SET_SALES_TREND':
      return { ...state, salesTrend: action.payload };
    
    case 'SET_CATEGORY_PERFORMANCE':
      return { ...state, categoryPerformance: action.payload };
    
    case 'SET_TOP_PRODUCTS':
      return { ...state, topProducts: action.payload };
    
    case 'SET_CUSTOMER_ANALYTICS':
      return { ...state, customerAnalytics: action.payload };
    
    case 'SET_VENDOR_PERFORMANCE':
      return { ...state, vendorPerformance: action.payload };
    
    case 'SET_INVENTORY_ANALYSIS':
      return { ...state, inventoryAnalysis: action.payload };
    
    case 'SET_PAYMENT_ANALYTICS':
      return { ...state, paymentAnalytics: action.payload };
    
    case 'CLEAR_CACHE':
      analyticsService.clearCache();
      return { ...state, lastUpdated: null };
    
    default:
      return state;
  }
}

// Context
interface AnalyticsContextType {
  state: AnalyticsState;
  actions: {
    fetchAllData: () => Promise<void>;
    refreshData: () => Promise<void>;
    setPeriod: (period: number) => void;
    clearCache: () => void;
  };
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

// Hook
export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

// Provider
interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(analyticsReducer, initialState);

  const fetchAllData = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const data = await analyticsService.fetchAllAnalytics(state.selectedPeriod);

      dispatch({
        type: 'SET_ALL_DATA',
        payload: {
          overview: data.overview as OverviewData || null,
          salesTrend: (data.salesTrend as any)?.sales_trend || [],
          categoryPerformance: (data.categoryPerformance as any)?.category_performance || [],
          topProducts: (data.topProducts as any)?.top_products || [],
          customerAnalytics: (data.customerAnalytics as any)?.top_customers || [],
          vendorPerformance: (data.vendorPerformance as any)?.vendor_performance || [],
          inventoryAnalysis: data.inventoryAnalysis as InventoryData || null,
          paymentAnalytics: data.paymentAnalytics as PaymentData || null,
          jewelryMetrics: data.jewelryMetrics || null,
          profitabilityAnalysis: data.profitabilityAnalysis || null,
        },
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to fetch analytics data',
      });
    }
  }, [state.selectedPeriod]);

  const refreshData = useCallback(async () => {
    try {
      dispatch({ type: 'SET_REFRESHING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Clear cache to force fresh data
      analyticsService.clearCache();

      await fetchAllData();
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to refresh analytics data',
      });
    }
  }, [fetchAllData]);

  const setPeriod = useCallback((period: number) => {
    dispatch({ type: 'SET_PERIOD', payload: period });
  }, []);

  const clearCache = useCallback(() => {
    dispatch({ type: 'CLEAR_CACHE' });
  }, []);

  // Fetch data when period changes
  useEffect(() => {
    fetchAllData();
  }, [state.selectedPeriod]); // Only depend on selectedPeriod, not fetchAllData

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, []); // Empty dependency array for initial fetch

  const contextValue: AnalyticsContextType = {
    state,
    actions: {
      fetchAllData,
      refreshData,
      setPeriod,
      clearCache,
    },
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};
