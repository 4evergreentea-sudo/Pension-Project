import React from 'react';
import type { UserProfile } from '../types';

interface ProfileFormProps {
  profile: UserProfile;
  onChange: (updates: Partial<UserProfile>) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="kb-label">고객 이름</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="홍길동"
            className="kb-input"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="kb-label">현재 나이 (세)</label>
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
          <div>
            <label className="kb-label">은퇴 목표 나이 (세)</label>
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
      </div>

      <div>
        <label className="kb-label">월 추가 납입 가능액 (원)</label>
        <input
          type="number"
          value={profile.monthlyContribution || ''}
          onChange={(e) => onChange({ monthlyContribution: Number(e.target.value) })}
          placeholder="예: 500,000"
          className="kb-input"
        />
      </div>

      <div>
        <label className="kb-label">주된 투자 목적</label>
        <select
          value={profile.mainGoal}
          onChange={(e) => onChange({ mainGoal: e.target.value })}
          className="kb-input appearance-none cursor-pointer"
        >
          <option value="세액공제">세액공제</option>
          <option value="은퇴자금 성장">은퇴자금 성장</option>
          <option value="안정적 수령">안정적 수령</option>
          <option value="인컴 창출">인컴 창출</option>
          <option value="유망 섹터 편입">유망 섹터 편입</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="kb-label">투자 경험</label>
          <div className="grid grid-cols-4 gap-2">
            {(['없음', '조금 있음', '보통', '많음'] as const).map((level) => (
              <button
                key={level}
                onClick={() => onChange({ investmentExperience: level })}
                className={`py-2 text-[11px] font-bold rounded-xl border transition-all ${
                  profile.investmentExperience === level
                    ? 'bg-[var(--color-kb-dark)] text-[var(--color-kb-gold)] border-[var(--color-kb-dark)]'
                    : 'bg-white text-gray-400 border-gray-100 hover:border-[var(--color-kb-gold)]'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="kb-label">감내 가능한 최대 손실</label>
          <div className="grid grid-cols-4 gap-2">
            {(['-5%', '-10%', '-20%', '-30% 이상'] as const).map((loss) => (
              <button
                key={loss}
                onClick={() => onChange({ riskTolerance: loss })}
                className={`py-2 text-[11px] font-bold rounded-xl border transition-all ${
                  profile.riskTolerance === loss
                    ? 'bg-[var(--color-kb-dark)] text-[var(--color-kb-gold)] border-[var(--color-kb-dark)]'
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
  );
};
