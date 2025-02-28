import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Wine } from '@/constants/data';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

async function getWineById(id: number): Promise<Wine | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data: wine, error } = await supabase.from('wines').select('*').eq('id', id).eq('user_id', user.id).single();

  if (error) {
    console.error('Error fetching wine:', error);
    throw new Error(error.message);
  }

  return wine;
}

async function updateWine(
  id: number,
  wine: Partial<Omit<Wine, 'id' | 'created_at' | 'updated_at' | 'user_id'>>
): Promise<Wine | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('wines')
    .update(wine)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating wine:', error);
    throw new Error(error.message);
  }

  return data;
}

async function deleteWine(id: number): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase.from('wines').delete().eq('id', id).eq('user_id', user.id);

  if (error) {
    console.error('Error deleting wine:', error);
    throw new Error(error.message);
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const wine = await getWineById(id);

    if (!wine) {
      return NextResponse.json({ error: 'Wine not found' }, { status: 404 });
    }

    return NextResponse.json(wine);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const updatedWine = await updateWine(id, body);

    if (!updatedWine) {
      return NextResponse.json({ error: 'Wine not found' }, { status: 404 });
    }

    return NextResponse.json(updatedWine);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    await deleteWine(id);
    return NextResponse.json({ message: 'Wine deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}