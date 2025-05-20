import React from "react";
import { notFound } from "next/navigation";
import nodeFetch from "node-fetch";
import ProductDetailsClient from "../../produit-details/[productId]/ProductDetailsClient";
import "../../produit-details/[productId]/ProductDetails.scss";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

// Interface pour définir la structure du produit
interface Product {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  seo?: {
    title?: string;
    metaDescription?: string;
  };
  // autres propriétés si nécessaire
}

// Fonction pour récupérer les données du produit - utilisée dans generateMetadata et le composant page
async function getProductData(productId: string): Promise<Product | null> {
  try {
    const response = await nodeFetch(`${API_URL}/api/products/${productId}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as Product;
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId: resolvedProductId } = await params;
  const product = await getProductData(resolvedProductId);

  if (!product) {
    return {
      title: "Produit non trouvé | NDS EVENTS",
      description:
        "Le produit que vous recherchez n'existe pas ou a été déplacé.",
    };
  }

  // Utiliser les métadonnées SEO personnalisées si elles existent
  const title = product.seo?.title || product.title || "Produit | NDS EVENTS";
  const description =
    product.seo?.metaDescription ||
    product.description ||
    "Découvrez ce produit sur NDS EVENTS";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://nds-events.fr"
      }/tentes/${resolvedProductId}`,
      images: [
        {
          url: product.imageUrl || "/images/logo.png",
          width: 800,
          height: 600,
          alt: product.title,
        },
      ],
    },
  };
}

export default async function TentesProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId: resolvedProductId } = await params;
  const product = await getProductData(resolvedProductId);

  if (!product) {
    notFound();
  }

  // Le SEO est géré par generateMetadata, nous pouvons simplement afficher le composant client
  return <ProductDetailsClient productId={resolvedProductId} />;
}
