"use client";

import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard/ProductCard';
import CategoryLinkFilter from '@/components/CategoryFilter/CategoryLinkFilter';
import RentalDialog from '@/components/RentalDialog';
import "@/app/tous-nos-produits/_Products.scss";
import { Product } from "../../type/Product"

// Interface pour les données brutes provenant de l'API
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

export default function LaTableClient() {
  const { navCategory, category } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openRentalDialog, setOpenRentalDialog] = useState<boolean>(false);

  // Si aucune catégorie n'est sélectionnée, affichez tous les produits déjà filtrés par navCategory 'la-table'
const filteredProducts = selectedCategory
? products.filter(product => product.category === selectedCategory)
: products;


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const productsData: RawProduct[] = await response.json();

      // Conversion vers l'interface Product attendue par ProductCard
      const convertedProducts: Product[] = productsData
        .filter((product: RawProduct) => product.navCategory === 'la-table')
        .map((product: RawProduct) => ({
          _id: product._id,
          id: product._id,               // On assigne l'_id à id
          title: product.title,
          name: product.title,           // On utilise le titre pour name
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

  return (
    <div className="products">
      <Container>
        <div className="products__header">
          <Typography variant="h4" component="h1" className="products__title">
            Nos produits pour la table
          </Typography>
             <Typography variant='h5' gutterBottom className="product-packs__subtitle">
                    Découvrez tous les produits pour vos tables
                    </Typography>
        </div>
        {!category && (
              <div className="products__filters">
                <CategoryLinkFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  navCategory={navCategory ?? 'la-table'}
                />
              </div>
            )}
    <div className="products__grid">
  {filteredProducts.map((product) => (
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
       <Container className="bottom-info">
       <button className="button-contacez-nous"><a href="/contact">Plus de produits - contactez nous</a></button>
              <p>
                <span>NDS Event&apos;s, spécialiste de la location de matériel d&apos;événement en
                Rhône Alpes (Grenoble, Isère 38) depuis plus de 10 ans !</span>  <br/><br/>Dans cette
                catégorie, vous trouverez à la location, de la vaisselle (verres,
                couverts, assiettes, tasses, etc...), tout l&apos;art de la table avec
                différentes gammes, du traditionnel "standard" aux produits hauts de
                gamme pour un mariage par exemple, mais aussi des nappes et serviettes
                en tissus blanc. <br/><br/>La vaisselle se loue propre et se rend sale, nous
                nous occupons du lavage et il est inclus dans les prix ! Idem pour les
                tissus, le service de blanchisserie est compris !<br/><br/> Une offre au
                meilleur prix garanti dans la région !
              </p>
            </Container>
    </div>
  );
}
