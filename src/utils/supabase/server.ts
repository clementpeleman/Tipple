"use server"

// Import de benodigde libraries voor server-side
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers'; // Deze werkt alleen in een Server Component of API-route.

export async function createClient() {
  const cookieStore = cookies(); // Verkrijg cookies in een server-side context

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll(); // Verkrijg alle cookies
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options) // Stel cookies in
            );
          } catch {
            // Dit kan worden genegeerd als de `setAll` wordt aangeroepen vanuit een Server Component
          }
        },
      },
    }
  );
}
