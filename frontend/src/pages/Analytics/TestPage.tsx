import React from 'react';
import { AnalyticsProvider } from './context/AnalyticsContext';

const SimpleTestPage: React.FC = () => {
  return (
    <AnalyticsProvider>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Analytics Test</h1>
        <p>If you can see this, the AnalyticsProvider is working!</p>
      </div>
    </AnalyticsProvider>
  );
};

export default SimpleTestPage;
