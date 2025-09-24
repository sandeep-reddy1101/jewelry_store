import React from 'react';
import Card from '../../../components/common/Card';
import { 
  BuildingStorefrontIcon,
  PhoneIcon,
  CubeIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  TrophyIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useAnalytics } from '../context/AnalyticsContext';

const VendorPerformance: React.FC = () => {
  const { state } = useAnalytics();
  const { vendorPerformance, loading } = state;

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
      <Card className="p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!vendorPerformance || vendorPerformance.length === 0) {
    return (
      <Card className="p-8 text-center">
        <BuildingStorefrontIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No vendor data available</p>
      </Card>
    );
  }

  // Calculate vendor rankings and insights
  const topVendor = vendorPerformance[0];
  const totalSales = vendorPerformance.reduce((sum, vendor) => sum + (vendor.total_sales || 0), 0);
  const totalProducts = vendorPerformance.reduce((sum, vendor) => sum + vendor.product_count, 0);

  const getPerformanceRating = (vendor: any) => {
    const salesScore = (vendor.total_sales || 0) / Math.max(topVendor.total_sales || 1, 1);
    const productScore = vendor.product_count / Math.max(topVendor.product_count, 1);
    const avgScore = (salesScore + productScore) / 2;
    
    if (avgScore >= 0.8) return { rating: 5, label: 'Excellent', color: 'text-green-600' };
    if (avgScore >= 0.6) return { rating: 4, label: 'Good', color: 'text-blue-600' };
    if (avgScore >= 0.4) return { rating: 3, label: 'Average', color: 'text-yellow-600' };
    if (avgScore >= 0.2) return { rating: 2, label: 'Below Avg', color: 'text-orange-600' };
    return { rating: 1, label: 'Poor', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BuildingStorefrontIcon className="h-6 w-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-900">Vendor Performance</h2>
      </div>

      {/* Top Vendor Highlight */}
      {topVendor && (
        <Card className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <TrophyIcon className="h-12 w-12 text-yellow-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Top Performing Vendor</h3>
                <p className="text-2xl font-bold mt-1">{topVendor.name}</p>
                <p className="text-white/90 text-sm">{topVendor.contact_number}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/90 text-sm">Total Sales</p>
              <p className="text-2xl font-bold">{formatCurrency(topVendor.total_sales || 0)}</p>
              <p className="text-white/80 text-sm">{topVendor.product_count} products</p>
            </div>
          </div>
        </Card>
      )}

      {/* Vendor List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">All Vendors</h3>
        <div className="space-y-4">
          {vendorPerformance.map((vendor, index) => {
            const performance = getPerformanceRating(vendor);
            const salesPercentage = totalSales > 0 ? ((vendor.total_sales || 0) / totalSales) * 100 : 0;
            
            return (
              <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <BuildingStorefrontIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        {vendor.name}
                        {index === 0 && <TrophyIcon className="h-4 w-4 text-yellow-500" />}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <PhoneIcon className="h-3 w-3" />
                        {vendor.contact_number}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={`h-4 w-4 ${i < performance.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className={`text-sm font-medium ml-1 ${performance.color}`}>
                        {performance.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">#{index + 1} ranking</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-gray-600">Sales</p>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(vendor.total_sales || 0)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CubeIcon className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-gray-600">Products</p>
                      <p className="font-semibold text-gray-900">{vendor.product_count}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ScaleIcon className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-gray-600">Inventory</p>
                      <p className="font-semibold text-gray-900">{vendor.total_inventory || 0}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CurrencyDollarIcon className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-gray-600">Avg Price</p>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(vendor.avg_product_price || 0)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sales percentage bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Market Share</span>
                    <span>{salesPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300"
                      style={{ width: `${salesPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Vendor Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BuildingStorefrontIcon className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">Total Vendors</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{vendorPerformance.length}</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Total Sales</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{formatCurrency(totalSales)}</p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CubeIcon className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-purple-800">Total Products</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">{totalProducts}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VendorPerformance;
