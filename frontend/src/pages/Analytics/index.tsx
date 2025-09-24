import React from 'react';
import { AnalyticsProvider } from './context/AnalyticsContext';
import AnalyticsPage from './AnalyticsPage';

const AnalyticsPageWrapper: React.FC = () => {
  return (
    <AnalyticsProvider>
      <AnalyticsPage />
    </AnalyticsProvider>
  );
};

export default AnalyticsPageWrapper;
