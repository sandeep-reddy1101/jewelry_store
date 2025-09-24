import React from 'react';
import Card from '../../../components/common/Card';

const CustomerAnalytics: React.FC = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h3>
      <div className="text-center py-8">
        <p className="text-gray-500">Customer analytics loading...</p>
      </div>
    </Card>
  );
};

export default CustomerAnalytics;
