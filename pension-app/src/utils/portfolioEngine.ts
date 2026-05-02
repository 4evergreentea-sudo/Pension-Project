import type { UserProfile, AssetRow, RiskProfile, TargetPortfolioItem } from '../types';

export const calculateRiskProfile = (profile: UserProfile): { profile: RiskProfile; score: number } => {
  let score = 0;

  // 1. 투자 경험
  const expScores = { '없음': 1, '조금 있음': 2, '보통': 3, '많음': 4 };
  score += expScores[profile.investmentExperience];

  // 2. 손실 감내
  const lossScores = { '-5%': 1, '-10%': 2, '-20%': 3, '-30% 이상': 4 };
  score += lossScores[profile.riskTolerance];

  // 3. 은퇴까지 남은 기간
  const yearsToRetirement = profile.retirementAge - profile.age;
  if (yearsToRetirement > 20) score += 4;
  else if (yearsToRetirement > 10) score += 3;
  else if (yearsToRetirement > 5) score += 2;
  else score += 1;

  // 4. 투자 목적
  if (profile.mainGoal === '은퇴자금 성장' || profile.mainGoal === '유망 섹터 편입') score += 4;
  else if (profile.mainGoal === '세액공제') score += 3;
  else if (profile.mainGoal === '안정적 수령') score += 2;
  else score += 1; // 인컴 창출 등

  // 최종 판정
  let finalProfile: RiskProfile = '균형형';
  if (score <= 6) finalProfile = '안정형';
  else if (score <= 10) finalProfile = '인컴형';
  else if (score <= 13) finalProfile = '균형형';
  else finalProfile = '성장형';

  // 안전 규칙: 55세 이상 또는 은퇴 5년 이하인 경우 보수적으로 조정
  if (profile.age >= 55 || yearsToRetirement <= 5) {
    if (finalProfile === '성장형') finalProfile = '균형형';
    else if (finalProfile === '균형형') finalProfile = '인컴형';
  }

  return { profile: finalProfile, score };
};

export const getModelPortfolio = (riskProfile: RiskProfile): TargetPortfolioItem[] => {
  switch (riskProfile) {
    case '안정형':
      return [
        { assetClass: '원리금보장·현금성', percent: 25, reason: '안정적인 현금 흐름 확보' },
        { assetClass: '채권·안전자산', percent: 30, reason: '변동성 방어' },
        { assetClass: '글로벌코어주식', percent: 20, reason: '우량주 중심 성장' },
        { assetClass: '배당·인컴', percent: 15, reason: '추가 수익 창출' },
        { assetClass: 'TDF/TIF 또는 기타', percent: 5, reason: '분산 투자' },
        { assetClass: '테마 위성자산', percent: 5, reason: '제한적 성과 추구' },
      ];
    case '인컴형':
      return [
        { assetClass: '원리금보장·현금성', percent: 20, reason: '유동성 확보' },
        { assetClass: '채권·안전자산', percent: 30, reason: '안전 자산 비중 유지' },
        { assetClass: '배당·인컴', percent: 25, reason: '정기적인 인컴 창출' },
        { assetClass: '글로벌코어주식', percent: 15, reason: '자산 가치 방어' },
        { assetClass: 'TIF·월지급형', percent: 10, reason: '월 배당/분배금 극대화' },
        { assetClass: '테마 위성자산', percent: 0, reason: '안정성 우선으로 테마 제외' },
      ];
    case '균형형':
      return [
        { assetClass: '원리금보장·현금성', percent: 10, reason: '최소 유동성' },
        { assetClass: '채권·안전자산', percent: 25, reason: '포트폴리오 균형' },
        { assetClass: '글로벌코어주식', percent: 35, reason: '균형 잡힌 자산 성장' },
        { assetClass: '국내·배당', percent: 10, reason: '내수 배당 수익' },
        { assetClass: 'TDF/TIF', percent: 5, reason: '자동 리밸런싱 활용' },
        { assetClass: '테마 위성자산', percent: 15, reason: '유망 섹터 적극 활용' },
      ];
    case '성장형':
      return [
        { assetClass: '원리금보장·현금성', percent: 5, reason: '효율적 자금 운용' },
        { assetClass: '채권·안전자산', percent: 20, reason: '최소 안전장치' },
        { assetClass: '글로벌코어주식', percent: 40, reason: '적극적인 자산 증식' },
        { assetClass: '국내·배당', percent: 10, reason: '배당 재투자' },
        { assetClass: 'TDF/TIF', percent: 5, reason: '장기 타겟 데이트 펀드' },
        { assetClass: '테마 위성자산', percent: 20, reason: '알파 수익 추구' },
      ];
  }
};

export const getCurrentAllocation = (assets: AssetRow[]) => {
  const total = assets.reduce((sum, asset) => sum + asset.amount, 0);
  if (total === 0) return [];

  const allocationMap = assets.reduce((acc, asset) => {
    acc[asset.assetCategory] = (acc[asset.assetCategory] || 0) + asset.amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(allocationMap).map(([name, value]) => ({
    name,
    value: Math.round((value / total) * 100),
  }));
};
