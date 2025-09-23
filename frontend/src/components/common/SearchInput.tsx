import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  label = "Search",
  className = "",
}) => {
  return (
    <>
      <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`block w-full h-12 pl-12 pr-4 border border-gray-300 rounded-xl focus:ring-0 focus:border-primary-400 focus:shadow-lg focus:shadow-primary-100 bg-white hover:border-gray-400 transition-all duration-200 text-gray-900 placeholder-gray-400 focus:placeholder-gray-300 font-medium ${className}`}
          placeholder={placeholder}
        />
      </div>
    </>
  );
};

export default SearchInput;
