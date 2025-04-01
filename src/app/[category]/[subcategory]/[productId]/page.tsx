"use client";

import React, { useEffect, useState } from "react";
import { Container, CircularProgress } from "@mui/material";
import { fetchProductById } from "../../../../services/products.service";
import { useRouter } from "next/navigation";
import ProductDetailsClient from "../../../produits/[productId]/ProductDetailsClient";
import "../../../produits/[productId]/ProductDetails.scss";
import { slugify } from "../../../../utils/slugify";

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string; productId: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Déballer les paramètres avec React.use()
  const resolvedParams = React.use(params);
  const { category, subcategory, productId } = resolvedParams;

  useEffect(() => {
    // Vérifier si l'URL contient des espaces encodés (%20)
    const hasEncodedSpaces = subcategory.includes("%20");

    if (hasEncodedSpaces) {
      // Décoder l'URL et remplacer les espaces par des tirets
      const decodedSubcategory = decodeURIComponent(subcategory);
      const slugifiedSubcategory = slugify(decodedSubcategory);

      // Rediriger vers l'URL corrigée
      router.replace(`/${category}/${slugifiedSubcategory}/${productId}`);
      return;
    }

    // Cas spécial: si c'est un produit de type tentes avec un format URL incorrect
    if (category === "tentes" && subcategory === "tentes") {
      // Rediriger vers le format simplifié pour les tentes
      router.replace(`/tentes/${productId}`);
      return;
    }

    // Vérifie si l'ID est un identifiant MongoDB (24 caractères hexadécimaux)
    const isMongoDB_ID = /^[0-9a-f]{24}$/i.test(productId);

    if (isMongoDB_ID) {
      // Si c'est un ID MongoDB, récupère le produit pour obtenir son slug
      const redirectToSlug = async () => {
        try {
          const product = await fetchProductById(productId);
          if (product && product.slug) {
            if (product.navCategory?.toLowerCase() === "tentes") {
              // Format simplifié pour les tentes
              router.replace(`/tentes/${product.slug}`);
            } else {
              // Format standard pour les autres produits
              router.replace(`/${category}/${subcategory}/${product.slug}`);
            }
          } else {
            setLoading(false);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du produit:", error);
          setLoading(false);
        }
      };
      redirectToSlug();
    } else {
      // Si c'est déjà un slug, on affiche simplement le produit
      setLoading(false);
    }
  }, [productId, category, subcategory, router]);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  // On utilise le productId des paramètres pour afficher le produit
  return <ProductDetailsClient productId={productId} />;
}
