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
import { ProfileForm } from './components/ProfileForm';
import { AssetInputTable } from './components/AssetInputTable';
import { PortfolioChart } from './components/PortfolioChart';
import { SectorGuide } from './components/SectorGuide';
import { RebalancingSteps } from './components/RebalancingSteps';
import { AccountChecklist } from './components/AccountChecklist';
import { CustomerScript } from './components/CustomerScript';
import { ConsultationHistory } from './components/ConsultationHistory';
import { ConsultationDetailModal } from './components/ConsultationDetailModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBox } from './components/ErrorBox';

// Premium Palette Shared across charts and tables
const COLORS = [
  '#FFCC00', // KB Gold
  '#333333', // KB Deep Gray
  '#FF9900', // Orange Accent
  '#555555', // Medium Gray
  '#FFD633', // Light Gold
  '#1A1A1A', // Near Black
  '#FFB300', // Amber Gold
  '#777777', // Light Gray
];

function App() {
  const [activeTab, setActiveTab] = useState<'consult' | 'history'>('consult');
  
  // Profile State
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 40,
    retirementAge: 60,
    monthlyContribution: 1000000,
    mainGoal: '안정적인 노후 자금 마련',
    investmentExperience: '보통',
    riskTolerance: '-10%',
    disclaimerAccepted: false,
  });

  // Assets State
  const [assets, setAssets] = useState<AssetRow[]>([]);
  
  // Analysis State
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConsultationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // History State
  const [history, setHistory] = useState<SavedConsultation[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<SavedConsultation | null>(null);

  // Load history from Supabase
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
      // Calculate heuristic diagnosis for AI context
      const { profile: heuristicRisk } = calculateRiskProfile(profile);
      const heuristicTarget = getModelPortfolio(heuristicRisk);
      const currentAllocation = getCurrentAllocation(assets);

      const consultationResult = await fetchConsultation(
        profile, 
        assets, 
        heuristicRisk, 
        heuristicTarget
      );
      setResult(consultationResult);
      
      // Save to Supabase (non-blocking)
      saveConsultation(profile, assets, consultationResult, currentAllocation).catch(err => {
        console.error('Failed to save consultation:', err);
      });
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || '상담 결과를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9F7F0] font-sans text-gray-900 selection:bg-[var(--color-kb-gold)] selection:text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="mt-8">
          {activeTab === 'consult' ? (
            <div className="space-y-12">
              {!result && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-8 space-y-12 pb-20">
                    <section id="profile-section" className="scroll-mt-32">
                      <ProfileForm 
                        profile={profile} 
                        onChange={(updates) => setProfile(prev => ({ ...prev, ...updates }))} 
                      />
                    </section>

                    <section id="asset-section" className="scroll-mt-32">
                      <AssetInputTable 
                        assets={assets} 
                        onChange={(id, updates) => setAssets(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))} 
                        onAdd={() => setAssets(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), accountType: 'DC', assetCategory: '원리금보장·예금', sectorTag: '없음', amount: 0, memo: '' }])}
                        onRemove={(id) => setAssets(prev => prev.filter(a => a.id !== id))}
                      />
                    </section>
                  </div>

                  <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col space-y-8">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#FFFDE7] rounded-2xl flex items-center justify-center text-xl">💡</div>
                        <h3 className="text-xl font-black text-gray-800 tracking-tight">분석 시작하기</h3>
                      </div>
                      
                      {error && <ErrorBox message={error} />}

                      <div className="space-y-4">
                        <div className="flex items-start space-x-3 bg-white p-4 rounded-2xl border border-gray-100">
                          <div className="pt-1">
                            <input
                              id="consent"
                              type="checkbox"
                              checked={profile.disclaimerAccepted}
                              onChange={(e) => setProfile({ ...profile, disclaimerAccepted: e.target.checked })}
                              className="w-5 h-5 rounded border-gray-300 text-[var(--color-kb-gold)] focus:ring-[var(--color-kb-gold)] cursor-pointer"
                            />
                          </div>
                          <label htmlFor="consent" className="cursor-pointer">
                            <span className="block text-xs font-black text-gray-700 leading-snug">[필수] 투자 유의사항 동의</span>
                            <button 
                              onClick={() => setShowDisclaimerModal(true)}
                              className="inline-block text-[10px] font-bold text-gray-400 border-b border-gray-200 mt-1"
                            >
                              상세내용 보기
                            </button>
                          </label>
                        </div>

                        <button
                          onClick={handleStartAnalysis}
                          disabled={loading || !profile.disclaimerAccepted}
                          className={`w-full py-6 text-lg font-black rounded-[1.5rem] transition-all duration-300 flex flex-col items-center justify-center space-y-1 ${
                            !profile.disclaimerAccepted 
                              ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                              : 'bg-[var(--color-kb-dark)] text-[var(--color-kb-gold)] shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.2)] hover:-translate-y-1'
                          }`}
                        >
                          {loading ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 border-2 border-[var(--color-kb-gold)] border-t-transparent rounded-full animate-spin"></div>
                              <span>분석 중...</span>
                            </div>
                          ) : (
                            <>
                              <span className="text-base">진단 리포트 생성</span>
                              <span className="text-[10px] opacity-60 font-medium tracking-tight">AI 코칭 리포트 받기</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[var(--color-kb-gold)] to-[#FFCC00] p-8 rounded-[2.5rem] shadow-xl text-[var(--color-kb-dark)]">
                      <p className="text-[11px] font-black uppercase tracking-widest opacity-60 mb-2">My Service Status</p>
                      <h4 className="text-2xl font-black leading-tight">프리미엄 AI<br/>포트폴리오 진단</h4>
                    </div>
                  </div>
                </div>
              )}

              {result && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8 pb-20">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
                    <div>
                      <h2 className="text-3xl font-black text-[var(--color-kb-dark)] tracking-tighter flex items-center space-x-3">
                        <span className="w-2 h-8 bg-gradient-to-b from-[var(--color-kb-gold)] to-[var(--color-kb-gold-dark)] rounded-full"></span>
                        <span>상담 결과 리포트</span>
                      </h2>
                      <p className="text-gray-500 font-bold mt-2 ml-5 text-sm">AI가 분석한 고객님의 최적 연금 포트폴리오입니다.</p>
                    </div>
                    <button 
                      onClick={() => setResult(null)}
                      className="px-6 py-3 bg-white border-2 border-gray-100 text-gray-500 font-black rounded-2xl hover:border-[var(--color-kb-gold)] hover:text-[var(--color-kb-gold-dark)] transition-all shadow-sm hover:shadow-md flex items-center space-x-2 w-fit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      <span>새로 상담하기</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
                      <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.08)] border border-gray-50 space-y-10">
                        <PortfolioChart title="현재 자산 배분" data={getCurrentAllocation(assets)} />
                        <div className="border-t border-dashed border-gray-100"></div>
                        <PortfolioChart 
                          title="추천 목표 포트폴리오" 
                          data={result.targetPortfolio.map(item => ({ name: item.assetClass, value: item.percent }))} 
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-[var(--color-kb-dark)] to-[#444] p-6 rounded-[2rem] text-white shadow-xl">
                          <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">위험 성향</p>
                          <p className="text-xl font-black text-[var(--color-kb-gold)]">{calculateRiskProfile(profile).profile}</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-lg">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">분석 정확도</p>
                          <p className="text-xl font-black text-[var(--color-kb-dark)]">Premium AI</p>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-7 space-y-8">
                      <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-50">
                        <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center space-x-2">
                          <span className="text-2xl">✨</span>
                          <span>AI 종합 진단 총평</span>
                        </h3>
                        <div className="space-y-6">
                          {result.diagnosis.map((diag, i) => (
                            <div key={i} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                              <h4 className="font-black text-gray-800 mb-2 flex items-center space-x-2">
                                <span className={`w-2 h-2 rounded-full ${diag.severity === '위험' ? 'bg-red-500' : diag.severity === '주의' ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                                <span>{diag.title}</span>
                              </h4>
                              <p className="text-sm font-bold text-gray-600 leading-relaxed">{diag.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-50">
                        <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center space-x-2">
                          <span className="text-2xl">📊</span>
                          <span>상세 포트폴리오 구성</span>
                        </h3>
                        <div className="overflow-hidden rounded-2xl border border-gray-50">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">자산군</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">비중</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">설명</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {result.targetPortfolio.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                                  <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                      <span className="text-xs font-black text-gray-700">{item.assetClass}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <span className="text-sm font-black text-[var(--color-kb-dark)] bg-[#FFFDE7] px-3 py-1 rounded-lg">
                                      {item.percent}%
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <p className="text-[10px] text-gray-500 font-medium leading-tight max-w-[200px]">
                                      {item.reason}
                                    </p>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <details className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-md overflow-hidden" open>
                          <summary className="flex items-center justify-between p-8 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                            <h3 className="text-lg font-black text-gray-800 flex items-center space-x-3">
                              <span className="w-8 h-8 bg-[#E3F2FD] rounded-xl flex items-center justify-center text-sm">🔄</span>
                              <span>단계별 리밸런싱 가이드</span>
                            </h3>
                            <span className="transition-transform duration-300 group-open:rotate-180">
                              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                            </span>
                          </summary>
                          <div className="px-8 pb-8 animate-in fade-in duration-500">
                            <RebalancingSteps steps={result.rebalancingSteps} />
                          </div>
                        </details>

                        <details className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-md overflow-hidden" open>
                          <summary className="flex items-center justify-between p-8 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                            <h3 className="text-lg font-black text-gray-800 flex items-center space-x-3">
                              <span className="w-8 h-8 bg-[#E8F5E9] rounded-xl flex items-center justify-center text-sm">✅</span>
                              <span>계좌별 최종 체크리스트</span>
                            </h3>
                            <span className="transition-transform duration-300 group-open:rotate-180">
                              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                            </span>
                          </summary>
                          <div className="px-8 pb-8 animate-in fade-in duration-500">
                            <AccountChecklist checklist={result.accountChecklist} />
                          </div>
                        </details>

                        <details className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-md overflow-hidden">
                          <summary className="flex items-center justify-between p-8 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                            <h3 className="text-lg font-black text-gray-800 flex items-center space-x-3">
                              <span className="w-8 h-8 bg-[#FFF3E0] rounded-xl flex items-center justify-center text-sm">🗺️</span>
                              <span>섹터별 투자 가이드</span>
                            </h3>
                            <span className="transition-transform duration-300 group-open:rotate-180">
                              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                            </span>
                          </summary>
                          <div className="px-8 pb-8 animate-in fade-in duration-500">
                            <SectorGuide guide={result.sectorGuide} />
                          </div>
                        </details>
                      </div>
                      
                      <CustomerScript script={result.customerScript} />

                      <div className="pt-8 text-center">
                        <button 
                          onClick={() => { setResult(null); setError(null); }}
                          className="group relative inline-flex items-center justify-center px-12 py-5 font-black text-white transition-all duration-300 bg-[var(--color-kb-dark)] rounded-[2rem] hover:bg-black shadow-2xl hover:-translate-y-1"
                        >
                          <span className="mr-3 text-lg">새로운 진단 시작하기</span>
                          <svg className="w-6 h-6 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </button>
                        <p className="mt-8 text-[11px] text-gray-400 font-medium leading-relaxed">
                          ※ 본 리포트는 입력하신 데이터를 바탕으로 생성된 인공지능 기반의 참고용 자료입니다.<br/>
                          실제 투자 시 원금 손실이 발생할 수 있으며, 최종 의사결정은 고객 본인의 책임하에 이루어져야 합니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
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
      </div>

      <footer className="py-12 border-t border-gray-200 text-center text-gray-400 text-[11px] leading-relaxed">
        &copy; 2026 연금부자서비스. All rights reserved.<br/>
        본 서비스는 KB국민은행의 공식 서비스가 아닌 교육/실습용 MVP 프로젝트입니다.<br/>
        Google Gemini 3 Flash 인공지능 모델을 사용합니다.
      </footer>

      {showDisclaimerModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">투자 유의사항 안내</h2>
              <button onClick={() => setShowDisclaimerModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar text-sm text-gray-600 font-bold leading-relaxed space-y-6">
              <div className="bg-[#FFFDE7] p-6 rounded-2xl border border-amber-100">
                <p className="text-amber-800 font-black mb-2">⚠️ 필독 사항</p>
                본 연금 분석 리포트는 입력하신 데이터를 바탕으로 생성된 인공지능 기반의 참고용 자료입니다.
              </div>
              <p>1. 투자에 따른 결과는 투자자 본인에게 귀속됩니다.</p>
              <p>2. 과거의 성과가 미래의 수익을 보장하지 않습니다.</p>
              <p>3. 시장 상황에 따라 제안된 포트폴리오는 변경될 수 있습니다.</p>
              <p>4. 실제 상품 가입 전에는 반드시 해당 금융기관의 약관 및 상품 설명서를 확인하시기 바랍니다.</p>
            </div>
            <div className="p-8 bg-gray-50/50 border-t border-gray-50 text-center">
              <button 
                onClick={() => {
                  setProfile({ ...profile, disclaimerAccepted: true });
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
