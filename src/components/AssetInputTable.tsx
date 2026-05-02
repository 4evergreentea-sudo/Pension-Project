import React from 'react';
import { Plus, Trash2, Wallet, PieChart, Target, Coins, Info } from 'lucide-react';
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[var(--color-kb-gold)] rounded-lg">
            <Coins className="w-5 h-5 text-[var(--color-kb-dark)]" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-800 leading-tight">연금자산 목록</h3>
            <p className="text-[11px] text-gray-400">보유하신 모든 연금 자산을 상세히 입력해 주세요.</p>
          </div>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center space-x-1.5 bg-[#FFFDE7] text-[var(--color-kb-dark)] px-4 sm:px-5 py-2.5 rounded-full text-sm font-black border border-[var(--color-kb-gold)] hover:bg-[var(--color-kb-gold)] transition-all shadow-sm flex-shrink-0 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>자산 추가</span>
        </button>
      </div>

      <div className="space-y-6">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-[var(--color-kb-gold)] transition-all relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--color-kb-gold)] opacity-50"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="space-y-2">
                <div className="flex items-center space-x-1.5 text-gray-400 ml-1">
                  <Wallet className="w-3.5 h-3.5" />
                  <label className="text-[10px] font-bold uppercase tracking-wider">계좌 유형</label>
                </div>
                <select
                  value={asset.accountType}
                  onChange={(e) => onChange(asset.id, { accountType: e.target.value as AccountType })}
                  className="kb-input text-sm py-3 px-4 appearance-none cursor-pointer"
                >
                  {accountTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-1.5 text-gray-400 ml-1">
                  <PieChart className="w-3.5 h-3.5" />
                  <label className="text-[10px] font-bold uppercase tracking-wider">자산군</label>
                </div>
                <select
                  value={asset.assetCategory}
                  onChange={(e) => onChange(asset.id, { assetCategory: e.target.value as AssetCategory })}
                  className="kb-input text-sm py-3 px-4 appearance-none cursor-pointer"
                >
                  {assetCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-1.5 text-gray-400 ml-1">
                  <Target className="w-3.5 h-3.5" />
                  <label className="text-[10px] font-bold uppercase tracking-wider">섹터 태그</label>
                </div>
                <select
                  value={asset.sectorTag}
                  onChange={(e) => onChange(asset.id, { sectorTag: e.target.value as SectorTag })}
                  className="kb-input text-sm py-3 px-4 appearance-none cursor-pointer"
                >
                  {sectorTags.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-1 space-y-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">평가금액 (백만 원)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={asset.amount ? asset.amount / 1000000 : ''}
                    onChange={(e) => onChange(asset.id, { amount: Math.round(Number(e.target.value) * 1000000) })}
                    placeholder="0"
                    className="w-full text-2xl font-black bg-transparent border-b-2 border-gray-100 focus:border-[var(--color-kb-gold)] outline-none pb-2 transition-all placeholder:text-gray-100 pr-20"
                  />
                  <div className="absolute right-0 bottom-3 text-sm font-black text-gray-300">
                    백만 원
                  </div>
                </div>
                {asset.amount > 0 && (
                  <div className="flex items-center space-x-1 text-xs text-[var(--color-kb-gold)] font-bold bg-[#FFFDE7] px-2 py-1 rounded-lg w-fit">
                    <Info className="w-3 h-3" />
                    <span>실제 금액: {formatCurrency(asset.amount)}원</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => onRemove(asset.id)}
                className="mt-6 p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                title="자산 삭제"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
            
            <div className="pt-4 border-t border-gray-50">
              <input
                type="text"
                value={asset.memo}
                onChange={(e) => onChange(asset.id, { memo: e.target.value })}
                placeholder="비고 (예: 삼성증권 퇴직연금 계좌)"
                className="w-full text-xs text-gray-400 bg-gray-50 border-none rounded-xl px-5 py-3 outline-none focus:bg-gray-100 transition-all font-medium"
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
