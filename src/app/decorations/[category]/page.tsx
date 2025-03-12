
import nodeFetch from 'node-fetch';
import { Product } from '../../../type/Product';
import ProductCard from '@/components/ProductCard/ProductCard';

import "@/app/tous-nos-produits/_Products.scss";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-nds-events.fr';


async function fetchProducts(): Promise<Product[]> {
  const res = await nodeFetch(`${API_URL}/api/products`);
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
  }
  const productsData = await res.json();

  const products: Product[] = productsData.map((product: any) => ({
    _id: product._id,
    id: product._id,
    title: product.title,
    name: product.title,
    description: product.description || '',
    imageUrl: product.imageUrl || '',
    price: product.price || 0,
    minQuantity: product.minQuantity || 1,
    discountPercentage: product.discountPercentage || 0,
    navCategory: product.navCategory,
    category: product.category,
  }));

  return products;
}

export async function generateStaticParams() {
  const products: Product[] = await fetchProducts();
  const paths = products.map((product) => ({
    // Ici, nous n'avons qu'un paramètre "category" car "le-mobilier" est fixe.
    category: product.category,
  }));

  const uniquePaths = Array.from(new Set(paths.map((p) => JSON.stringify(p)))).map((s) =>
    JSON.parse(s)
  );

  return uniquePaths;
}

export async function generateMetadata({ params }: { params: { category: string } }) {
  // Puisque le dossier parent est "le-mobilier", on le définit ici.
  const navCategory = "decorations";
  const category = params.category;
  const decodedNavCategory = decodeURIComponent(navCategory);
  const decodedCategory = decodeURIComponent(category);
  
  return {
    title: `${decodedCategory} | NDS EVENTS`,
    description: `Découvrez tous les produits dans la catégorie ${decodedCategory}.`,
  };
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  // On définit navCategory manuellement car il n'est pas présent dans params.
  const navCategory = "decorations";
  const category = params.category;
  const decodedNavCategory = decodeURIComponent(navCategory);
  const decodedCategory = decodeURIComponent(category);
  
  const products: Product[] = await fetchProducts();

  const filteredProducts = products.filter(
    (product) =>
      product.navCategory.trim() === decodedNavCategory.trim() &&
      product.category.trim() === decodedCategory.trim()
  );



  return (
    <div className="products">
       <div className='products__header'>

      <h1>{decodedCategory}</h1>
      <p>Découvrez tous les produits dans la catégorie {decodedCategory}.</p>
        </div>
      <div className="products__grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
