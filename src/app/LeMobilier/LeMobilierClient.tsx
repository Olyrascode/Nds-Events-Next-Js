"use client";

import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard/ProductCard';
import CategoryFilter from '@/components/CategoryFilter/CategoryFilter';
import RentalDialog from '@/components/RentalDialog';
import "@/app/Products/_Products.scss"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://82.29.170.25';

export default function LaTableClient() {
  const { navCategory } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openRentalDialog, setOpenRentalDialog] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const productsData = await response.json();

      // Filtrer pour ne conserver que les produits du groupe "le mobilier"
      const filteredProducts = productsData.filter(
        product => product.navCategory === 'le-mobilier'
      );
      setProducts(filteredProducts);

      const uniqueCategories = [
        ...new Set(filteredProducts.map(product => product.category))
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleRentClick = (product) => {
    setSelectedProduct(product);
    setOpenRentalDialog(true);
  };

  return (
    <div className="products">
      <Container>
        <div className="products__header">
          <Typography variant="h4" component="h1" className="products__title">
            Nos produits pour le mobilier
          </Typography>
        </div>

        {/* Afficher le filtre par catégorie seulement si aucun paramètre navCategory n'est présent */}
        {!navCategory && (
          <div className="products__filters">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        )}

        <div className="products__grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
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
