
import { fetchProductById } from '../../../services/products.service';
import ProductDetailsClient from './ProductDetailsClient';
import { redirect } from 'next/navigation';

export async function generateMetadata({ params }: { params: { productId: string } }) {
  // Await params pour s'assurer qu'il est résolu avant d'accéder à ses propriétés
  const resolvedParams = await Promise.resolve(params);
  const product = await fetchProductById(resolvedParams.productId);
  
  // Si le paramètre ressemble à un ObjectId (24 caractères) et que le produit possède un slug, rediriger
  if (resolvedParams.productId.length === 24 && product.slug) {
    redirect(`/produits/${product.slug}`);
  }
  
  return {
    title: product.seo?.title || product.title,
    description: product.seo?.metaDescription || product.description,
  };
}

export default async function ProductDetailsPage({ params }: { params: { productId: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const product = await fetchProductById(resolvedParams.productId);
  
  if (resolvedParams.productId.length === 24 && product.slug) {
    redirect(`/produits/${product.slug}`);
  }
  
  return <ProductDetailsClient product={product} />;
}
