import { type Product, type Invoice, type InvoiceItem, type User } from '../../types/models';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface InvoiceFormData {
  user_id: number;
  items: Array<{
    product_id: number;
    quantity: number;
    unit_price: number;
    discount: number;
    total_price: number;
  }>;
  total_amount: number;
  discount: number;
  tax: number;
  final_amount: number;
  payment_status: 'pending' | 'completed' | 'cancelled';
  payment_method: string;
}

const NewInvoicePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<{
    [key: string]: {
      product: Product;
      quantity: number;
      discount: number;
    };
  }>({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [productsRes, usersRes] = await Promise.all([
        api.get('/products'),
        api.get('/users'),
      ]);
      setProducts(productsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const handleProductSelect = (productId: string, quantity: number = 1, discount: number = 0) => {
    const product = products.find((p) => p.id === parseInt(productId));
    if (product) {
      setSelectedProducts((prev) => ({
        ...prev,
        [productId]: {
          product,
          quantity,
          discount,
        },
      }));
    }
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;

    Object.values(selectedProducts).forEach(({ product, quantity, discount }) => {
      const itemTotal = product.sale_price * quantity;
      const itemDiscount = (itemTotal * discount) / 100;
      subtotal += itemTotal;
      totalDiscount += itemDiscount;
    });

    const tax = subtotal * 0.18; // 18% GST
    const finalAmount = subtotal - totalDiscount + tax;

    return {
      subtotal,
      totalDiscount,
      tax,
      finalAmount,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = e.target as HTMLFormElement;
      const userId = parseInt(form.user_id.value);
      const paymentMethod = form.payment_method.value;
      const { subtotal, totalDiscount, tax, finalAmount } = calculateTotals();

      const invoiceData: InvoiceFormData = {
        user_id: userId,
        items: Object.entries(selectedProducts).map(([productId, { quantity, discount }]) => ({
          product_id: parseInt(productId),
          quantity,
          unit_price: products.find((p) => p.id === parseInt(productId))?.sale_price || 0,
          discount,
          total_price:
            ((products.find((p) => p.id === parseInt(productId))?.sale_price || 0) * quantity * (100 - discount)) / 100,
        })),
        total_amount: subtotal,
        discount: totalDiscount,
        tax,
        final_amount: finalAmount,
        payment_status: 'pending',
        payment_method: paymentMethod,
      };

      await api.post('/invoices', invoiceData);
      navigate('/invoices');
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, totalDiscount, tax, finalAmount } = calculateTotals();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New Invoice</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer</label>
              <select
                name="user_id"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">Select Customer</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <select
                name="payment_method"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">Select Payment Method</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Items</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-4">
                <label className="block text-sm font-medium text-gray-700">Product</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  onChange={(e) => handleProductSelect(e.target.value)}
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ₹{product.sale_price}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {Object.entries(selectedProducts).map(([productId, { product, quantity, discount }]) => (
              <div key={productId} className="grid grid-cols-12 gap-4 items-center bg-gray-50 p-4 rounded-md">
                <div className="col-span-4">
                  <div className="text-sm font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">₹{product.sale_price} per unit</div>
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      handleProductSelect(productId, parseInt(e.target.value), discount)
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) =>
                      handleProductSelect(productId, quantity, parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="col-span-3 text-right">
                  <div className="text-sm font-medium">
                    Total: ₹{((product.sale_price * quantity * (100 - discount)) / 100).toFixed(2)}
                  </div>
                </div>
                <div className="col-span-1 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      const newSelected = { ...selectedProducts };
                      delete newSelected[productId];
                      setSelectedProducts(newSelected);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Discount</span>
              <span className="font-medium">₹{totalDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax (18% GST)</span>
              <span className="font-medium">₹{tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-medium">₹{finalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/invoices')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading || Object.keys(selectedProducts).length === 0}>
            Create Invoice
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewInvoicePage;
