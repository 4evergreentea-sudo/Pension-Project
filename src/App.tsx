import { useState, useEffect, useCallback } from 'react';
import type { UserProfile, AssetRow, ConsultationResult, SavedConsultation } from './types';
import { calculateRiskProfile, getModelPortfolio, getCurrentAllocation } from './utils/portfolioEngine';
import { validateProfile, validateAssets } from './utils/validation';
import { fetchConsultation } from './lib/gemini';
import { saveConsultation, fetchConsultationHistory } from './lib/supabase';
import { downloadConsultationsAsCSV } from './lib/csv';

// Components
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import { DisclaimerBox } from './components/DisclaimerBox';
import { ProfileForm } from './components/ProfileForm';
import { AssetInputTable } from './components/AssetInputTable';
import { PortfolioChart } from './components/PortfolioChart';
import { ResultCards } from './components/ResultCards';
import { SectorGuide } from './components/SectorGuide';
import { RebalancingSteps } from './components/RebalancingSteps';
import { ConsultationHistory } from './components/ConsultationHistory';
import { ConsultationDetailModal } from './components/ConsultationDetailModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBox } from './components/ErrorBox';

function App() {
  const [activeTab, setActiveTab] = useState<'consult' | 'history'>('consult');
  
  // Profile State
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 0,
    retirementAge: 0,
    monthlyContribution: 0,
    mainGoal: '은퇴자금 성장',
    investmentExperience: '보통',
    riskTolerance: '-10%',
    disclaimerAccepted: false,
  });

  // Assets State
  const [assets, setAssets] = useState<AssetRow[]>([]);

  // Result State
  const [result, setResult] = useState<ConsultationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // History State
  const [history, setHistory] = useState<SavedConsultation[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<SavedConsultation | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Load history on mount or tab change
  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const data = await fetchConsultationHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab, loadHistory]);

  const handleAddAsset = () => {
    const newAsset: AssetRow = {
      id: Math.random().toString(36).substr(2, 9),
      accountType: 'DC',
      assetCategory: '글로벌코어주식',
      sectorTag: '없음',
      amount: 0,
      memo: '',
    };
    setAssets([...assets, newAsset]);
  };

  const handleRemoveAsset = (id: string) => {
    setAssets(assets.filter((a) => a.id !== id));
  };

  const handleChangeAsset = (id: string, updates: Partial<AssetRow>) => {
    setAssets(assets.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const handleStartAnalysis = async () => {
    setError(null);
    const profileError = validateProfile(profile);
    if (profileError) {
      setError(profileError);
      return;
    }
    const assetError = validateAssets(assets);
    if (assetError) {
      setError(assetError);
      return;
    }

    setLoading(true);
    try {
      // 1. Heuristic Engine
      const { profile: riskProfile } = calculateRiskProfile(profile);
      const modelPortfolio = getModelPortfolio(riskProfile);
      const currentAlloc = getCurrentAllocation(assets);

      // 2. Gemini API Call
      const aiResult = await fetchConsultation(profile, assets, riskProfile, modelPortfolio);
      setResult(aiResult);

      // 3. Save to Supabase
      try {
        await saveConsultation(profile, assets, aiResult, currentAlloc);
        // Toast can be added here
      } catch (dbErr) {
        console.error('Failed to save to Supabase:', dbErr);
        // We still show the result even if saving fails, but alert the user
        alert(`상담 결과 저장에 실패했습니다: ${dbErr instanceof Error ? dbErr.message : 'Unknown error'}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '상담 중 알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToInput = () => {
    document.getElementById('input-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--color-kb-bg)] flex flex-col font-sans">
      <Header />
      
      {/* Hero Banner Section */}
      <div className="bg-white border-b border-gray-100 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 py-10 sm:py-16 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4 text-center sm:text-left">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-[1.2]">
              개인형IRP <br className="hidden sm:block" />
              하시나요?
            </h2>
            <p className="text-gray-500 text-sm sm:text-base font-medium leading-relaxed">
              소득이 있는 국민 누구나<br/>
              연말정산부터 퇴직연금까지 한번에!
            </p>
            <div className="pt-2">
              <button 
                onClick={scrollToInput}
                className="kb-button-primary shadow-lg shadow-[#FFCC00]/30 px-8"
              >
                나만의 연금 진단받기
              </button>
            </div>
          </div>
          <div className="flex-1 flex justify-center sm:justify-end relative">
            <div className="w-72 h-72 sm:w-96 sm:h-96 relative z-10">
              <img 
                src="/hero-ghibli.png" 
                alt="KB Pension Ghibli Hero" 
                className="w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white"
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[var(--color-kb-gold)]/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab === 'consult' ? (
          <div className="space-y-8 pb-20">
            {/* Input Section */}
            {!result && !loading && (
              <div id="input-section" className="fade-in">
                <div className="kb-card p-6 sm:p-10 mb-8">
                  <div className="flex items-center space-x-2 mb-8">
                    <div className="w-1.5 h-6 bg-[var(--color-kb-gold)] rounded-full"></div>
                    <h2 className="text-xl font-bold text-gray-900">내 연금 정보 입력</h2>
                  </div>
                  <ProfileForm 
                    profile={profile} 
                    onChange={(updates) => setProfile({ ...profile, ...updates })} 
                  />
                  <div className="mt-10">
                    <AssetInputTable 
                      assets={assets} 
                      onAdd={handleAddAsset} 
                      onRemove={handleRemoveAsset} 
                      onChange={handleChangeAsset} 
                    />
                  </div>
                </div>

                <DisclaimerBox 
                  accepted={profile.disclaimerAccepted} 
                  onToggle={() => setProfile({ ...profile, disclaimerAccepted: !profile.disclaimerAccepted })} 
                />

                {error && <ErrorBox message={error} />}

                <div className="mt-10">
                  <button
                    onClick={handleStartAnalysis}
                    className="kb-button-primary w-full text-lg py-5 shadow-xl shadow-[#FFCC00]/20"
                  >
                    AI 포트폴리오 상담 시작하기
                  </button>
                </div>
              </div>
            )}

            {/* Loading Section */}
            {loading && (
              <div className="kb-card p-12 flex flex-col items-center justify-center min-h-[400px]">
                <LoadingSpinner message="Gemini 3 Flash가 연금 포트폴리오를 분석 중입니다..." />
              </div>
            )}

            {/* Result Section */}
            {result && !loading && (
              <div className="fade-in space-y-10">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-6 bg-[var(--color-kb-gold)] rounded-full"></div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">상담 결과</h2>
                  </div>
                  <button
                    onClick={() => { setResult(null); setError(null); }}
                    className="text-sm font-bold text-gray-400 hover:text-[var(--color-kb-gold-dark)] transition-colors"
                  >
                    새로 상담하기
                  </button>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="kb-card p-6">
                    <PortfolioChart title="현재 자산 배분" data={getCurrentAllocation(assets)} />
                  </div>
                  <div className="kb-card p-6">
                    <PortfolioChart 
                      title="추천 목표 포트폴리오" 
                      data={result.targetPortfolio.map(item => ({ name: item.assetClass, value: item.percent }))} 
                    />
                  </div>
                </div>

                <ResultCards 
                  headline={result.headline} 
                  riskProfile={result.riskProfile} 
                  diagnosis={result.diagnosis} 
                  targetPortfolio={result.targetPortfolio} 
                />

                <SectorGuide guide={result.sectorGuide} />

                <RebalancingSteps 
                  steps={result.rebalancingSteps} 
                  checklist={result.accountChecklist} 
                />

                <div className="bg-[var(--color-kb-dark)] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-kb-gold)] opacity-10 rounded-full -mr-16 -mt-16"></div>
                  <h3 className="text-lg font-bold mb-4 text-[var(--color-kb-gold)]">고객 응대용 3문장 요약</h3>
                  <p className="text-base leading-relaxed opacity-90 italic">
                    "{result.customerScript}"
                  </p>
                </div>

                <button
                  onClick={() => { setResult(null); setError(null); }}
                  className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-full text-lg font-bold hover:bg-gray-50 transition-all shadow-sm"
                >
                  다른 자산으로 다시 상담하기
                </button>
              </div>
            )}
          </div>
        ) : (
          /* History Tab */
          <div className="fade-in pb-20">
            {historyLoading ? (
              <div className="py-20 flex justify-center"><LoadingSpinner /></div>
            ) : (
              <ConsultationHistory 
                history={history} 
                onViewDetail={setSelectedHistory} 
                onDownloadCSV={() => downloadConsultationsAsCSV(history)} 
                onRefresh={loadHistory}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer / Copyright */}
      <footer className="py-12 border-t border-gray-200 text-center text-gray-400 text-[11px] leading-relaxed">
        &copy; 2026 연금부자서비스. All rights reserved.<br/>
        본 서비스는 KB국민은행의 공식 서비스가 아닌 교육/실습용 MVP 프로젝트입니다.<br/>
        Google Gemini 3 Flash 인공지능 모델을 사용합니다.
      </footer>

      {/* Modal */}
      {selectedHistory && (
        <ConsultationDetailModal 
          consultation={selectedHistory} 
          onClose={() => setSelectedHistory(null)} 
        />
      )}
    </div>
  );
}

export default App;
