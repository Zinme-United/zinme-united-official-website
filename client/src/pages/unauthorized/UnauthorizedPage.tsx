import React from "react";
import { Link } from "react-router";

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied!</h1>
        <p className="text-lg text-gray-700 mb-6">
          You do not have the necessary permissions to view this page.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-[#003b75] font-semibold rounded-md hover:bg-[#003b75] transition-colors"
        >
          <p className="text-white">Go to Homepage</p>
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
