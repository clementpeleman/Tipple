import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { Wine } from '@/constants/data';  // Zorg ervoor dat je het type Wine importeert

export async function GET() {
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user?.user) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('wines')
    .select('*')
    .eq('user_id', user.user.id);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch wines' }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function GET_WINE({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user?.user) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('wines')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: `Failed to fetch wine with ID ${params.id}` }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const wine = await request.json();
  
  // Assuming `wine` contains the correct shape without `id`, `created_at`, or `updated_at`
  const { data, error } = await supabase
    .from('wines')
    .insert([wine])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to add wine' }, { status: 500 });
  }

  return NextResponse.json(data);
}
