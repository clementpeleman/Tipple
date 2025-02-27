import { Wine } from '@/constants/data';
import { wineService } from '@/constants/wineItem-service';
import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { columns } from './product-tables/columns';

type ProductListingPage = {};

export default async function ProductListingPage({}: ProductListingPage) {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const pageLimit = searchParamsCache.get('limit');
  const categories = searchParamsCache.get('categories');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { categories })
  };

  const data = await wineService.getAllWines(); // Adjust this to use filters if needed
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