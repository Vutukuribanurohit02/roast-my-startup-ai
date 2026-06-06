'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (!session) {
        // Direct to login
        router.push('/auth');
      } else {
        setUser(session.user);
        loadUserReports();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      if (!session) {
        router.push('/auth');
      } else {
        setUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadUserReports() {
    try {
      const { data, error } = await supabase
        .from('startup_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this memo?')) return;

    try {
      const { error } = await supabase
        .from('startup_reports')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setReports(reports.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete report:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="text-xl font-mono text-slate-400 animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  // Calculate some analytics helper stats
  const averageScore = reports.length 
    ? Math.round(reports.reduce((acc, r) => acc + r.startup_score, 0) / reports.length) 
    : 0;

  const highestScore = reports.length 
    ? Math.max(...reports.map(r => r.startup_score)) 
    : 0;

  return (
    <>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12 space-y-10">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Startup Portfolio</h1>
            <p className="text-sm text-slate-400">
              Welcome back, {user?.email || 'Founder'}. Access and manage your roasted VC memos.
            </p>
          </div>
          <Link
            href="/submit"
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-orange-950/50 text-center cursor-pointer"
          >
            Roast New Idea
          </Link>
        </div>

        {/* Analytical Cards */}
        {reports.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-xl p-5 border-l-4 border-l-orange-500">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Total Analyzed</span>
              <div className="my-2 text-3xl font-extrabold text-white">{reports.length}</div>
              <span className="text-[10px] text-slate-500 font-mono">Ideas Evaluated</span>
            </div>
            
            <div className="glass-card rounded-xl p-5 border-l-4 border-l-emerald-500">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Average Score</span>
              <div className="my-2 text-3xl font-extrabold text-emerald-400">{averageScore} <span className="text-xs text-slate-500">/100</span></div>
              <span className="text-[10px] text-slate-500 font-mono">Overall Portfolio Health</span>
            </div>

            <div className="glass-card rounded-xl p-5 border-l-4 border-l-amber-500">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Peak Viability</span>
              <div className="my-2 text-3xl font-extrabold text-amber-400">{highestScore} <span className="text-xs text-slate-500">/100</span></div>
              <span className="text-[10px] text-slate-500 font-mono">Highest Scored Concept</span>
            </div>
          </div>
        )}

        {/* Reports History List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Saved Memos</h2>
          
          {reports.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center space-y-6">
              <div className="text-5xl">📁</div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">No Startup Memos Yet</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Submit a startup idea in the analysis engine terminal to generate your first VC investment memo.
                </p>
              </div>
              <Link
                href="/submit"
                className="inline-block bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-all"
              >
                Analyze Your First Idea
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {reports.map((report) => (
                <Link
                  key={report.id}
                  href={`/report/${report.id}`}
                  className="glass-card rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between hover:border-slate-600 hover:bg-slate-900/40 transition-all gap-4"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xs font-semibold px-2 py-0.5 bg-slate-950 border border-slate-800 text-orange-400 rounded">
                        {report.industry.split('/')[0].trim()}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-400 rounded">
                        {report.stage}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(report.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white line-clamp-1">
                      {report.idea}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {report.report_json?.verdict}
                    </p>
                  </div>

                  <div className="flex items-center space-x-6 justify-between md:justify-end">
                    <div className="flex flex-col items-center md:items-end">
                      <span className="text-xs text-slate-400 uppercase tracking-wider">Score</span>
                      <span className="text-2xl font-black text-white">{report.startup_score}</span>
                    </div>

                    <button
                      onClick={(e) => handleDelete(report.id, e)}
                      className="p-2 bg-slate-950 border border-slate-900 hover:border-rose-950 text-slate-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                      title="Delete Memo"
                    >
                      🗑️
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
