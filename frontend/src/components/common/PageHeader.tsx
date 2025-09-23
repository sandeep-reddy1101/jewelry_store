import React from 'react';
import Card from './Card';

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  children,
}) => {
  return (
    <Card padding="lg" className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 border-2 border-white/40 shadow-glass">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2 text-gray-800 text-contrast">{title}</h1>
          <p className="text-gray-700 text-lg font-medium">
            {description}
          </p>
        </div>
        {Icon && (
          <div className="hidden lg:block">
            <Icon className="h-16 w-16 text-primary-500 animate-float" />
          </div>
        )}
        {children}
      </div>
    </Card>
  );
};

export default PageHeader;
