import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function PricingPage() {
  return (
    <>
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 py-16 space-y-16 relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center space-y-4 max-w-2xl mx-auto relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-orange-400 text-xs font-semibold uppercase tracking-wider">
            <span>SaaS Pricing Model</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Flexible plans for <br />
            <span className="bg-gradient-to-r from-orange-500 to-amber-300 bg-clip-text text-transparent">
              founders at any stage.
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-400">
            Choose a plan that fits your execution pace. Start for free to validate basic assumptions, or upgrade for comprehensive GTM models and SWOT matrices.
          </p>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
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
