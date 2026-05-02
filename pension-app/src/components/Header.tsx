import React from 'react';
import { PiggyBank } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <PiggyBank className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">연금부자서비스</h1>
            <p className="text-xs text-blue-600 font-medium">연금 투자 코치 v2</p>
          </div>
        </div>
        <div className="hidden sm:block">
          <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase tracking-wider font-bold">
            Gemini 3 Flash Powered
          </span>
        </div>
      </div>
    </header>
  );
};
