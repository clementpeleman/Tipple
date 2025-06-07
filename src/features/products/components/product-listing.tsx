import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { columns } from './product-tables/columns';
import { createClient } from '@/utils/supabase/server';
import { Pairing, WinePairing } from '../types';

type ProductListingPageProps = {
  searchParams?: Record<string, string | string[]>;
};

export default async function ProductListingPage({ searchParams = {} }: ProductListingPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return <p>You must be logged in to view your wines.</p>;
  }

  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  // Get search params from props
  const searchQuery = typeof searchParams.q === "string" ? searchParams.q : '';
  const categoriesFilter = typeof searchParams.categories === "string" ? searchParams.categories : '';
  
  // Build the URL with query parameters
  const url = new URL(`${apiUrl}/api/wine`);
  url.searchParams.append('userId', user.id);
  
  if (searchQuery) {
    url.searchParams.append('q', searchQuery);
  }
  
  if (categoriesFilter) {
    url.searchParams.append('categories', categoriesFilter);
  }

  const response = await fetch(url.toString(), {
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