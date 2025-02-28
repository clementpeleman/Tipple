import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user?.user) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  const { error } = await supabase
    .from('wines')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.user.id);

  if (error) {
    return NextResponse.json({ error: `Failed to delete wine with ID ${params.id}` }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
