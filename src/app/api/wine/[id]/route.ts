import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { Pairing, Wine } from '@/types/database';
import { deletePairing, updatePairing } from '@/services/wine-service';

async function getPairingById(id: string, userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pairings')
    .select(`
      id,
      user_id,
      wine_id,
      dish_id,
      relevance_score,
      is_favorite,
      notes,
      created_at,
      updated_at,
      wines_new:wine_id (
        id,
        name,
        description,
        color,
        type,
        country,
        region,
        price,
        photo_url
      ),
      dishes:dish_id (
        id,
        name,
        translated_name,
        dish_type,
        cuisine
      )
    `)
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching pairing:', error);
    throw new Error(error.message);
  }

  // Rename wines_new to wines in the response for frontend compatibility
  const formattedData = {
    ...data,
    wines: data.wines_new,
    wines_new: undefined
  };

  return formattedData;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const pairing = await getPairingById(params.id, user.id);

    if (!pairing) {
      return NextResponse.json({ error: 'Pairing not found' }, { status: 404 });
    }

    return NextResponse.json(pairing);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { is_favorite, notes, relevance_score } = body;

    // Only allow updating specific fields of the pairing
    const updates: Partial<Pairing> = {};
    if (is_favorite !== undefined) updates.is_favorite = is_favorite;
    if (notes !== undefined) updates.notes = notes;
    if (relevance_score !== undefined) updates.relevance_score = relevance_score;

    const updatedPairing = await updatePairing(params.id, user.id, updates);

    return NextResponse.json(updatedPairing);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    await deletePairing(params.id, user.id);
    return NextResponse.json({ message: 'Pairing deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}