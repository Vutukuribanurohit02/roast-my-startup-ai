// Supabase Client with graceful LocalStorage mock fallback
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if environment variables are set
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your-supabase-url');

// Define type for reports stored locally
interface LocalReport {
  id: string;
  user_id: string | null;
  idea: string;
  roast_level: string;
  industry: string;
  stage: string;
  report_json: any;
  startup_score: number;
  created_at: string;
}

// Custom LocalStorage Mock DB helper for Demo Mode
const localDb = {
  getReports: (): LocalReport[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem('rms_reports');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveReport: (report: LocalReport) => {
    if (typeof window === 'undefined') return;
    try {
      const reports = localDb.getReports();
      reports.unshift(report);
      localStorage.setItem('rms_reports', JSON.stringify(reports));
    } catch (e) {
      console.error('Error saving report locally:', e);
    }
  },
  deleteReport: (id: string) => {
    if (typeof window === 'undefined') return;
    try {
      const reports = localDb.getReports();
      const filtered = reports.filter(r => r.id !== id);
      localStorage.setItem('rms_reports', JSON.stringify(filtered));
    } catch (e) {
      console.error('Error deleting report locally:', e);
    }
  },
  getUser: () => {
    if (typeof window === 'undefined') return null;
    try {
      const user = localStorage.getItem('rms_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
  setUser: (user: any) => {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem('rms_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('rms_user');
    }
  }
};

// Create the real client or a mock client
let supabaseInstance: any;

if (isSupabaseConfigured) {
  supabaseInstance = createClient(supabaseUrl!, supabaseAnonKey!);
} else {
  // Mock Supabase Client implementation
  supabaseInstance = {
    auth: {
      signUp: async ({ email, password }: any) => {
        const mockUser = { id: 'mock-uid-' + Math.random().toString(36).substr(2, 9), email };
        localDb.setUser(mockUser);
        return { data: { user: mockUser, session: { user: mockUser } }, error: null };
      },
      signInWithPassword: async ({ email }: any) => {
        const mockUser = { id: 'mock-uid-default', email };
        localDb.setUser(mockUser);
        return { data: { user: mockUser, session: { user: mockUser } }, error: null };
      },
      signOut: async () => {
        localDb.setUser(null);
        return { error: null };
      },
      getSession: async () => {
        const user = localDb.getUser();
        return { data: { session: user ? { user } : null }, error: null };
      },
      onAuthStateChange: (callback: any) => {
        // Simple mock auth listener
        if (typeof window !== 'undefined') {
          const handleStorage = () => {
            const user = localDb.getUser();
            callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', user ? { user } : null);
          };
          window.addEventListener('storage', handleStorage);
          // Initial trigger
          setTimeout(() => {
            const user = localDb.getUser();
            callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', user ? { user } : null);
          }, 0);
          return {
            data: {
              subscription: {
                unsubscribe: () => window.removeEventListener('storage', handleStorage)
              }
            }
          };
        }
        return { data: { subscription: { unsubscribe: () => {} } } };
      }
    },
    // Mock Database functions
    from: (table: string) => {
      if (table !== 'startup_reports') {
        return {
          select: () => ({ data: [], error: null }),
          insert: () => ({ data: [], error: null })
        };
      }
      return {
        select: (columns?: string) => {
          return {
            order: (col: string, { ascending }: any) => {
              let reports = localDb.getReports();
              reports.sort((a: any, b: any) => {
                const dateA = new Date(a[col]).getTime();
                const dateB = new Date(b[col]).getTime();
                return ascending ? dateA - dateB : dateB - dateA;
              });
              return {
                data: reports,
                error: null,
                eq: (key: string, val: any) => {
                  if (key === 'id') {
                    return { data: reports.filter(r => r.id === val), error: null };
                  }
                  return { data: reports, error: null };
                }
              };
            },
            eq: (key: string, val: any) => {
              const reports = localDb.getReports();
              const filtered = reports.filter((r: any) => r[key] === val);
              return {
                data: filtered,
                error: null,
                single: () => ({ data: filtered[0] || null, error: filtered[0] ? null : { message: 'Not found' } })
              };
            }
          };
        },
        insert: (data: any) => {
          const arrayData = Array.isArray(data) ? data : [data];
          const newReports = arrayData.map(item => {
            const report = {
              id: item.id || 'mock-report-' + Math.random().toString(36).substr(2, 9),
              user_id: item.user_id || (localDb.getUser()?.id || null),
              idea: item.idea,
              roast_level: item.roast_level,
              industry: item.industry,
              stage: item.stage,
              report_json: item.report_json,
              startup_score: item.startup_score,
              created_at: new Date().toISOString()
            };
            localDb.saveReport(report);
            return report;
          });
          return { data: newReports, error: null };
        },
        delete: () => {
          return {
            eq: (key: string, val: any) => {
              if (key === 'id') {
                localDb.deleteReport(val);
              }
              return { data: null, error: null };
            }
          };
        }
      };
    }
  };
}

export const supabase = supabaseInstance;
export { localDb };
