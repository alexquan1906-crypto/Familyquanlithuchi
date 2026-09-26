import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  'https://djqfpwpltefaswtmbgih.supabase.co';

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqcWZwd3BsdGVmYXN3dG1iZ2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NTI1NTMsImV4cCI6MjA4OTQyODU1M30.6sIERIac0pSerUFwV9yAwqdyfAcp9l_E_hckpClbThE';

/**
 * Safe Storage Wrapper cho Android PWA
 * Trên Android Chrome PWA (standalone mode), localStorage có thể bị chặn
 * gây ra SecurityError: The request was denied
 * Wrapper này tự động fallback sang in-memory storage nếu localStorage không dùng được
 */
class SafeStorage {
  private memoryStore = new Map<string, string>();
  private useLocalStorage: boolean;

  constructor() {
    this.useLocalStorage = this.testLocalStorage();
    if (!this.useLocalStorage) {
      console.warn('[SafeStorage] localStorage không khả dụng, sử dụng in-memory storage');
    }
  }

  private testLocalStorage(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      const testKey = '__supabase_storage_test__';
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  getItem(key: string): string | null {
    try {
      if (this.useLocalStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // localStorage bị chặn runtime - chuyển sang memory
      this.useLocalStorage = false;
    }
    return this.memoryStore.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    try {
      if (this.useLocalStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch {
      this.useLocalStorage = false;
    }
    this.memoryStore.set(key, value);
  }

  removeItem(key: string): void {
    try {
      if (this.useLocalStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch {
      this.useLocalStorage = false;
    }
    this.memoryStore.delete(key);
  }
}

const safeStorage = new SafeStorage();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
    storage: safeStorage,
  }
});
