import { type Product, type ProductCategory, type ProductType, type WeightUnit, type Vendor } from '../../types/models';
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { 
  InformationCircleIcon, 
  ScaleIcon, 
  CurrencyDollarIcon, 
  ArchiveBoxIcon,
  SparklesIcon,
  TagIcon 
} from '@heroicons/react/24/outline';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Partial<Product>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [types, setTypes] = useState<ProductType[]>([]);
  const [weightUnits, setWeightUnits] = useState<WeightUnit[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Partial<Product>>(product || {
    name: '',
    description: '',
    barcode: '',
    counter_no: '',
    vendor_id: undefined,
    category_id: undefined,
    type_id: undefined,
    weight_unit_id: undefined,
    purity: 0,
    gross_weight: 0,
    net_weight: 0,
    beads_weight: 0,
    cost_per_unit: 0,
    making_charges: 0,
    wastage_charges: 0,
    beads_cost: 0,
    gst_rate: 18,
    total_cost: 0,
    sale_price: 0,
    discount_percentage: 0,
    quantity: 0,
    min_stock_level: 1,
    is_active: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesRes, typesRes, weightUnitsRes, vendorsRes] = await Promise.all([
          api.get('/categories/'),
          api.get('/product-types/'),
          api.get('/weight-units/'),
          api.get('/vendors/'),
        ]);

        setCategories(categoriesRes.data);
        setTypes(typesRes.data);
        setWeightUnits(weightUnitsRes.data);
        setVendors(vendorsRes.data);
      } catch (error) {
        console.error('Error fetching form data:', error);
        setErrors({ general: 'Failed to load form data. Please try again.' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-calculate total cost when relevant fields change
  useEffect(() => {
    const calculateTotalCost = () => {
      const costPerUnit = formData.cost_per_unit || 0;
      const netWeight = formData.net_weight || 0;
      const makingCharges = formData.making_charges || 0;
      const wastageCharges = formData.wastage_charges || 0;
      const beadsCost = formData.beads_cost || 0;
      
      const baseCost = costPerUnit * netWeight;
      const totalCost = baseCost + makingCharges + wastageCharges + beadsCost;
      
      setFormData(prev => ({
        ...prev,
        total_cost: totalCost
      }));
    };

    calculateTotalCost();
  }, [formData.cost_per_unit, formData.net_weight, formData.making_charges, formData.wastage_charges, formData.beads_cost]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = 'Product name is required';
    if (!formData.barcode?.trim()) newErrors.barcode = 'Barcode is required';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.type_id) newErrors.type_id = 'Type is required';
    if (!formData.vendor_id) newErrors.vendor_id = 'Vendor is required';
    if (!formData.weight_unit_id) newErrors.weight_unit_id = 'Weight unit is required';
    if (!formData.net_weight || formData.net_weight <= 0) newErrors.net_weight = 'Net weight must be greater than 0';
    if (!formData.cost_per_unit || formData.cost_per_unit <= 0) newErrors.cost_per_unit = 'Cost per unit must be greater than 0';
    if (!formData.sale_price || formData.sale_price <= 0) newErrors.sale_price = 'Sale price must be greater than 0';
    if (formData.quantity === undefined || formData.quantity < 0) newErrors.quantity = 'Quantity cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
        <span className="ml-3 text-gray-600">Loading form data...</span>
      </div>
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {errors.general}
          </div>
        )}

        {/* Basic Information Section */}
        <Card padding="lg" className="border-l-4 border-l-jewelry-gold">
          <div className="flex items-center mb-6">
            <InformationCircleIcon className="h-6 w-6 text-jewelry-gold mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Product Name *"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                error={errors.name}
                placeholder="Enter product name"
                className="font-medium"
              />
            </div>

            <Input
              label="Barcode *"
              name="barcode"
              value={formData.barcode || ''}
              onChange={handleChange}
              error={errors.barcode}
              placeholder="Enter or scan barcode"
            />

            <Input
              label="Counter Number"
              name="counter_no"
              value={formData.counter_no || ''}
              onChange={handleChange}
              placeholder="Counter display number"
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-jewelry-gold focus:border-jewelry-gold"
                rows={3}
                placeholder="Product description..."
              />
            </div>
          </div>
        </Card>

        {/* Classification Section */}
        <Card padding="lg" className="border-l-4 border-l-blue-500">
          <div className="flex items-center mb-6">
            <TagIcon className="h-6 w-6 text-blue-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Classification</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category_id"
                value={formData.category_id || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-jewelry-gold focus:border-jewelry-gold ${
                  errors.category_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                name="type_id"
                value={formData.type_id || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-jewelry-gold focus:border-jewelry-gold ${
                  errors.type_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Type</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.type_id && <p className="mt-1 text-sm text-red-600">{errors.type_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor *
              </label>
              <select
                name="vendor_id"
                value={formData.vendor_id || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-jewelry-gold focus:border-jewelry-gold ${
                  errors.vendor_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
              {errors.vendor_id && <p className="mt-1 text-sm text-red-600">{errors.vendor_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight Unit *
              </label>
              <select
                name="weight_unit_id"
                value={formData.weight_unit_id || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-jewelry-gold focus:border-jewelry-gold ${
                  errors.weight_unit_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Unit</option>
                {weightUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
              {errors.weight_unit_id && <p className="mt-1 text-sm text-red-600">{errors.weight_unit_id}</p>}
            </div>
          </div>
        </Card>

        {/* Specifications Section */}
        <Card padding="lg" className="border-l-4 border-l-purple-500">
          <div className="flex items-center mb-6">
            <ScaleIcon className="h-6 w-6 text-purple-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input
              label="Purity (Karat/%) *"
              name="purity"
              type="number"
              step="0.01"
              min="0"
              value={formData.purity || ''}
              onChange={handleChange}
              error={errors.purity}
              placeholder="e.g., 22 for 22K gold"
            />

            <Input
              label="Gross Weight *"
              name="gross_weight"
              type="number"
              step="0.001"
              min="0"
              value={formData.gross_weight || ''}
              onChange={handleChange}
              error={errors.gross_weight}
              placeholder="Total weight"
            />

            <Input
              label="Net Weight *"
              name="net_weight"
              type="number"
              step="0.001"
              min="0"
              value={formData.net_weight || ''}
              onChange={handleChange}
              error={errors.net_weight}
              placeholder="Pure metal weight"
            />

            <Input
              label="Beads Weight"
              name="beads_weight"
              type="number"
              step="0.001"
              min="0"
              value={formData.beads_weight || ''}
              onChange={handleChange}
              error={errors.beads_weight}
              placeholder="Weight of beads/stones"
            />
          </div>
        </Card>

        {/* Pricing Section */}
        <Card padding="lg" className="border-l-4 border-l-green-500">
          <div className="flex items-center mb-6">
            <CurrencyDollarIcon className="h-6 w-6 text-green-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input
              label="Cost per Unit (₹) *"
              name="cost_per_unit"
              type="number"
              step="0.01"
              min="0"
              value={formData.cost_per_unit || ''}
              onChange={handleChange}
              error={errors.cost_per_unit}
              placeholder="Rate per gram/unit"
            />

            <Input
              label="Making Charges (₹)"
              name="making_charges"
              type="number"
              step="0.01"
              min="0"
              value={formData.making_charges || ''}
              onChange={handleChange}
              error={errors.making_charges}
              placeholder="Labor charges"
            />

            <Input
              label="Wastage Charges (₹)"
              name="wastage_charges"
              type="number"
              step="0.01"
              min="0"
              value={formData.wastage_charges || ''}
              onChange={handleChange}
              error={errors.wastage_charges}
              placeholder="Wastage cost"
            />

            <Input
              label="Beads Cost (₹)"
              name="beads_cost"
              type="number"
              step="0.01"
              min="0"
              value={formData.beads_cost || ''}
              onChange={handleChange}
              error={errors.beads_cost}
              placeholder="Cost of beads/stones"
            />

            <Input
              label="GST Rate (%)"
              name="gst_rate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.gst_rate || ''}
              onChange={handleChange}
              error={errors.gst_rate}
              placeholder="GST percentage"
            />

            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Cost (Auto-calculated)
              </label>
              <div className="text-xl font-bold text-gray-900">
                ₹{(formData.total_cost || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Base + Making + Wastage + Beads
              </div>
            </div>

            <Input
              label="Sale Price (₹) *"
              name="sale_price"
              type="number"
              step="0.01"
              min="0"
              value={formData.sale_price || ''}
              onChange={handleChange}
              error={errors.sale_price}
              placeholder="Selling price"
              className="font-semibold"
            />

            <Input
              label="Discount (%)"
              name="discount_percentage"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.discount_percentage || ''}
              onChange={handleChange}
              error={errors.discount_percentage}
              placeholder="Discount percentage"
            />
          </div>
        </Card>

        {/* Inventory Section */}
        <Card padding="lg" className="border-l-4 border-l-orange-500">
          <div className="flex items-center mb-6">
            <ArchiveBoxIcon className="h-6 w-6 text-orange-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Inventory</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Quantity *"
              name="quantity"
              type="number"
              min="0"
              value={formData.quantity || ''}
              onChange={handleChange}
              error={errors.quantity}
              placeholder="Available quantity"
            />

            <Input
              label="Minimum Stock Level"
              name="min_stock_level"
              type="number"
              min="0"
              value={formData.min_stock_level || ''}
              onChange={handleChange}
              error={errors.min_stock_level}
              placeholder="Reorder level"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="is_active"
                    value="true"
                    checked={formData.is_active === true}
                    onChange={() => setFormData(prev => ({ ...prev, is_active: true }))}
                    className="h-4 w-4 text-jewelry-gold focus:ring-jewelry-gold border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="is_active"
                    value="false"
                    checked={formData.is_active === false}
                    onChange={() => setFormData(prev => ({ ...prev, is_active: false }))}
                    className="h-4 w-4 text-jewelry-gold focus:ring-jewelry-gold border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Inactive</span>
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="gold" className="min-w-[120px]">
            <SparklesIcon className="h-4 w-4 mr-2" />
            {product ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
