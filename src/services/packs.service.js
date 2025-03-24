// const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

// // Fonction utilitaire pour générer un slug
// const generateSlug = (title) => {
//   return title
//     .toLowerCase()
//     .replace(/[éèêë]/g, "e")
//     .replace(/[àâä]/g, "a")
//     .replace(/[ùûü]/g, "u")
//     .replace(/[ôö]/g, "o")
//     .replace(/[îï]/g, "i")
//     .replace(/[ç]/g, "c")
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "");
// };

// // Créer un pack
// export const createPack = async (packData) => {
//   try {
//     if (!packData.title) {
//       throw new Error("Le titre du pack est obligatoire");
//     }

//     const formData = new FormData();

//     // Générer le slug à partir du titre
//     const slug = generateSlug(packData.title);

//     // Ajouter les champs de base
//     formData.append("title", packData.title);
//     formData.append("description", packData.description);
//     formData.append("slug", slug);

//     // Ajouter les produits
//     const convertedProducts = packData.products.map((item) => ({
//       product: item.id || item._id,
//       quantity: item.quantity,
//     }));
//     formData.append("products", JSON.stringify(convertedProducts));

//     // Ajouter les autres champs
//     formData.append("discountPercentage", packData.discountPercentage);
//     formData.append("minRentalDays", packData.minRentalDays);
//     formData.append("category", packData.category);
//     formData.append("navCategory", packData.navCategory);

//     // Ajouter les champs SEO
//     if (packData.seo) {
//       formData.append(
//         "seo",
//         JSON.stringify({
//           title: packData.seo.title || packData.title,
//           metaDescription: packData.seo.metaDescription || packData.description,
//         })
//       );
//     } else {
//       // Valeurs SEO par défaut si non fournies
//       formData.append(
//         "seo",
//         JSON.stringify({
//           title: packData.title,
//           metaDescription: packData.description,
//         })
//       );
//     }

//     // Ajouter l'image si elle existe
//     if (packData.image) {
//       formData.append("image", packData.image);
//     }

//     const response = await fetch(`${API_URL}/api/packs`, {
//       method: "POST",
//       body: formData,
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || "Failed to create pack");
//     }

//     const newPack = await response.json();
//     return newPack;
//   } catch (error) {
//     console.error("Error creating pack:", error);
//     throw error;
//   }
// };

// // Récupérer tous les packs
// export const fetchPacks = async () => {
//   try {
//     const response = await fetch(`${API_URL}/api/packs`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch packs");
//     }
//     const packs = await response.json();
//     // Normalisation de _id en id
//     const normalized = packs.map((pack) => ({
//       ...pack,
//       id: pack._id,
//       slug: pack.slug || pack._id,
//     }));
//     return normalized;
//   } catch (error) {
//     console.error("Error fetching packs:", error);
//     throw error;
//   }
// };

// // Récupérer un pack par ID
// export const fetchPackById = async (packId) => {
//   try {
//     const response = await fetch(`${API_URL}/api/packs/${packId}`);
//     if (!response.ok) {
//       throw new Error("Pack not found");
//     }
//     const pack = await response.json();
//     return pack;
//   } catch (error) {
//     console.error("Error fetching pack:", error);
//     throw error;
//   }
// };

// // Récupérer un pack par slug
// export const fetchPackBySlug = async (slug) => {
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/packs/slug/${slug}`
//     );
//     if (!response.ok) {
//       throw new Error("Pack not found");
//     }
//     const pack = await response.json();
//     return pack;
//   } catch (error) {
//     console.error("Error fetching pack by slug:", error);
//     throw error;
//   }
// };

// // Mettre à jour un pack
// export const updatePack = async (packId, packData) => {
//   try {
//     const formData = new FormData();
//     formData.append("title", packData.title);
//     formData.append("description", packData.description);

//     // On convertit comme pour createPack
//     const convertedProducts = packData.products.map((item) => ({
//       product: item.id || item._id,
//       quantity: item.quantity,
//     }));
//     formData.append("products", JSON.stringify(convertedProducts));

//     formData.append("discountPercentage", packData.discountPercentage);
//     formData.append("minRentalDays", packData.minRentalDays);

//     if (packData.image) {
//       formData.append("image", packData.image);
//     }

//     const response = await fetch(`${API_URL}/api/packs/${packId}`, {
//       method: "PUT",
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error("Failed to update pack");
//     }

//     const updatedPack = await response.json();
//     return updatedPack;
//   } catch (error) {
//     console.error("Error updating pack:", error);
//     throw error;
//   }
// };

// // Supprimer un pack
// export const deletePack = async (packId) => {
//   try {
//     if (!packId) {
//       throw new Error("Pack ID is undefined");
//     }

//     const response = await fetch(`${API_URL}/api/packs/${packId}`, {
//       method: "DELETE",
//     });

//     if (!response.ok) {
//       throw new Error("Failed to delete pack");
//     }

//     return true;
//   } catch (error) {
//     console.error("Error deleting pack:", error);
//     throw error;
//   }
// };
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

    // Ajouter les champs SEO
    if (packData.seo) {
      formData.append(
        "seo",
        JSON.stringify({
          title: packData.seo.title || packData.title,
          metaDescription: packData.seo.metaDescription || packData.description,
        })
      );
    } else {
      // Valeurs SEO par défaut si non fournies
      formData.append(
        "seo",
        JSON.stringify({
          title: packData.title,
          metaDescription: packData.description,
        })
      );
    }

    // Ajouter l'image si elle existe
    if (packData.image) {
      formData.append("image", packData.image);
    }

    const response = await fetch(`${API_URL}/api/packs`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/packs/slug/${slug}`
    );
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

    // On convertit comme pour createPack
    const convertedProducts = packData.products.map((item) => ({
      product: item.id || item._id,
      quantity: item.quantity,
    }));
    formData.append("products", JSON.stringify(convertedProducts));

    formData.append("discountPercentage", packData.discountPercentage);
    formData.append("minRentalDays", packData.minRentalDays);

    formData.append("category", packData.category);
    formData.append("navCategory", packData.navCategory);

    if (packData.image) {
      formData.append("image", packData.image);
    }

    const response = await fetch(`${API_URL}/api/packs/${packId}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to update pack");
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
