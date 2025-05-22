import { createClient } from '@/utils/supabase/server';
import { Wine } from './data';
import { cookies } from 'next/headers'; // Import cookies from next/headers
import { getWinesByUserId, addWine as addWineService, deletePairing } from '@/services/wine-service';
import { Dish } from '@/types/database';

export const wineService = {
  async getAllWines(): Promise<Wine[]> {
    const cookieStore = cookies();
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Use the new service to get wines with their pairings
      const pairings = await getWinesByUserId(user.id);
      
      // Transform pairings to match the old Wine interface
      const wines: Wine[] = pairings.map(pairing => {
        // Handle wines as an object (not an array)
        const wine = pairing.wines as unknown as Wine;
        const dish = pairing.dishes as unknown as Dish;
        
        return {
          id: parseInt(pairing.id), // Convert UUID to number for backward compatibility
          user_id: pairing.user_id,
          name: wine?.name || '',
          description: wine?.description || '',
          category: wine?.color || '',
          price: wine?.price || 0,
          photo_url: wine?.photo_url || '',
          dish: dish?.name || '',
          dish_type: dish?.dish_type || '',
          created_at: pairing.created_at,
          updated_at: pairing.updated_at
        };
      });
      
      return wines || [];
    } catch (error: any) {
      console.error('Error fetching wines:', error);
      throw new Error(error.message);
    }
  },

  async addWine(wine: Omit<Wine, 'id' | 'created_at' | 'updated_at'>): Promise<Wine> {
    const cookieStore = cookies();
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Prepare wine data
      const wineData = {
        name: wine.name,
        description: wine.description,
        color: wine.category, // Map the old 'category' to the new 'color'
        price: wine.price,
        photo_url: wine.photo_url
      };

      // Prepare dish data
      const dishData = {
        name: wine.dish,
        dish_type: wine.dish_type
      };

      // Prepare pairing data
      const pairingData = {
        is_favorite: false
      };

      // Use the new service to add the wine, dish, and pairing
      const result = await addWineService(user.id, wineData, dishData, pairingData);
      
      // Transform the result to match the old Wine interface
      return {
        id: parseInt(result.id), // Convert UUID to number for backward compatibility
        user_id: result.user_id,
        name: result.wines?.name || '',
        description: result.wines?.description || '',
        category: result.wines?.color || '',
        price: result.wines?.price || 0,
        photo_url: result.wines?.photo_url || '',
        dish: result.dishes?.name || '',
        dish_type: result.dishes?.dish_type || '',
        created_at: result.created_at,
        updated_at: result.updated_at
      };
    } catch (error: any) {
      console.error('Error adding wine:', error);
      throw new Error(error.message);
    }
  },

  async deleteWine(id: number): Promise<void> {
    const cookieStore = cookies();
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // In the new structure, we delete the pairing, not the wine directly
      // The id parameter is actually the pairing id
      await deletePairing(id.toString(), user.id);
    } catch (error: any) {
      console.error('Error deleting wine:', error);
      throw new Error(error.message);
    }
  },
};