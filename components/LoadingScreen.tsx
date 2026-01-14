
import React from 'react';

interface LoadingScreenProps {
  progress: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-xs text-center">
        <div className="mb-6 relative">
          <div className="w-20 h-20 border-4 border-slate-100 rounded-full mx-auto"></div>
          <div className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin absolute inset-0 mx-auto"></div>
          <i className="fas fa-brain text-green-600 text-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></i>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Loading AI Model...</h2>
        <p className="text-slate-500 mb-6 text-sm">Initializing TensorFlow.js for on-device inference.</p>
        
        <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{Math.round(progress)}% Loaded</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
