import React from 'react';
import Card from './Card';

interface StatCard {
  name: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  } | null;
}

interface StatsGridProps {
  stats: StatCard[];
  columns?: 2 | 3 | 4;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats, columns = 4 }) => {
  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <div className={`grid ${gridClass} gap-6`}>
      {stats.map((stat, index) => (
        <Card key={index} padding="md" className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 border-2 border-white/40 shadow-glass">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-12 h-12 rounded-2xl text-white shadow-lg ${stat.bgColor}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <dl className="flex-1 flex flex-col justify-center">
                  <dt className="text-sm font-semibold text-gray-600 truncate">{stat.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-bold text-gray-800 text-contrast">{stat.value}</div>
                    {stat.trend && (
                      <div className={`ml-2 flex items-baseline text-sm font-bold ${
                        stat.trend.isPositive ? 'text-success-600' : 'text-danger-600'
                      }`}>
                        {stat.trend.isPositive ? (
                          <svg className="h-4 w-4 flex-shrink-0 self-center" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4 flex-shrink-0 self-center" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                          </svg>
                        )}
                        <span className="ml-1">{stat.trend.value}%</span>
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsGrid;
