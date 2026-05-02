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
      
      {/* New Hero Section: Focused Layout */}
      <div className="bg-white border-b border-gray-100 relative">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          {/* Top 40% Illustration Area */}
          <div className="w-full h-48 sm:h-64 flex justify-center items-center relative overflow-hidden py-10">
            <div className="absolute inset-0 bg-[var(--color-kb-gold)] opacity-5"></div>
            <div className="w-48 h-48 sm:w-64 sm:h-64 relative z-10 transition-transform hover:scale-105 duration-700">
              <img 
                src="/hero-ghibli.png" 
                alt="KB Pension Ghibli Hero" 
                className="w-full h-full object-cover rounded-full shadow-xl border-4 border-white"
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--color-kb-gold)]/20 rounded-full blur-3xl"></div>
          </div>

          {/* Text and Big Button Area */}
          <div className="w-full px-6 pt-4 pb-12 text-center space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 leading-tight">
                개인형 IRP 하시나요?
              </h2>
              <p className="text-gray-500 text-sm sm:text-base font-medium leading-relaxed">
                소득이 있는 국민 누구나<br/>
                연말정산부터 퇴직연금까지 한번에!
              </p>
            </div>
            
            <div className="pt-4 max-w-sm mx-auto">
              <button 
                onClick={scrollToInput}
                className="kb-button-primary w-full text-xl py-6 sm:py-7 rounded-2xl shadow-2xl shadow-[#FFCC00]/40 flex items-center justify-center space-x-2 active:scale-95 transition-all"
              >
                <span className="font-black">나만의 연금 진단받기</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>
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
                {/* Disclaimer and Consent Section */}
                <div className="mt-12 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-start space-x-3">
                      <div className="pt-1">
                        <input
                          id="consent"
                          type="checkbox"
                          checked={hasConsented}
                          onChange={(e) => setHasConsented(e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-[var(--color-kb-gold)] focus:ring-[var(--color-kb-gold)] cursor-pointer"
                        />
                      </div>
                      <label htmlFor="consent" className="cursor-pointer">
                        <span className="block text-sm font-black text-gray-800">[필수] 투자 유의사항 및 면책고지 동의</span>
                        <span className="block text-xs text-gray-400 mt-1">분석 결과는 참고용이며 실제 수익을 보장하지 않음에 동의합니다.</span>
                      </label>
                    </div>
                    <button 
                      onClick={() => setShowDisclaimerModal(true)}
                      className="text-xs font-bold text-gray-400 hover:text-[var(--color-kb-dark)] border-b border-gray-200 pb-0.5 transition-all"
                    >
                      자세히 보기
                    </button>
                  </div>

                  <div className="mt-10">
                    <button
                      onClick={handleAnalyze}
                      disabled={loading || !hasConsented}
                      className={`w-full py-6 text-xl font-black rounded-[2rem] transition-all duration-300 flex items-center justify-center space-x-3 ${
                        !hasConsented 
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed border-2 border-dashed border-gray-200' 
                          : 'bg-[var(--color-kb-dark)] text-[var(--color-kb-gold)] shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.3)] hover:-translate-y-1.5 active:scale-[0.98]'
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-6 h-6 border-3 border-[var(--color-kb-gold)] border-t-transparent rounded-full animate-spin"></div>
                          <span>리포트 생성 중...</span>
                        </>
                      ) : (
                        <>
                          <span>나만의 연금 투자 리포트 생성하기</span>
                          <svg className={`w-6 h-6 transition-transform ${hasConsented ? 'translate-x-1' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </button>
                    {!hasConsented && (
                      <p className="text-center text-xs text-amber-600 mt-4 font-bold animate-pulse">
                        ⚠️ 유의사항에 동의하시면 분석을 시작할 수 있습니다.
                      </p>
                    )}
                  </div>
                </div>

                {/* Disclaimer Modal */}
                {showDisclaimerModal && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                      <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                        <h3 className="text-lg font-black text-gray-800">투자 유의사항 및 면책고지</h3>
                        <button 
                          onClick={() => setShowDisclaimerModal(false)}
                          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <div className="p-8 overflow-y-auto max-h-[60vh] text-sm text-gray-600 leading-relaxed space-y-4">
                        <p className="font-bold text-gray-800">1. 서비스의 성격 및 책임 범위</p>
                        <p>본 서비스가 제공하는 분석 결과와 투자 포트폴리오 제안은 인공지능(AI) 기술을 기반으로 한 투자 참고용 정보이며, 금융투자상품의 매수 또는 매도를 권유하는 것이 아닙니다.</p>
                        <p className="font-bold text-gray-800">2. 투자 결과에 대한 책임</p>
                        <p>최종적인 투자 결정과 그로 인해 발생하는 모든 결과(손실 포함)에 대한 책임은 투자자 본인에게 있습니다. 과거의 수익률이 미래의 수익을 보장하지 않습니다.</p>
                        <p className="font-bold text-gray-800">3. 데이터의 정확성</p>
                        <p>제공되는 데이터와 분석 결과는 시장 상황에 따라 실시간으로 변동될 수 있으며, 실제 금융기관의 수치와 차이가 있을 수 있습니다. 정밀한 자산 관리를 위해서는 반드시 전문가와 상담하시기 바랍니다.</p>
                      </div>
                      <div className="p-8 bg-gray-50/50 border-t border-gray-50 text-center">
                        <button 
                          onClick={() => {
                            setHasConsented(true);
                            setShowDisclaimerModal(false);
                          }}
                          className="kb-button-primary px-12 py-4 rounded-xl font-black"
                        >
                          내용 확인 및 동의
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
