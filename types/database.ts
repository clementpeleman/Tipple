// Database types for the normalized wine storage schema

export interface Wine {
  id: string;
  name: string;
  description?: string;
  color: string; // Red, White, Rose, etc.
  type?: string; // Cabernet, Merlot, Chardonnay, etc.
  country?: string;
  region?: string;
  price?: number;
  photo_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Dish {
  id: string;
  name: string;
  translated_name?: string;
  dish_type?: string;
  cuisine?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Pairing {
  id: string;
  user_id: string;
  wine_id: string;
  dish_id: string;
  relevance_score?: number;
  is_favorite: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Extended types with related data
export interface PairingWithDetails extends Pairing {
  wine?: Wine;
  dish?: Dish;
}

export interface WineWithPairings extends Wine {
  pairings?: PairingWithDetails[];
}

export interface DishWithPairings extends Dish {
  pairings?: PairingWithDetails[];
}