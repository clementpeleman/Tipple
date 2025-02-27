import { createClient } from '@/utils/supabase/server';
import { Wine } from './data'; // Hergebruik het Wine type
import { userAgent } from 'next/server';

const supabase = await createClient();

export const wineService = {
  async getAllWines(): Promise<Wine[]> {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.user) {
      console.error('Error fetching user:', userError);
      throw userError || new Error('User not found');
    }

    const { data, error } = await supabase
      .from('wines')
      .select('*')
      .eq('user_id', user.user.id);

    if (error) {
      console.error('Error fetching wines:', error);
      throw error;
    }

    return data as Wine[];
  },

  async getWineById(id: number): Promise<Wine | null> {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.user) {
      console.error('Error fetching user:', userError);
      throw userError || new Error('User not found');
    }

    const { data, error } = await supabase
      .from('wines')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.user.id)
      .single();

    if (error) {
      console.error(`Error fetching wine with ID ${id}:`, error);
      return null;
    }

    return data as Wine;
  },

  async addWine(wine: Omit<Wine, 'id' | 'created_at' | 'updated_at'> & { user_id: string }): Promise<Wine> {
    const { data, error } = await supabase
      .from('wines')
      .insert([wine])
      .select()
      .single();
  
    if (error) {
      console.error('Error adding wine:', error);
      throw error;
    }
  
    return data as Wine;
  }  
};