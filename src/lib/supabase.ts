import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  'https://djqfpwpltefaswtmbgih.supabase.co';

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqcWZwd3BsdGVmYXN3dG1iZ2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NTI1NTMsImV4cCI6MjA4OTQyODU1M30.6sIERIac0pSerUFwV9yAwqdyfAcp9l_E_hckpClbThE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});
