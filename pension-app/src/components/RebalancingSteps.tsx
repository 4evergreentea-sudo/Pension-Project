import React from 'react';
import { ChevronRight } from 'lucide-react';

interface RebalancingStepsProps {
  steps: string[];
  checklist: string[];
}

export const RebalancingSteps: React.FC<RebalancingStepsProps> = ({ steps, checklist }) => {
  return (
    <div className="mt-8 space-y-8">
      {/* Rebalancing Steps */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 px-1">리밸런싱 실행 순서</h3>
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-start space-x-3">
              <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                {idx + 1}
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-4 flex-1 shadow-sm relative">
                <p className="text-[13px] text-gray-700 font-medium leading-relaxed">{step}</p>
                {idx < steps.length - 1 && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-gray-300">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-gray-900 rounded-3xl p-6 text-white">
        <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
          <span className="bg-blue-500 w-1.5 h-6 rounded-full"></span>
          <span>계좌별 최종 체크리스트</span>
        </h3>
        <ul className="space-y-3">
          {checklist.map((item, idx) => (
            <li key={idx} className="flex items-start space-x-3 group">
              <div className="w-5 h-5 rounded-full border border-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-blue-500 transition-colors">
                <div className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{item}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 pt-6 border-t border-gray-800">
          <p className="text-[11px] text-gray-500 leading-relaxed italic text-center">
            "본 서비스는 투자 자문이 아닌 정보 제공용입니다.<br/>실제 매수 시점의 시장 상황을 반드시 확인하세요."
          </p>
        </div>
      </div>
    </div>
  );
};
