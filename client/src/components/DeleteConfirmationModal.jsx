import React from 'react';
import { X } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, articleTitle, type = "article" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-15 w-full max-w-md mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brown-400 hover:text-brown-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal content */}
        <div className="text-center">
          <h2 className="h3 text-brown-600 mb-2">
            Delete {type}
          </h2>
          <p className="b1 text-brown-400 mb-6">
            Do you want to delete this {type}?
          </p>

          {/* Action buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-6 cursor-pointer py-2 border border-gray-300 text-brown-600 rounded-full hover:bg-gray-50 transition-colors b1"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 cursor-pointer py-2 bg-brown-600 text-white rounded-full hover:bg-brown-400 transition-colors b1"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
