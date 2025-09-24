import React from 'react';
import Card from '../../../components/common/Card';
import { 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  CalculatorIcon,
  ChartPieIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useAnalytics } from '../context/AnalyticsContext';

const ProfitabilityAnalysis: React.FC = () => {
  const { state } = useAnalytics();
  const { overview, categoryPerformance, profitabilityAnalysis, loading } = state;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Use backend data if available, otherwise fall back to calculated estimates
  const totalRevenue = profitabilityAnalysis?.overview?.total_revenue || overview?.total_sales || 0;
  const totalCost = profitabilityAnalysis?.overview?.total_cost || (totalRevenue * 0.65);
  const grossProfit = profitabilityAnalysis?.overview?.gross_profit || (totalRevenue - totalCost);
  const grossMargin = profitabilityAnalysis?.overview?.gross_margin || 
    (totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0);
  
  const operatingExpenses = totalRevenue * 0.15; // 15% as operating expenses
  const netProfit = grossProfit - operatingExpenses;
  const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  
  const avgOrderValue = overview?.avg_order_value || 0;
  
  // ROI and other metrics
  const inventoryTurnover = 4.2; // Mock data - would be calculated from inventory data
  const customerAcquisitionCost = 125; // Mock data
  const customerLifetimeValue = avgOrderValue * 3.5; // Estimate

  // Category profitability analysis - use backend data or fall back to estimates
  const categoryProfitability = profitabilityAnalysis?.category_profitability || 
    categoryPerformance?.map(category => ({
      ...category,
      profit: category.total_revenue * 0.35,
      margin: 35,
      cost: category.total_revenue * 0.65
    })) || [];

  if (loading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-900">Profitability Analysis</h2>
      </div>

      {/* Key Profitability Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 hover">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Gross Profit</h3>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-green-800">
              {formatCurrency(grossProfit)}
            </p>
            <p className="text-sm text-green-600">
              {formatPercentage(grossMargin)} margin
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 hover">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalculatorIcon className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Net Profit</h3>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-blue-800">
              {formatCurrency(netProfit)}
            </p>
            <p className="text-sm text-blue-600">
              {formatPercentage(netMargin)} margin
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 hover">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ChartPieIcon className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-purple-800">Inventory Turnover</h3>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-purple-800">
              {inventoryTurnover}x
            </p>
            <p className="text-sm text-purple-600">Annual turnover rate</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 hover">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CurrencyDollarIcon className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-orange-800">Customer LTV</h3>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-orange-800">
              {formatCurrency(customerLifetimeValue)}
            </p>
            <p className="text-sm text-orange-600">
              CAC: {formatCurrency(customerAcquisitionCost)}
            </p>
          </div>
        </Card>
      </div>

      {/* Detailed Profitability Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Gross Revenue</span>
              <span className="font-semibold text-gray-900">{formatCurrency(totalRevenue)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Cost of Goods Sold</span>
              <span className="font-semibold text-red-600">-{formatCurrency(totalCost)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Gross Profit</span>
              <span className="font-semibold text-green-600">{formatCurrency(grossProfit)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Operating Expenses</span>
              <span className="font-semibold text-red-600">-{formatCurrency(operatingExpenses)}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-gray-50 px-3 rounded-lg">
              <span className="font-semibold text-gray-900">Net Profit</span>
              <span className="font-bold text-green-700">{formatCurrency(netProfit)}</span>
            </div>
          </div>
        </Card>

        {/* Category Profitability */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Profitability</h3>
          <div className="space-y-3">
            {categoryProfitability.slice(0, 5).map((category: any, index: number) => {
              const isPositive = (category.margin || 35) > 30;
              return (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{category.category}</p>
                    <p className="text-sm text-gray-600">
                      {category.items_sold || category.total_sold} items sold
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(category.profit || (category.total_revenue * 0.35))}
                    </p>
                    <div className="flex items-center gap-1">
                      {isPositive ? (
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-4 w-4 text-orange-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        isPositive ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {formatPercentage(category.margin || 35)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Profitability Alerts */}
      {grossMargin < 30 && (
        <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
          <div className="flex items-center gap-3">
            <ExclamationCircleIcon className="h-6 w-6 text-yellow-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-800">Low Gross Margin Alert</h3>
              <p className="text-yellow-700 text-sm mt-1">
                Your gross margin of {formatPercentage(grossMargin)} is below the recommended 30% for jewelry retail. 
                Consider reviewing pricing strategy or supplier costs.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProfitabilityAnalysis;
