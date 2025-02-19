// "use client";

// import React, { useState, useEffect } from 'react';
// import { Container, Typography } from '@mui/material';
// import { useParams } from 'next/navigation';
// import ProductCard from '@/components/ProductCard/ProductCard';
// import CategoryFilter from '@/components/CategoryFilter/CategoryFilter';
// import RentalDialog from '@/components/RentalDialog';
// import "@/app/Products/_Products.scss";
// import { Product } from '../../type/Product'; // Utilise l'interface Product définie dans vos types

// // Interface pour le produit brut provenant de l'API
// interface RawProduct {
//   _id: string;
//   title: string;
//   description?: string;
//   imageUrl?: string;
//   price?: number;
//   minQuantity?: number;
//   discountPercentage?: number;
//   navCategory: string;
//   category: string;
// }

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://82.29.170.25';

// export default function LeMobilierClient() {
//   const { navCategory } = useParams();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<string[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [openRentalDialog, setOpenRentalDialog] = useState<boolean>(false);


//   // Si aucune catégorie n'est sélectionnée, affichez tous les produits déjà filtrés par navCategory 'la-table'
// const filteredProducts = selectedCategory
// ? products.filter(product => product.category === selectedCategory)
// : products;


//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const response = await fetch(`${API_URL}/api/products`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch products');
//       }
//       const productsData: RawProduct[] = await response.json();

//       // Filtrer pour ne conserver que les produits du groupe "le-mobilier"
//       const convertedProducts: Product[] = productsData
//         .filter((product: RawProduct) => product.navCategory === 'le-mobilier')
//         .map((product: RawProduct) => ({
//           _id: product._id,
//           id: product._id,                // On assigne _id à id
//           title: product.title,
//           name: product.title,            // Utiliser title pour name
//           description: product.description || '',
//           imageUrl: product.imageUrl || '',
//           price: product.price || 0,
//           minQuantity: product.minQuantity || 1,
//           discountPercentage: product.discountPercentage || 0,
//           navCategory: product.navCategory,
//           category: product.category,
//         }));
//       setProducts(convertedProducts);

//       const uniqueCategories = [
//         ...new Set(convertedProducts.map((product) => product.category))
//       ];
//       setCategories(uniqueCategories);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     }
//   };

//   const handleRentClick = (product: Product) => {
//     setSelectedProduct(product);
//     setOpenRentalDialog(true);
//   };

//   return (
//     <div className="products">
//       <Container>
//         <div className="products__header">
//           <Typography variant="h4" component="h1" className="products__title">
//             Nos produits pour le mobilier
//           </Typography>
//              <Typography variant='h5' gutterBottom className="product-packs__subtitle">
//                     Découvrez tous les produits pour le mobilier
//                     </Typography>
//         </div>

//         {/* Afficher le filtre par catégorie seulement si aucun paramètre navCategory n'est présent */}
//         {!navCategory && (
//           <div className="products__filters">
//             <CategoryFilter
//               categories={categories}
//               selectedCategory={selectedCategory}
//               onSelectCategory={setSelectedCategory}
//             />
//           </div>
//         )}

// <div className="products__grid">
//   {filteredProducts.map((product) => (
//     <ProductCard
//       key={product.id}
//       product={product}
//       onRent={handleRentClick}
//     />
//   ))}
// </div>


//         {selectedProduct && (
//           <RentalDialog
//             open={openRentalDialog}
//             onClose={() => setOpenRentalDialog(false)}
//             product={selectedProduct}
//           />
//         )}
//       </Container>
//     </div>
//   );
// }
"use client";

import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard/ProductCard';
import CategoryLinkFilter from '@/components/CategoryFilter/CategoryLinkFilter';
import RentalDialog from '@/components/RentalDialog';
import "@/app/Products/_Products.scss";
import { Product } from '../../type/Product';

// Interface pour le produit brut provenant de l'API
interface RawProduct {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  minQuantity?: number;
  discountPercentage?: number;
  navCategory: string;
  category: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-nds-events.fr';

interface LeMobilierClientProps {
  selectedCategory?: string | null;
}

export default function LeMobilierClient({ selectedCategory = null }: LeMobilierClientProps) {
  // On récupère à la fois navCategory et category (si présent dans l'URL)
  const { navCategory, category } = useParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openRentalDialog, setOpenRentalDialog] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const productsData: RawProduct[] = await response.json();

      // On ne conserve que les produits du groupe "le-mobilier"
      const convertedProducts: Product[] = productsData
        .filter((product: RawProduct) => product.navCategory === 'le-mobilier')
        .map((product: RawProduct) => ({
          _id: product._id,
          id: product._id, // On assigne _id à id
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
      setProducts(convertedProducts);

      const uniqueCategories = [
        ...new Set(convertedProducts.map((product) => product.category))
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleRentClick = (product: Product) => {
    setSelectedProduct(product);
    setOpenRentalDialog(true);
  };

  // Exemple d'une redirection si besoin (pour un clic sur une catégorie via un callback)
  const handleCategoryClick = (cat: string) => {
    router.push(`/${navCategory ?? 'le-mobilier'}/${cat}`);
  };

  return (
    <div className="products">
      <Container>
        <div className="products__header">
          <Typography variant="h4" component="h1" className="products__title">
            Nos produits pour le mobilier
          </Typography>
          <Typography variant="h5" gutterBottom className="product-packs__subtitle">
            Découvrez tous les produits pour le mobilier
          </Typography>
        </div>

        {/* Affichage du filtre par catégorie uniquement sur la page principale
            de la navCategory (si aucun sous-paramètre "category" n'est présent) */}
        {!category && (
          <div className="products__filters">
            <CategoryLinkFilter
              categories={categories}
              selectedCategory={selectedCategory}
              navCategory={navCategory ?? 'le-mobilier'}
            />
          </div>
        )}

        <div className="products__grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onRent={handleRentClick}
            />
          ))}
        </div>

        {selectedProduct && (
          <RentalDialog
            open={openRentalDialog}
            onClose={() => setOpenRentalDialog(false)}
            product={selectedProduct}
          />
        )}
      </Container>
    </div>
  );
}
