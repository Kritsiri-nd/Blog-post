import React from 'react';
import { XCircle } from 'lucide-react';

const ErrorModal = ({ isOpen, onClose, title, message, buttonText }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          {message && (
            <p className="text-gray-600">
              {message}
            </p>
          )}
        </div>

        {/* OK Button */}
        <button
          onClick={onClose}
          className="w-full bg-brown-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-brown-500 transition-colors"
        >
          {buttonText || 'OK'}
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
