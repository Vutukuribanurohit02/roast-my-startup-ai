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
  // Thenable query builder to support chainable Supabase syntax (e.g. select().order() or insert().select())
  class MockQueryBuilder {
    private table: string;
    private data: any = null;
    private error: any = null;

    constructor(table: string) {
      this.table = table;
    }

    // Awaitable promise resolution
    then(onfulfilled: any) {
      return Promise.resolve(onfulfilled({ data: this.data, error: this.error }));
    }

    select(columns?: string) {
      if (this.table === 'startup_reports') {
        this.data = localDb.getReports();
      } else {
        this.data = [];
      }
      return this;
    }

    insert(payload: any) {
      const arrayData = Array.isArray(payload) ? payload : [payload];
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
      this.data = newReports;
      return this;
    }

    delete() {
      this.data = null; // Mark for deletion, eq will execute
      return this;
    }

    order(col: string, { ascending }: any = {}) {
      if (Array.isArray(this.data)) {
        this.data = [...this.data].sort((a: any, b: any) => {
          const dateA = new Date(a[col]).getTime();
          const dateB = new Date(b[col]).getTime();
          return ascending ? dateA - dateB : dateB - dateA;
        });
      }
      return this;
    }

    eq(key: string, val: any) {
      if (key === 'id') {
        if (this.table === 'startup_reports') {
          if (this.data === null) {
            // It's a delete operation
            localDb.deleteReport(val);
          } else if (Array.isArray(this.data)) {
            this.data = this.data.filter(r => r.id === val);
          } else {
            const reports = localDb.getReports();
            this.data = reports.filter(r => r.id === val);
          }
        }
      } else if (key === 'user_id') {
        if (Array.isArray(this.data)) {
          this.data = this.data.filter(r => r.user_id === val);
        }
      }
      return this;
    }

    single() {
      const item = Array.isArray(this.data) ? this.data[0] : this.data;
      return Promise.resolve({ data: item || null, error: item ? null : { message: 'Not found' } });
    }
  }

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
        if (typeof window !== 'undefined') {
          const handleStorage = () => {
            const user = localDb.getUser();
            callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', user ? { user } : null);
          };
          window.addEventListener('storage', handleStorage);
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
    from: (table: string) => {
      return new MockQueryBuilder(table);
    }
  };
}

export const supabase = supabaseInstance;
export { localDb };
