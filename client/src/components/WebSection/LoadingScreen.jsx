import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        
        {/* Loading Text */}
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">กำลังโหลด...</p>
          <p className="text-sm text-gray-500">กรุณารอสักครู่</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
