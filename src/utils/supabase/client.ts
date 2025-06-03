import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Check if environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials missing, returning mock client");
    // Return a mock client for testing
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      // Add other methods as needed
    };
  }
  
  // Return actual client if credentials are available
  return createBrowserClient(supabaseUrl, supabaseKey);
}