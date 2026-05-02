import type { UserProfile, AssetRow } from '../types';

export const validateProfile = (profile: UserProfile): string | null => {
  if (!profile.name.trim()) return '고객 이름을 입력해주세요.';
  if (profile.age < 20 || profile.age > 80) return '나이는 20세에서 80세 사이여야 합니다.';
  if (profile.retirementAge <= profile.age) return '은퇴 목표 나이는 현재 나이보다 커야 합니다.';
  if (!profile.disclaimerAccepted) return '면책 문구에 동의하셔야 상담이 가능합니다.';
  return null;
};

export const validateAssets = (assets: AssetRow[]): string | null => {
  if (assets.length === 0) return '최소 하나 이상의 연금 자산을 입력해주세요.';
  const totalAmount = assets.reduce((sum, asset) => sum + asset.amount, 0);
  if (totalAmount <= 0) return '평가금액 합계는 0보다 커야 합니다.';
  return null;
};
