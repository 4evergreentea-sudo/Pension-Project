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
          <label className="block text-sm font-bold text-gray-700 mb-1.5">고객 이름</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="홍길동"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">현재 나이</label>
            <input
              type="number"
              value={profile.age || ''}
              onChange={(e) => onChange({ age: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">은퇴 목표 나이</label>
            <input
              type="number"
              value={profile.retirementAge || ''}
              onChange={(e) => onChange({ retirementAge: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">월 추가 납입 가능액 (원)</label>
        <input
          type="number"
          value={profile.monthlyContribution || ''}
          onChange={(e) => onChange({ monthlyContribution: Number(e.target.value) })}
          placeholder="예: 500000"
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">주된 투자 목적</label>
        <select
          value={profile.mainGoal}
          onChange={(e) => onChange({ mainGoal: e.target.value })}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none"
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
          <label className="block text-sm font-bold text-gray-700 mb-1.5">투자 경험</label>
          <div className="grid grid-cols-4 gap-2">
            {(['없음', '조금 있음', '보통', '많음'] as const).map((level) => (
              <button
                key={level}
                onClick={() => onChange({ investmentExperience: level })}
                className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                  profile.investmentExperience === level
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">감내 가능한 최대 손실</label>
          <div className="grid grid-cols-4 gap-2">
            {(['-5%', '-10%', '-20%', '-30% 이상'] as const).map((loss) => (
              <button
                key={loss}
                onClick={() => onChange({ riskTolerance: loss })}
                className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                  profile.riskTolerance === loss
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
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
