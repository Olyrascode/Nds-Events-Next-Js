"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
// Use a relative import if your tsconfig paths aren't set up
import { Product } from "../../type/Product";
import "./ProductCard.scss";

// Ajout de la constante pour l'URL de l'API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

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

      // Rediriger tous les produits vers le nouveau format /produits/slug
      router.push(`/produits/${identifier}`);
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

  // Modifier la ligne pour transformer l'URL de l'image
  const imageUrl = product.imageUrl
    ? product.imageUrl.replace("http://localhost:5000", API_URL)
    : "/default-placeholder.png";
  const title = product.title || product.name;

  return (
    <Card className="product-card">
      <div className="product-card__image-container">
        <Image
          src={imageUrl}
          alt={title}
          width={0}
          height={0}
          sizes="100%"
          className="product-card__image"
          loading="lazy"
          style={{
            objectFit: "contain",
            backgroundColor: "#ffff",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
      </div>
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
