import React, { useEffect, useState } from 'react';
import type { SavedConsultation, AssetRow } from '../types';
import { fetchConsultationAssets } from '../lib/supabase';
import { X, User, Calendar, Target, Briefcase, Info } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/format';
import { ResultCards } from './ResultCards';
import { SectorGuide } from './SectorGuide';
import { RebalancingSteps } from './RebalancingSteps';
import { LoadingSpinner } from './LoadingSpinner';

interface ConsultationDetailModalProps {
  consultation: SavedConsultation;
  onClose: () => void;
}

export const ConsultationDetailModal: React.FC<ConsultationDetailModalProps> = ({ consultation, onClose }) => {
  const [assets, setAssets] = useState<AssetRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const data = await fetchConsultationAssets(consultation.id);
        setAssets(data);
      } catch (err) {
        console.error('Failed to load assets:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAssets();
  }, [consultation.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-gray-50 w-full max-w-4xl max-h-[92vh] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">상담 상세 결과</h2>
            <p className="text-xs text-gray-500">{formatDate(consultation.createdAt)} 상담 내역</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-3xl mx-auto space-y-10">
            {/* User Profile Summary */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><User className="w-5 h-5"/></div>
                <div><p className="text-[10px] text-gray-400 font-bold">고객명</p><p className="text-sm font-bold">{consultation.customerName}</p></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Calendar className="w-5 h-5"/></div>
                <div><p className="text-[10px] text-gray-400 font-bold">나이/은퇴</p><p className="text-sm font-bold">{consultation.age}/{consultation.retirementAge}세</p></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Briefcase className="w-5 h-5"/></div>
                <div><p className="text-[10px] text-gray-400 font-bold">총 자산</p><p className="text-sm font-bold text-blue-600">{formatCurrency(consultation.totalAssets)}</p></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Target className="w-5 h-5"/></div>
                <div><p className="text-[10px] text-gray-400 font-bold">투자 목적</p><p className="text-sm font-bold">{consultation.mainGoal}</p></div>
              </div>
            </div>

            {/* Input Assets */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 px-1">상담 당시 입력 자산</h3>
              {loading ? (
                <LoadingSpinner />
              ) : (
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-4 py-3 font-bold text-gray-400">자산군</th>
                        <th className="px-4 py-3 font-bold text-gray-400 text-right">금액</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {assets.map((a, i) => (
                        <tr key={i}>
                          <td className="px-4 py-3">
                            <span className="font-medium text-gray-900">{a.assetCategory}</span>
                            {a.sectorTag !== '없음' && <span className="ml-2 text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">{a.sectorTag}</span>}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-gray-700">{formatCurrency(a.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* AI Results */}
            <ResultCards 
              headline={consultation.headline || ''} 
              riskProfile={consultation.riskProfile} 
              diagnosis={consultation.diagnosis} 
              targetPortfolio={consultation.targetPortfolio} 
            />

            <SectorGuide guide={consultation.sectorGuide} />

            <RebalancingSteps 
              steps={consultation.rebalancingSteps} 
            />

            {/* Script */}
            <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-bold mb-3 flex items-center space-x-2">
                <Info className="w-5 h-5" />
                <span>고객 상담용 3문장 요약</span>
              </h3>
              <p className="text-sm leading-relaxed italic opacity-90">
                "{consultation.customerScript}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
