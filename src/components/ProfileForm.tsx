import React from 'react';
import type { UserProfile } from '../types';

interface ProfileFormProps {
  profile: UserProfile;
  onChange: (updates: Partial<UserProfile>) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onChange }) => {
  return (
    <div className="space-y-10">
      {/* Group 1: 기본 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="kb-label mb-0">고객 이름</label>
          <p className="text-[11px] text-gray-400 mb-2">상담 결과에 표시될 성함을 입력해 주세요.</p>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="홍길동"
            className="kb-input"
          />
        </div>
        <div className="space-y-1.5">
          <label className="kb-label mb-0">주된 투자 목적</label>
          <p className="text-[11px] text-gray-400 mb-2">연금을 통해 달성하고 싶은 목표를 선택하세요.</p>
          <select
            value={profile.mainGoal}
            onChange={(e) => onChange({ mainGoal: e.target.value })}
            className="kb-input appearance-none cursor-pointer"
          >
            <option value="세액공제">세액공제 극대화</option>
            <option value="은퇴자금 성장">은퇴자금의 공격적 성장</option>
            <option value="안정적 수령">안정적인 연금 수령</option>
            <option value="인컴 창출">배당/이자 인컴 창출</option>
            <option value="유망 섹터 편입">AI/테마주 등 유망 섹터 투자</option>
          </select>
        </div>
      </div>

      {/* Group 2: 연령 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="kb-label mb-0">현재 나이</label>
          <p className="text-[11px] text-gray-400 mb-2">현재 만 나이를 기준으로 선택해 주세요.</p>
          <select
            value={profile.age || ''}
            onChange={(e) => onChange({ age: Number(e.target.value) })}
            className="kb-input appearance-none cursor-pointer"
          >
            <option value="">선택</option>
            {Array.from({ length: 62 }, (_, i) => i + 19).map(age => (
              <option key={age} value={age}>{age}세</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="kb-label mb-0">은퇴 목표 나이</label>
          <p className="text-[11px] text-gray-400 mb-2">언제부터 연금을 수령하고 싶으신가요? (40세 이상)</p>
          <select
            value={profile.retirementAge || ''}
            onChange={(e) => onChange({ retirementAge: Number(e.target.value) })}
            className="kb-input appearance-none cursor-pointer"
          >
            <option value="">선택</option>
            {Array.from({ length: 61 }, (_, i) => i + 40).map(age => (
              <option key={age} value={age}>{age}세</option>
            ))}
          </select>
        </div>
      </div>

      {/* Group 3: 납입 정보 */}
      <div className="space-y-1.5">
        <label className="kb-label mb-0">월 추가 납입 가능액</label>
        <p className="text-[11px] text-gray-400 mb-2">매월 추가로 연금 자산에 적립할 수 있는 금액입니다.</p>
        <div className="relative">
          <input
            type="number"
            step="0.1"
            value={profile.monthlyContribution ? profile.monthlyContribution / 1000000 : ''}
            onChange={(e) => onChange({ monthlyContribution: Math.round(Number(e.target.value) * 1000000) })}
            placeholder="예: 0.5 (50만 원)"
            className="kb-input pr-16"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
            백만 원
          </div>
        </div>
      </div>

      {/* Group 4: 투자 성향 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
        <div className="space-y-3">
          <div>
            <label className="kb-label mb-0">투자 경험</label>
            <p className="text-[11px] text-gray-400 mb-3">본인의 투자 숙련도를 선택해 주세요.</p>
            <div className="grid grid-cols-4 gap-2">
              {(['없음', '조금 있음', '보통', '많음'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => onChange({ investmentExperience: level })}
                  className={`py-2.5 text-[11px] font-bold rounded-xl border transition-all ${
                    profile.investmentExperience === level
                      ? 'bg-[var(--color-kb-dark)] text-[var(--color-kb-gold)] border-[var(--color-kb-dark)] shadow-md'
                      : 'bg-white text-gray-400 border-gray-100 hover:border-[var(--color-kb-gold)]'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="kb-label mb-0">감내 가능한 최대 손실</label>
            <p className="text-[11px] text-gray-400 mb-3">하락장에서 견딜 수 있는 최대 하락폭입니다.</p>
            <div className="grid grid-cols-4 gap-2">
              {(['-5%', '-10%', '-20%', '-30% 이상'] as const).map((loss) => (
                <button
                  key={loss}
                  onClick={() => onChange({ riskTolerance: loss })}
                  className={`py-2.5 text-[11px] font-bold rounded-xl border transition-all ${
                    profile.riskTolerance === loss
                      ? 'bg-[var(--color-kb-dark)] text-[var(--color-kb-gold)] border-[var(--color-kb-dark)] shadow-md'
                      : 'bg-white text-gray-400 border-gray-100 hover:border-[var(--color-kb-gold)]'
                  }`}
                >
                  {loss}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
