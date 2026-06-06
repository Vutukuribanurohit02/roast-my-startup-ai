'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabaseClient';

export default function SavedReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roastFilter, setRoastFilter] = useState('all');

  useEffect(() => {
    async function loadReports() {
      try {
        const { data, error } = await supabase
          .from('startup_reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReports(data || []);
        setFilteredReports(data || []);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  // Handle filtering
  useEffect(() => {
    let filtered = reports;

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(
        (r) =>
          r.idea.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.industry.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roastFilter !== 'all') {
      filtered = filtered.filter((r) => r.roast_level === roastFilter);
    }

    setFilteredReports(filtered);
  }, [searchTerm, roastFilter, reports]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this report?')) return;

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

  return (
    <>
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Saved Investment Memos</h1>
          <p className="text-sm text-slate-400">
            Browse and filter through your historically generated startup analysis assets.
          </p>
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="Search by idea keywords or industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <select
              value={roastFilter}
              onChange={(e) => setRoastFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Roast Intensities</option>
              <option value="mild">☕ Mild Only</option>
              <option value="honest">⚖️ Honest Only</option>
              <option value="brutal">🔥 Brutal Only</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm font-mono text-slate-400 animate-pulse">
            Loading archives...
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center space-y-4">
            <div className="text-4xl">🔍</div>
            <h3 className="text-lg font-bold text-white">No Matching Reports</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search keywords or filter settings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredReports.map((report) => (
              <Link
                key={report.id}
                href={`/report/${report.id}`}
                className="glass-card rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:border-slate-600 hover:bg-slate-900/40 transition-all gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        report.roast_level === 'brutal'
                          ? 'bg-rose-950/40 border-rose-800/60 text-red-400'
                          : report.roast_level === 'honest'
                          ? 'bg-amber-950/40 border-amber-800/60 text-orange-400'
                          : 'bg-slate-905/40 border-slate-800 text-slate-300'
                      }`}
                    >
                      {report.roast_level}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white line-clamp-1">{report.idea}</h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{report.report_json?.verdict}</p>
                </div>

                <div className="flex items-center space-x-4 justify-between sm:justify-end">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Score</span>
                    <span className="text-lg font-black text-white">{report.startup_score}</span>
                  </div>
                  <button
                    onClick={(e) => handleDelete(report.id, e)}
                    className="p-2 bg-slate-950 border border-slate-900 hover:border-rose-950 text-slate-500 hover:text-rose-400 rounded-lg cursor-pointer"
                  >
                    🗑️
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
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
