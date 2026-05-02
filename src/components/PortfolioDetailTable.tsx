import React, { useState } from 'react';
import type { TargetPortfolioItem } from '../types';
import { ChevronDown } from 'lucide-react';

interface PortfolioDetailTableProps {
  items: TargetPortfolioItem[];
}

const COLORS = [
  '#FFCC00', // KB Gold
  '#333333', // KB Deep Gray
  '#FF9900', // Orange Accent
  '#555555', // Medium Gray
  '#FFD633', // Light Gold
  '#1A1A1A', // Near Black
  '#FFB300', // Amber Gold
  '#777777', // Light Gray
];

export const PortfolioDetailTable: React.FC<PortfolioDetailTableProps> = ({ items }) => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

  return (
    <div className="w-full">
      {/* 1. Desktop & Tablet View: Classic Table */}
      <div className="hidden sm:block overflow-hidden rounded-2xl border border-gray-50 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-50">
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">자산군</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">비중</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-left pl-10">AI 추천 사유 및 역할</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-6 py-6 align-top">
                  <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-sm font-black text-gray-800 whitespace-nowrap">{item.assetClass}</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-right align-top">
                  <span className="text-sm font-black text-[var(--color-kb-dark)] bg-[#FFFDE7] px-3 py-1.5 rounded-lg border border-amber-100 shadow-sm">
                    {item.percent}%
                  </span>
                </td>
                <td className="px-10 py-6">
                  <p className="text-sm text-gray-600 font-bold leading-relaxed max-w-lg break-keep">
                    {item.reason}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2. Mobile View: Interactive Card List with Accordion */}
      <div className="sm:hidden space-y-4">
        {items.map((item, idx) => {
          const isExpanded = expandedIdx === idx;
          const isLongText = item.reason.length > 60;

          return (
            <div 
              key={idx} 
              className={`bg-white rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 ${isExpanded ? 'ring-2 ring-[var(--color-kb-gold)] shadow-md' : ''}`}
            >
              {/* Card Header: Toggleable if text is long */}
              <div 
                className={`p-5 flex items-center justify-between cursor-pointer ${isLongText ? 'hover:bg-gray-50/50' : ''}`}
                onClick={() => isLongText && toggleExpand(idx)}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full shadow-sm" 
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  ></div>
                  <h4 className="text-base font-black text-gray-800 tracking-tight">{item.assetClass}</h4>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-black text-[var(--color-kb-dark)] bg-[#FFFDE7] px-3 py-1 rounded-xl border border-amber-100">
                    {item.percent}%
                  </span>
                  {isLongText && (
                    <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[var(--color-kb-gold)]' : ''}`} />
                  )}
                </div>
              </div>

              {/* Card Content (Accordion) */}
              <div className={`overflow-hidden transition-all duration-300 ${isExpanded || !isLongText ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-5 pb-5">
                  <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                    <p className="text-sm text-gray-600 font-bold leading-relaxed break-keep">
                      <span className="text-[var(--color-kb-gold-dark)] block mb-1 text-[10px] font-black uppercase tracking-wider opacity-60">AI Insight</span>
                      {item.reason}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* "Read More" hint for mobile users */}
              {!isExpanded && isLongText && (
                <div className="px-5 pb-3 text-center">
                  <button onClick={() => toggleExpand(idx)} className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Tap to read reasoning</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
