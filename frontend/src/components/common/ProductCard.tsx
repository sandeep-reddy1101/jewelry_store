import React from 'react';
import { type Product } from '../../types/models';
import Card from '../common/Card';
import Button from '../common/Button';
import { PencilIcon, TrashIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onView?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete, onView }) => {
  const getMetalTypeColor = (type: string) => {
    const typeColors: { [key: string]: string } = {
      'Gold': 'text-jewelry-gold-dark bg-jewelry-gold-light',
      'Silver': 'text-jewelry-silver-dark bg-jewelry-silver-light',
      'Diamond': 'text-jewelry-diamond-dark bg-jewelry-diamond',
      'Platinum': 'text-gray-700 bg-jewelry-platinum',
    };
    return typeColors[type] || 'text-gray-600 bg-gray-100';
  };

  const getStockStatus = () => {
    if (product.quantity === 0) {
      return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    } else if (product.quantity <= product.min_stock_level) {
      return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <Card hover className="group">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{product.barcode}</p>
          </div>
          <SparklesIcon className="h-6 w-6 text-jewelry-gold group-hover:text-jewelry-gold-dark transition-colors" />
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</span>
            <p className="text-sm font-medium text-gray-900 mt-1">{product.category?.name || 'N/A'}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</span>
            <div className="mt-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMetalTypeColor(product.type?.name || '')}`}>
                {product.type?.name || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Weight:</span>
            <span className="text-sm font-medium text-gray-900">
              {product.net_weight} {product.weight_unit?.symbol}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Purity:</span>
            <span className="text-sm font-medium text-gray-900">{product.purity}K</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Counter:</span>
            <span className="text-sm font-medium text-gray-900">{product.counter_no}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-gradient-to-r from-primary-50 to-jewelry-gold-light rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Sale Price:</span>
            <span className="text-xl font-bold text-gray-900">₹{product.sale_price.toLocaleString()}</span>
          </div>
          {product.discount_percentage > 0 && (
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">Discount:</span>
              <span className="text-sm font-medium text-green-600">{product.discount_percentage}% OFF</span>
            </div>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between">
          <div>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
              {stockStatus.text}
            </span>
          </div>
          <span className="text-sm text-gray-500">Qty: {product.quantity}</span>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2 border-t border-gray-100">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onView(product)}
            >
              View Details
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            icon={<PencilIcon className="h-4 w-4" />}
            onClick={() => onEdit(product)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<TrashIcon className="h-4 w-4" />}
            onClick={() => onDelete(product.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
