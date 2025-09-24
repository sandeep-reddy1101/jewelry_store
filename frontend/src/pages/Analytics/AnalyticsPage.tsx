import React from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CubeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import { useAnalytics } from './context/AnalyticsContext';
import SalesChart from './components/SalesChart';
import CategoryChart from './components/CategoryChart';
import TopProductsTable from './components/TopProductsTable';
import CustomerAnalytics from './components/CustomerAnalytics';
import VendorPerformance from './components/VendorPerformance';
import InventoryAnalysis from './components/InventoryAnalysis';
import PaymentAnalytics from './components/PaymentAnalytics';
import JewelryMetrics from './components/JewelryMetrics';
import ProfitabilityAnalysis from './components/ProfitabilityAnalysis';

const AnalyticsPage: React.FC = () => {
  const { state, actions } = useAnalytics();
  const { overview, loading, error, selectedPeriod } = state;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const periodOptions = [
    { value: 7, label: '7 Days' },
    { value: 30, label: '30 Days' },
    { value: 90, label: '90 Days' },
    { value: 365, label: '1 Year' },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Loading Header */}
        <div className="relative">
          <PageHeader 
            title="Jewelry Store Analytics" 
            description="Loading comprehensive business insights..." 
            icon={ChartBarIcon}
          />
          <div className="absolute top-6 right-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">Loading...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-300 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Loading Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        {/* Error Header */}
        <div className="relative">
          <PageHeader 
            title="Jewelry Store Analytics" 
            description="Error loading business insights" 
            icon={ChartBarIcon}
          />
          <div className="absolute top-6 right-6">
            <button
              onClick={actions.refreshData}
              className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors flex items-center gap-2"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>

        {/* Error Content */}
              {/* Error State */}
      {error && (
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error Loading Analytics</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
            <button
              onClick={actions.refreshData}
              className="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </Card>
      )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Clean Full-Width Header */}
      <PageHeader 
        title="Jewelry Store Analytics" 
        description="Comprehensive business insights and performance metrics" 
        icon={ChartBarIcon}
      />

      {/* Controls Bar */}
      <Card className="p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 border border-gray-200/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left: Period & Refresh Controls */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Time Period:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => actions.setPeriod(Number(e.target.value))}
              className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors shadow-sm"
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={actions.refreshData}
              disabled={state.refreshing}
              className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <ArrowPathIcon className={`h-4 w-4 transition-transform duration-200 ${state.refreshing ? 'animate-spin' : 'group-hover:rotate-45'}`} />
              <span>{state.refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>

          {/* Right: Status & Last Updated */}
          <div className="flex items-center gap-4">
            {/* Data Status Indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                state.refreshing ? 'bg-yellow-500 animate-pulse' : 
                error ? 'bg-red-500' : 'bg-green-500'
              }`}></div>
              <span className="text-xs font-medium text-gray-600">
                {state.refreshing ? 'Updating...' : 
                 error ? 'Error' : 'Live Data'}
              </span>
            </div>

            {/* Last Updated */}
            {state.lastUpdated && (
              <div className="text-xs text-gray-500 bg-white/60 px-3 py-1.5 rounded-full border border-gray-200">
                Updated: {new Date(state.lastUpdated).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 text-white shadow-xl hover">
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-white/90 text-sm font-medium">Total Sales</p>
              <p className="text-2xl font-bold text-white mt-1">
                {formatCurrency(overview?.total_sales || 0)}
              </p>
              <p className="text-white/80 text-xs mt-1">
                {overview?.total_orders || 0} orders
              </p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-white/80" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white shadow-xl hover">
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-white/90 text-sm font-medium">Avg Order Value</p>
              <p className="text-2xl font-bold text-white mt-1">
                {formatCurrency(overview?.avg_order_value || 0)}
              </p>
              <p className="text-white/80 text-xs mt-1">
                Per transaction
              </p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-white/80" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white shadow-xl hover">
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-white/90 text-sm font-medium">Active Products</p>
              <p className="text-2xl font-bold text-white mt-1">
                {(overview?.total_products || 0).toLocaleString()}
              </p>
              <p className="text-white/80 text-xs mt-1">
                {overview?.low_stock_items || 0} low stock
              </p>
            </div>
            <CubeIcon className="h-8 w-8 text-white/80" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 text-white shadow-xl hover">
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-white/90 text-sm font-medium">Active Customers</p>
              <p className="text-2xl font-bold text-white mt-1">
                {(overview?.active_customers || 0).toLocaleString()}
              </p>
              <p className="text-white/80 text-xs mt-1">
                Customer base
              </p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-white/80" />
          </div>
        </Card>
      </div>

      {/* Today & Month Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-green-800">Today's Performance</h3>
            <ClockIcon className="h-5 w-5 text-green-600" />
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-green-600">Sales Today</p>
              <p className="text-2xl font-bold text-green-800">
                {formatCurrency(overview?.today_sales || 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-800">This Month</h3>
            <CurrencyDollarIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-blue-600">Monthly Sales</p>
              <p className="text-2xl font-bold text-blue-800">
                {formatCurrency(overview?.month_sales || 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Jewelry-Specific Metrics */}
      <JewelryMetrics />

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <SalesChart />
        <CategoryChart />
      </div>

      {/* Profitability Analysis */}
      <ProfitabilityAnalysis />

      {/* Products and Customers */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <TopProductsTable />
        <CustomerAnalytics />
      </div>

      {/* Vendor and Payment Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <VendorPerformance />
        <PaymentAnalytics />
      </div>

      {/* Inventory Analysis */}
      <InventoryAnalysis />
    </div>
  );
};

export default AnalyticsPage;
