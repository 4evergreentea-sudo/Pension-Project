import React, { useState } from 'react';

interface AccountChecklistProps {
  checklist: string[];
}

export const AccountChecklist: React.FC<AccountChecklistProps> = ({ checklist }) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="w-full space-y-6">
      <div className={`grid gap-4 ${checklist.length >= 4 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {checklist.map((item, index) => (
          <div 
            key={index}
            onClick={() => toggleItem(index)}
            className={`flex items-center space-x-4 p-5 rounded-2xl border transition-all cursor-pointer group ${
              checkedItems[index] 
                ? 'bg-gray-50 border-gray-200' 
                : 'bg-white border-gray-100 shadow-sm hover:border-[var(--color-kb-gold)]'
            }`}
          >
            {/* Custom Checkbox */}
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
              checkedItems[index]
                ? 'bg-[var(--color-kb-gold)] border-[var(--color-kb-gold)]'
                : 'border-gray-200 bg-white group-hover:border-[var(--color-kb-gold)]'
            }`}>
              {checkedItems[index] && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            
            <span className={`text-sm font-bold transition-colors ${
              checkedItems[index] ? 'text-gray-400 line-through' : 'text-gray-700'
            }`}>
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* Small Disclaimer Footer style */}
      <div className="pt-4 border-t border-gray-50 text-center">
        <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
          ※ 본 서비스는 투자 자문이 아닌 인공지능 기반의 정보 제공용입니다.<br/>
          실제 매수 시점의 시장 상황을 반드시 해당 금융기관을 통해 최종 확인하시기 바랍니다.
        </p>
      </div>
    </div>
  );
};
