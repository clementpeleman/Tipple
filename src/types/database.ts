// Database types for the normalized wine storage structure

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
  created_at: string;
  updated_at: string;
}

export interface Dish {
  id: string;
  name: string;
  translated_name?: string; // English translation if original is in another language
  dish_type?: string; // Category of dish
  cuisine?: string; // Italian, French, etc.
  created_at: string;
  updated_at: string;
}

export interface Pairing {
  id: string;
  user_id: string;
  wine_id: string;
  dish_id: string;
  relevance_score?: number; // How well the pairing matches
  is_favorite: boolean;
  notes?: string; // User notes about the pairing
  created_at: string;
  updated_at: string;
}

// Combined type for API responses
export interface PairingWithDetails extends Pairing {
  // Supabase returns these as objects, not arrays, despite the naming
  wines: Wine;
  dishes: Dish;
}