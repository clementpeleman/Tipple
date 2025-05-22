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
  
  // Start a transaction
  const { error: transactionError } = await supabase.rpc('begin_transaction');
  if (transactionError) {
    console.error('Error starting transaction:', transactionError);
    throw transactionError;
  }

  try {
    // 1. Insert or select wine
    let wineId: string;
    
    // Check if wine already exists
    const { data: existingWines, error: wineQueryError } = await supabase
      .from('wines_new')
      .select('id')
      .eq('name', wineData.name)
      .eq('color', wineData.color || 'Unknown')
      .maybeSingle();
    
    if (wineQueryError) {
      throw wineQueryError;
    }
    
    if (existingWines) {
      wineId = existingWines.id;
    } else {
      // Insert new wine
      const { data: newWine, error: wineInsertError } = await supabase
        .from('wines_new')
        .insert({
          name: wineData.name,
          description: wineData.description,
          color: wineData.color || 'Unknown',
          type: wineData.type,
          country: wineData.country,
          region: wineData.region,
          price: wineData.price,
          photo_url: wineData.photo_url
        })
        .select('id')
        .single();
      
      if (wineInsertError) {
        throw wineInsertError;
      }
      
      wineId = newWine.id;
    }
    
    // 2. Insert or select dish
    let dishId: string;
    
    // Check if dish already exists
    const { data: existingDishes, error: dishQueryError } = await supabase
      .from('dishes')
      .select('id')
      .eq('name', dishData.name)
      .maybeSingle();
    
    if (dishQueryError) {
      throw dishQueryError;
    }
    
    if (existingDishes) {
      dishId = existingDishes.id;
    } else {
      // Insert new dish
      const { data: newDish, error: dishInsertError } = await supabase
        .from('dishes')
        .insert({
          name: dishData.name,
          translated_name: dishData.translated_name,
          dish_type: dishData.dish_type,
          cuisine: dishData.cuisine
        })
        .select('id')
        .single();
      
      if (dishInsertError) {
        throw dishInsertError;
      }
      
      dishId = newDish.id;
    }
    
    // 3. Create pairing
    const { data: pairing, error: pairingError } = await supabase
      .from('pairings')
      .insert({
        user_id: userId,
        wine_id: wineId,
        dish_id: dishId,
        relevance_score: pairingData.relevance_score,
        is_favorite: pairingData.is_favorite || false,
        notes: pairingData.notes
      })
      .select(`
        id,
        user_id,
        wine_id,
        dish_id,
        relevance_score,
        is_favorite,
        notes,
        created_at,
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
      .single();
    
    if (pairingError) {
      throw pairingError;
    }
    
    // Commit transaction
    await supabase.rpc('commit_transaction');
    
    // Rename wines_new to wines in the response for frontend compatibility
    const formattedPairing = {
      ...pairing,
      wines: pairing.wines_new,
      wines_new: undefined
    };
    
    return formattedPairing;
  } catch (error) {
    // Rollback transaction on error
    await supabase.rpc('rollback_transaction');
    throw error;
  }
}

export async function deletePairing(pairingId: string, userId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('pairings')
    .delete()
    .eq('id', pairingId)
    .eq('user_id', userId); // Ensure the user owns this pairing
  
  if (error) {
    console.error('Error deleting pairing:', error);
    throw error;
  }
  
  return true;
}

export async function updatePairing(
  pairingId: string, 
  userId: string, 
  updates: Partial<Pairing>
) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('pairings')
    .update(updates)
    .eq('id', pairingId)
    .eq('user_id', userId) // Ensure the user owns this pairing
    .select()
    .single();
  
  if (error) {
    console.error('Error updating pairing:', error);
    throw error;
  }
  
  return data;
}