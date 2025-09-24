import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'elegant';
  hover?: boolean;
  bordered?: boolean;
  allowOverflow?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  hover = false,
  bordered = true,
  allowOverflow = false,
}) => {
  const baseClasses = `bg-white/90 backdrop-blur-sm rounded-2xl transition-all duration-300 relative ${allowOverflow ? 'overflow-visible' : 'overflow-hidden'}`;
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-modern',
    lg: 'shadow-elegant',
    elegant: 'shadow-glass',
  };

  const hoverClasses = hover ? 'hover:shadow-elegant hover:scale-[1.02] hover:bg-white/95 cursor-pointer hover:-translate-y-1' : '';
  const borderClasses = bordered ? 'border border-white/20' : '';

  return (
    <div
      className={`${baseClasses} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${hoverClasses} ${borderClasses} ${className}`}
    >
      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card;
