import { type ProductCategory } from '../../types/models';
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import FormModal from '../../components/common/FormModal';
import CategoryForm from '../../components/forms/CategoryForm';
import Spinner from '../../components/common/Spinner';
import {
  PlusIcon,
  TagIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [categories, searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    let filtered = [...categories];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCategories(filtered);
  };

  const handleSubmit = async (data: Partial<ProductCategory>) => {
    try {
      if (selectedCategory) {
        await api.put(`/categories/${selectedCategory.id}`, data);
      } else {
        await api.post('/categories/', data);
      }
      fetchCategories();
      setIsModalOpen(false);
      setSelectedCategory(undefined);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleEdit = (category: ProductCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('ring')) return '💍';
    if (name.includes('necklace')) return '📿';
    if (name.includes('bracelet') || name.includes('bangle')) return '⚡';
    if (name.includes('earring')) return '👂';
    if (name.includes('pendant') || name.includes('locket')) return '🏺';
    if (name.includes('anklet')) return '🦶';
    if (name.includes('nose')) return '👃';
    return '💎';
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      'from-purple-500 to-purple-600',
      'from-blue-500 to-blue-600', 
      'from-green-500 to-green-600',
      'from-yellow-500 to-yellow-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-red-500 to-red-600',
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <Card padding="md" shadow="elegant" className="text-center">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600">Total Categories</h3>
          <p className="text-2xl font-bold text-purple-600">{categories.length}</p>
        </div>
      </Card>

      {/* Header Actions */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-display font-semibold text-gray-900">Product Categories</h1>
            <span className="text-sm text-gray-500">({filteredCategories.length} categories)</span>
          </div>

          <Button
            variant="primary"
            icon={<PlusIcon className="h-4 w-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Category
          </Button>
        </div>
      </Card>

      {/* Search */}
      <Card padding="md">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <Card padding="lg" className="text-center">
          <div className="py-12">
            <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try adjusting your search criteria.' : 'Start by adding your first category.'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category, index) => (
            <Card key={category.id} padding="lg" shadow="elegant" className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Category Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`h-12 w-12 bg-gradient-to-br ${getCategoryColor(index)} rounded-lg flex items-center justify-center`}>
                      <span className="text-2xl">{getCategoryIcon(category.name)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{category.name}</h3>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                      title="Edit category"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete category"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Category Description */}
                <div className="text-sm text-gray-600 line-clamp-3">
                  {category.description}
                </div>

                {/* Category Stats (placeholder for future use) */}
                <div className="pt-2 border-t border-gray-200 flex items-center text-xs text-gray-500">
                  <SparklesIcon className="h-3 w-3 mr-1" />
                  Category ID: {category.id}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Category Form Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(undefined);
        }}
        title={selectedCategory ? 'Edit Category' : 'Add New Category'}
        size="lg"
      >
        <CategoryForm
          category={selectedCategory}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedCategory(undefined);
          }}
        />
      </FormModal>
    </div>
  );
};

export default CategoriesPage;
