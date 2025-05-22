import { createClient } from '@/utils/supabase/server';
import { Dish, Pairing, Wine } from '@/types/database';

export async function getWinesByUserId(userId: string) {
  const supabase = await createClient();
  
  // Get all pairings for the user with wine and dish details
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
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching wines:', error);
    throw error;
  }

  // Rename wines_new to wines in the response for frontend compatibility
  const formattedData = data?.map(item => ({
    ...item,
    wines: item.wines_new,
    wines_new: undefined
  }));

  return formattedData;
}

export async function addWine(
  userId: string, 
  wineData: Partial<Wine>, 
  dishData: Partial<Dish>,
  pairingData: Partial<Pairing> = {}
) {
  const supabase = await createClient();
  
  try {
    // Use the PostgreSQL function to handle the transaction
    const { data, error } = await supabase.rpc('add_wine_with_pairing', {
      user_id: userId,
      wine_data: wineData,
      dish_data: dishData,
      pairing_data: pairingData
    });
    
    if (error) {
      console.error('Error in add_wine_with_pairing RPC:', error);
      throw error;
    }
    
    // Rename wines_new to wines in the response for frontend compatibility
    const formattedPairing = {
      ...data,
      wines_new: undefined
    };
    
    return formattedPairing;
  } catch (error) {
    console.error('Error in addWine:', error);
    throw error;
  }
}

export async function deletePairing(pairingId: string, userId: string) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase.rpc('delete_wine_pairing', {
      pairing_id: pairingId,
      user_id: userId
    });
    
    if (error) {
      console.error('Error in delete_wine_pairing RPC:', error);
      throw error;
    }
    
    return data; // Returns true if deleted, false if not found
  } catch (error) {
    console.error('Error deleting pairing:', error);
    throw error;
  }
}

export async function updatePairing(
  pairingId: string, 
  userId: string, 
  updates: Partial<Pairing>
) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase.rpc('update_wine_pairing', {
      pairing_id: pairingId,
      user_id: userId,
      updates: updates
    });
    
    if (error) {
      console.error('Error in update_wine_pairing RPC:', error);
      throw error;
    }
    
    // Rename wines_new to wines in the response for frontend compatibility
    const formattedPairing = {
      ...data,
      wines: data.wines,
      wines_new: undefined
    };
    
    return formattedPairing;
  } catch (error) {
    console.error('Error updating pairing:', error);
    throw error;
  }
}