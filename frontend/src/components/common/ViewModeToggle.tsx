import React from 'react';
import { Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';

type ViewMode = 'grid' | 'table';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  label?: string;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewModeChange,
  label = "View Mode",
}) => {
  return (
    <div className="flex flex-col items-start min-w-0">
      <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
      <div className="flex gap-2">
        <button
          onClick={() => onViewModeChange('grid')}
          className={`flex items-center justify-center px-4 py-3 h-12 font-medium text-sm rounded-xl transition-all duration-200 ${
            viewMode === 'grid'
              ? 'bg-gray-900 text-white shadow-lg'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400'
          }`}
          title="Grid View"
        >
          <Squares2X2Icon className="h-4 w-4 mr-2" />
          Grid
        </button>
        <button
          onClick={() => onViewModeChange('table')}
          className={`flex items-center justify-center px-4 py-3 h-12 font-medium text-sm rounded-xl transition-all duration-200 ${
            viewMode === 'table'
              ? 'bg-gray-900 text-white shadow-lg'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400'
          }`}
          title="Table View"
        >
          <ListBulletIcon className="h-4 w-4 mr-2" />
          List
        </button>
      </div>
    </div>
  );
};

export default ViewModeToggle;
