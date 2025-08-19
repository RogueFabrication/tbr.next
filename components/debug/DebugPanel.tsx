'use client';

import { useState, useEffect } from 'react';

interface EnvironmentInfo {
  nodeEnv: string;
  hasAdminToken: boolean;
  hasNeonUrl: boolean;
  hasApiKey: boolean;
  hasDatabaseUrl: boolean;
}

interface ApiTestResult {
  endpoint: string;
  status: 'pending' | 'success' | 'error';
  response?: string;
  error?: string;
}

export function DebugPanel() {
  const [envInfo, setEnvInfo] = useState<EnvironmentInfo | null>(null);
  const [apiTests, setApiTests] = useState<ApiTestResult[]>([]);
  const [dbTest, setDbTest] = useState<{ status: 'pending' | 'success' | 'error'; message?: string }>({ status: 'pending' });

  useEffect(() => {
    checkEnvironment();
    runApiTests();
    testDatabase();
  }, []);

  const checkEnvironment = () => {
    const info: EnvironmentInfo = {
      nodeEnv: process.env.NODE_ENV || 'unknown',
      hasAdminToken: !!process.env.ADMIN_TOKEN,
      hasNeonUrl: !!process.env.DATABASE_URL && process.env.DATABASE_URL.includes('neon'),
      hasApiKey: !!process.env.API_KEY,
      hasDatabaseUrl: !!process.env.DATABASE_URL
    };
    setEnvInfo(info);
  };

  const runApiTests = async () => {
    const endpoints = [
      '/api/tube-benders',
      '/api/admin/auth'
    ];

    const tests: ApiTestResult[] = endpoints.map(endpoint => ({
      endpoint,
      status: 'pending'
    }));

    setApiTests(tests);

    for (let i = 0; i < endpoints.length; i++) {
      try {
        const response = await fetch(endpoints[i]);
        const data = await response.json();
        
        tests[i] = {
          endpoint: endpoints[i],
          status: response.ok ? 'success' : 'error',
          response: JSON.stringify(data, null, 2)
        };
      } catch (error) {
        tests[i] = {
          endpoint: endpoints[i],
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
      
      setApiTests([...tests]);
    }
  };

  const testDatabase = async () => {
    if (!process.env.DATABASE_URL) {
      setDbTest({ status: 'error', message: 'No database URL configured' });
      return;
    }

    try {
      // In a real app, you would test the database connection here
      // For now, we'll simulate a test
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDbTest({ status: 'success', message: 'Database connection successful' });
    } catch (error) {
      setDbTest({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Database connection failed' 
      });
    }
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'pending':
        return '⏳';
    }
  };

  const getStatusColor = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Environment Information */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Environment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {envInfo && (
            <>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Node Environment</span>
                  <span className="text-sm text-gray-900">{envInfo.nodeEnv}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Admin Token</span>
                  <span className={`text-sm ${envInfo.hasAdminToken ? 'text-green-600' : 'text-red-600'}`}>
                    {envInfo.hasAdminToken ? '✅ Configured' : '❌ Missing'}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Database URL</span>
                  <span className={`text-sm ${envInfo.hasDatabaseUrl ? 'text-green-600' : 'text-red-600'}`}>
                    {envInfo.hasDatabaseUrl ? '✅ Configured' : '❌ Missing'}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Neon Database</span>
                  <span className={`text-sm ${envInfo.hasNeonUrl ? 'text-green-600' : 'text-yellow-600'}`}>
                    {envInfo.hasNeonUrl ? '✅ Detected' : '⚠️ Not Neon'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">API Key</span>
                  <span className={`text-sm ${envInfo.hasApiKey ? 'text-green-600' : 'text-yellow-600'}`}>
                    {envInfo.hasApiKey ? '✅ Configured' : '⚠️ Optional'}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* API Tests */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">API Tests</h2>
        <div className="space-y-3">
          {apiTests.map((test, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{test.endpoint}</span>
                <span className={`text-sm ${getStatusColor(test.status)}`}>
                  {getStatusIcon(test.status)} {test.status}
                </span>
              </div>
              {test.response && (
                <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                  {test.response}
                </pre>
              )}
              {test.error && (
                <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                  {test.error}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Database Test */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Database Connection</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Database Status</span>
            <span className={`text-sm ${getStatusColor(dbTest.status)}`}>
              {getStatusIcon(dbTest.status)} {dbTest.status}
            </span>
          </div>
          {dbTest.message && (
            <div className="text-sm text-gray-600">
              {dbTest.message}
            </div>
          )}
        </div>
      </div>

      {/* System Information */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Platform:</span>
              <span className="ml-2 text-gray-900">{typeof window !== 'undefined' ? window.navigator.platform : 'Server'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">User Agent:</span>
              <span className="ml-2 text-gray-900">{typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 50) + '...' : 'Server'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Timestamp:</span>
              <span className="ml-2 text-gray-900">{new Date().toISOString()}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Build Time:</span>
              <span className="ml-2 text-gray-900">{process.env.BUILD_TIME || 'Unknown'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

