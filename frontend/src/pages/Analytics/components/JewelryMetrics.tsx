import React from 'react';
import Card from '../../../components/common/Card';
import { 
  SparklesIcon, 
  ScaleIcon, 
  GiftIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { useAnalytics } from '../context/AnalyticsContext';

const JewelryMetrics: React.FC = () => {
  const { state } = useAnalytics();
  const { overview, categoryPerformance, jewelryMetrics, loading } = state;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatWeight = (weight: number) => {
    return `${weight.toFixed(2)}g`;
  };

  // Calculate jewelry-specific metrics
  const goldCategory = categoryPerformance?.find(c => 
    c.category?.toLowerCase().includes('gold') || c.category?.toLowerCase().includes('chain')
  );
  const silverCategory = categoryPerformance?.find(c => 
    c.category?.toLowerCase().includes('silver')
  );
  const diamondCategory = categoryPerformance?.find(c => 
    c.category?.toLowerCase().includes('diamond') || c.category?.toLowerCase().includes('stone')
  );

  // Use backend data if available, otherwise fall back to mock data
  const mockJewelryMetrics = {
    totalGoldWeight: 2847.5, // grams
    totalSilverWeight: 1523.2, // grams
    averagePurity: 18.2, // karats
    topSellingMetal: 'Gold',
    craftsmanshipCharges: (overview?.total_sales || 0) * 0.15, // 15% of sales
    wastageRecovery: 92.5, // percentage
  };

  const jewelryData = jewelryMetrics || mockJewelryMetrics;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <SparklesIcon className="h-6 w-6 text-amber-600" />
        <h2 className="text-2xl font-bold text-gray-900">Jewelry-Specific Metrics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Metal-wise Performance */}
        <Card className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 hover">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold text-amber-800">Gold Sales</h3>
            </div>
            <div className="text-amber-600 text-sm font-medium">
              {formatWeight(jewelryData.totalGoldWeight || mockJewelryMetrics.totalGoldWeight)}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-amber-800">
              {formatCurrency(goldCategory?.total_revenue || 0)}
            </p>
            <p className="text-sm text-amber-600">
              {goldCategory?.total_sold || 0} pieces sold
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 hover">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ScaleIcon className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-800">Silver Sales</h3>
            </div>
            <div className="text-gray-600 text-sm font-medium">
              {formatWeight(jewelryData.totalSilverWeight || mockJewelryMetrics.totalSilverWeight)}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-800">
              {formatCurrency(silverCategory?.total_revenue || 0)}
            </p>
            <p className="text-sm text-gray-600">
              {silverCategory?.total_sold || 0} pieces sold
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 hover">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GiftIcon className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Diamond/Stones</h3>
            </div>
            <div className="text-blue-600 text-sm font-medium">Premium</div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-blue-800">
              {formatCurrency(diamondCategory?.total_revenue || 0)}
            </p>
            <p className="text-sm text-blue-600">
              {diamondCategory?.total_sold || 0} pieces sold
            </p>
          </div>
        </Card>

        {/* Purity & Quality Metrics */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 hover">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BeakerIcon className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Average Purity</h3>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-green-800">
              {jewelryData.averagePurity || mockJewelryMetrics.averagePurity}K
            </p>
            <p className="text-sm text-green-600">Gold purity standard</p>
          </div>
        </Card>

        {/* Craftsmanship Revenue */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 hover">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CurrencyDollarIcon className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-purple-800">Making Charges</h3>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-purple-800">
              {formatCurrency(jewelryData.craftsmanshipCharges || mockJewelryMetrics.craftsmanshipCharges)}
            </p>
            <p className="text-sm text-purple-600">Craftsmanship revenue</p>
          </div>
        </Card>

        {/* Wastage Recovery */}
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 hover">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-orange-800">Wastage Recovery</h3>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-orange-800">
              {jewelryData.wastageRecovery || mockJewelryMetrics.wastageRecovery}%
            </p>
            <p className="text-sm text-orange-600">Metal recovery rate</p>
          </div>
        </Card>
      </div>

      {/* Top Performing Metal Type */}
      <Card className="p-6 bg-gradient-to-r from-gradient-start to-gradient-end border border-white/20 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Top Performing Metal</h3>
            <p className="text-3xl font-bold">{jewelryData.topSellingMetal || mockJewelryMetrics.topSellingMetal}</p>
            <p className="text-white/80 text-sm mt-1">Leading by revenue</p>
          </div>
          <SparklesIcon className="h-12 w-12 text-white/60" />
        </div>
      </Card>
    </div>
  );
};

export default JewelryMetrics;
