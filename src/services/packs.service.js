const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

// Fonction utilitaire pour générer un slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[éèêë]/g, "e")
    .replace(/[àâä]/g, "a")
    .replace(/[ùûü]/g, "u")
    .replace(/[ôö]/g, "o")
    .replace(/[îï]/g, "i")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Créer un pack
export const createPack = async (packData) => {
  try {
    if (!packData.title) {
      throw new Error("Le titre du pack est obligatoire");
    }

    const formData = new FormData();

    // Générer le slug à partir du titre
    const slug = generateSlug(packData.title);

    // Ajouter les champs de base
    formData.append("title", packData.title);
    formData.append("description", packData.description);
    formData.append("slug", slug);

    // Ajouter les produits
    const convertedProducts = packData.products.map((item) => ({
      product: item.id || item._id,
      quantity: item.quantity,
    }));
    formData.append("products", JSON.stringify(convertedProducts));

    // Ajouter les autres champs
    formData.append("discountPercentage", packData.discountPercentage);
    formData.append("minRentalDays", packData.minRentalDays);
    formData.append("category", packData.category);
    formData.append("navCategory", packData.navCategory);

    if (packData.minQuantity) {
      formData.append("minQuantity", packData.minQuantity);
    }

    // Ajouter les champs SEO
    if (packData.seo) {
      formData.append("seoTitle", packData.seo.title || packData.title);
      formData.append(
        "seoMetaDescription",
        packData.seo.metaDescription || packData.description
      );
    }

    // Ajouter l'image principale si elle existe
    if (packData.image) {
      formData.append("image", packData.image);
    }

    // Ajouter les images du carrousel directement comme fichiers
    if (packData.carouselImages && packData.carouselImages.length > 0) {
      // Limiter à 10 images maximum pour le carrousel
      const maxImages = Math.min(packData.carouselImages.length, 10);
      for (let index = 0; index < maxImages; index++) {
        const img = packData.carouselImages[index];
        if (img) {
          formData.append(`carouselImage${index}`, img);
        }
      }
    }

    // Log du contenu du formData pour déboguer
    console.log("FormData content:");
    for (let [key, value] of formData.entries()) {
      console.log(
        `${key}:`,
        value instanceof File ? `File: ${value.name}` : value
      );
    }

    const response = await fetch(`${API_URL}/api/packs`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorData;
      if (contentType && contentType.includes("application/json")) {
        errorData = await response.json();
      } else {
        const text = await response.text();
        errorData = {
          message: `Invalid server response: ${text.substring(0, 100)}`,
        };
      }
      throw new Error(errorData.message || "Failed to create pack");
    }

    const newPack = await response.json();
    return newPack;
  } catch (error) {
    console.error("Error creating pack:", error);
    throw error;
  }
};

// Récupérer tous les packs
export const fetchPacks = async () => {
  try {
    const response = await fetch(`${API_URL}/api/packs`);
    if (!response.ok) {
      throw new Error("Failed to fetch packs");
    }
    const packs = await response.json();
    // Normalisation de _id en id
    const normalized = packs.map((pack) => ({
      ...pack,
      id: pack._id,
      slug: pack.slug || pack._id,
    }));
    return normalized;
  } catch (error) {
    console.error("Error fetching packs:", error);
    throw error;
  }
};

// Récupérer un pack par ID
export const fetchPackById = async (packId) => {
  try {
    const response = await fetch(`${API_URL}/api/packs/${packId}`);
    if (!response.ok) {
      throw new Error("Pack not found");
    }
    const pack = await response.json();
    return pack;
  } catch (error) {
    console.error("Error fetching pack:", error);
    throw error;
  }
};

// Récupérer un pack par slug
export const fetchPackBySlug = async (slug) => {
  try {
    const response = await fetch(`${API_URL}/api/packs/slug/${slug}`);
    if (!response.ok) {
      throw new Error("Pack not found");
    }
    const pack = await response.json();
    return pack;
  } catch (error) {
    console.error("Error fetching pack by slug:", error);
    throw error;
  }
};

// Mettre à jour un pack
export const updatePack = async (packId, packData) => {
  try {
    const formData = new FormData();
    formData.append("title", packData.title);
    formData.append("description", packData.description);

    // Générer le slug à partir du titre si nécessaire
    if (packData.title) {
      const slug = generateSlug(packData.title);
      formData.append("slug", slug);
    }

    // On convertit comme pour createPack
    const convertedProducts = packData.products.map((item) => {
      // Afficher chaque élément pour déboguer
      console.log("Item produit à convertir:", item);
      return {
        product: item.product || item.product_id || item.id || item._id,
        quantity: item.quantity || 1,
      };
    });
    console.log("Produits convertis:", convertedProducts);
    formData.append("products", JSON.stringify(convertedProducts));

    formData.append("discountPercentage", packData.discountPercentage);
    formData.append("minRentalDays", packData.minRentalDays);
    formData.append("category", packData.category);
    formData.append("navCategory", packData.navCategory);

    if (packData.minQuantity) {
      formData.append("minQuantity", packData.minQuantity);
    }

    // Ajouter les champs SEO
    if (packData.seo) {
      formData.append("seoTitle", packData.seo.title || packData.title);
      formData.append(
        "seoMetaDescription",
        packData.seo.metaDescription || packData.description
      );
    }

    // Ajouter l'image principale si modifiée
    if (packData.image) {
      formData.append("image", packData.image);
    }

    // Ajouter les images du carrousel directement comme fichiers
    if (packData.carouselImages && packData.carouselImages.length > 0) {
      // Limiter à 10 images maximum pour le carrousel
      const maxImages = Math.min(packData.carouselImages.length, 10);
      for (let index = 0; index < maxImages; index++) {
        const img = packData.carouselImages[index];
        if (img) {
          formData.append(`carouselImage${index}`, img);
        }
      }
    }

    // Log du contenu du formData pour déboguer
    console.log("UpdatePack FormData content:");
    for (let [key, value] of formData.entries()) {
      console.log(
        `${key}:`,
        value instanceof File ? `File: ${value.name}` : value
      );
    }

    const response = await fetch(`${API_URL}/api/packs/${packId}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorData;
      if (contentType && contentType.includes("application/json")) {
        errorData = await response.json();
      } else {
        const text = await response.text();
        errorData = {
          message: `Invalid server response: ${text.substring(0, 100)}`,
        };
      }
      throw new Error(errorData.message || "Failed to update pack");
    }

    const updatedPack = await response.json();
    return updatedPack;
  } catch (error) {
    console.error("Error updating pack:", error);
    throw error;
  }
};

// Supprimer un pack
export const deletePack = async (packId) => {
  try {
    if (!packId) {
      throw new Error("Pack ID is undefined");
    }

    const response = await fetch(`${API_URL}/api/packs/${packId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete pack");
    }

    return true;
  } catch (error) {
    console.error("Error deleting pack:", error);
    throw error;
  }
};

// Récupérer les packs similaires (même catégorie)
export const getSimilarPacks = async (currentPackId, category, navCategory) => {
  try {
    if (!category) {
      console.warn("Catégorie non définie pour récupérer les packs similaires");
      return [];
    }

    // Utiliser l'API existante pour récupérer tous les packs
    const response = await fetch(`${API_URL}/api/packs`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des packs similaires");
    }

    const packs = await response.json();

    // Filtrer les packs par catégorie et exclure le pack actuel
    const similarPacks = packs.filter(
      (pack) =>
        pack._id !== currentPackId &&
        (pack.category === category ||
          (navCategory && pack.navCategory === navCategory))
    );

    // Limiter à 4 packs maximum
    return similarPacks.slice(0, 4);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des packs similaires:",
      error
    );
    return [];
  }
};
