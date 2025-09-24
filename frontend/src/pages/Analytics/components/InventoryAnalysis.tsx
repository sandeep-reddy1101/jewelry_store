import React from 'react';
import Card from '../../../components/common/Card';
import { 
  CubeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ScaleIcon,
  ChartBarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useAnalytics } from '../context/AnalyticsContext';

const InventoryAnalysis: React.FC = () => {
  const { state } = useAnalytics();
  const { inventoryAnalysis, loading } = state;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
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
      </div>
    );
  }

  if (!inventoryAnalysis) {
    return (
      <Card className="p-8 text-center">
        <CubeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No inventory data available</p>
      </Card>
    );
  }

  const { stock_status, inventory_value } = inventoryAnalysis;
  
  // Calculate totals
  const totalValue = inventory_value.reduce((sum, item) => sum + item.total_value, 0);
  const totalProducts = stock_status.total_products;
  const stockHealthScore = totalProducts > 0 ? 
    ((stock_status.in_stock / totalProducts) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <CubeIcon className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Inventory Analysis</h2>
      </div>

      {/* Stock Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 hover">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-red-800">Out of Stock</h3>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-red-800">
              {stock_status.out_of_stock}
            </p>
            <p className="text-sm text-red-600">
              {totalProducts > 0 ? ((stock_status.out_of_stock / totalProducts) * 100).toFixed(1) : 0}% of inventory
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 hover">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-800">Low Stock</h3>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-yellow-800">
              {stock_status.low_stock}
            </p>
            <p className="text-sm text-yellow-600">
              {totalProducts > 0 ? ((stock_status.low_stock / totalProducts) * 100).toFixed(1) : 0}% needs reorder
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 hover">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-800">In Stock</h3>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-green-800">
              {stock_status.in_stock}
            </p>
            <p className="text-sm text-green-600">
              {totalProducts > 0 ? ((stock_status.in_stock / totalProducts) * 100).toFixed(1) : 0}% healthy stock
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 hover">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Stock Health</h3>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-blue-800">
              {stockHealthScore.toFixed(0)}%
            </p>
            <p className="text-sm text-blue-600">Overall health score</p>
          </div>
        </Card>
      </div>

      {/* Inventory Value by Category */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Inventory Value by Category</h3>
          <div className="text-sm text-gray-600">
            Total Value: {formatCurrency(totalValue)}
          </div>
        </div>
        
        <div className="space-y-4">
          {inventory_value.map((category, index) => {
            const percentage = totalValue > 0 ? (category.total_value / totalValue) * 100 : 0;
            const avgValuePerProduct = category.product_count > 0 ? 
              category.total_value / category.product_count : 0;
            
            return (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{category.category}</h4>
                    <p className="text-sm text-gray-600">
                      {category.product_count} products • {category.total_quantity} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(category.total_value)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {percentage.toFixed(1)}% of total
                    </p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Avg per product: {formatCurrency(avgValuePerProduct)}</span>
                  <span>{category.total_quantity} total items</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Inventory Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <EyeIcon className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
          </div>
          <div className="space-y-3">
            {stock_status.out_of_stock > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Urgent:</strong> {stock_status.out_of_stock} products are out of stock and need immediate restocking.
                </p>
              </div>
            )}
            
            {stock_status.low_stock > stock_status.out_of_stock && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> {stock_status.low_stock - stock_status.out_of_stock} additional products are running low on stock.
                </p>
              </div>
            )}
            
            {stockHealthScore >= 80 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Good:</strong> Your inventory health score is excellent at {stockHealthScore.toFixed(0)}%.
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ScaleIcon className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Inventory Metrics</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Products</span>
              <span className="font-semibold text-gray-900">{totalProducts.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Inventory Value</span>
              <span className="font-semibold text-gray-900">{formatCurrency(totalValue)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Categories</span>
              <span className="font-semibold text-gray-900">{inventory_value.length}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Avg Value per Product</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(totalProducts > 0 ? totalValue / totalProducts : 0)}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InventoryAnalysis;
