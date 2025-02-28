// app/api/wine/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Wine } from '@/constants/data';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

async function getAllWines(cookieStore: ReadonlyRequestCookies): Promise<Wine[]> {
  try {
    const supabase = await createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('User not authenticated');
    }

    const { data: wines, error } = await supabase
      .from('wines')
      .select('*')
      .eq('user_id', session.user.id); // Gebruik session.user.id

    if (error) {
      console.error('Error fetching wines:', error);
      throw new Error(error.message);
    }

    return wines || [];
  } catch (error) {
    console.error('Error in getAllWines: ', error);
    throw error;
  }
}

export async function GET() {
  try {
    const cookieStore = cookies();
    console.log("Cookies in API: ", cookieStore.getAll()); // Log de cookies
    const wines = await getAllWines(cookieStore);
    return NextResponse.json(wines);
  } catch (error: any) {
    console.error('Error in GET: ', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}