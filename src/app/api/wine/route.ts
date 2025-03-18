// app/api/wine/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    const supabase = await createClient();
    
    const { data: wines, error } = await supabase
      .from('wines')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching wines:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(wines || []);
  } catch (error: any) {
    console.error('Error in GET: ', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Extract userId from the URL
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    // Parse the request body
    const body = await request.json();
    const { name, description, category, price, photo_url, dish, dish_type } = body;

    // Validate required fields
    if (!name || !description || !category || price === undefined || !photo_url || !dish || !dish_type) {
      return NextResponse.json({ error: 'Missing required wine data' }, { status: 400 });
    }

    const supabase = await createClient();

    // Insert the new wine into the database
    const { data, error } = await supabase
      .from('wines')
      .insert([
        {
          user_id: userId,
          name,
          description,
          category,
          price,
          photo_url,
          dish,
          dish_type
        }
      ]);

    if (error) {
      console.error('Error inserting wine:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Wine added successfully', wine: data }, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST: ', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}