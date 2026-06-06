'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabaseClient';

export default function SubmitPage() {
  const [idea, setIdea] = useState('');
  const [industry, setIndustry] = useState('Artificial Intelligence / SaaS');
  const [stage, setStage] = useState('Idea Stage');
  const [roastLevel, setRoastLevel] = useState<'mild' | 'honest' | 'brutal'>('honest');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const loadingMessages = [
    'Deploying VC Analyst agent...',
    'Reviewing operational feasibility checklists...',
    'Scanning market database for competitors...',
    'Drafting highly critical investment memos...',
    'Brewing high-intensity coffee for the committee...',
    'Formulating brutal, non-legally binding insults...',
    'Writing the final checklist roadmap...'
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Loading screen text cycle effect
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    setLoadingStep(0);

    try {
      const res = await fetch('/api/analyze-startup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea,
          roastLevel,
          industry,
          stage
        })
      });

      if (!res.ok) {
        throw new Error('Analysis failed');
      }

      const reportJson = await res.json();
      
      // Save report in Supabase (falls back to localDb under the hood if missing keys)
      const reportData = {
        user_id: user?.id ?? null,
        idea,
        roast_level: roastLevel,
        industry,
        stage,
        report_json: reportJson,
        startup_score: reportJson.startupScore
      };

      const { data, error } = await supabase
        .from('startup_reports')
        .insert(reportData)
        .select();

      if (error) {
        throw error;
      }

      const savedReport = data?.[0];
      if (savedReport) {
        router.push(`/report/${savedReport.id}`);
      } else {
        // Fallback in case returning row failed
        router.push(`/report/temp-id`);
      }

    } catch (err) {
      console.error(err);
      alert('Failed to analyze startup. Please check your credentials or try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-6 max-w-md w-full relative z-10">
          <div className="text-4xl animate-bounce">🔥</div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Roasting in Progress</h2>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden relative">
              <div className="bg-gradient-to-r from-orange-600 to-amber-400 h-full w-2/3 rounded-full absolute left-0 top-0 animate-[shimmer_1.5s_infinite] origin-left" style={{ width: '40%' }}></div>
            </div>
          </div>
          
          <p className="text-sm text-slate-400 font-mono italic animate-pulse">
            “{loadingMessages[loadingStep]}”
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 py-16 relative">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-80 h-80 bg-orange-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="glass-card rounded-2xl p-6 md:p-8 glow-orange relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"></div>
          
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-orange-500/10 p-2 rounded-lg text-orange-500 text-xl font-bold">⚙️</div>
            <div>
              <h2 className="text-xl font-bold text-white">Analysis Engine Terminal</h2>
              <p className="text-xs text-slate-400">Configure parameters for deployment evaluation</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                The Startup Idea
              </label>
              <textarea
                rows={5}
                required
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                placeholder="Describe what you are building, who it's for, and how you plan to make money..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Industry / Vertical
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 focus:outline-none focus:border-orange-500"
                >
                  <option>Artificial Intelligence / SaaS</option>
                  <option>Fintech</option>
                  <option>B2B Enterprise</option>
                  <option>Web3 / Crypto</option>
                  <option>Developer Tools</option>
                  <option>Healthtech / Biotech</option>
                  <option>E-commerce / Consumer D2C</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Current Stage
                </label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 focus:outline-none focus:border-orange-500"
                >
                  <option>Idea Stage</option>
                  <option>MVP / Prototype Built</option>
                  <option>Launched (Early Traction)</option>
                  <option>Generating Revenue</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Roast Intensity Level
              </label>
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRoastLevel('mild')}
                  className={`py-2.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    roastLevel === 'mild'
                      ? 'bg-slate-900 border border-slate-800 text-slate-200 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ☕ Mild
                </button>
                <button
                  type="button"
                  onClick={() => setRoastLevel('honest')}
                  className={`py-2.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    roastLevel === 'honest'
                      ? 'bg-slate-900 border border-slate-700/60 text-orange-400 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ⚖️ Honest
                </button>
                <button
                  type="button"
                  onClick={() => setRoastLevel('brutal')}
                  className={`py-2.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    roastLevel === 'brutal'
                      ? 'bg-red-950/40 border border-red-800/60 text-red-400 font-bold shadow-sm animate-pulse'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🔥 Brutal
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-950/60 flex items-center justify-center space-x-2 group cursor-pointer"
            >
              <span>Generate Startup Roast & Memo</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
