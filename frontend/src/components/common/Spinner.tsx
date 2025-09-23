import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const innerSizes = {
    sm: 'h-2 w-2',
    md: 'h-4 w-4',
    lg: 'h-8 w-8',
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`relative ${sizes[size]}`}>
        {/* Outer ring with gradient */}
        <div className={`absolute inset-0 ${sizes[size]} rounded-full border-2 border-transparent bg-gradient-to-r from-primary-500 via-jewelry-gold to-primary-600 animate-spin`}></div>
        <div className={`absolute inset-1 ${innerSizes[size]} bg-white rounded-full`}></div>
        
        {/* Inner rotating element */}
        <svg
          className={`${sizes[size]} text-primary-600 animate-pulse-soft relative z-10`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-80"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
    </div>
  );
};

export default Spinner;
