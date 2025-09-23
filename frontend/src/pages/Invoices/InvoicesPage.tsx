import { type Invoice } from '../../types/models';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import {
  PlusIcon,
  DocumentTextIcon,
  EyeIcon,
  PrinterIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  Squares2X2Icon,
  ListBulletIcon,
  PencilIcon,
  TrashIcon,
  CurrencyRupeeIcon,
  UserIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

type FilterStatus = 'all' | 'completed' | 'pending' | 'cancelled';
type ViewMode = 'grid' | 'table';

const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [invoices, searchQuery, statusFilter, dateFilter]);

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/invoices');
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterInvoices = () => {
    let filtered = [...invoices];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(invoice =>
        invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.payment_status === statusFilter);
    }

    // Date filter
    const now = new Date();
    if (dateFilter !== 'all') {
      filtered = filtered.filter(invoice => {
        const invoiceDate = new Date(invoice.created_at);
        switch (dateFilter) {
          case 'today':
            return invoiceDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return invoiceDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return invoiceDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredInvoices(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm';
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200 shadow-sm';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200 shadow-sm';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200 shadow-sm';
    }
  };

  const getStatsCards = () => {
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.final_amount, 0);
    const completedInvoices = invoices.filter(inv => inv.payment_status === 'completed').length;
    const pendingInvoices = invoices.filter(inv => inv.payment_status === 'pending').length;

    return [
      { title: 'Total Invoices', value: invoices.length, color: 'primary' },
      { title: 'Total Revenue', value: `₹${totalAmount.toLocaleString()}`, color: 'gold' },
      { title: 'Completed', value: completedInvoices, color: 'success' },
      { title: 'Pending', value: pendingInvoices, color: 'warning' },
    ];
  };

  const renderInvoiceCard = (invoice: Invoice) => (
    <Card 
      key={invoice.id}
      padding="lg"
      className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 border-2 border-white/40 shadow-glass hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
            <DocumentTextIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{invoice.invoice_number}</h3>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {new Date(invoice.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.payment_status)}`}>
          {invoice.payment_status.charAt(0).toUpperCase() + invoice.payment_status.slice(1)}
        </span>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <UserIcon className="h-4 w-4 text-primary-500" />
            <span className="text-sm font-semibold text-gray-700">Customer</span>
          </div>
          <div className="ml-6">
            <p className="font-semibold text-gray-900">{invoice.user?.name || 'N/A'}</p>
            {invoice.user?.phone_number && (
              <p className="text-sm text-gray-500">{invoice.user.phone_number}</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <CurrencyRupeeIcon className="h-4 w-4 text-primary-500" />
            <span className="text-sm font-semibold text-gray-700">Amount Details</span>
          </div>
          <div className="ml-6">
            <p className="text-2xl font-bold text-gray-900">₹{invoice.final_amount.toLocaleString()}</p>
            {invoice.discount > 0 && (
              <p className="text-sm text-green-600 font-medium">Discount: ₹{invoice.discount.toLocaleString()}</p>
            )}
            <p className="text-sm text-gray-600">Payment: {invoice.payment_method}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            icon={<EyeIcon className="h-4 w-4" />}
          >
            View
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<PrinterIcon className="h-4 w-4" />}
          >
            Print
          </Button>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200">
            <PencilIcon className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200">
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const statsCards = getStatsCards();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card padding="lg" className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 border-2 border-white/40 shadow-glass">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2 text-gray-800 text-contrast">Invoices & Sales Management ✨</h1>
            <p className="text-gray-700 text-lg font-medium">
              Track sales, manage invoices, and monitor payment status. {invoices.length} invoices currently in system.
            </p>
          </div>
          <div className="hidden lg:block">
            <DocumentTextIcon className="h-16 w-16 text-primary-500 animate-float" />
          </div>
        </div>
      </Card>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} padding="md" className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 border-2 border-white/40 shadow-glass">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center w-12 h-12 rounded-2xl text-white shadow-lg ${
                  stat.color === 'primary' ? 'bg-gradient-to-br from-blue-600 to-blue-700' :
                  stat.color === 'gold' ? 'bg-gradient-to-br from-amber-500 to-amber-600' :
                  stat.color === 'success' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                  'bg-gradient-to-br from-orange-500 to-orange-600'
                }`}>
                  {stat.color === 'primary' && <DocumentTextIcon className="h-6 w-6" />}
                  {stat.color === 'gold' && <CurrencyRupeeIcon className="h-6 w-6" />}
                  {stat.color === 'success' && <EyeIcon className="h-6 w-6" />}
                  {stat.color === 'warning' && <CalendarIcon className="h-6 w-6" />}
                </div>
                <div>
                  <dl className="flex-1 flex flex-col justify-center">
                    <dt className="text-sm font-semibold text-gray-600 truncate">{stat.title}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-bold text-gray-800 text-contrast">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Header Actions */}
      <Card padding="md" className="bg-gradient-to-r from-white to-gray-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-display font-semibold text-gray-900">Invoice Management</h1>
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 min-w-[4rem] text-center">
              {filteredInvoices.length} items
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link to="/invoices/new">
              <button className="inline-flex items-center justify-center px-4 py-2 h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-blue-600 hover:border-blue-700">
                <PlusIcon className="h-4 w-4 mr-2 text-white" />
                New Invoice
              </button>
            </Link>
            
            <Button variant="outline" icon={<ArrowDownTrayIcon className="h-4 w-4" />}>
              Export Data
            </Button>
          </div>
        </div>
      </Card>

      {/* Search and Filters */}
      <Card padding="lg" className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 border-2 border-white/40 shadow-glass">
        <div className="flex flex-col lg:flex-row lg:items-end gap-6">
          {/* Search Section */}
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-700 mb-3">Search Invoices</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full h-12 pl-12 pr-4 border border-gray-300 rounded-xl focus:ring-0 focus:border-primary-400 focus:shadow-lg focus:shadow-primary-100 bg-white hover:border-gray-400 transition-all duration-200 text-gray-900 placeholder-gray-400 focus:placeholder-gray-300 font-medium"
                placeholder="Search by invoice number, customer name..."
              />
            </div>
          </div>

          {/* Filters Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            {/* Status Filter */}
            <div className="min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
              <div className="relative group">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                  className="custom-select w-full sm:w-40 h-12 px-4 pr-10 border border-gray-300 rounded-xl focus:ring-0 focus:border-primary-400 focus:shadow-lg focus:shadow-primary-100 bg-white hover:border-gray-400 transition-all duration-200 font-medium text-gray-900 appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-focus-within:text-primary-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-3">Date Range</label>
              <div className="relative group">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="custom-select w-full sm:w-40 h-12 px-4 pr-10 border border-gray-300 rounded-xl focus:ring-0 focus:border-primary-400 focus:shadow-lg focus:shadow-primary-100 bg-white hover:border-gray-400 transition-all duration-200 font-medium text-gray-900 appearance-none cursor-pointer"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-focus-within:text-primary-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex flex-col items-start">
              <label className="block text-sm font-medium text-gray-700 mb-3">View Mode</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center justify-center px-4 py-3 h-12 font-medium text-sm rounded-xl transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400'
                  }`}
                  title="Grid View"
                >
                  <Squares2X2Icon className="h-4 w-4 mr-2" />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center justify-center px-4 py-3 h-12 font-medium text-sm rounded-xl transition-all duration-200 ${
                    viewMode === 'table'
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400'
                  }`}
                  title="Table View"
                >
                  <ListBulletIcon className="h-4 w-4 mr-2" />
                  List
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <Card padding="lg" className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 border-2 border-white/40 shadow-glass text-center">
          <div className="py-12">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">No invoices found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'No invoices match your current filters. Try adjusting your search criteria.'
                : 'Start creating invoices to track your jewelry sales and manage customer transactions.'
              }
            </p>
            <Link to="/invoices/new">
              <Button variant="primary" icon={<PlusIcon className="h-4 w-4" />}>
                Create Your First Invoice
              </Button>
            </Link>
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredInvoices.map(renderInvoiceCard)}
        </div>
      ) : (
        <Card padding="none" className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 border-2 border-white/40 shadow-glass">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white/60 backdrop-blur-sm divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-white/80 transition-all duration-200 group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mr-3 shadow-lg">
                          <DocumentTextIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{invoice.invoice_number}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{invoice.user?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-600">{invoice.user?.phone_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-primary-500 mr-2" />
                        <span className="font-medium">{new Date(invoice.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">₹{invoice.final_amount.toLocaleString()}</div>
                      {invoice.discount > 0 && (
                        <div className="text-sm text-green-600 font-medium">Discount: ₹{invoice.discount.toLocaleString()}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      {invoice.payment_method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.payment_status)}`}>
                        {invoice.payment_status.charAt(0).toUpperCase() + invoice.payment_status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end space-x-2 opacity-70 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<EyeIcon className="h-4 w-4" />}
                        >
                          View
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<PrinterIcon className="h-4 w-4" />}
                        >
                          Print
                        </Button>
                        <div className="flex space-x-1 ml-2">
                          <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default InvoicesPage;
