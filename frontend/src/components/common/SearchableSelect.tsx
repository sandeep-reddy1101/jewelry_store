import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Option {
  value: string | number;
  label: string;
  subtitle?: string;
  icon?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string | number | '';
  onChange: (value: string | number | '') => void;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
  allowClear?: boolean;
  searchPlaceholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  error,
  disabled = false,
  allowClear = true,
  searchPlaceholder = 'Search...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (option.subtitle && option.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Find selected option
  const selectedOption = options.find(option => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
    }
  };

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef} style={{ zIndex: isOpen ? 9999 : 'auto' }}>
      {/* Main Select Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`relative w-full rounded-xl border-0 py-3 px-4 pr-3 text-left bg-white/80 backdrop-blur-sm ring-1 ring-inset transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg ${
          error
            ? 'ring-red-300 focus:ring-red-500 bg-red-50/50'
            : 'ring-gray-200 focus:ring-primary-500 hover:ring-gray-300 focus:ring-2 focus:ring-inset focus:bg-white'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            {selectedOption?.icon && (
              <span className="flex-shrink-0 text-lg">{selectedOption.icon}</span>
            )}
            <div className="min-w-0 flex-1">
              {selectedOption ? (
                <div>
                  <span className="block text-gray-900 font-medium truncate">
                    {selectedOption.label}
                  </span>
                  {selectedOption.subtitle && (
                    <span className="block text-sm text-gray-500 truncate">
                      {selectedOption.subtitle}
                    </span>
                  )}
                </div>
              ) : (
                <span className="block text-gray-500 truncate">{placeholder}</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            {selectedOption && allowClear && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
            <div className="flex items-center justify-center w-8 h-8">
              <ChevronDownIcon
                className={`h-4 w-4 text-gray-500 transition-all duration-300 ${
                  isOpen ? 'rotate-180 text-primary-600' : 'hover:text-gray-700'
                }`}
              />
            </div>
          </div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-[9999] mt-1 w-full bg-white backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden animate-slide-down">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setHighlightedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-4 py-3 flex items-center space-x-3 transition-colors duration-200 ${
                    index === highlightedIndex
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-900 hover:bg-gray-50'
                  } ${option.value === value ? 'bg-primary-100 text-primary-800 font-medium' : ''}`}
                >
                  {option.icon && (
                    <span className="flex-shrink-0 text-lg">{option.icon}</span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{option.label}</div>
                    {option.subtitle && (
                      <div className="text-sm text-gray-500 truncate">{option.subtitle}</div>
                    )}
                  </div>
                  {option.value === value && (
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 bg-primary-600 rounded-full"></div>
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                <MagnifyingGlassIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No options found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
          <XMarkIcon className="h-4 w-4" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default SearchableSelect;
