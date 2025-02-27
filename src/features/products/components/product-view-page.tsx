import { wineService } from '@/constants/wineItem-service';
import { Wine } from '@/constants/data';
import { notFound } from 'next/navigation';
import ProductForm from './product-form';
import Scanner from './scan-form';

type TProductViewPageProps = {
  productId: string;
};

export default async function ProductViewPage({
  productId
}: TProductViewPageProps) {
  let product = null;
  let pageTitle = 'Create New Wine';

  if (productId !== 'new') {
    const data = await wineService.getWineById(Number(productId));
    product = data as Wine;
    if (!product) {
      notFound();
    }
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