
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 mb-8 text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
          <i className="fas fa-recycle text-white text-2xl"></i>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">EcoClear <span className="text-green-600">AI</span></h1>
      </div>
      <p className="text-slate-500 max-w-md mx-auto">
        Classify waste and recyclables instantly using on-device computer vision. No data leaves your browser.
      </p>
    </header>
  );
};

export default Header;
