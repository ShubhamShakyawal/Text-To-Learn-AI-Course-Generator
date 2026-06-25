import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = true }) => {
  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm z-50"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-slate-400 font-medium animate-pulse">Generating your learning journey...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
