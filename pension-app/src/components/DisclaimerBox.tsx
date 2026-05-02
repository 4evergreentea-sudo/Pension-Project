import React from 'react';

interface DisclaimerBoxProps {
  accepted: boolean;
  onToggle: () => void;
}

export const DisclaimerBox: React.FC<DisclaimerBoxProps> = ({ accepted, onToggle }) => {
  return (
    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
      <div className="text-[13px] text-amber-900 leading-relaxed mb-4">
        <strong>[필독 면책 문구]</strong><br />
        본 서비스는 투자 자문 또는 투자 일임 서비스가 아닌 정보 제공 목적의 연금 포트폴리오 코칭 서비스입니다. 
        모든 투자 판단과 책임은 사용자 본인에게 있습니다.
      </div>
      <label className="flex items-center space-x-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={accepted}
            onChange={onToggle}
          />
          <div className={`w-6 h-6 rounded border-2 transition-colors flex items-center justify-center ${
            accepted ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300 group-hover:border-blue-400'
          }`}>
            {accepted && (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        <span className="text-sm font-bold text-gray-700">위 내용을 확인하였으며 동의합니다.</span>
      </label>
    </div>
  );
};
