import React from 'react';
import { Wallet } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-[var(--color-kb-gold)] p-1.5 rounded-lg shadow-sm">
            <Wallet className="w-5 h-5 text-[#333]" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-black text-gray-800 tracking-tighter">KB</span>
              <h1 className="text-base font-bold text-gray-800">연금부자서비스</h1>
            </div>
            <p className="text-[10px] text-gray-400 font-medium">연금 투자 코치 v2</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-[10px] bg-[#F3F4F6] px-2 py-1 rounded text-gray-500 font-bold">
            Gemini 3 Flash
          </span>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
        </div>
      </div>
    </header>
  );
};
