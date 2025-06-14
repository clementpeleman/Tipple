-- Fix foreign key constraints for pairings table

-- First, drop the existing foreign key constraint
ALTER TABLE pairings DROP CONSTRAINT IF EXISTS pairings_wine_id_fkey;

-- Add the correct foreign key constraint pointing to wines_new
ALTER TABLE pairings ADD CONSTRAINT pairings_wine_id_fkey 
  FOREIGN KEY (wine_id) REFERENCES wines_new(id) ON DELETE CASCADE;

-- Rename wines_new to wines for better naming
ALTER TABLE wines_new RENAME TO wines;

-- Update the foreign key constraint to point to the renamed table
ALTER TABLE pairings DROP CONSTRAINT IF EXISTS pairings_wine_id_fkey;
ALTER TABLE pairings ADD CONSTRAINT pairings_wine_id_fkey 
  FOREIGN KEY (wine_id) REFERENCES wines(id) ON DELETE CASCADE;

-- Update the wine_transaction_functions.sql to use the renamed table
CREATE OR REPLACE FUNCTION add_wine_with_pairing(
  user_id UUID,
  wine_data JSONB,
  dish_data JSONB,
  pairing_data JSONB DEFAULT '{}'::JSONB
) RETURNS JSONB AS $$
DECLARE
  wine_id UUID;
  dish_id UUID;
  pairing_id UUID;
  result JSONB;
BEGIN
  -- Check if wine exists or insert new one
  SELECT id INTO wine_id FROM wines 
  WHERE name = wine_data->>'name' AND color = COALESCE(wine_data->>'color', 'Unknown');
  
  IF wine_id IS NULL THEN
    INSERT INTO wines (
      name, 
      description, 
      color, 
      type, 
      country, 
      region, 
      price, 
      photo_url
    )
    VALUES (
      wine_data->>'name',
      wine_data->>'description',
      COALESCE(wine_data->>'color', 'Unknown'),
      wine_data->>'type',
      wine_data->>'country',
      wine_data->>'region',
      (wine_data->>'price')::numeric,
      wine_data->>'photo_url'
    )
    RETURNING id INTO wine_id;
  END IF;
  
  -- Check if dish exists or insert new one
  SELECT id INTO dish_id FROM dishes
  WHERE name = dish_data->>'name';
  
  IF dish_id IS NULL THEN
    INSERT INTO dishes (
      name, 
      translated_name, 
      dish_type, 
      cuisine
    )
    VALUES (
      dish_data->>'name',
      dish_data->>'translated_name',
      dish_data->>'dish_type',
      dish_data->>'cuisine'
    )
    RETURNING id INTO dish_id;
  END IF;
  
  -- Create pairing
  INSERT INTO pairings (
    user_id,
    wine_id,
    dish_id,
    relevance_score,
    is_favorite,
    notes
  )
  VALUES (
    user_id,
    wine_id,
    dish_id,
    (pairing_data->>'relevance_score')::numeric,
    COALESCE((pairing_data->>'is_favorite')::boolean, false),
    pairing_data->>'notes'
  )
  RETURNING id INTO pairing_id;
  
  -- Get the complete pairing data with wine and dish details
  SELECT 
    jsonb_build_object(
      'id', p.id,
      'user_id', p.user_id,
      'wine_id', p.wine_id,
      'dish_id', p.dish_id,
      'relevance_score', p.relevance_score,
      'is_favorite', p.is_favorite,
      'notes', p.notes,
      'created_at', p.created_at,
      'wines', jsonb_build_object(
        'id', w.id,
        'name', w.name,
        'description', w.description,
        'color', w.color,
        'type', w.type,
        'country', w.country,
        'region', w.region,
        'price', w.price,
        'photo_url', w.photo_url
      ),
      'dishes', jsonb_build_object(
        'id', d.id,
        'name', d.name,
        'translated_name', d.translated_name,
        'dish_type', d.dish_type,
        'cuisine', d.cuisine
      )
    ) INTO result
  FROM pairings p
  JOIN wines w ON p.wine_id = w.id
  JOIN dishes d ON p.dish_id = d.id
  WHERE p.id = pairing_id;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    -- Transaction automatically rolls back on error
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the update_wine_pairing function to use the renamed table
CREATE OR REPLACE FUNCTION update_wine_pairing(
  pairing_id UUID,
  user_id UUID,
  updates JSONB
) RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Update the pairing
  UPDATE pairings
  SET 
    relevance_score = COALESCE((updates->>'relevance_score')::numeric, relevance_score),
    is_favorite = COALESCE((updates->>'is_favorite')::boolean, is_favorite),
    notes = COALESCE(updates->>'notes', notes),
    updated_at = NOW()
  WHERE id = pairing_id AND user_id = user_id;
  
  -- Get the updated pairing data
  SELECT 
    jsonb_build_object(
      'id', p.id,
      'user_id', p.user_id,
      'wine_id', p.wine_id,
      'dish_id', p.dish_id,
      'relevance_score', p.relevance_score,
      'is_favorite', p.is_favorite,
      'notes', p.notes,
      'created_at', p.created_at,
      'updated_at', p.updated_at,
      'wines', jsonb_build_object(
        'id', w.id,
        'name', w.name,
        'description', w.description,
        'color', w.color,
        'type', w.type,
        'country', w.country,
        'region', w.region,
        'price', w.price,
        'photo_url', w.photo_url
      ),
      'dishes', jsonb_build_object(
        'id', d.id,
        'name', d.name,
        'translated_name', d.translated_name,
        'dish_type', d.dish_type,
        'cuisine', d.cuisine
      )
    ) INTO result
  FROM pairings p
  JOIN wines w ON p.wine_id = w.id
  JOIN dishes d ON p.dish_id = d.id
  WHERE p.id = pairing_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;