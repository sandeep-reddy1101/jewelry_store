import { type ProductCategory } from '../../types/models';
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import FormModal from '../../components/common/FormModal';
import CategoryForm from '../../components/forms/CategoryForm';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import StatsGrid from '../../components/common/StatsGrid';
import SearchFilterBar from '../../components/common/SearchFilterBar';
import {
  PlusIcon,
  TagIcon,
  PencilIcon,
  TrashIcon,
  SparklesIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

type ViewMode = 'grid' | 'table';
type SortOption = 'name' | 'created_at' | 'id';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('name');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    filterAndSortCategories();
  }, [categories, searchQuery, sortBy]);

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

  const filterAndSortCategories = () => {
    let filtered = [...categories];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'id':
          return b.id - a.id;
        default:
          return 0;
      }
    });

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
      'from-amber-500 to-amber-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-red-500 to-red-600',
      'from-teal-500 to-teal-600',
    ];
    return colors[index % colors.length];
  };

  const getStatsCards = () => {
    const totalCategories = categories.length;
    const activeCategories = categories.filter(c => c.name && c.description).length;

    return [
      {
        name: 'Total Categories',
        value: totalCategories,
        icon: TagIcon,
        color: 'primary',
        bgColor: 'bg-gradient-to-br from-blue-600 to-blue-700',
      },
      {
        name: 'Active Categories',
        value: activeCategories,
        icon: SparklesIcon,
        color: 'success',
        bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
      },
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

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <PageHeader
        title="Product Categories ✨"
        description={`Organize your jewelry collection efficiently. ${categories.length} categories available to classify your products.`}
        icon={TagIcon}
      />

      {/* Stats Cards */}
      <StatsGrid stats={statsCards} columns={2} />

      {/* Header Actions */}
      <Card padding="md" className="bg-gradient-to-r from-white to-gray-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-display font-semibold text-gray-900">Category Management</h1>
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 min-w-[4rem] text-center">
              {filteredCategories.length} items
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center px-4 py-2 h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-blue-600 hover:border-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2 text-white" />
              Add New Category
            </button>
            
            <Button variant="outline" icon={<ArrowDownTrayIcon className="h-4 w-4" />}>
              Export Data
            </Button>
          </div>
        </div>
      </Card>

      {/* Search and Filters */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by name, description..."
        showViewToggle={true}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={[
          {
            label: "Sort By",
            value: sortBy,
            options: [
              { value: "name", label: "Name" },
              { value: "created_at", label: "Date Created" },
              { value: "id", label: "ID" },
            ],
            onChange: (value) => setSortBy(value as SortOption),
          },
        ]}
      />

      {/* Categories Display */}
      {filteredCategories.length === 0 ? (
        <Card padding="lg" className="text-center">
          <div className="py-12">
            <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-500 mb-4">
              {categories.length === 0 
                ? "You haven't added any categories yet. Start organizing your product inventory!" 
                : "Try adjusting your search criteria."
              }
            </p>
            {categories.length === 0 && (
              <Button
                variant="gold"
                icon={<PlusIcon className="h-4 w-4" />}
                onClick={() => setIsModalOpen(true)}
              >
                Add Your First Category
              </Button>
            )}
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category, index) => (
            <Card key={category.id} hover className="relative overflow-hidden card-hover group h-full">
              <div className="p-6 h-full flex flex-col">
                {/* Category Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className={`h-12 w-12 bg-gradient-to-br ${getCategoryColor(index)} rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center flex-shrink-0`}>
                      <span className="text-2xl drop-shadow-sm">{getCategoryIcon(category.name)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg text-contrast leading-tight">{category.name}</h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 opacity-60 group-hover:opacity-100 transition-opacity duration-200 ml-3">
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50/80 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                      title="Edit category"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-600 hover:bg-red-50/80 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                      title="Delete category"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Category Description */}
                <div className="flex-1 mb-4">
                  <p className="text-sm text-gray-600 leading-relaxed overflow-hidden" style={{ 
                    display: '-webkit-box', 
                    WebkitLineClamp: 3, 
                    WebkitBoxOrient: 'vertical' as const 
                  }}>
                    {category.description || 'No description available'}
                  </p>
                </div>

                {/* Category Footer */}
                <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs">
                  <div className="flex items-center text-gray-500">
                    <SparklesIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>ID: {category.id}</span>
                  </div>
                  <div className="text-gray-400 font-medium">
                    {new Date(category.created_at || Date.now()).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category, index) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 bg-gradient-to-br ${getCategoryColor(index)} rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0`}>
                          <span className="text-lg">{getCategoryIcon(category.name)}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">{category.name}</div>
                          <div className="md:hidden text-xs text-gray-500 mt-1 truncate" title={category.description}>
                            {category.description || 'No description'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-sm" title={category.description}>
                        <p className="leading-relaxed overflow-hidden" style={{ 
                          display: '-webkit-box', 
                          WebkitLineClamp: 2, 
                          WebkitBoxOrient: 'vertical' as const 
                        }}>
                          {category.description || 'No description available'}
                        </p>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.id}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(category.created_at || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="inline-flex items-center justify-center px-3 py-1.5 border border-blue-300 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-400 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                          title="Edit category"
                        >
                          <PencilIcon className="h-4 w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="inline-flex items-center justify-center px-3 py-1.5 border border-red-300 bg-white text-red-700 hover:bg-red-50 hover:border-red-400 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                          title="Delete category"
                        >
                          <TrashIcon className="h-4 w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
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
