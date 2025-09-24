import React from 'react';
import Card from '../../../components/common/Card';
import Spinner from '../../../components/common/Spinner';
import { CurrencyDollarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { useAnalytics } from '../context/AnalyticsContext';

const SalesChart: React.FC = () => {
  const { state } = useAnalytics();
  const { salesTrend, loading } = state;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
          <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex justify-center items-center h-64">
          <Spinner size="md" />
        </div>
      </Card>
    );
  }

  if (!salesTrend || salesTrend.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
          <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">No sales data available</p>
        </div>
      </Card>
    );
  }

  const maxSales = Math.max(...salesTrend.map(d => d.total_sales), 1);
  const totalSales = salesTrend.reduce((sum, d) => sum + d.total_sales, 0);
  const totalOrders = salesTrend.reduce((sum, d) => sum + d.order_count, 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>Total: {formatCurrency(totalSales)}</span>
            <span>Orders: {totalOrders}</span>
          </div>
        </div>
        <div className="text-green-600 flex items-center gap-1">
          <ArrowTrendingUpIcon className="h-4 w-4" />
          <span className="text-sm font-medium">+12.5%</span>
        </div>
      </div>

      <div className="space-y-3">
        {salesTrend.map((item, index) => {
          const percentage = (item.total_sales / maxSales) * 100;
          
          return (
            <div key={index} className="group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">{formatDate(item.date)}</span>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(item.total_sales)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.order_count} orders
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 group-hover:from-blue-600 group-hover:to-blue-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default SalesChart;
