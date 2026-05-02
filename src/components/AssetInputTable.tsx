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
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-1 bg-[var(--color-kb-gold)] h-5 rounded-full"></div>
          <h3 className="text-lg font-bold text-gray-800">연금자산 목록</h3>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center space-x-1.5 bg-[#FFFDE7] text-[var(--color-kb-dark)] px-4 py-2 rounded-full text-sm font-bold border border-[var(--color-kb-gold)] hover:bg-[var(--color-kb-gold)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>자산 추가</span>
        </button>
      </div>

      <div className="space-y-5">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:border-[var(--color-kb-gold)] transition-all relative group">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 ml-1">계좌 유형</label>
                <select
                  value={asset.accountType}
                  onChange={(e) => onChange(asset.id, { accountType: e.target.value as AccountType })}
                  className="kb-input text-xs py-2 px-3 appearance-none cursor-pointer"
                >
                  {accountTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 ml-1">자산군</label>
                <select
                  value={asset.assetCategory}
                  onChange={(e) => onChange(asset.id, { assetCategory: e.target.value as AssetCategory })}
                  className="kb-input text-xs py-2 px-3 appearance-none cursor-pointer"
                >
                  {assetCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 ml-1">섹터 태그</label>
                <select
                  value={asset.sectorTag}
                  onChange={(e) => onChange(asset.id, { sectorTag: e.target.value as SectorTag })}
                  className="kb-input text-xs py-2 px-3 appearance-none cursor-pointer"
                >
                  {sectorTags.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 ml-1">평가금액 (원)</label>
                <input
                  type="number"
                  value={asset.amount || ''}
                  onChange={(e) => onChange(asset.id, { amount: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full text-xl font-bold bg-transparent border-b border-gray-200 focus:border-[var(--color-kb-gold)] outline-none pb-2 transition-all placeholder:text-gray-200"
                />
              </div>
              <button
                onClick={() => onRemove(asset.id)}
                className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-4">
              <input
                type="text"
                value={asset.memo}
                onChange={(e) => onChange(asset.id, { memo: e.target.value })}
                placeholder="비고 (예: 삼성증권 IRP)"
                className="w-full text-xs text-gray-500 bg-gray-50 border-none rounded-lg px-4 py-2.5 outline-none focus:bg-gray-100 transition-all"
              />
            </div>
          </div>
        ))}

        {assets.length === 0 && (
          <div className="text-center py-16 bg-white/50 rounded-2xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 text-sm font-medium">등록된 자산이 없습니다.<br/><span className="text-xs opacity-60">위의 '자산 추가' 버튼을 눌러 자산을 입력해 주세요.</span></p>
          </div>
        )}
      </div>
    </div>
  );
};
