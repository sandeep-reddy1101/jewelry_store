import { type Product } from '../../types/models';
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ProductForm from '../../components/forms/ProductForm';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  useEffect(() => {
    fetchProducts();
  }, []);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add New Product</Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.barcode}</div>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{product.sale_price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.quantity > product.min_stock_level
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.quantity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mr-2"
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(undefined);
        }}
        title={selectedProduct ? 'Edit Product' : 'Add New Product'}
      >
        <ProductForm
          product={selectedProduct}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedProduct(undefined);
          }}
        />
      </Modal>
    </div>
  );
};

export default ProductsPage;
