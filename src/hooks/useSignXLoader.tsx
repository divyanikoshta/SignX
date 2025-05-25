import React from 'react';

interface UseSignXLoaderReturn {
  Loader: React.FC;
}

// Simple Top Loader Component
const SignXLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="w-12 h-12 border-4 border-gray-200 border-t-blue-900 rounded-full animate-spin"
        style={{
          borderWidth: '4px',
          borderColor: '#e5e7eb',
          borderTopColor: '#1e3a8a'
        }}
      />
    </div>
  );
};

// Custom Hook
export const useSignXLoader = (isLoading: boolean = false): UseSignXLoaderReturn => {
  const Loader: React.FC = () => {
    if (!isLoading) return null;
    return <SignXLoader />;
  };

  return { Loader };
};