import React from 'react';
import Card from './Card';
import SearchInput from './SearchInput';
import ViewModeToggle from './ViewModeToggle';

type ViewMode = 'grid' | 'table';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFilterBarProps {
  // Search
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  
  // Filters
  filters?: {
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
    width?: string;
  }[];
  
  // View Mode
  showViewToggle?: boolean;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  
  // Layout
  className?: string;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  showViewToggle = false,
  viewMode = 'grid',
  onViewModeChange,
  className = "",
}) => {
  return (
    <Card 
      padding="lg" 
      className={`bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 border-2 border-white/40 shadow-glass ${className}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-end gap-6">
        {/* Search Section */}
        <div className="flex-1 min-w-0">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            label="Search"
          />
        </div>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          {filters.map((filter, index) => (
            <div key={index} className="min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-3">{filter.label}</label>
              <div className="relative group">
                <select
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className={`custom-select h-12 px-4 pr-10 border border-gray-300 rounded-xl focus:ring-0 focus:border-primary-400 focus:shadow-lg focus:shadow-primary-100 bg-white hover:border-gray-400 transition-all duration-200 font-medium text-gray-900 appearance-none cursor-pointer ${filter.width || "w-full sm:w-40"}`}
                >
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-focus-within:text-primary-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}

          {/* View Mode Toggle */}
          {showViewToggle && onViewModeChange && (
            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default SearchFilterBar;
