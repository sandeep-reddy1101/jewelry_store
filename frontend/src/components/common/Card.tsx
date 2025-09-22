import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'elegant';
  hover?: boolean;
  bordered?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  hover = false,
  bordered = true,
}) => {
  const baseClasses = 'bg-white rounded-xl transition-all duration-200';
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-soft',
    lg: 'shadow-lg',
    elegant: 'shadow-elegant',
  };

  const hoverClasses = hover ? 'hover:shadow-elegant hover:scale-102 cursor-pointer' : '';
  const borderClasses = bordered ? 'border border-gray-100' : '';

  return (
    <div
      className={`${baseClasses} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${hoverClasses} ${borderClasses} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
