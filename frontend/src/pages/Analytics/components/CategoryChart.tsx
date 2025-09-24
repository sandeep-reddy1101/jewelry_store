import React from 'react';
import Card from '../../../components/common/Card';
import Spinner from '../../../components/common/Spinner';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { useAnalytics } from '../context/AnalyticsContext';

const CategoryChart: React.FC = () => {
  const { state } = useAnalytics();
  const { categoryPerformance, loading } = state;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Category Performance</h3>
          <ChartBarIcon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex justify-center items-center h-64">
          <Spinner size="md" />
        </div>
      </Card>
    );
  }

  if (!categoryPerformance || categoryPerformance.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Category Performance</h3>
          <ChartBarIcon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">No category data available</p>
        </div>
      </Card>
    );
  }

  const maxRevenue = Math.max(...categoryPerformance.map(c => c.total_revenue), 1);
  const totalRevenue = categoryPerformance.reduce((sum, c) => sum + c.total_revenue, 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Category Performance</h3>
          <p className="text-sm text-gray-600 mt-1">
            Total: {formatCurrency(totalRevenue)}
          </p>
        </div>
        <ChartBarIcon className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {categoryPerformance.map((category, index) => {
          const percentage = (category.total_revenue / maxRevenue) * 100;
          const colors = [
            'from-blue-500 to-blue-600',
            'from-green-500 to-green-600',
            'from-purple-500 to-purple-600',
            'from-orange-500 to-orange-600',
            'from-pink-500 to-pink-600',
            'from-indigo-500 to-indigo-600',
          ];
          const colorClass = colors[index % colors.length];

          return (
            <div key={category.category} className="group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {category.category}
                </span>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(category.total_revenue)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {category.total_sold} sold
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-3 bg-gradient-to-r ${colorClass} rounded-full transition-all duration-300 group-hover:shadow-lg`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{category.product_count} products</span>
                <span>Avg: {formatCurrency(category.avg_price)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default CategoryChart;
