import { type Product, type ProductCategory, type ProductType, type WeightUnit, type Vendor } from '../../types/models';
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

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
  const [formData, setFormData] = useState<Partial<Product>>(product || {
    name: '',
    description: '',
    barcode: '',
    counter_no: '',
    purity: 0,
    gross_weight: 0,
    net_weight: 0,
    beads_weight: 0,
    cost_per_unit: 0,
    making_charges: 0,
    wastage_charges: 0,
    beads_cost: 0,
    gst_rate: 0,
    sale_price: 0,
    discount_percentage: 0,
    quantity: 0,
    min_stock_level: 1,
    is_active: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, typesRes, weightUnitsRes, vendorsRes] = await Promise.all([
          api.get('/product-categories'),
          api.get('/product-types'),
          api.get('/weight-units'),
          api.get('/vendors'),
        ]);

        setCategories(categoriesRes.data);
        setTypes(typesRes.data);
        setWeightUnits(weightUnitsRes.data);
        setVendors(vendorsRes.data);
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Input
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <Input
          label="Barcode"
          name="barcode"
          value={formData.barcode}
          onChange={handleChange}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            name="type_id"
            value={formData.type_id}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          >
            <option value="">Select Type</option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Purity"
          name="purity"
          type="number"
          step="0.01"
          value={formData.purity}
          onChange={handleChange}
          required
        />

        <Input
          label="Net Weight"
          name="net_weight"
          type="number"
          step="0.01"
          value={formData.net_weight}
          onChange={handleChange}
          required
        />

        <Input
          label="Cost per Unit"
          name="cost_per_unit"
          type="number"
          step="0.01"
          value={formData.cost_per_unit}
          onChange={handleChange}
          required
        />

        <Input
          label="Sale Price"
          name="sale_price"
          type="number"
          step="0.01"
          value={formData.sale_price}
          onChange={handleChange}
          required
        />

        <Input
          label="Quantity"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
