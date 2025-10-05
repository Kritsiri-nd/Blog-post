import * as React from "react";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-800 flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl font-bold">!</span>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="h1 mb-10 text-gray-800 font-bold">Page Not Found</h1>

          {/* Go Home Button */}
          <button
            onClick={handleGoHome}
            className="px-8 py-4 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Go To Homepage
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
