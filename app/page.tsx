import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12 space-y-24">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-8 relative pt-12">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-orange-950/40 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>⚡ Hard Truths. No Fluff.</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Get your startup roasted <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
              before investors do.
            </span>
          </h1>
          
          <p className="text-base md:text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
            AI-powered startup planner, VC-grade investment committee memo generator, SWOT analyzer, GTM strategist, and roadmap builder. Find your red flags before Pitch Day.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              href="/submit"
              className="w-full sm:w-auto text-center bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold px-8 py-4 rounded-xl transition-all transform hover:-translate-y-0.5 shadow-xl shadow-orange-950/50"
            >
              Get Your Startup Roasted
            </Link>
            <Link
              href="/report/sample-report-id"
              className="w-full sm:w-auto text-center glass-card hover:bg-slate-900/60 text-white font-semibold px-8 py-4 rounded-xl transition-all border border-slate-700/60 hover:border-slate-500"
            >
              View Sample VC Memo
            </Link>
          </div>
        </section>

        {/* Features / Why It Works Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="bg-orange-500/10 p-3 rounded-lg text-orange-500 text-xl font-bold w-max">🔥</div>
            <h3 className="text-lg font-bold text-white">Brutally Honest Roasting</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Skip the polite nods from friends and accelerators. Choose your roast intensity level (Mild, Honest, or Brutal) and get raw, unvarnished feedback on your concept, execution risk, and target demographics.
            </p>
          </div>
          
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="bg-blue-500/10 p-3 rounded-lg text-blue-400 text-xl font-bold w-max">📊</div>
            <h3 className="text-lg font-bold text-white">VC-Grade Investment Memo</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We translate the roast into a structured professional report. Get a SWOT analysis grid, investor readiness scores out of 10.0, target customer persona breakdowns, and lists of red flags.
            </p>
          </div>
          
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-400 text-xl font-bold w-max">🚀</div>
            <h3 className="text-lg font-bold text-white">Tactical GTM & Roadmap</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We don't just point out flaws; we give you path-to-market solutions. Receive a 7-day action plan, competitor defensibility guides, pricing insights, and an MVP engineering scope checklist.
            </p>
          </div>
        </section>

        {/* Dynamic Matrix Showcase */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Structured Analysis Engine</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Our analyzer deep-dives into 16 separate parameters to build a comprehensive risk profile for early-stage builders.
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card rounded-xl p-5 border-l-4 border-l-orange-500 flex flex-col justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Startup Score</span>
              <div className="my-3 flex items-baseline space-x-1">
                <span className="text-3xl font-black text-white">73</span>
                <span className="text-xs text-slate-500">/100</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5">
                <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '73%' }}></div>
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-5 flex flex-col justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Investor Readiness</span>
              <div className="my-3">
                <span className="text-3xl font-bold text-amber-400">6.8</span>
                <span className="text-xs text-slate-500"> / 10</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium bg-slate-900/60 py-1 px-2 rounded border border-slate-800 w-max">Requires Polish</span>
            </div>
            
            <div className="glass-card rounded-xl p-5 flex flex-col justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Market Potential</span>
              <div className="my-3">
                <span className="text-3xl font-bold text-emerald-400">High</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium bg-slate-900/60 py-1 px-2 rounded border border-slate-800 w-max">Large TAM</span>
            </div>
            
            <div className="glass-card rounded-xl p-5 flex flex-col justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">GTM Difficulty</span>
              <div className="my-3">
                <span className="text-3xl font-bold text-rose-500">High</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium bg-slate-900/60 py-1 px-2 rounded border border-slate-800 w-max">High CAC Threat</span>
            </div>
          </div>
        </section>

        {/* Pricing Tiers Section */}
        <section className="space-y-8 pt-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Flexible SaaS Pricing Plans</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Choose the level of analysis and customization required to validate your next idea.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="glass-card rounded-2xl p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs uppercase font-bold tracking-widest text-slate-400">Free Tier</div>
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-slate-400 text-sm ml-1">/ forever</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Validate basic assumptions and get a taste of AI feedback.
                </p>
                <hr className="border-slate-800" />
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center space-x-2">
                    <span className="text-emerald-500">✓</span> <span>1 Startup Roast / month</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-emerald-500">✓</span> <span>Mild & Honest Roast levels</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-slate-600">✗</span> <span className="text-slate-500">Full SWOT Analysis</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-slate-600">✗</span> <span className="text-slate-500">7-Day Action Plan</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/submit"
                className="w-full text-center bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-medium py-2.5 rounded-lg text-sm transition-all"
              >
                Analyze Free
              </Link>
            </div>

            {/* Founder Tier */}
            <div className="glass-card rounded-2xl p-8 flex flex-col justify-between space-y-6 border-2 border-orange-500/60 relative glow-orange">
              <div className="absolute -top-3 right-6 bg-orange-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                Most Popular
              </div>
              <div className="space-y-4">
                <div className="text-xs uppercase font-bold tracking-widest text-orange-400">Founder Tier</div>
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">$19</span>
                  <span className="text-slate-400 text-sm ml-1">/ one-off report</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Perfect for serious builders preparing pitch materials or exploring GTM channels.
                </p>
                <hr className="border-slate-800" />
                <ul className="space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-center space-x-2">
                    <span className="text-emerald-500">✓</span> <span>Unlimited Startup Roasts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-emerald-500">✓</span> <span>Brutal Intensity Access</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-emerald-500">✓</span> <span>Dynamic SWOT Matrix</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-emerald-500">✓</span> <span>Full GTM Launch sequence</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-emerald-500">✓</span> <span>7-Day Action Plan checklist</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/submit"
                className="w-full text-center bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-2.5 rounded-lg text-sm transition-all"
              >
                Go Premium
              </Link>
            </div>

            {/* VC Advisory Tier */}
            <div className="glass-card rounded-2xl p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs uppercase font-bold tracking-widest text-slate-400">VC Advisor</div>
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">$99</span>
                  <span className="text-slate-400 text-sm ml-1">/ month</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tailored for accelerator scouts, pitch panels, and angel investor groups.
                </p>
                <hr className="border-slate-800" />
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center space-x-2">
                    <span className="text-emerald-500">✓</span> <span>Custom Branding & Headers</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-emerald-500">✓</span> <span>API access (JSON payloads)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-emerald-500">✓</span> <span>PDF Export & Custom link sharing</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-emerald-500">✓</span> <span>Dedicated prompt tuning support</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/submit"
                className="w-full text-center bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-medium py-2.5 rounded-lg text-sm transition-all"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
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
