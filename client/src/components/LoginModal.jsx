import * as React from "react";

function LoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleCreateAccount = () => {
    // In a real app, this would redirect to signup page
    alert("Create Account functionality would be implemented here");
  };

  const handleLogin = () => {
    // In a real app, this would redirect to login page
    alert("Login functionality would be implemented here");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>

        {/* Modal Content */}
        <div className="text-center">
          <h2 className="h2 mb-8 text-brown-600">
            Create an account to continue
          </h2>

          {/* Create Account Button */}
          <button
            onClick={handleCreateAccount}
            className="w-full bg-brown-600 text-white py-4 px-6 rounded-full b1 hover:bg-brown-500 transition-colors mb-4"
          >
            Create account
          </button>

          {/* Login Link */}
          <p className="text-brown-400">
            Already have an account?{" "}
            <button
              onClick={handleLogin}
              className="text-brown-600 underline hover:text-brown-400 transition-colors"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
