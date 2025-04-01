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
      // Pour les produits normaux, on utilise le nouveau format d'URL avec slug obligatoire
      // Si le slug n'existe pas, on utilise quand même l'ID mais on encourage à créer des slugs
      const identifier = product.slug || product._id;

      // Si c'est un ID et non un slug, log un avertissement pour encourager l'usage des slugs
      if (!product.slug) {
        console.warn(
          `Produit sans slug détecté: ${product.title} (${product._id}). Veuillez ajouter un slug à ce produit.`
        );
      }

      const category = product.navCategory?.toLowerCase() || "la-table";
      const subcategory = product.category?.toLowerCase() || "autre";
      router.push(`/${category}/${subcategory}/${identifier}`);
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
