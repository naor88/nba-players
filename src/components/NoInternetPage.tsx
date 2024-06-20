import React from 'react';
import { FaWifi } from 'react-icons/fa';

const NoInternetPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <FaWifi className="text-6xl text-red-500 mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">No Internet Connection</h1>
        <p className="text-lg text-gray-600 mb-8">
          It looks like you are not connected to the internet. Please check your connection and try again.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default NoInternetPage;
