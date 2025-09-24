import { type Product, type User } from '../../types/models';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import SearchableSelect from '../../components/common/SearchableSelect';
import {
  PlusIcon,
  XMarkIcon,
  UserIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  CurrencyRupeeIcon,
  DocumentTextIcon,
  SparklesIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { STORE_CONFIG } from '../../config/store';

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
  const [initialLoading, setInitialLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<{
    [key: string]: {
      product: Product;
      quantity: number;
      discount: number;
    };
  }>({});
  const [selectedCustomer, setSelectedCustomer] = useState<number | ''>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setInitialLoading(true);
      const [productsRes, usersRes] = await Promise.all([
        api.get('/products'),
        api.get('/users'),
      ]);
      setProducts(productsRes.data);
      setUsers(usersRes.data);
      setErrors({});
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setErrors({ general: 'Failed to load initial data. Please try again.' });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleProductSelect = (productId: string, quantity: number = 1, discount: number = 0) => {
    const product = products.find((p) => p.id === parseInt(productId));
    if (product) {
      setSelectedProducts((prev) => ({
        ...prev,
        [productId]: {
          product,
          quantity: Math.max(1, quantity),
          discount: Math.max(0, Math.min(100, discount)),
        },
      }));
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) => {
      const newSelected = { ...prev };
      delete newSelected[productId];
      return newSelected;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedCustomer) {
      newErrors.customer = 'Please select a customer';
    }
    
    if (!paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }
    
    if (Object.keys(selectedProducts).length === 0) {
      newErrors.products = 'Please add at least one product';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { subtotal, totalDiscount, tax, finalAmount } = calculateTotals();

      const invoiceData: InvoiceFormData = {
        user_id: selectedCustomer as number,
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
      setErrors({ general: 'Failed to create invoice. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, totalDiscount, tax, finalAmount } = calculateTotals();

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-400/20">
            <DocumentTextIcon className="h-8 w-8 text-white stroke-2" style={{ color: '#ffffff' }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Invoice</h1>
            <p className="text-gray-600 mt-1">Generate a new invoice for customer purchase</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/invoices')}
          icon={<XMarkIcon className="h-4 w-4" />}
        >
          Cancel
        </Button>
      </div>

      {/* Error Display */}
      {errors.general && (
        <Card className="border-red-200 bg-red-50/50">
          <div className="flex items-center space-x-2 text-red-700">
            <XMarkIcon className="h-5 w-5" />
            <span className="font-medium">{errors.general}</span>
          </div>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 relative">
        {/* Customer Information Card */}
        <Card shadow="elegant" allowOverflow={true} className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm border border-blue-400/20">
              <UserIcon className="h-5 w-5 text-white stroke-2" style={{ color: '#ffffff' }} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Customer Information</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4 text-gray-600" />
                  <span>Customer</span>
                </div>
              </label>
              <SearchableSelect
                options={users.map(user => ({
                  value: user.id,
                  label: user.name,
                  subtitle: user.email ? `📧 ${user.email}` : undefined,
                  icon: '👤'
                }))}
                value={selectedCustomer}
                onChange={(value) => setSelectedCustomer(value as number | '')}
                placeholder="Select Customer"
                searchPlaceholder="Search customers..."
                error={errors.customer}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                <div className="flex items-center space-x-2">
                  <CreditCardIcon className="h-4 w-4 text-gray-600" />
                  <span>Payment Method</span>
                </div>
              </label>
              <SearchableSelect
                options={[
                  { value: 'cash', label: 'Cash', icon: '💵', subtitle: 'Physical cash payment' },
                  { value: 'card', label: 'Card', icon: '💳', subtitle: 'Credit/Debit card payment' },
                  { value: 'upi', label: 'UPI', icon: '�', subtitle: 'Digital UPI payment' },
                  { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦', subtitle: 'Direct bank transfer' }
                ]}
                value={paymentMethod}
                onChange={(value) => setPaymentMethod(value as string)}
                placeholder="Select Payment Method"
                searchPlaceholder="Search payment methods..."
                error={errors.paymentMethod}
              />
            </div>
          </div>
        </Card>

        {/* Product Selection & Items Card */}
        <Card shadow="elegant" allowOverflow={true} className="relative z-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg shadow-sm border border-amber-300/20">
                <ShoppingBagIcon className="h-5 w-5 text-gray-900 stroke-2" style={{ color: '#1f2937' }} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Invoice Items</h2>
            </div>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {Object.keys(selectedProducts).length} items selected
            </span>
          </div>

          {/* Product Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              <div className="flex items-center space-x-2">
                <SparklesIcon className="h-4 w-4 text-gray-600" />
                <span>Add Product</span>
              </div>
            </label>
            <SearchableSelect
              options={products
                .filter(product => !selectedProducts[product.id])
                .map(product => ({
                  value: product.id,
                  label: product.name,
                  subtitle: `${STORE_CONFIG.currency}${product.sale_price} ${product.category ? `• ${product.category.name}` : ''}`,
                  icon: '💎'
                }))}
              value=""
              onChange={(value) => {
                if (value) {
                  handleProductSelect(value.toString());
                }
              }}
              placeholder="Select Product to Add"
              searchPlaceholder="Search products..."
              error={errors.products}
              allowClear={false}
            />
          </div>

          {/* Selected Products List */}
          <div className="space-y-4">
            {Object.entries(selectedProducts).map(([productId, { product, quantity, discount }]) => {
              const itemTotal = product.sale_price * quantity;
              const itemDiscount = (itemTotal * discount) / 100;
              const finalItemTotal = itemTotal - itemDiscount;

              return (
                <Card key={productId} className="border border-gray-200 bg-gradient-to-r from-gray-50/80 to-white/80">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Product Info */}
                    <div className="lg:col-span-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-jewelry-diamond rounded-lg">
                          <SparklesIcon className="h-4 w-4 text-jewelry-diamond-dark" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-600">
                            {STORE_CONFIG.currency}{product.sale_price} per unit
                          </p>
                          {product.category && (
                            <span className="inline-block px-2 py-0.5 text-xs bg-jewelry-gold/20 text-jewelry-gold-dark rounded-full mt-1">
                              {product.category.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Input */}
                    <div className="lg:col-span-2">
                      <Input
                        label="Qty"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                          handleProductSelect(productId, parseInt(e.target.value) || 1, discount)
                        }
                        className="text-center"
                      />
                    </div>

                    {/* Discount Input */}
                    <div className="lg:col-span-2">
                      <Input
                        label="Discount %"
                        type="number"
                        min="0"
                        max="100"
                        value={discount}
                        onChange={(e) =>
                          handleProductSelect(productId, quantity, parseInt(e.target.value) || 0)
                        }
                        className="text-center"
                      />
                    </div>

                    {/* Item Total */}
                    <div className="lg:col-span-3 text-right">
                      <div className="space-y-1">
                        {discount > 0 && (
                          <div className="text-sm text-gray-500 line-through">
                            {STORE_CONFIG.currency}{itemTotal.toFixed(2)}
                          </div>
                        )}
                        <div className="text-lg font-semibold text-gray-900">
                          {STORE_CONFIG.currency}{finalItemTotal.toFixed(2)}
                        </div>
                        {discount > 0 && (
                          <div className="text-xs text-green-600">
                            Saved {STORE_CONFIG.currency}{itemDiscount.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <div className="lg:col-span-1 flex justify-end">
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveProduct(productId)}
                        icon={<TrashIcon className="h-4 w-4" />}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {Object.keys(selectedProducts).length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
              <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No items added yet</p>
              <p className="text-gray-400 text-sm">Select products from the dropdown above to add them to the invoice</p>
            </div>
          )}
        </Card>

        {/* Invoice Summary */}
        {Object.keys(selectedProducts).length > 0 && (
          <Card shadow="elegant" className="border-2 border-jewelry-gold/20 bg-gradient-to-br from-jewelry-gold-light/30 to-white/90">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-sm border border-green-400/20">
                <CurrencyRupeeIcon className="h-5 w-5 text-white stroke-2" style={{ color: '#ffffff' }} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Invoice Summary</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">{STORE_CONFIG.currency}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Total Discount</span>
                  <span className="font-medium text-green-600">-{STORE_CONFIG.currency}{totalDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tax (18% GST)</span>
                  <span className="font-medium text-gray-900">{STORE_CONFIG.currency}{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-gray-900">Final Amount</span>
                    <span className="text-2xl font-bold text-jewelry-gold-dark">
                      {STORE_CONFIG.currency}{finalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 rounded-xl p-6 border border-white/20">
                <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Items</span>
                    <span className="font-medium">{Object.keys(selectedProducts).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Quantity</span>
                    <span className="font-medium">
                      {Object.values(selectedProducts).reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Discount</span>
                    <span className="font-medium">
                      {Object.keys(selectedProducts).length > 0 
                        ? (Object.values(selectedProducts).reduce((sum, item) => sum + item.discount, 0) / Object.keys(selectedProducts).length).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <Card className="bg-gradient-to-r from-gray-50/80 to-white/80">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <DocumentTextIcon className="h-4 w-4" />
              <span>Invoice will be saved as pending status</span>
            </div>
            
            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/invoices')}
                icon={<XMarkIcon className="h-4 w-4" />}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gold"
                loading={loading}
                disabled={Object.keys(selectedProducts).length === 0 || !selectedCustomer || !paymentMethod}
                icon={<PlusIcon className="h-4 w-4" />}
              >
                Create Invoice
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default NewInvoicePage;
