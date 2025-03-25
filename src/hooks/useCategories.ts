"use client";

import { useState, useEffect } from "react";

export function useCategories(navCategory: string) {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr"
          }/api/products`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const products = await response.json();

        // Filtrer les produits par navCategory et extraire les catégories uniques
        const filteredCategories = [
          ...new Set(
            products
              .filter((product) => product.navCategory === navCategory)
              .map((product) => product.category)
          ),
        ];

        setCategories(filteredCategories);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
        setLoading(false);
      }
    };

    fetchCategories();
  }, [navCategory]);

  return { categories, loading, error };
}
