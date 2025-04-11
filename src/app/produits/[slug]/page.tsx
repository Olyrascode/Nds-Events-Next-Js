import React from "react";
import ProductDetailsClient from "../../produit-details/[productId]/ProductDetailsClient";
import "../../produit-details/[productId]/ProductDetails.scss";
import { notFound } from "next/navigation";
import nodeFetch from "node-fetch";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

interface Product {
  _id: string;
  title: string;
  slug?: string;
  navCategory?: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  price?: number;
}

async function fetchProductByCriteria(slug: string): Promise<Product | null> {
  try {
    const response = await nodeFetch(`${API_URL}/api/products`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des produits");
    }

    const products = (await response.json()) as Product[];

    // Chercher le produit correspondant au slug
    const product = products.find((p: Product) => {
      return p.slug === slug || slugify(p.title) === slug;
    });

    return product || null;
  } catch (error) {
    console.error("Erreur lors de la recherche du produit:", error);
    return null;
  }
}

// Fonction simple de slugification pour correspondre à celle utilisée dans ProductCard
function slugify(text: string): string {
  return text
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
}

// Fonction pour formater les noms de catégories (première lettre en majuscule et tirets remplacés par des espaces)
function formatCategoryName(name: string): string {
  if (!name) return "";

  // Remplacer les tirets par des espaces et mettre la première lettre de chaque mot en majuscule
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function ProductDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  // Récupérer le slug du produit
  const { slug } = params;

  // Récupérer les informations du produit pour le fil d'Ariane
  const product = await fetchProductByCriteria(slug);

  if (!product) {
    notFound();
  }

  // Formatage des noms de catégories pour l'affichage
  const navCategory = product.navCategory?.toLowerCase() || "produits";
  const category = product.category?.toLowerCase() || "";

  // Formatage des noms pour les URLs et l'affichage
  const navCategorySlug = navCategory.replace(/\s+/g, "-");
  const categorySlug = category.replace(/\s+/g, "-");

  // Obtenir le titre du produit pour l'affichage
  const productTitle = product.title;

  // Générer les noms d'affichage avec espaces au lieu de tirets
  const navCategoryDisplay = formatCategoryName(navCategory);
  const categoryDisplay = formatCategoryName(category);

  // Génération des éléments pour le fil d'Ariane
  let breadcrumbItems = [];

  // Cas spécial pour les tentes - fil d'ariane sans catégorie
  if (navCategory === "tentes") {
    breadcrumbItems = [
      {
        label: "Tentes",
        href: "/tentes",
      },
      {
        label: productTitle,
        href: `/produits/${slug}`,
        active: true,
      },
    ];
  } else {
    // Cas normal avec catégorie et sous-catégorie
    breadcrumbItems = [
      {
        label: navCategoryDisplay,
        href: `/${navCategorySlug}`,
      },
      {
        label: categoryDisplay,
        href: `/${navCategorySlug}/${categorySlug}`,
      },
      {
        label: productTitle,
        href: `/produits/${slug}`,
        active: true,
      },
    ];
  }

  // Transmettre les infos de breadcrumb via SearchParams
  return (
    <>
      <ProductDetailsClient
        productId={slug}
        breadcrumbItems={breadcrumbItems}
      />
    </>
  );
}
