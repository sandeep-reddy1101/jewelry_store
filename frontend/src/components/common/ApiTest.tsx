import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ApiTest: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const testEndpoints = async () => {
    setLoading(true);
    const endpoints = [
      { name: 'categories', url: '/categories/' },
      { name: 'product-types', url: '/product-types/' },
      { name: 'weight-units', url: '/weight-units/' },
      { name: 'vendors', url: '/vendors/' },
    ];

    const results: Record<string, any> = {};

    for (const endpoint of endpoints) {
      try {
        console.log(`Testing ${endpoint.url}...`);
        const response = await api.get(endpoint.url);
        results[endpoint.name] = { success: true, data: response.data, count: response.data?.length || 0 };
        console.log(`✅ ${endpoint.name}:`, response.data);
      } catch (error) {
        results[endpoint.name] = { success: false, error: String(error) };
        console.error(`❌ ${endpoint.name}:`, error);
      }
    }

    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    testEndpoints();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">API Test Results</h3>
      
      {loading && <div className="text-blue-600">Testing APIs...</div>}
      
      <div className="space-y-4">
        {Object.entries(testResults).map(([name, result]) => (
          <div key={name} className="border rounded p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">{name}</span>
              <span className={`px-2 py-1 rounded text-sm ${
                result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {result.success ? '✅ Success' : '❌ Failed'}
              </span>
            </div>
            {result.success && (
              <div className="text-sm text-gray-600 mt-1">
                Count: {result.count} items
              </div>
            )}
            {!result.success && (
              <div className="text-sm text-red-600 mt-1">
                Error: {result.error}
              </div>
            )}
          </div>
        ))}
      </div>

      <button 
        onClick={testEndpoints}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Testing...' : 'Retest APIs'}
      </button>
    </div>
  );
};

export default ApiTest;
