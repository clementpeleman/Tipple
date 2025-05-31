// New types for the normalized database structure
export interface Wine {
  id: string; // UUID
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
  id: string; // UUID
  name: string;
  translated_name?: string;
  dish_type?: string;
  cuisine?: string;
  created_at: string;
  updated_at: string;
}

export interface Pairing {
  id: string; // UUID
  user_id: string;
  wine_id: string;
  dish_id: string;
  relevance_score?: number;
  is_favorite: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  wines?: Wine; // Joined wine data
  dishes?: Dish; // Joined dish data
}

// Type for the product listing page
export interface WinePairing extends Pairing {
  // Additional fields for backward compatibility
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  photo_url?: string;
  dish?: string;
  dish_type?: string;
}