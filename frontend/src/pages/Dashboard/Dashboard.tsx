import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import {
  SparklesIcon,
  DocumentTextIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import { STORE_DISPLAY } from '../../config/store';

interface DashboardStats {
  totalProducts: number;
  totalRevenue: number;
  totalInvoices: number;
  lowStockItems: number;
  revenueGrowth: number;
  salesGrowth: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalRevenue: 0,
    totalInvoices: 0,
    lowStockItems: 0,
    revenueGrowth: 0,
    salesGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch products and invoices to calculate stats
      const [productsResponse, invoicesResponse] = await Promise.all([
        api.get('/products'),
        api.get('/invoices'),
      ]);

      const products = productsResponse.data;
      const invoices = invoicesResponse.data;

      // Calculate stats
      const totalRevenue = invoices.reduce((sum: number, invoice: any) => sum + invoice.final_amount, 0);
      const lowStockItems = products.filter((p: any) => p.quantity <= p.min_stock_level).length;

      setStats({
        totalProducts: products.length,
        totalRevenue,
        totalInvoices: invoices.length,
        lowStockItems,
        revenueGrowth: 12.5, // Mock data - in real app, calculate from historical data
        salesGrowth: 8.2,
      });

      // Set recent data
      setRecentProducts(products.slice(0, 5));
      setRecentInvoices(invoices.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      name: 'Add New Product',
      description: 'Add jewelry to inventory',
      href: '/products',
      icon: SparklesIcon,
      color: 'gold',
    },
    {
      name: 'Create Invoice',
      description: 'Start a new sale',
      href: '/invoices/new',
      icon: DocumentTextIcon,
      color: 'primary',
    },
    {
      name: 'View Analytics',
      description: 'Check performance',
      href: '/analytics',
      icon: ChartBarIcon,
      color: 'success',
    },
    {
      name: 'Manage Staff',
      description: 'Employee management',
      href: '/employees',
      icon: UsersIcon,
      color: 'secondary',
    },
  ];

  const statCards = [
    {
      name: 'Total Products',
      value: stats.totalProducts,
      icon: SparklesIcon,
      color: 'primary',
      bgColor: 'bg-gradient-to-br from-blue-600 to-blue-700',
      trend: null,
    },
    {
      name: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: BanknotesIcon,
      color: 'gold',
      bgColor: 'bg-gradient-to-br from-amber-500 to-amber-600',
      trend: { value: stats.revenueGrowth, isPositive: true },
    },
    {
      name: 'Total Sales',
      value: stats.totalInvoices,
      icon: DocumentTextIcon,
      color: 'success',
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
      trend: { value: stats.salesGrowth, isPositive: true },
    },
    {
      name: 'Low Stock Alerts',
      value: stats.lowStockItems,
      icon: ExclamationTriangleIcon,
      color: 'danger',
      bgColor: 'bg-gradient-to-br from-red-500 to-red-600',
      trend: null,
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Spinner size="lg" />
        <p className="text-gray-600 font-medium">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card padding="lg" className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 border-2 border-white/40 shadow-glass">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2 text-gray-800 text-contrast">Welcome back! ✨</h1>
            <p className="text-gray-700 text-lg font-medium">
              Here's what's happening at {STORE_DISPLAY.brandName} today.
            </p>
          </div>
          <div className="hidden lg:block">
            <SparklesIcon className="h-16 w-16 text-primary-500 animate-float" />
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} hover className="relative overflow-hidden card-hover group">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${stat.bgColor} p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <stat.icon className="h-6 w-6 text-white drop-shadow-sm" />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-gray-600 truncate">{stat.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-bold text-gray-800 text-contrast">{stat.value}</div>
                      {stat.trend && (
                        <div className={`ml-2 flex items-baseline text-sm font-bold ${
                          stat.trend.isPositive ? 'text-success-600' : 'text-danger-600'
                        }`}>
                          {stat.trend.isPositive ? (
                            <ArrowTrendingUpIcon className="h-4 w-4 flex-shrink-0 self-center" />
                          ) : (
                            <ArrowTrendingDownIcon className="h-4 w-4 flex-shrink-0 self-center" />
                          )}
                          <span className="ml-1">{stat.trend.value}%</span>
                        </div>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card padding="md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className="group relative bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center space-x-3">
                <action.icon className={`h-8 w-8 ${
                  action.color === 'gold' ? 'text-jewelry-gold-dark' :
                  action.color === 'primary' ? 'text-primary-600' :
                  action.color === 'success' ? 'text-green-600' :
                  'text-gray-600'
                }`} />
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                    {action.name}
                  </h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
            <Link to="/products">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentProducts.length > 0 ? (
              recentProducts.map((product: any, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="h-10 w-10 bg-gradient-to-br from-jewelry-gold to-jewelry-gold-dark rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{product.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">₹{product.sale_price.toLocaleString()}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    product.quantity > product.min_stock_level
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    Stock: {product.quantity}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No products yet</p>
            )}
          </div>
        </Card>

        {/* Recent Invoices */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Sales</h2>
            <Link to="/invoices">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentInvoices.length > 0 ? (
              recentInvoices.map((invoice: any, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                      <DocumentTextIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{invoice.invoice_number}</p>
                      <p className="text-sm text-gray-500">{new Date(invoice.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">₹{invoice.final_amount.toLocaleString()}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      invoice.payment_status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : invoice.payment_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {invoice.payment_status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No sales yet</p>
            )}
          </div>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockItems > 0 && (
        <Card padding="md" className="border-l-4 border-red-500 bg-red-50">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Low Stock Alert
              </h3>
              <p className="text-sm text-red-700 mt-1">
                {stats.lowStockItems} product{stats.lowStockItems !== 1 ? 's' : ''} running low on stock. 
                <Link to="/products" className="font-medium underline hover:text-red-900 ml-1">
                  Review inventory →
                </Link>
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
