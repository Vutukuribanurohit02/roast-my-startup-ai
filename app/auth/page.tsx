'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabaseClient';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Registration successful! Check your email or proceed to login.' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Authentication failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      // Login with default mock user
      await supabase.auth.signInWithPassword({ email: 'demo@founder.com', password: 'password123' });
      router.push('/dashboard');
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Demo login failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md glass-card rounded-2xl p-8 space-y-6 glow-orange relative">
          <div className="text-center space-y-2">
            <span className="text-3xl">🔑</span>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {isSignUp ? 'Create a Founder Account' : 'Welcome Back, Partner'}
            </h1>
            <p className="text-xs text-slate-400">
              {isSignUp ? 'Sign up to keep track of your startup portfolio' : 'Sign in to access your investment memos'}
            </p>
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-xs font-semibold ${
                message.type === 'success'
                  ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-950/40 border border-rose-500/30 text-rose-400'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-950/60 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-900"></div>
            <span className="flex-shrink mx-4 text-[10px] text-slate-500 uppercase tracking-widest font-mono">
              Or Test Out
            </span>
            <div className="flex-grow border-t border-slate-900"></div>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-semibold py-3 rounded-xl transition-all hover:bg-slate-900/80 cursor-pointer"
          >
            Sign In with Demo Account
          </button>

          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-orange-400 hover:text-orange-300 font-medium underline underline-offset-4 cursor-pointer"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
