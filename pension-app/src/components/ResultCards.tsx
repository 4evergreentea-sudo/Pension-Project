import React from 'react';
import type { DiagnosisResult, TargetPortfolioItem } from '../types';
import { Badge } from './Badge';
import { CheckCircle2, AlertCircle, XCircle, TrendingUp } from 'lucide-react';

interface ResultCardsProps {
  headline: string;
  riskProfile: string;
  diagnosis: DiagnosisResult[];
  targetPortfolio: TargetPortfolioItem[];
}

export const ResultCards: React.FC<ResultCardsProps> = ({ headline, riskProfile, diagnosis, targetPortfolio }) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case '양호': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case '주의': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case '위험': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const getRiskBadgeVariant = (profile: string) => {
    if (profile.includes('안정')) return 'success';
    if (profile.includes('균형')) return 'info';
    if (profile.includes('성장')) return 'purple';
    if (profile.includes('인컴')) return 'orange';
    return 'info';
  };

  return (
    <div className="space-y-6">
      {/* Headline & Risk */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <Badge variant={getRiskBadgeVariant(riskProfile)}>{riskProfile}</Badge>
          <TrendingUp className="w-6 h-6 opacity-50" />
        </div>
        <h2 className="text-xl font-bold leading-tight mb-2">{headline}</h2>
        <p className="text-blue-100 text-sm">Gemini 3 Flash가 제안하는 맞춤형 포트폴리오입니다.</p>
      </div>

      {/* Diagnosis */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 px-1">포트폴리오 주요 진단</h3>
        <div className="space-y-3">
          {diagnosis.map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-start space-x-3 shadow-sm">
              <div className="mt-0.5">{getSeverityIcon(item.severity)}</div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                <p className="text-gray-600 text-[13px] leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Target Portfolio Details */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 px-1">추천 모델 포트폴리오 상세</h3>
        <div className="grid grid-cols-1 gap-3">
          {targetPortfolio.map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900">{item.assetClass}</span>
                <span className="text-blue-600 font-black text-lg">{item.percent}%</span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">{item.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
