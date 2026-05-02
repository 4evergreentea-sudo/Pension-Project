import { GoogleGenAI } from '@google/genai';
import type { UserProfile, AssetRow, ConsultationResult, RiskProfile, TargetPortfolioItem } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = 'gemini-3-flash-preview';

if (!API_KEY) {
  console.warn('환경변수 VITE_GEMINI_API_KEY가 설정되지 않았습니다.');
}

// SDK 초기화
const ai = new GoogleGenAI({ apiKey: API_KEY || '' });

export const fetchConsultation = async (
  profile: UserProfile,
  assets: AssetRow[],
  heuristicRisk: RiskProfile,
  heuristicTarget: TargetPortfolioItem[]
): Promise<ConsultationResult> => {
  if (!API_KEY) {
    throw new Error('환경변수 VITE_GEMINI_API_KEY가 설정되지 않았습니다.');
  }

  const totalAssets = assets.reduce((sum, a) => sum + a.amount, 0);
  const assetSummary = assets
    .map((a) => `- ${a.accountType} | ${a.assetCategory} | ${a.sectorTag} | ${a.amount.toLocaleString()}원 | ${a.memo}`)
    .join('\n');

  const prompt = `
당신은 노후를 준비하는 사용자를 돕는 전문 연금 투자 코치입니다. 
사용자가 입력한 정보와 프론트엔드 휴리스틱 엔진의 1차 진단 결과를 바탕으로 심층적인 연금 포트폴리오 상담 결과를 생성해주세요.

[고객 정보]
- 이름: ${profile.name}
- 나이: ${profile.age}세
- 은퇴 목표 나이: ${profile.retirementAge}세 (남은 기간: ${profile.retirementAge - profile.age}년)
- 월 추가 납입 가능액: ${profile.monthlyContribution.toLocaleString()}원
- 투자 목적: ${profile.mainGoal}
- 투자 경험: ${profile.investmentExperience}
- 감내 가능한 최대 손실: ${profile.riskTolerance}

[현재 자산 목록 (총액: ${totalAssets.toLocaleString()}원)]
${assetSummary}

[프론트엔드 엔진 진단 결과]
- 추천 위험성향: ${heuristicRisk}
- 기본 모델 포트폴리오: ${JSON.stringify(heuristicTarget)}

[지시 사항]
1. 위 데이터를 바탕으로 사용자의 현재 자산 배분의 문제점을 3가지 진단하십시오.
2. 프론트엔드 엔진이 제안한 모델 포트폴리오를 존중하되, 사용자의 투자 목적과 위험성향을 고려하여 세부적인 비중 조절 이유(reason)를 구체적으로 작성하십시오.
3. 유망 섹터(AI·반도체, 데이터센터, 헬스케어, 방위, 배당 등)에 대한 적정 편입 비중 가이드를 포함하십시오.
4. 리밸런싱을 위한 실행 단계를 3단계로 제안하십시오.
5. 모든 문장은 친절하고 신뢰감 있는 한국어로 작성하십시오.
6. 개별 주식명, 특정 매수/매도 지시, 수익률 보장 표현은 절대 금지합니다.

응답은 아래 JSON 형식으로만. 마크다운 코드블록이나 설명 텍스트 없이 순수 JSON만 출력.
targetPortfolio의 percent 합계는 반드시 100이 되도록 작성.

{
  "riskProfile": "${heuristicRisk}",
  "riskScore": 0,
  "retirementYears": ${profile.retirementAge - profile.age},
  "headline": "상담 결과 한 줄 요약",
  "diagnosis": [
    {
      "title": "진단 제목",
      "description": "진단 설명",
      "severity": "양호|주의|위험"
    }
  ],
  "currentAllocationComment": "현재 자산배분에 대한 짧은 코멘트",
  "targetPortfolio": [
    {
      "assetClass": "자산군 이름",
      "percent": 0,
      "reason": "이 비중을 제안하는 이유"
    }
  ],
  "sectorGuide": [
    {
      "sector": "섹터명",
      "recommendedRange": "예: 5~7%",
      "maxPercent": 7,
      "role": "포트폴리오 내 역할",
      "rationale": "추천 또는 제한 이유",
      "warning": "주의사항"
    }
  ],
  "rebalancingSteps": [
    "1단계 실행 가이드",
    "2단계 실행 가이드",
    "3단계 실행 가이드"
  ],
  "accountChecklist": [
    "IRP/DC 계좌에서는 위험자산 한도와 안전자산 기준을 확인하세요.",
    "연금저축에서는 ETF와 펀드의 총보수, 환헤지 여부, 위험등급을 확인하세요.",
    "실제 매수 가능 상품은 각 금융사 앱에서 최종 확인하세요."
  ],
  "customerScript": "고객에게 설명할 3문장 이내의 상담 스크립트",
  "disclaimer": "본 서비스는 투자 자문 또는 투자 일임 서비스가 아닌 정보 제공 목적입니다. 모든 투자 판단과 책임은 사용자 본인에게 있습니다."
}
`;

  try {
    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt
    });
    
    const responseText = result.text || '';
    
    // JSON 전처리: 마크다운 코드 블록 제거 및 공백 제거
    const cleanJson = responseText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    try {
      return JSON.parse(cleanJson) as ConsultationResult;
    } catch (parseError) {
      console.error('Gemini JSON Parsing Error:', parseError, 'Raw Response:', responseText);
      throw new Error(`Gemini JSON 파싱에 실패했습니다: ${parseError instanceof Error ? parseError.message : 'Unknown error'}\n\n[Raw Response Preview]\n${responseText.substring(0, 200)}...`);
    }
  } catch (apiError) {
    console.error('Gemini API Error:', apiError);
    throw apiError;
  }
};
