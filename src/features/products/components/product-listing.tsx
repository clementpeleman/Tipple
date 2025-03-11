import { Wine } from '@/constants/data';
import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { columns } from './product-tables/columns';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

type ProductListingPage = {};

export default async function ProductListingPage({}: ProductListingPage) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return <p>You must be logged in to view your wines.</p>;
  }

  const response = await fetch(`http://localhost:3000/api/wine?userId=${user.id}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    return <p>Failed to fetch wines.</p>;
  }

  const data: Wine[] = await response.json();
  const totalProducts = data.length;
  const products: Wine[] = data;

  return (
    <ProductTable
      columns={columns}
      data={products}
      totalItems={totalProducts}
    />
  );
}