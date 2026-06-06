'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabaseClient';
import { generateMockReport, StartupReport } from '@/lib/mockReport';

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [user, setUser] = useState<any>(null);

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

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      try {
        if (id === 'sample-report-id' || id === 'temp-id') {
          // Load default sample report
          const sample = generateMockReport(
            'A marketplace matching AI agents with developers for minor coding tasks.',
            'honest',
            'Artificial Intelligence / SaaS',
            'Idea Stage'
          );
          setReportData({
            id,
            idea: 'A marketplace matching AI agents with developers for minor coding tasks.',
            roast_level: 'honest',
            industry: 'Artificial Intelligence / SaaS',
            stage: 'Idea Stage',
            report_json: sample,
            startup_score: sample.startupScore
          });
          setIsSaved(id === 'sample-report-id');
        } else {
          let report = null;
          try {
            const { data, error } = await supabase
              .from('startup_reports')
              .select('*')
              .eq('id', id)
              .single();
            
            if (!error && data) {
              report = data;
            }
          } catch (dbErr) {
            console.warn('DB single fetch failed. Checking LocalStorage fallback...', dbErr);
          }

          if (!report) {
            const { localDb } = require('@/lib/supabaseClient');
            const localReports = localDb.getReports();
            const found = localReports.find((r: any) => r.id === id);
            if (found) {
              report = found;
            }
          }

          if (!report) {
            throw new Error('Report not found');
          }

          setReportData(report);
          setIsSaved(true);
        }
      } catch (err) {
        console.error('Error fetching report:', err);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [id]);

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToAccount = async () => {
    if (!user) {
      // Direct them to auth to save it
      router.push('/auth');
      return;
    }

    if (id === 'sample-report-id' || id === 'temp-id') {
      try {
        const { error } = await supabase
          .from('startup_reports')
          .insert({
            user_id: user.id,
            idea: reportData.idea,
            roast_level: reportData.roast_level,
            industry: reportData.industry,
            stage: reportData.stage,
            report_json: reportData.report_json,
            startup_score: reportData.startup_score
          });

        if (error) throw error;
        setIsSaved(true);
        alert('Memo saved to your profile!');
      } catch (err) {
        console.error('Failed to save to account:', err);
      }
    }
  };

  const handleImprovePivot = () => {
    if (!reportData) return;
    const improvedIdeaText = reportData.report_json.improvedIdea;
    // Redirect to submit with improved idea in state/query
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('rms_prefill_idea', improvedIdeaText);
      router.push('/submit');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="text-xl font-mono text-slate-400 animate-pulse">Loading VC Memo...</div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-16 text-center space-y-6">
          <h2 className="text-2xl font-bold text-white">Investment Memo Not Found</h2>
          <p className="text-slate-400 text-sm">We couldn't retrieve the startup analysis report for this ID.</p>
          <Link href="/submit" className="inline-block bg-orange-600 hover:bg-orange-500 text-white px-6 py-2.5 rounded-lg text-sm font-semibold">
            Roast a New Startup
          </Link>
        </main>
      </>
    );
  }

  const report: StartupReport = reportData.report_json;

  return (
    <>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12 space-y-12">
        {/* Header Metadata */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-900 pb-6 gap-4">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-widest text-orange-500 font-bold">
              Generated Investment Analysis
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Project: {reportData.industry.split('/')[0].trim()} Starter
            </h2>
            <p className="text-xs text-slate-400 italic max-w-xl">
              Idea: "{reportData.idea}"
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>CONFIDENTIAL // VC MEMO STYLE v1.4</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="text-xs border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-300 font-semibold px-3 py-1.5 rounded transition-all cursor-pointer"
              >
                {copied ? 'Copied Link!' : 'Share Memo'}
              </button>
              {(id === 'sample-report-id' || id === 'temp-id') && !isSaved && (
                <button
                  onClick={handleSaveToAccount}
                  className="text-xs bg-orange-600 hover:bg-orange-500 text-white font-semibold px-3 py-1.5 rounded transition-all cursor-pointer"
                >
                  Save to Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="glass-card rounded-xl p-5 col-span-2 lg:col-span-1 flex flex-col justify-between border-l-4 border-l-orange-500">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Startup Score</span>
            <div className="my-3 flex items-baseline space-x-1">
              <span className="text-4xl font-black text-white">{report.startupScore}</span>
              <span className="text-sm text-slate-500">/100</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-1.5">
              <div
                className="bg-orange-500 h-1.5 rounded-full"
                style={{ width: `${report.startupScore}%` }}
              ></div>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-5 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Investor Readiness</span>
            <div className="my-3">
              <span className="text-3xl font-bold text-amber-400">{report.investorReadinessScore}</span>
              <span className="text-xs text-slate-500">/10</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium bg-slate-900/60 py-1 px-2 rounded border border-slate-800 w-max">
              {report.investorReadinessScore >= 8.0 ? 'Investor Ready' : report.investorReadinessScore >= 6.0 ? 'Needs Polish' : 'High Risk'}
            </span>
          </div>

          <div className="glass-card rounded-xl p-5 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Market Potential</span>
            <div className="my-3">
              <span className="text-3xl font-bold text-emerald-400">
                {report.startupScore > 70 ? 'High' : 'Medium'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium bg-slate-900/60 py-1 px-2 rounded border border-slate-800 w-max">
              Growth Segment
            </span>
          </div>

          <div className="glass-card rounded-xl p-5 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Execution Risk</span>
            <div className="my-3">
              <span className="text-3xl font-bold text-yellow-400">
                {report.startupScore > 80 ? 'Low' : report.startupScore > 60 ? 'Medium' : 'High'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium bg-slate-900/60 py-1 px-2 rounded border border-slate-800 w-max">
              Model Defensibility
            </span>
          </div>

          <div className="glass-card rounded-xl p-5 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">GTM Difficulty</span>
            <div className="my-3">
              <span className="text-3xl font-bold text-rose-500">
                {report.startupScore > 75 ? 'Medium' : 'High'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium bg-slate-900/60 py-1 px-2 rounded border border-slate-800 w-max">
              CAC Threat
            </span>
          </div>
        </div>

        {/* The Roast & Verdict */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6 border-t-4 border-t-red-500 relative overflow-hidden bg-gradient-to-b from-red-950/10 to-transparent">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🔥</span>
                <h3 className="font-bold text-lg text-white">The Roast</h3>
              </div>
              <span className="text-[10px] font-mono uppercase bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded">
                {reportData.roast_level.toUpperCase()} MODE
              </span>
            </div>
            <p className="text-sm md:text-base text-red-200/90 leading-relaxed font-serif italic">
              {report.roast}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border-t-4 border-t-blue-500 bg-gradient-to-b from-blue-950/10 to-transparent">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xl">⚖️</span>
                <h3 className="font-bold text-lg text-white">VC Verdict</h3>
              </div>
              <span className="text-[10px] font-mono uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                Committee Evaluation
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {report.verdict}
            </p>
          </div>
        </div>

        {/* Anatomical Strengths / Weaknesses */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
            <span>📊</span>
            <span>Anatomical Breakdown</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-widest text-emerald-400 flex items-center space-x-2">
                <span>✓</span> <span>Core Strengths</span>
              </h4>
              <ul className="space-y-3 text-sm text-slate-300">
                {report.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5">
                    <span className="text-emerald-500 mt-1 flex-shrink-0">■</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4 pt-6 md:pt-0 md:pl-8">
              <h4 className="text-xs uppercase font-bold tracking-widest text-rose-400 flex items-center space-x-2">
                <span>𐄂</span> <span>Strategic Weaknesses</span>
              </h4>
              <ul className="space-y-3 text-sm text-slate-300">
                {report.weaknesses.map((weak, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5">
                    <span className="text-rose-500 mt-1 flex-shrink-0">■</span>
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* SWOT Grid */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm uppercase tracking-widest font-bold text-slate-400">Structured Matrix</h3>
            <h4 className="text-xl font-bold text-white">SWOT Analysis</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card rounded-xl p-5 border-t-2 border-emerald-500 bg-emerald-950/5 space-y-2">
              <div className="text-2xl font-black text-emerald-500/50">S</div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">Strengths</h5>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-3">
                {report.swot.strengths.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            
            <div className="glass-card rounded-xl p-5 border-t-2 border-rose-500 bg-rose-950/5 space-y-2">
              <div className="text-2xl font-black text-rose-500/50">W</div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">Weaknesses</h5>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-3">
                {report.swot.weaknesses.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="glass-card rounded-xl p-5 border-t-2 border-blue-500 bg-blue-950/5 space-y-2">
              <div className="text-2xl font-black text-blue-500/50">O</div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">Opportunities</h5>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-3">
                {report.swot.opportunities.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="glass-card rounded-xl p-5 border-t-2 border-amber-500 bg-amber-950/5 space-y-2">
              <div className="text-2xl font-black text-amber-500/50">T</div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">Threats</h5>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-3">
                {report.swot.threats.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ICP & Target Personas */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <span>🎯</span> <span>Ideal Customer Profile (ICP)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.targetUsers.map((user, idx) => (
              <div key={idx} className="glass-card rounded-xl p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-white text-base">{user.persona}</h4>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 font-mono px-2 py-0.5 border border-amber-500/20 rounded-full flex-shrink-0">
                      WTP: {user.willingnessToPay}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Core Pain Point
                  </span>
                  <p className="text-xs text-slate-200">
                    “{user.painPoint}”
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Go-To-Market Sequence */}
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Launch Sequence</h3>
            <h4 className="text-xl font-bold text-white">Go-To-Market (GTM) Horizon</h4>
          </div>
          
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Positioning Angle</span>
            <p className="text-sm text-slate-300 font-medium">
              {report.gtmStrategy.positioning}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {report.gtmStrategy.launchPlan.map((planStep, idx) => (
              <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 relative">
                <div className="text-xs font-bold text-orange-500 font-mono mb-1">PHASE 0{idx + 1}</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {planStep}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* MVP Roadmap & Value Proposition Pivot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 md:col-span-1 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
                <span>🛠️</span> <span>MVP Scope Roadmap</span>
              </h3>
              <div className="space-y-3">
                {report.mvpRoadmap.map((feature, idx) => (
                  <label key={idx} className="flex items-center space-x-3 text-xs text-slate-300">
                    <input type="checkbox" className="accent-orange-500 h-4 w-4 rounded bg-slate-900 border-slate-800" />
                    <span>{feature}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-slate-900 mt-4 text-[11px] text-slate-500">
              Sprint Velocity Status: Stable
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 md:col-span-2 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/10 border-l-4 border-l-emerald-500 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>💡</span> <span>Value Proposition Pivot Recommendation</span>
                </h3>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/20">
                  High Defensibility
                </span>
              </div>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed font-medium">
                {report.improvedIdea}
              </p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <span className="text-xs text-slate-400">
                <strong>Impact Assessment:</strong> Increases target willingness to pay (WTP) straight to premium metrics.
              </span>
              <button
                onClick={handleImprovePivot}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all cursor-pointer flex-shrink-0"
              >
                Use Improved Version
              </button>
            </div>
          </div>
        </div>

        {/* 7-Day Action Plan */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <span>📅</span> <span>7-Day Action Plan</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {report.sevenDayActionPlan.map((action, idx) => (
              <div key={idx} className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-center flex flex-col justify-between h-36">
                <div>
                  <div className="text-[10px] font-bold text-orange-500 uppercase tracking-wider font-mono">Day {idx + 1}</div>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  {action}
                </p>
                <div></div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Risk / Red Flags */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-widest font-bold text-rose-500">Critical Risk Assurances</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {report.redFlags.map((flag, idx) => {
              const parts = flag.split(':');
              const title = parts[0]?.trim() || 'Warning';
              const desc = parts[1]?.trim() || flag;
              return (
                <div key={idx} className="bg-red-950/20 border border-red-900/40 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-lg mb-1">🚨</div>
                    <h4 className="text-xs font-bold uppercase text-slate-200 tracking-wider">
                      {title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 mt-24 py-12 px-4 text-center">
        <div className="max-w-7xl mx-auto space-y-4">
          <p className="text-sm font-medium text-slate-400">
            “Built for founders who want the truth before the market gives it to them.”
          </p>
          <div className="text-[11px] text-slate-600 font-mono">
            © 2026 ROAST MY STARTUP AI. DATA DISCLOSURE: NOT LEGALLY BINDING STRATEGIC FINANCIAL INVESTMENT ADVICE.
          </div>
        </div>
      </footer>
    </>
  );
}
