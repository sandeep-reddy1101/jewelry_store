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
      { title: 'Total Products', value: totalProducts, color: 'primary' },
      { title: 'Total Value', value: `₹${totalValue.toLocaleString()}`, color: 'gold' },
      { title: 'Low Stock', value: lowStockItems, color: 'yellow' },
      { title: 'Out of Stock', value: outOfStockItems, color: 'red' },
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} padding="md" shadow="elegant" className="text-center">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
              <p className={`text-2xl font-bold ${
                stat.color === 'primary' ? 'text-primary-600' :
                stat.color === 'gold' ? 'text-jewelry-gold-dark' :
                stat.color === 'yellow' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {stat.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Header Actions */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-display font-semibold text-gray-900">Products</h1>
            <span className="text-sm text-gray-500">({filteredProducts.length} items)</span>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="gold"
              icon={<PlusIcon className="h-4 w-4" />}
              onClick={() => {
                console.log('Add Product clicked, setting modal to open');
                setIsModalOpen(true);
              }}
            >
              Add Product
            </Button>
            <Button variant="outline" icon={<ArrowDownTrayIcon className="h-4 w-4" />}>
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Search and Filters */}
      <Card padding="md">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Search products..."
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="category">Sort by Category</option>
              <option value="stock">Sort by Stock</option>
              <option value="created_at">Sort by Date</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-l-lg transition-colors`}
              >
                <Squares2X2Icon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 ${viewMode === 'table' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-r-lg transition-colors`}
              >
                <ListBulletIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        <Card padding="lg" className="text-center">
          <div className="py-12">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
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
