
import React from 'react';

interface LoaderProps {
    message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex flex-col justify-center items-center z-50 rounded-lg">
      <div className="w-12 h-12 border-4 border-t-cyan-400 border-gray-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-white font-semibold">{message}</p>
    </div>
  );
};
