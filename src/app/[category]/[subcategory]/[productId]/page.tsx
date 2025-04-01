"use client";

import React, { useEffect, useState } from "react";
import { Container, CircularProgress } from "@mui/material";
import { fetchProductById } from "../../../../services/products.service";
import { useRouter } from "next/navigation";
import ProductDetailsClient from "../../../produits/[productId]/ProductDetailsClient";
import "../../../produits/[productId]/ProductDetails.scss";

export default function ProductDetailsPage({
  params,
}: {
  params: { category: string; subcategory: string; productId: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifie si l'ID est un identifiant MongoDB (24 caractères hexadécimaux)
    const isMongoDB_ID = /^[0-9a-f]{24}$/i.test(params.productId);

    if (isMongoDB_ID) {
      // Si c'est un ID MongoDB, récupère le produit pour obtenir son slug
      const redirectToSlug = async () => {
        try {
          const product = await fetchProductById(params.productId);
          if (product && product.slug) {
            // Rediriger vers l'URL avec le slug
            router.replace(
              `/${params.category}/${params.subcategory}/${product.slug}`
            );
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
  }, [params.productId, params.category, params.subcategory, router]);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  // On utilise le productId des paramètres pour afficher le produit
  return <ProductDetailsClient productId={params.productId} />;
}
