import React from 'react';
import { ClipboardList, History } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'consult' | 'history';
  onTabChange: (tab: 'consult' | 'history') => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
      <button
        onClick={() => onTabChange('consult')}
        className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg text-sm font-bold transition-all ${
          activeTab === 'consult'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <ClipboardList className="w-4 h-4" />
        <span>상담하기</span>
      </button>
      <button
        onClick={() => onTabChange('history')}
        className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg text-sm font-bold transition-all ${
          activeTab === 'history'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <History className="w-4 h-4" />
        <span>상담 이력</span>
      </button>
    </div>
  );
};
