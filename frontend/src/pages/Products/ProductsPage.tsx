import { type Product } from '../../types/models';
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ProductCard from '../../components/common/ProductCard';
import FormModal from '../../components/common/FormModal';
import ProductForm from '../../components/forms/ProductForm';
import Spinner from '../../components/common/Spinner';
import {
  PlusIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

type ViewMode = 'grid' | 'table';
type SortOption = 'name' | 'price' | 'category' | 'stock' | 'created_at';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  // Debug modal state
  React.useEffect(() => {
    console.log('Modal state changed:', isModalOpen);
  }, [isModalOpen]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, sortBy, filterCategory]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.type?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => product.category?.name === filterCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return b.sale_price - a.sale_price;
        case 'category':
          return (a.category?.name || '').localeCompare(b.category?.name || '');
        case 'stock':
          return b.quantity - a.quantity;
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleSubmit = async (data: Partial<Product>) => {
    try {
      if (selectedProduct) {
        await api.put(`/products/${selectedProduct.id}`, data);
      } else {
        await api.post('/products', data);
      }
      fetchProducts();
      setIsModalOpen(false);
      setSelectedProduct(undefined);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const getCategories = () => {
    const categories = Array.from(new Set(products.map(p => p.category?.name).filter(Boolean)));
    return categories;
  };

  const getStatsCards = () => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.sale_price * p.quantity), 0);
    const lowStockItems = products.filter(p => p.quantity <= p.min_stock_level).length;
    const outOfStockItems = products.filter(p => p.quantity === 0).length;

    return [
      {
        name: 'Total Products',
        value: totalProducts,
        icon: SparklesIcon,
        color: 'primary',
        bgColor: 'bg-gradient-to-br from-blue-600 to-blue-700',
      },
      {
        name: 'Total Value',
        value: `₹${totalValue.toLocaleString()}`,
        icon: BanknotesIcon,
        color: 'gold',
        bgColor: 'bg-gradient-to-br from-amber-500 to-amber-600',
      },
      {
        name: 'Low Stock',
        value: lowStockItems,
        icon: ExclamationTriangleIcon,
        color: 'yellow',
        bgColor: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      },
      {
        name: 'Out of Stock',
        value: outOfStockItems,
        icon: XCircleIcon,
        color: 'red',
        bgColor: 'bg-gradient-to-br from-red-500 to-red-600',
      },
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const statsCards = getStatsCards();
  const categories = getCategories();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card padding="lg" className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 border-2 border-white/40 shadow-glass">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2 text-gray-800 text-contrast">Product Inventory ✨</h1>
            <p className="text-gray-700 text-lg font-medium">
              Manage your jewelry collection with ease. {products.length} products currently in inventory.
            </p>
          </div>
          <div className="hidden lg:block">
            <SparklesIcon className="h-16 w-16 text-primary-500 animate-float" />
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
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
            <h1 className="text-2xl font-display font-semibold text-gray-900">Inventory Management</h1>
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 min-w-[4rem] text-center">
              {filteredProducts.length} items
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                console.log('Add Product clicked, setting modal to open');
                setIsModalOpen(true);
              }}
              className="inline-flex items-center justify-center px-4 py-2 h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-blue-600 hover:border-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2 text-white" />
              Add New Product
            </button>
            
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
            <label className="block text-sm font-medium text-gray-700 mb-3">Search Products</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full h-12 pl-12 pr-4 border border-gray-300 rounded-xl focus:ring-0 focus:border-primary-400 focus:shadow-lg focus:shadow-primary-100 bg-white hover:border-gray-400 transition-all duration-200 text-gray-900 placeholder-gray-400 focus:placeholder-gray-300 font-medium"
                placeholder="Search by name, barcode, category..."
              />
            </div>
          </div>

          {/* Filters Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            {/* Category Filter */}
            <div className="min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
              <div className="relative group">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="custom-select w-full sm:w-40 h-12 px-4 pr-10 border border-gray-300 rounded-xl focus:ring-0 focus:border-primary-400 focus:shadow-lg focus:shadow-primary-100 bg-white hover:border-gray-400 transition-all duration-200 font-medium text-gray-900 appearance-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-focus-within:text-primary-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Sort Filter */}
            <div className="min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-3">Sort By</label>
              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="custom-select w-full sm:w-40 h-12 px-4 pr-10 border border-gray-300 rounded-xl focus:ring-0 focus:border-primary-400 focus:shadow-lg focus:shadow-primary-100 bg-white hover:border-gray-400 transition-all duration-200 font-medium text-gray-900 appearance-none cursor-pointer"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="category">Category</option>
                  <option value="stock">Stock</option>
                  <option value="created_at">Date</option>
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

      {/* Low Stock Alert - Similar to Dashboard */}
      {products.length > 0 && products.filter(p => p.quantity <= p.min_stock_level).length > 0 && (
        <Card padding="md" className="border-l-4 border-yellow-500 bg-yellow-50">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                Low Stock Alert
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                {products.filter(p => p.quantity <= p.min_stock_level).length} product{products.filter(p => p.quantity <= p.min_stock_level).length !== 1 ? 's' : ''} running low on stock. 
                <span className="font-medium underline hover:text-yellow-900 ml-1 cursor-pointer">
                  Review inventory to restock items.
                </span>
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Out of Stock Alert */}
      {products.length > 0 && products.filter(p => p.quantity === 0).length > 0 && (
        <Card padding="md" className="border-l-4 border-red-500 bg-red-50">
          <div className="flex items-center">
            <XCircleIcon className="h-6 w-6 text-red-600" />
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Out of Stock Alert
              </h3>
              <p className="text-sm text-red-700 mt-1">
                {products.filter(p => p.quantity === 0).length} product{products.filter(p => p.quantity === 0).length !== 1 ? 's' : ''} completely out of stock. 
                <span className="font-medium underline hover:text-red-900 ml-1 cursor-pointer">
                  Immediate restocking required.
                </span>
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        <Card padding="lg" className="text-center">
          <div className="py-12">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              {products.length === 0 
                ? "You haven't added any products yet. Start building your inventory!" 
                : "Try adjusting your search or filter criteria."
              }
            </p>
            {products.length === 0 && (
              <Button
                variant="gold"
                icon={<PlusIcon className="h-4 w-4" />}
                onClick={() => setIsModalOpen(true)}
              >
                Add Your First Product
              </Button>
            )}
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-br from-jewelry-gold to-jewelry-gold-dark rounded-lg flex items-center justify-center mr-4">
                          <span className="text-white font-bold text-sm">{product.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.barcode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.type?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.net_weight} {product.weight_unit?.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{product.sale_price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.quantity > product.min_stock_level
                          ? 'bg-green-100 text-green-800'
                          : product.quantity === 0
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Product Form Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          console.log('Modal onClose called');
          setIsModalOpen(false);
          setSelectedProduct(undefined);
        }}
        title={selectedProduct ? 'Edit Product' : 'Add New Product'}
        size="xl"
      >
        <ProductForm
          product={selectedProduct}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedProduct(undefined);
          }}
        />
      </FormModal>
    </div>
  );
};

export default ProductsPage;
