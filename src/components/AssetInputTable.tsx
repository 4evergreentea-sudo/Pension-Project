import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { AssetRow, AccountType, AssetCategory, SectorTag } from '../types';

interface AssetInputTableProps {
  assets: AssetRow[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, updates: Partial<AssetRow>) => void;
}

export const AssetInputTable: React.FC<AssetInputTableProps> = ({ assets, onAdd, onRemove, onChange }) => {
  const accountTypes: AccountType[] = ['DC', 'IRP', '연금저축', 'ISA', '기타'];
  const assetCategories: AssetCategory[] = [
    '원리금보장·예금', '채권·안전자산', '국내주식형', '글로벌코어주식', 
    '나스닥·기술주코어', '테마형', '배당·인컴', '기타'
  ];
  const sectorTags: SectorTag[] = [
    '없음', 'AI·반도체', '데이터센터·전력망', '헬스케어·고령화', 
    '방위·사이버보안', '배당·인컴', '기타'
  ];

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">연금자산 목록</h3>
        <button
          onClick={onAdd}
          className="flex items-center space-x-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>자산 추가</span>
        </button>
      </div>

      <div className="space-y-4">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">계좌 유형</label>
                <select
                  value={asset.accountType}
                  onChange={(e) => onChange(asset.id, { accountType: e.target.value as AccountType })}
                  className="w-full text-sm font-medium bg-gray-50 border-none rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {accountTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">자산군</label>
                <select
                  value={asset.assetCategory}
                  onChange={(e) => onChange(asset.id, { assetCategory: e.target.value as AssetCategory })}
                  className="w-full text-sm font-medium bg-gray-50 border-none rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {assetCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">섹터 태그</label>
                <select
                  value={asset.sectorTag}
                  onChange={(e) => onChange(asset.id, { sectorTag: e.target.value as SectorTag })}
                  className="w-full text-sm font-medium bg-gray-50 border-none rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sectorTags.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">평가금액 (원)</label>
                <input
                  type="number"
                  value={asset.amount || ''}
                  onChange={(e) => onChange(asset.id, { amount: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full text-lg font-bold bg-transparent border-b-2 border-gray-100 focus:border-blue-500 outline-none pb-1 transition-colors"
                />
              </div>
              <button
                onClick={() => onRemove(asset.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-3">
              <input
                type="text"
                value={asset.memo}
                onChange={(e) => onChange(asset.id, { memo: e.target.value })}
                placeholder="간단한 메모 (선택사항)"
                className="w-full text-xs text-gray-500 bg-gray-50 border-none rounded-lg px-3 py-1.5 outline-none"
              />
            </div>
          </div>
        ))}

        {assets.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-sm font-medium">등록된 자산이 없습니다.<br/>위의 '자산 추가' 버튼을 눌러주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
};
