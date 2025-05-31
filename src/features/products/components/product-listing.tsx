import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { columns } from './product-tables/columns';
import { createClient } from '@/utils/supabase/server';
import { Pairing, WinePairing } from '../types';

type ProductListingPage = {};

export default async function ProductListingPage({}: ProductListingPage) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return <p>You must be logged in to view your wines.</p>;
  }

  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const response = await fetch(`${apiUrl}/api/wine?userId=${user.id}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    return <p>Failed to fetch wines.</p>;
  }

  const pairings: Pairing[] = await response.json();
  
  // Transform pairings to match the expected format for the table
  const products: WinePairing[] = pairings.map(pairing => {
    const wine = pairing.wines;
    const dish = pairing.dishes;
    
    return {
      ...pairing,
      name: wine?.name || '',
      description: wine?.description || '',
      category: wine?.color || '',
      price: wine?.price || 0,
      photo_url: wine?.photo_url || '',
      dish: dish?.name || '',
      dish_type: dish?.dish_type || ''
    };
  });
  
  const totalProducts = products.length;

  return (
    <ProductTable
      columns={columns}
      data={products}
      totalItems={totalProducts}
    />
  );
}