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

    // Query the pairings table instead of wines directly
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
        wines:wine_id (
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
      .eq('id', productId)
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching wine:', error);
      return <p>Failed to fetch wine.</p>;
    }

    if (!data) {
      notFound();
    }

    // Transform the pairing data to match the Wine interface
    const wine = data.wines;
    const dish = data.dishes;
    
    product = {
      id: parseInt(data.id), // Convert UUID to number for backward compatibility
      user_id: data.user_id,
      name: wine?.name || '',
      description: wine?.description || '',
      category: wine?.color || '',
      price: wine?.price || 0,
      photo_url: wine?.photo_url || '',
      dish: dish?.name || '',
      dish_type: dish?.dish_type || '',
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    pageTitle = `Edit Wine`;
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