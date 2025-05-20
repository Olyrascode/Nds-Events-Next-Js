"use client";

import { useState, useEffect } from "react";

// Interface pour la structure brute du produit attendue de l'API dans ce hook
interface RawProductForHook {
  _id: string; // ou tout autre identifiant unique
  associations?: Array<{
    categoryName: string;
    navCategorySlug: string;
    _id?: string;
  }>;
  // Ajoutez d'autres champs si nécessaire pour le typage, même s'ils ne sont pas utilisés directement ici
}

export function useCategories(navCategory: string) {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true); // S'assurer que loading est true au début du fetch
      setError(null); // Réinitialiser l'erreur
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr"
          }/api/products` // On pourrait aussi avoir besoin des packs si des catégories de packs sont exclusives
          // Pour l'instant, on se base sur les produits simples.
          // Si les packs peuvent définir des catégories uniques, il faudra aussi les fetcher.
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch products: ${response.status} ${response.statusText}`
          );
        }
        const products: RawProductForHook[] = await response.json();

        // Extraire les categoryName uniques à partir des associations
        const uniqueCategoriesForNav = new Set<string>();
        products.forEach((product) => {
          if (product.associations) {
            product.associations.forEach((assoc) => {
              if (assoc.navCategorySlug === navCategory && assoc.categoryName) {
                uniqueCategoriesForNav.add(assoc.categoryName);
              }
            });
          }
        });

        setCategories(Array.from(uniqueCategoriesForNav).sort()); // Trier pour un affichage cohérent
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors de la récupération des catégories"
        );
        setLoading(false);
      }
    };

    fetchCategories();
  }, [navCategory]);

  return { categories, loading, error };
}
