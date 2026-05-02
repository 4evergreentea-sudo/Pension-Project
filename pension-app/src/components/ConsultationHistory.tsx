import React from 'react';
import type { SavedConsultation } from '../types';
import { formatDate, formatCurrency } from '../utils/format';
import { Badge } from './Badge';
import { Search, Download, RefreshCcw, Eye } from 'lucide-react';

interface ConsultationHistoryProps {
  history: SavedConsultation[];
  onViewDetail: (consultation: SavedConsultation) => void;
  onDownloadCSV: () => void;
  onRefresh: () => void;
}

export const ConsultationHistory: React.FC<ConsultationHistoryProps> = ({
  history,
  onViewDetail,
  onDownloadCSV,
  onRefresh
}) => {
  const getRiskBadgeVariant = (profile: string) => {
    if (profile.includes('안정')) return 'success';
    if (profile.includes('균형')) return 'info';
    if (profile.includes('성장')) return 'purple';
    if (profile.includes('인컴')) return 'orange';
    return 'info';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">상담 이력</h2>
        <div className="flex space-x-2">
          <button
            onClick={onRefresh}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            title="새로고침"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
          <button
            onClick={onDownloadCSV}
            className="flex items-center space-x-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-green-100 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">CSV 다운로드</span>
          </button>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="sm:hidden space-y-4">
        {history.map((item) => (
          <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{formatDate(item.createdAt)}</p>
                <h3 className="font-bold text-gray-900">{item.customerName} ({item.age}세)</h3>
              </div>
              <Badge variant={getRiskBadgeVariant(item.riskProfile)}>{item.riskProfile}</Badge>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">{item.headline}</p>
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <span className="text-sm font-bold text-blue-600">{formatCurrency(item.totalAssets)}</span>
              <button
                onClick={() => onViewDetail(item)}
                className="flex items-center space-x-1 text-gray-400 hover:text-blue-600 transition-colors text-xs font-bold"
              >
                <Eye className="w-4 h-4" />
                <span>상세보기</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">상담 일시</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">고객 정보</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">위험성향</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">총 연금자산</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">동작</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600 font-medium">{formatDate(item.createdAt)}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">{item.customerName}</span>
                    <span className="text-xs text-gray-500">{item.age}세 | 은퇴 {item.retirementAge}세</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={getRiskBadgeVariant(item.riskProfile)}>{item.riskProfile}</Badge>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-blue-600">{formatCurrency(item.totalAssets)}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onViewDetail(item)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {history.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-gray-900 font-bold mb-1">상담 이력이 없습니다</h3>
          <p className="text-gray-500 text-sm">새로운 포트폴리오 상담을 시작해보세요.</p>
        </div>
      )}
    </div>
  );
};
