import React from 'react';
import type { DiagnosisResult, TargetPortfolioItem } from '../types';
import { Badge } from './Badge';
import { CheckCircle2, AlertCircle, XCircle, TrendingUp } from 'lucide-react';
import { PortfolioDetailTable } from './PortfolioDetailTable';

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
                <p className="text-gray-600 text-[13px] leading-relaxed break-keep">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Target Portfolio Details */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center space-x-2">
          <span className="text-xl">📊</span>
          <span>추천 모델 포트폴리오 상세</span>
        </h3>
        <PortfolioDetailTable items={targetPortfolio} />
      </div>
    </div>
  );
};
