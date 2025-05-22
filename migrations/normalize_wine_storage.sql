-- Create new normalized tables for wines, dishes, and pairings

-- First, check if the extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Rename the existing wines table to avoid conflicts
ALTER TABLE IF EXISTS wines RENAME TO wines_old;

-- Create new wines table
CREATE TABLE IF NOT EXISTS wines_new (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL, -- Red, White, Rose, etc.
  type TEXT, -- Cabernet, Merlot, Chardonnay, etc.
  country TEXT,
  region TEXT,
  price DECIMAL(10, 2),
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dishes table
CREATE TABLE IF NOT EXISTS dishes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  translated_name TEXT, -- English translation if original is in another language
  dish_type TEXT, -- Category of dish
  cuisine TEXT, -- Italian, French, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pairings table to connect users, wines, and dishes
CREATE TABLE IF NOT EXISTS pairings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wine_id UUID NOT NULL REFERENCES wines_new(id) ON DELETE CASCADE,
  dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  relevance_score DECIMAL(5, 2), -- How well the pairing matches
  is_favorite BOOLEAN DEFAULT FALSE,
  notes TEXT, -- User notes about the pairing
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, wine_id, dish_id) -- Prevent duplicate pairings
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pairings_user_id ON pairings(user_id);
CREATE INDEX IF NOT EXISTS idx_pairings_wine_id ON pairings(wine_id);
CREATE INDEX IF NOT EXISTS idx_pairings_dish_id ON pairings(dish_id);
CREATE INDEX IF NOT EXISTS idx_dishes_name ON dishes(name);
CREATE INDEX IF NOT EXISTS idx_wines_new_name ON wines_new(name);
CREATE INDEX IF NOT EXISTS idx_wines_new_color ON wines_new(color);

-- Migration function to move data from old wines table to new structure
CREATE OR REPLACE FUNCTION migrate_wines_data() RETURNS void AS $$
DECLARE
  wine_record RECORD;
  new_wine_id UUID;
  new_dish_id UUID;
BEGIN
  -- Check if old wines table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'wines_old') THEN
    -- For each record in the old wines table
    FOR wine_record IN SELECT * FROM wines_old LOOP
      -- Insert into new wines table
      INSERT INTO wines_new (name, description, color, country, photo_url, price)
      VALUES (
        wine_record.name,
        wine_record.description,
        COALESCE(wine_record.category, 'Unknown'), -- Assuming category in old table is color in new table
        COALESCE(wine_record.country, 'Unknown'),
        wine_record.photo_url,
        COALESCE(wine_record.price, 0)
      )
      RETURNING id INTO new_wine_id;
      
      -- Insert into dishes table
      INSERT INTO dishes (name, dish_type)
      VALUES (
        COALESCE(wine_record.dish, 'Unknown Dish'),
        COALESCE(wine_record.dish_type, 'Other')
      )
      RETURNING id INTO new_dish_id;
      
      -- Create pairing
      INSERT INTO pairings (user_id, wine_id, dish_id)
      VALUES (
        wine_record.user_id,
        new_wine_id,
        new_dish_id
      );
    END LOOP;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Comment out the following line if you want to run the migration manually
-- SELECT migrate_wines_data();

-- After confirming the migration worked, you can rename the new table to the original name
-- DROP TABLE IF EXISTS wines_old;
-- ALTER TABLE wines_new RENAME TO wines;