'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
          <span className="text-2xl">🔥</span>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-orange-500 bg-clip-text text-transparent">
            ROAST MY STARTUP AI
          </span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <span className="hidden md:inline-block text-xs uppercase tracking-wider text-slate-400 font-semibold px-2.5 py-1 bg-slate-900 border border-slate-800 rounded">
            Internal VC Memo v1.4
          </span>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/saved" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Saved Memos
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
                <Link
                  href="/submit"
                  className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-medium text-sm px-4 py-2 rounded-lg transition-all duration-200 shadow-lg shadow-orange-950/50"
                >
                  New Analysis
                </Link>
              </>
            ) : (
              <>
                <Link href="/pricing" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Pricing
                </Link>
                <Link
                  href="/auth"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors border border-slate-800 px-3.5 py-2 rounded-lg bg-slate-900/40 hover:bg-slate-900"
                >
                  Sign In
                </Link>
                <Link
                  href="/submit"
                  className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-medium text-sm px-4 py-2 rounded-lg transition-all duration-200 shadow-lg shadow-orange-950/50"
                >
                  Roast Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
