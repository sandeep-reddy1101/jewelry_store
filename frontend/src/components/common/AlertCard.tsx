import React from 'react';
import Card from './Card';

type AlertType = 'info' | 'warning' | 'error' | 'success';

interface AlertCardProps {
  type: AlertType;
  title: string;
  message: string;
  icon?: React.ComponentType<{ className?: string }>;
  actionText?: string;
  onActionClick?: () => void;
}

const AlertCard: React.FC<AlertCardProps> = ({
  type,
  title,
  message,
  icon: Icon,
  actionText,
  onActionClick,
}) => {
  const alertConfig = {
    info: {
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-700',
      actionColor: 'hover:text-blue-900',
    },
    warning: {
      borderColor: 'border-yellow-500',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-800',
      messageColor: 'text-yellow-700',
      actionColor: 'hover:text-yellow-900',
    },
    error: {
      borderColor: 'border-red-500',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      titleColor: 'text-red-800',
      messageColor: 'text-red-700',
      actionColor: 'hover:text-red-900',
    },
    success: {
      borderColor: 'border-green-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      titleColor: 'text-green-800',
      messageColor: 'text-green-700',
      actionColor: 'hover:text-green-900',
    },
  };

  const config = alertConfig[type];

  return (
    <Card padding="md" className={`border-l-4 ${config.borderColor} ${config.bgColor}`}>
      <div className="flex items-center">
        {Icon && <Icon className={`h-6 w-6 ${config.iconColor}`} />}
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${config.titleColor}`}>
            {title}
          </h3>
          <p className={`text-sm ${config.messageColor} mt-1`}>
            {message}
            {actionText && onActionClick && (
              <span 
                className={`font-medium underline ${config.actionColor} ml-1 cursor-pointer`}
                onClick={onActionClick}
              >
                {actionText}
              </span>
            )}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AlertCard;
