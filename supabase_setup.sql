DROP TABLE IF EXISTS portfolio_assets CASCADE;
DROP TABLE IF EXISTS portfolio_consultations CASCADE;
DROP TABLE IF EXISTS sector_scores CASCADE;

CREATE TABLE portfolio_consultations (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  customer_name text NOT NULL,
  age integer NOT NULL,
  retirement_age integer NOT NULL,
  retirement_years integer NOT NULL,
  monthly_contribution numeric DEFAULT 0,
  main_goal text NOT NULL,
  risk_score integer DEFAULT 0,
  risk_profile text NOT NULL,
  total_assets numeric NOT NULL DEFAULT 0,
  current_allocation jsonb NOT NULL DEFAULT '[]'::jsonb,
  target_portfolio jsonb NOT NULL DEFAULT '[]'::jsonb,
  sector_guide jsonb NOT NULL DEFAULT '[]'::jsonb,
  diagnosis jsonb NOT NULL DEFAULT '[]'::jsonb,
  rebalancing_steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  account_checklist jsonb NOT NULL DEFAULT '[]'::jsonb,
  headline text,
  current_allocation_comment text,
  customer_script text,
  disclaimer text,
  disclaimer_accepted boolean NOT NULL DEFAULT false,
  ai_model text NOT NULL DEFAULT 'gemini-3-flash-preview',
  ai_raw_response text
);

CREATE TABLE portfolio_assets (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  consultation_id bigint NOT NULL REFERENCES portfolio_consultations(id) ON DELETE CASCADE,
  account_type text NOT NULL,
  asset_category text NOT NULL,
  sector_tag text,
  amount numeric NOT NULL CHECK (amount >= 0),
  memo text
);

CREATE TABLE sector_scores (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  name text NOT NULL UNIQUE,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  role text,
  risk text,
  is_demo boolean NOT NULL DEFAULT true
);

CREATE INDEX idx_portfolio_consultations_created_at
ON portfolio_consultations(created_at DESC);

CREATE INDEX idx_portfolio_assets_consultation_id
ON portfolio_assets(consultation_id);

INSERT INTO sector_scores (name, score, role, risk, is_demo) VALUES
('AI·반도체', 88, '장기 성장 위성자산', '고평가, 특정 기업 집중, 반도체 사이클', true),
('데이터센터·전력망·에너지 인프라', 84, 'AI 성장의 2차 수혜 및 실물 인프라', '금리 민감도, 규제, 에너지 가격', true),
('헬스케어·고령화', 80, '경기 방어와 장기 성장의 중간 성격', '임상 실패, 약가 규제, 특허 만료', true),
('방위·사이버보안', 76, '지정학 리스크와 디지털 보안 수요 대응', '정책 변화, 윤리 논란, 변동성', true),
('배당·인컴', 72, '은퇴 준비 및 현금흐름 보완', '배당 삭감, 금리 변화', true);

ALTER TABLE portfolio_consultations DISABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_assets DISABLE ROW LEVEL SECURITY;
ALTER TABLE sector_scores DISABLE ROW LEVEL SECURITY;
