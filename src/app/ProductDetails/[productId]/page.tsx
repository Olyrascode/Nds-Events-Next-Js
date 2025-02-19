
import { fetchProductById } from '../../../services/products.service';
import ProductDetailsClient from './ProducDetailsClient';

export async function generateMetadata({ params }: { params: { productId: string } }) {
  const product = await fetchProductById(params.productId);
  return {
    title: product.seo?.title || product.title,
    description: product.seo?.metaDescription || product.description,
  };
}

export default async function ProductDetailsPage({ params }: { params: { productId: string } }) {
  const product = await fetchProductById(params.productId);
  return <ProductDetailsClient product={product} />;
}
