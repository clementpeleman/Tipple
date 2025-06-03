import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // For testing purposes, return a mock client
  console.log("Using mock Supabase server client");
  
  return {
    auth: {
      getSession: () => Promise.resolve({
        data: {
          session: {
            user: {
              id: 'test-user-id',
              email: 'test@example.com'
            }
          }
        },
        error: null
      }),
      getUser: () => Promise.resolve({
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com'
          }
        },
        error: null
      })
    },
    from: (table: string) => {
      return {
        select: (fields: string) => {
          return {
            eq: (field: string, value: any) => {
              return {
                eq: (field2: string, value2: any) => {
                  return {
                    single: () => Promise.resolve({
                      data: null,
                      error: null
                    })
                  }
                },
                single: () => Promise.resolve({
                  data: null,
                  error: null
                })
              }
            }
          }
        }
      }
    }
  };
  
  // Original implementation (commented out for testing)
  /*
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
  */
}