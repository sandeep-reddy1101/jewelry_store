import { type ProductCategory } from '../../types/models';
import React, { useState } from 'react';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import { 
  TagIcon,
  CheckCircleIcon,
  SparklesIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface CategoryFormProps {
  category?: ProductCategory;
  onSubmit: (data: Partial<ProductCategory>) => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, onCancel }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Partial<ProductCategory>>(category || {
    name: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = 'Category name is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <TagIcon className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <p className="text-gray-600">
          {category ? 'Update category information' : 'Create a new product category'}
        </p>
      </div>

      {/* Category Information */}
      <div className="space-y-6">
        <div className="border-l-4 border-purple-500 pl-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Category Details</h3>
          <p className="text-sm text-gray-600">Define your jewelry category</p>
        </div>

        <div className="space-y-6">
          <Input
            label="Category Name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            error={errors.name}
            placeholder="e.g., Necklaces, Rings, Bracelets"
            icon={<TagIcon />}
            helpText="Choose a clear, descriptive name for this category"
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            error={errors.description}
            placeholder="Describe what products belong in this category..."
            rows={4}
            helpText="Provide a detailed description to help identify products that belong in this category"
          />
        </div>
      </div>

      {/* Helpful Examples */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <LightBulbIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Category Examples</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-start">
                  <SparklesIcon className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-800">Necklaces</div>
                    <div className="text-gray-600">Chains, chokers, pendants, statement pieces</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <SparklesIcon className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-800">Rings</div>
                    <div className="text-gray-600">Wedding bands, engagement rings, fashion rings</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start">
                  <SparklesIcon className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-800">Earrings</div>
                    <div className="text-gray-600">Studs, hoops, chandeliers, drop earrings</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <SparklesIcon className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-800">Bracelets</div>
                    <div className="text-gray-600">Bangles, cuffs, tennis bracelets, charm bracelets</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          className="w-full sm:w-auto sm:min-w-[140px]"
        >
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          {category ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
