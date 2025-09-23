import React from 'react';
import { type Product } from '../../types/models';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Partial<Product>) => void;
  onCancel: () => void;
}

const SimpleProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ 
      name: 'Test Product', 
      barcode: '12345',
      quantity: 1,
      sale_price: 1000 
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {product ? 'Edit Product' : 'Add New Product'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter product name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price *
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter price"
            required
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {product ? 'Update' : 'Add'} Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default SimpleProductForm;
