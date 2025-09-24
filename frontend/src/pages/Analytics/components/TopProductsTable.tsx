import React from 'react';
import Card from '../../../components/common/Card';
import Spinner from '../../../components/common/Spinner';
import { SparklesIcon, TrophyIcon, StarIcon } from '@heroicons/react/24/outline';
import { useAnalytics } from '../context/AnalyticsContext';

const TopProductsTable: React.FC = () => {
  const { state } = useAnalytics();
  const { topProducts, loading } = state;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <TrophyIcon className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <StarIcon className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <SparklesIcon className="h-5 w-5 text-orange-500" />;
    return <span className="h-5 w-5 flex items-center justify-center text-gray-500 font-bold">#{index + 1}</span>;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
          <SparklesIcon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex justify-center items-center h-64">
          <Spinner size="md" />
        </div>
      </Card>
    );
  }

  if (!topProducts || topProducts.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
          <SparklesIcon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">No product data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
        <SparklesIcon className="h-5 w-5 text-gray-400" />
      </div>

      <div className="overflow-hidden">
        <div className="space-y-3">
          {topProducts.slice(0, 8).map((product, index) => (
            <div key={product.barcode} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {getRankIcon(index)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 truncate max-w-40">
                    {product.name}
                  </p>
                  <div className="flex gap-2 text-xs text-gray-500 mt-1">
                    <span>{product.category}</span>
                    <span>•</span>
                    <span>{product.type}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatCurrency(product.total_revenue)}
                </p>
                <p className="text-sm text-gray-600">
                  {product.total_sold} sold
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TopProductsTable;
