import React from 'react';
import type { SectorGuideItem } from '../types';
import { ShieldCheck, Info } from 'lucide-react';

interface SectorGuideProps {
  guide: SectorGuideItem[];
}

export const SectorGuide: React.FC<SectorGuideProps> = ({ guide }) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4 px-1 flex items-center space-x-2">
        <span>유망 섹터 적정 비중 가이드</span>
        <div className="bg-blue-100 text-blue-600 p-1 rounded-full">
          <ShieldCheck className="w-4 h-4" />
        </div>
      </h3>
      <div className="space-y-4">
        {guide.map((item, idx) => (
          <div key={idx} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex items-center justify-between">
              <span className="font-bold text-gray-800 text-sm">{item.sector}</span>
              <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                최대 {item.maxPercent}%
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-start space-x-2 mb-3">
                <div className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold whitespace-nowrap">추천 비중</div>
                <span className="text-sm font-bold text-blue-600">{item.recommendedRange}</span>
              </div>
              <p className="text-[13px] text-gray-600 leading-relaxed mb-3">
                <strong className="text-gray-800">역할:</strong> {item.role}<br/>
                {item.rationale}
              </p>
              {item.warning && (
                <div className="flex items-start space-x-2 bg-amber-50 p-2 rounded-lg">
                  <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-800 font-medium">{item.warning}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
