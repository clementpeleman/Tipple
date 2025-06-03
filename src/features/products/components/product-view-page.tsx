import { Wine } from '@/constants/data';
import { notFound } from 'next/navigation';
import ProductForm from './product-form';
import Scanner from './scan-form';
import { createClient } from '@/utils/supabase/server';

type TProductViewPageProps = {
  productId: string;
};

type PairingResponse = {
  id: number;
  user_id: string;
  wine_id: string;
  dish_id: string;
  relevance_score?: number;
  is_favorite?: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  wines: {
    id: string;
    name: string;
    description?: string;
    color?: string;
    type?: string;
    country?: string;
    region?: string;
    price?: number;
    photo_url?: string;
  } | null;
  dishes: {
    id: string;
    name: string;
    translated_name?: string;
    dish_type?: string;
    cuisine?: string;
  } | null;
};

export default async function ProductViewPage({ productId }: TProductViewPageProps) {
  let product: Wine | null = null;
  let pageTitle = 'Create New Wine';

  if (productId !== 'new') {
    const supabase = await createClient();
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError);
      return <p>Error checking authentication status.</p>;
    }

    const userId = session?.user?.id || 'test-user-id';

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
        wines!pairings_wine_id_fkey (
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
        dishes!pairings_dish_id_fkey (
          id,
          name,
          translated_name,
          dish_type,
          cuisine
        )
      `)
      .eq('id', productId)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching pairing:', error);
      return <p>Failed to fetch wine pairing.</p>;
    }

    if (!data) {
      notFound();
    }

    const pairing = data as PairingResponse;

    const wine = Array.isArray(pairing.wines) ? pairing.wines[0] : pairing.wines;
    const dish = Array.isArray(pairing.dishes) ? pairing.dishes[0] : pairing.dishes;

    if (!wine) {
      console.error('No wine data found for pairing');
      return <p>Wine data not found.</p>;
    }

    product = {
      id: pairing.id,
      user_id: pairing.user_id,
      name: wine.name ?? '',
      description: wine.description ?? '',
      category: wine.color ?? '',
      price: wine.price ?? 0,
      photo_url: wine.photo_url ?? '',
      dish: dish?.name ?? '',
      dish_type: dish?.dish_type ?? '',
      created_at: pairing.created_at,
      updated_at: pairing.updated_at,
    };

    pageTitle = 'Edit Wine Pairing';
  }

  return (
    <>
      {productId === 'new' ? (
        <Scanner />
      ) : (
        <ProductForm initialData={product} pageTitle={pageTitle} />
      )}
    </>
  );
}
