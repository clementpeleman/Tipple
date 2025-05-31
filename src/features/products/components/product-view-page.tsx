import { Wine } from '@/constants/data';
import { notFound } from 'next/navigation';
import ProductForm from './product-form';
import Scanner from './scan-form';
import { createClient } from '@/utils/supabase/server';

type TProductViewPageProps = {
  productId: string;
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

    if (sessionError || !session?.user) {
      return <p>You must be logged in to view your wines.</p>;
    }

    // Query the pairings table to get the pairing with related wine and dish data
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
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching pairing:', error);
      return <p>Failed to fetch wine pairing.</p>;
    }

    if (!data) {
      notFound();
    }

    // Since we're using explicit foreign key names, these should be single objects, not arrays
    // But let's handle both cases to be safe
    const wine = Array.isArray(data.wines) ? data.wines[0] : data.wines;
    const dish = Array.isArray(data.dishes) ? data.dishes[0] : data.dishes;
    
    if (!wine) {
      console.error('No wine data found for pairing');
      return <p>Wine data not found.</p>;
    }
    
    product = {
      id: data.id, // Keep as UUID string since that's what your DB uses
      user_id: data.user_id,
      name: wine.name || '',
      description: wine.description || '',
      category: wine.color || '',
      price: wine.price || 0,
      photo_url: wine.photo_url || '',
      dish: dish?.name || '',
      dish_type: dish?.dish_type || '',
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    pageTitle = `Edit Wine Pairing`;
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
