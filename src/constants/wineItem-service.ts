import { createClient } from '@/utils/supabase/server';
import { Wine } from './data';
import { cookies } from 'next/headers'; // Import cookies from next/headers

export const wineService = {
  async getAllWines(): Promise<Wine[]> {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: wines, error } = await supabase
      .from('wines')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching wines:', error);
      throw new Error(error.message);
    }

    return wines || [];
  },

  async addWine(wine: Omit<Wine, 'id' | 'created_at' | 'updated_at'>): Promise<Wine> {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('wines')
      .insert([{ ...wine, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error('Error adding wine:', error);
      throw new Error(error.message);
    }

    return data;
  },

  async deleteWine(id: number): Promise<void> {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('wines')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Controleer user_id bij het verwijderen

    if (error) {
      console.error('Error deleting wine:', error);
      throw new Error(error.message);
    }
  },
};