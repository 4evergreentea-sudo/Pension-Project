export type AccountType = 'DC' | 'IRP' | '연금저축' | 'ISA' | '기타';

export type AssetCategory = 
  | '원리금보장·예금' 
  | '채권·안전자산' 
  | '국내주식형' 
  | '글로벌코어주식' 
  | '나스닥·기술주코어' 
  | '테마형' 
  | '배당·인컴' 
  | '기타';

export type SectorTag = 
  | '없음' 
  | 'AI·반도체' 
  | '데이터센터·전력망' 
  | '헬스케어·고령화' 
  | '방위·사이버보안' 
  | '배당·인컴' 
  | '기타';

export type RiskProfile = '안정형' | '균형형' | '성장형' | '인컴형';

export interface AssetRow {
  id: string;
  accountType: AccountType;
  assetCategory: AssetCategory;
  sectorTag: SectorTag;
  amount: number;
  memo: string;
}

export interface UserProfile {
  name: string;
  age: number;
  retirementAge: number;
  monthlyContribution: number;
  mainGoal: string;
  investmentExperience: '없음' | '조금 있음' | '보통' | '많음';
  riskTolerance: '-5%' | '-10%' | '-20%' | '-30% 이상';
  disclaimerAccepted: boolean;
}

export interface DiagnosisResult {
  title: string;
  description: string;
  severity: '양호' | '주의' | '위험';
}

export interface TargetPortfolioItem {
  assetClass: string;
  percent: number;
  reason: string;
}

export interface SectorGuideItem {
  sector: string;
  recommendedRange: string;
  maxPercent: number;
  role: string;
  rationale: string;
  warning: string;
}

export interface ConsultationResult {
  riskProfile: RiskProfile;
  riskScore: number;
  retirementYears: number;
  headline: string;
  diagnosis: DiagnosisResult[];
  currentAllocationComment: string;
  targetPortfolio: TargetPortfolioItem[];
  sectorGuide: SectorGuideItem[];
  rebalancingSteps: string[];
  accountChecklist: string[];
  customerScript: string;
  disclaimer: string;
}

export interface SavedConsultation extends ConsultationResult {
  id: number;
  createdAt: string;
  customerName: string;
  age: number;
  retirementAge: number;
  retirementYears: number;
  monthlyContribution: number;
  mainGoal: string;
  totalAssets: number;
  aiModel: string;
  assets?: AssetRow[];
}
