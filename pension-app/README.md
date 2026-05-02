# 노후를 편안하게 연금부자서비스 (연금 투자 코치 v2)

사용자가 직접 입력한 연금 자산을 Gemini 3 Flash AI가 진단하고, 은퇴 시점·위험성향·계좌 유형을 고려한 장기 모델 포트폴리오와 유망 투자 섹터 비중을 제안하는 모바일 최적화 웹 서비스입니다.

## 1. 핵심 기능
- **연금자산 수기 입력**: 계좌 유형별(DC, IRP, 연금저축 등) 자산 현황 입력
- **AI 포트폴리오 진단**: Gemini 3 Flash 모델을 활용한 심층 진단 및 코칭
- **현재/목표 포트폴리오 차트**: Recharts 기반의 직관적인 비중 비교
- **유망 섹터 가이드**: AI·반도체, 헬스케어 등 섹터별 적정 편입 비중 제안
- **상담 이력 관리**: Supabase 연동을 통한 상담 내역 저장 및 다시 보기
- **CSV 다운로드**: 전체 상담 이력을 엑셀에서 확인 가능한 CSV 파일로 추출

## 2. 기술 스택
- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **AI Engine**: Gemini 3 Flash (`gemini-3-flash-preview`)
- **Backend/DB**: Supabase
- **Charts**: Recharts
- **Icons**: Lucide React

## 3. 로컬 실행 방법
```bash
# 의존성 설치
npm install

# 로컬 서버 실행
npm run dev
```

## 4. 환경변수 설정 (.env)
프로젝트 루트에 `.env` 파일을 생성하고 아래 내용을 입력합니다.
```env
VITE_GEMINI_API_KEY=AIzaSyD6KddpIOroI2aq-ek8CLGns6Q1KKDW_bE
VITE_SUPABASE_URL=https://ocnwcfeyzquchhtqlppq.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_6wZi3KBQW_eL0s4677jdKQ_v6VEGDeC
```

## 5. Supabase 설정 방법
1. Supabase 프로젝트를 생성합니다.
2. SQL Editor에서 프로젝트 루트의 `supabase_setup.sql` 파일 내용을 붙여넣고 실행(Run)합니다.
3. RLS는 실습용으로 비활성화되어 있으나, 프로덕션 배포 시에는 반드시 활성화하고 사용자별 정책을 설정해야 합니다.

## 6. Vercel 배포 방법
1. GitHub 저장소에 코드를 push합니다.
2. Vercel에서 `Import Project`를 선택합니다.
3. 아래 빌드 설정을 확인합니다.
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. 위 **환경변수 3종**을 Vercel 프로젝트 설정의 Environment Variables에 등록합니다.
5. `Deploy` 버튼을 클릭합니다.

## 7. 주의사항
- 본 서비스는 투자 자문이 아닌 정보 제공 목적의 MVP입니다.
- 개별 주식 종목 추천이나 실시간 매매 기능을 제공하지 않습니다.
- 모든 투자 판단과 책임은 사용자 본인에게 있습니다.
