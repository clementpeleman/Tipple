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

    const { data, error } = await supabase
      .from('wines')
      .select('*')
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

    product = data;
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