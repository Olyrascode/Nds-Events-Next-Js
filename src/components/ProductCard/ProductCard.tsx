"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();

  const extractCategory = () => {
    // Extraire la catégorie de l'URL actuelle
    if (pathname) {
      const parts = pathname.split("/").filter((p) => p);
      if (parts.length >= 1) {
        return parts[0]; // Première partie = catégorie principale
      }
    }
    return null;
  };

  const handleViewDetails = () => {
    if (isPack) {
      // Pour les packs, on utilise toujours le slug s'il existe
      const identifier = product.slug || product._id;

      // Essayer d'extraire la catégorie de l'URL actuelle
      const currentCategory = extractCategory();

      if (currentCategory && currentCategory !== "packs-complets") {
        // Si on est déjà dans une catégorie (comme "la-table"), l'utiliser dans l'URL du pack
        router.push(`/${currentCategory}/packs-complets/${identifier}`);
      } else {
        // Sinon, utiliser l'URL par défaut des packs
        router.push(`/packs-complets/${identifier}`);
      }
    } else {
      // Pour les produits normaux, on utilise le slug s'il existe, sinon on crée un slug à partir du titre
      const slug = product.slug || slugifyTitle(product.title);
      const identifier = slug;

      // Si c'est un ID et non un slug, log un avertissement pour encourager l'usage des slugs
      if (!product.slug) {
        console.warn(
          `Produit sans slug détecté: ${product.title} (${product._id}). Un slug temporaire a été créé.`
        );
      }

      // Cas spécial pour les tentes qui n'ont pas de sous-catégories
      if (product.navCategory?.toLowerCase() === "tentes") {
        router.push(`/tentes/${identifier}`);
      } else {
        // Pour les autres produits, utiliser le format standard avec sous-catégorie
        const category = product.navCategory?.toLowerCase() || "la-table";
        // Assurer que subcategory utilise des tirets au lieu d'espaces pour les URL
        let subcategory = product.category?.toLowerCase() || "autre";

        // Remplacer les espaces par des tirets dans la sous-catégorie
        subcategory = subcategory.replace(/\s+/g, "-");

        router.push(`/${category}/${subcategory}/${identifier}`);
      }
    }
  };

  // Fonction utilitaire pour générer un slug temporaire à partir du titre
  const slugifyTitle = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[éèêë]/g, "e")
      .replace(/[àâä]/g, "a")
      .replace(/[ùûü]/g, "u")
      .replace(/[ôö]/g, "o")
      .replace(/[îï]/g, "i")
      .replace(/[ç]/g, "c")
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
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
