import { createClient } from '@supabase/supabase-js';
import type { UserProfile, AssetRow, ConsultationResult, SavedConsultation } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase 환경변수가 설정되지 않았습니다.');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export const saveConsultation = async (
  profile: UserProfile,
  assets: AssetRow[],
  result: ConsultationResult,
  currentAllocation: any
) => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase 환경변수가 설정되지 않아 저장할 수 없습니다.');
  }

  const totalAssets = assets.reduce((sum, a) => sum + a.amount, 0);

  // 1. consultations 테이블 저장
  const { data: consultation, error: consultationError } = await supabase
    .from('portfolio_consultations')
    .insert({
      customer_name: profile.name,
      age: profile.age,
      retirement_age: profile.retirementAge,
      retirement_years: result.retirementYears,
      monthly_contribution: profile.monthlyContribution,
      main_goal: profile.mainGoal,
      risk_score: result.riskScore,
      risk_profile: result.riskProfile,
      total_assets: totalAssets,
      current_allocation: currentAllocation,
      target_portfolio: result.targetPortfolio,
      sector_guide: result.sectorGuide,
      diagnosis: result.diagnosis,
      rebalancing_steps: result.rebalancingSteps,
      account_checklist: result.accountChecklist,
      headline: result.headline,
      current_allocation_comment: result.currentAllocationComment,
      customer_script: result.customerScript,
      disclaimer: result.disclaimer,
      disclaimer_accepted: profile.disclaimerAccepted,
      ai_model: 'gemini-3-flash-preview'
    })
    .select()
    .single();

  if (consultationError) throw consultationError;

  // 2. assets 테이블 벌크 저장
  const assetInserts = assets.map(a => ({
    consultation_id: consultation.id,
    account_type: a.accountType,
    asset_category: a.assetCategory,
    sector_tag: a.sectorTag,
    amount: a.amount,
    memo: a.memo
  }));

  const { error: assetsError } = await supabase
    .from('portfolio_assets')
    .insert(assetInserts);

  if (assetsError) throw assetsError;

  return consultation;
};

export const fetchConsultationHistory = async (): Promise<SavedConsultation[]> => {
  const { data, error } = await supabase
    .from('portfolio_consultations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data.map(d => ({
    id: d.id,
    createdAt: d.created_at,
    customerName: d.customer_name,
    age: d.age,
    retirementAge: d.retirement_age,
    retirementYears: d.retirement_years,
    monthlyContribution: d.monthly_contribution,
    mainGoal: d.main_goal,
    riskScore: d.risk_score,
    riskProfile: d.risk_profile,
    totalAssets: Number(d.total_assets),
    currentAllocation: d.current_allocation,
    targetPortfolio: d.target_portfolio,
    sectorGuide: d.sector_guide,
    diagnosis: d.diagnosis,
    rebalancingSteps: d.rebalancing_steps,
    accountChecklist: d.account_checklist,
    headline: d.headline,
    currentAllocationComment: d.current_allocation_comment,
    customerScript: d.customer_script,
    disclaimer: d.disclaimer,
    aiModel: d.ai_model
  })) as SavedConsultation[];
};

export const fetchConsultationAssets = async (consultationId: number): Promise<AssetRow[]> => {
  const { data, error } = await supabase
    .from('portfolio_assets')
    .select('*')
    .eq('consultation_id', consultationId);

  if (error) throw error;
  
  return data.map(d => ({
    id: d.id.toString(),
    accountType: d.account_type,
    assetCategory: d.asset_category,
    sectorTag: d.sector_tag,
    amount: Number(d.amount),
    memo: d.memo
  })) as AssetRow[];
};
