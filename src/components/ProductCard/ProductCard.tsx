"use client";

import React from "react";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";
// Use a relative import if your tsconfig paths aren't set up
import { Product } from "../../type/Product";
import "./ProductCard.scss";

interface ProductCardProps {
  product: Product;
  onRent?: (product: Product) => void;
  isPack?: boolean;
}

export default function ProductCard({
  product,
  isPack = false,
}: ProductCardProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    if (isPack) {
      // Pour les packs, on utilise toujours le slug s'il existe
      const identifier = product.slug || product._id;
      router.push(`/packs-complets/${identifier}`);
    } else {
      // Pour les produits normaux
      const identifier = product.slug || product._id;
      router.push(`/produits/${identifier}`);
    }
  };

  const imageUrl = product.imageUrl || "/default-placeholder.png";
  const title = product.title || product.name;

  return (
    <Card className="product-card">
      <CardMedia
        component="img"
        height="200"
        image={imageUrl}
        alt={title}
        className="product-card__image"
        sx={{ objectFit: "contain", backgroundColor: "#ffff" }}
      />
      <CardContent className="product-card__content">
        <Typography gutterBottom variant="h5" component="h2">
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          className="product-card__description"
        >
          {product.description}
        </Typography>
        {/* Hide price and min quantity if it's a pack */}
        {!isPack && (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="h6"
              component="div"
              className="product-card__price"
            >
              A partir de {product.price}€ /Jour
            </Typography>
          </Box>
        )}

        <Button
          variant="contained"
          fullWidth
          onClick={handleViewDetails}
          className="product-card__button"
          sx={{ mt: 2 }}
        >
          Voir le {isPack ? "Pack" : "Produit"}
        </Button>
      </CardContent>
    </Card>
  );
}
