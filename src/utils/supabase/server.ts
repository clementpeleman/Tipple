import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'

// Check if we're in test/development mode
const isTestMode = () => {
  return (
    process.env.NODE_ENV === 'test' ||
    process.env.NODE_ENV === 'development' ||
    process.env.USE_MOCK_SUPABASE === 'true' ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

// Create a comprehensive mock client that matches SupabaseClient interface
const createMockClient = (): SupabaseClient => {
  console.log("🧪 Using mock Supabase server client");
  
  const mockPairingData = {
    id: 'mock-pairing-id',
    user_id: 'test-user-id',
    wine_id: 'mock-wine-id',
    dish_id: 'mock-dish-id',
    relevance_score: 85,
    is_favorite: true,
    notes: 'Great pairing for testing',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    wines: {
      id: 'mock-wine-id',
      name: 'Test Chardonnay',
      description: 'A crisp white wine perfect for testing',
      color: 'white',
      type: 'Chardonnay',
      country: 'France',
      region: 'Burgundy',
      price: 25.99,
      photo_url: 'https://example.com/wine.jpg'
    },
    dishes: {
      id: 'mock-dish-id',
      name: 'Grilled Salmon',
      translated_name: 'Zalm van de grill',
      dish_type: 'main',
      cuisine: 'international'
    }
  };

  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    aud: 'authenticated',
    role: 'authenticated',
    app_metadata: {},
    user_metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const mockSession = {
    user: mockUser,
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    expires_in: 3600,
    token_type: 'bearer'
  };

  // Create a mock that satisfies the SupabaseClient interface
  const mockClient = {
    auth: {
      getSession: () => Promise.resolve({
        data: { session: mockSession },
        error: null
      }),
      getUser: () => Promise.resolve({
        data: { user: mockUser },
        error: null
      }),
      verifyOtp: (params: any) => {
        console.log('🔐 Mock verifyOtp called with:', params);
        return Promise.resolve({
          data: { user: mockUser, session: mockSession },
          error: null
        });
      },
      signInWithPassword: (credentials: any) => {
        console.log('🔐 Mock signInWithPassword called');
        return Promise.resolve({
          data: { user: { ...mockUser, email: credentials.email }, session: mockSession },
          error: null
        });
      },
      signInWithOtp: (params: any) => {
        console.log('🔐 Mock signInWithOtp called');
        return Promise.resolve({ data: {}, error: null });
      },
      signUp: (credentials: any) => {
        console.log('🔐 Mock signUp called');
        return Promise.resolve({
          data: { user: { ...mockUser, email: credentials.email }, session: null },
          error: null
        });
      },
      signOut: () => {
        console.log('🔐 Mock signOut called');
        return Promise.resolve({ error: null });
      },
      onAuthStateChange: (callback: any) => {
        console.log('🔐 Mock onAuthStateChange called');
        return { data: { subscription: { unsubscribe: () => {} } }, error: null };
      },
      resetPasswordForEmail: (email: string) => {
        console.log('🔐 Mock resetPasswordForEmail called for:', email);
        return Promise.resolve({ data: {}, error: null });
      },
      updateUser: (attributes: any) => {
        console.log('🔐 Mock updateUser called');
        return Promise.resolve({
          data: { user: { ...mockUser, ...attributes } },
          error: null
        });
      },
      refreshSession: () => {
        console.log('🔐 Mock refreshSession called');
        return Promise.resolve({
          data: { session: mockSession, user: mockUser },
          error: null
        });
      },
      setSession: (session: any) => {
        console.log('🔐 Mock setSession called');
        return Promise.resolve({
          data: { session, user: session?.user },
          error: null
        });
      },
      signInWithOAuth: (provider: any) => {
        console.log('🔐 Mock signInWithOAuth called with provider:', provider);
        return Promise.resolve({
          data: { url: 'mock-oauth-url', provider },
          error: null
        });
      }
    },
    from: (table: string) => {
      console.log(`📋 Mock query on table: ${table}`);
      
      return {
        select: (fields: string) => {
          console.log(`📝 Mock select fields: ${fields}`);
          
          return {
            eq: (field: string, value: any) => {
              console.log(`🔍 Mock filter: ${field} = ${value}`);
              
              return {
                eq: (field2: string, value2: any) => {
                  console.log(`🔍 Mock filter: ${field2} = ${value2}`);
                  
                  return {
                    single: () => {
                      console.log(`📦 Mock returning single result`);
                      
                      if (table === 'pairings') {
                        return Promise.resolve({
                          data: mockPairingData,
                          error: null
                        });
                      }
                      
                      return Promise.resolve({
                        data: null,
                        error: { code: 'PGRST116', message: 'No rows found' }
                      });
                    }
                  }
                },
                single: () => {
                  console.log(`📦 Mock returning single result`);
                  
                  if (table === 'pairings') {
                    return Promise.resolve({
                      data: mockPairingData,
                      error: null
                    });
                  }
                  
                  return Promise.resolve({
                    data: null,
                    error: { code: 'PGRST116', message: 'No rows found' }
                  });
                }
              }
            },
            insert: (data: any) => ({
              select: () => Promise.resolve({ data: [{ ...data, id: 'mock-id' }], error: null })
            }),
            update: (data: any) => ({
              eq: () => ({
                select: () => Promise.resolve({ data: [data], error: null })
              })
            }),
            delete: () => ({
              eq: () => Promise.resolve({ data: [], error: null })
            })
          }
        },
        insert: (data: any) => ({
          select: () => Promise.resolve({ data: [{ ...data, id: 'mock-id' }], error: null })
        }),
        update: (data: any) => ({
          eq: () => ({
            select: () => Promise.resolve({ data: [data], error: null })
          })
        }),
        delete: () => ({
          eq: () => Promise.resolve({ data: [], error: null })
        })
      }
    },
    // Add other SupabaseClient properties as needed
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        download: () => Promise.resolve({ data: null, error: null }),
        list: () => Promise.resolve({ data: [], error: null }),
        remove: () => Promise.resolve({ data: [], error: null })
      })
    }
  } as any; // Use 'as any' to satisfy TypeScript while maintaining functionality

  return mockClient;
};

// Create the real Supabase client
const createRealClient = async (): Promise<SupabaseClient> => {
  console.log("🚀 Using real Supabase server client");
  
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};

export async function createClient(): Promise<SupabaseClient> {
  if (isTestMode()) {
    return createMockClient();
  } else {
    return await createRealClient();
  }
}

// Export helper function to check current mode
export function getClientMode() {
  return isTestMode() ? 'mock' : 'real';
}

// Export function to force mock mode (useful for testing)
export function createMockClientForced(): SupabaseClient {
  return createMockClient();
}