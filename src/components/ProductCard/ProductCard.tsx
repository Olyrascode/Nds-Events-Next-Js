"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
// Use a relative import if your tsconfig paths aren’t set up
import { Product } from '../../type/Product';
import './ProductCard.scss';

interface ProductCardProps {
  product: Product;
  onRent?: (product: Product) => void;
  isPack?: boolean;
}

export default function ProductCard({ product, onRent, isPack = false }: ProductCardProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    const path = isPack ? `/PackDetails/${product._id}` : `/ProductDetails/${product._id}`;
    router.push(path);
  };

  const imageUrl = product.imageUrl || '/default-placeholder.png';

  return (
    <Card className="product-card">
      <CardMedia
        component="img"
        height="200"
        image={imageUrl}
        alt={product.title || product.name}
        className="product-card__image"
      />
      <CardContent className="product-card__content">
        <Typography gutterBottom variant="h5" component="h2">
          {product.title || product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="product-card__description">
          {product.description}
        </Typography>
        {/* Hide price and min quantity if it's a pack */}
        {!isPack && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" component="div" className="product-card__price">
              €{product.price}/Jour
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Min. quantité: {product.minQuantity}
            </Typography>
          </Box>
        )}
        {/* Show discount only for packs */}
        {isPack && product.discountPercentage && product.discountPercentage > 0 && (
          <Chip
            label={`${product.discountPercentage}% off`}
            color="primary"
            size="small"
            className="product-card__discount"
          />
        )}
        <Button
          variant="contained"
          fullWidth
          onClick={handleViewDetails}
          className="product-card__button"
          sx={{ mt: 2 }}
        >
          Voir le {isPack ? 'Pack' : 'Produit'}
        </Button>
      </CardContent>
    </Card>
  );
}
