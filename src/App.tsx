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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'consult' ? (
          <div className="space-y-8 pb-20">
            {/* Input Section */}
            {!result && !loading && (
              <div className="animate-in fade-in duration-500">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">내 연금 정보 입력</h2>
                  <ProfileForm 
                    profile={profile} 
                    onChange={(updates) => setProfile({ ...profile, ...updates })} 
                  />
                  <AssetInputTable 
                    assets={assets} 
                    onAdd={handleAddAsset} 
                    onRemove={handleRemoveAsset} 
                    onChange={handleChangeAsset} 
                  />
                </div>

                <DisclaimerBox 
                  accepted={profile.disclaimerAccepted} 
                  onToggle={() => setProfile({ ...profile, disclaimerAccepted: !profile.disclaimerAccepted })} 
                />

                {error && <ErrorBox message={error} />}

                <button
                  onClick={handleStartAnalysis}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl text-lg font-black shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all"
                >
                  AI 포트폴리오 상담 시작하기
                </button>
              </div>
            )}

            {/* Loading Section */}
            {loading && (
              <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                <LoadingSpinner message="Gemini 3 Flash가 연금 포트폴리오를 분석 중입니다..." />
              </div>
            )}

            {/* Result Section */}
            {result && !loading && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">상담 결과</h2>
                  <button
                    onClick={() => { setResult(null); setError(null); }}
                    className="text-sm font-bold text-gray-400 hover:text-gray-600"
                  >
                    새로 상담하기
                  </button>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PortfolioChart title="현재 자산 배분" data={getCurrentAllocation(assets)} />
                  <PortfolioChart 
                    title="추천 목표 포트폴리오" 
                    data={result.targetPortfolio.map(item => ({ name: item.assetClass, value: item.percent }))} 
                  />
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

                <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg">
                  <h3 className="text-lg font-bold mb-3">고객 응대용 3문장 요약</h3>
                  <p className="text-sm leading-relaxed opacity-90 italic">
                    "{result.customerScript}"
                  </p>
                </div>

                <button
                  onClick={() => { setResult(null); setError(null); }}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl text-lg font-bold hover:bg-black transition-colors"
                >
                  다른 자산으로 다시 상담하기
                </button>
              </div>
            )}
          </div>
        ) : (
          /* History Tab */
          <div className="animate-in fade-in duration-500 pb-20">
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
      <footer className="py-8 text-center text-gray-400 text-[10px]">
        &copy; 2026 연금부자서비스. All rights reserved.<br/>
        본 서비스는 Gemini 3 Flash 인공지능 모델을 사용합니다.
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
