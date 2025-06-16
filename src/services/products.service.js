const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

// Créer un produit
export const createProduct = async (productData) => {
  try {
    const formData = new FormData();
    formData.append("title", productData.title);
    formData.append("description", productData.description);
    formData.append("gamme", productData.gamme || ""); // Gamme du produit (optionnel)
    formData.append("price", productData.price);
    formData.append("vatRate", productData.vatRate || 20);
    formData.append("minQuantity", productData.minQuantity);
    /* Ancien code pour category et navCategory - commenté
    // Envoyer category comme une chaîne JSON si c'est un tableau
    if (Array.isArray(productData.category)) {
      formData.append("category", JSON.stringify(productData.category));
    } else {
      // Fallback pour une chaîne simple ou undefined/null (le backend le mettra dans un tableau si besoin)
      formData.append("category", productData.category || JSON.stringify([]));
    }
    formData.append("navCategory", productData.navCategory);
    */

    // Nouvelle gestion pour associations
    if (productData.associations && Array.isArray(productData.associations)) {
      formData.append("associations", JSON.stringify(productData.associations));
    } else {
      formData.append("associations", JSON.stringify([])); // Envoyer un tableau vide par défaut si non défini ou pas un tableau
    }

    formData.append("stock", productData.stock || 0);
    formData.append("options", JSON.stringify(productData.options || []));
    formData.append("lotSize", productData.lotSize || 1);
    // Ajouter les champs SEO
    if (productData.seo) {
      formData.append("seoTitle", productData.seo.title);
      formData.append("seoMetaDescription", productData.seo.metaDescription);
    }
    if (productData.image) {
      formData.append("image", productData.image);
    }

    // Ajouter les images du carrousel directement comme fichiers
    if (productData.carouselImages && productData.carouselImages.length > 0) {
      productData.carouselImages.forEach((img, index) => {
        if (img) {
          formData.append(`carouselImage${index}`, img);
        }
      });
    }

    console.log("FormData content:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create product");
    }

    const product = await response.json();
    return product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const fetchProductById = async (productId) => {
  const response = await fetch(`${API_URL}/api/products/${productId}`);
  if (!response.ok) {
    throw new Error("Product not found");
  }
  const product = await response.json();
  console.log(
    "[Service fetchProductById] Product data received from API:",
    product
  );
  console.log(
    "[Service fetchProductById] Type of product.category:",
    typeof product.category,
    "Is Array?",
    Array.isArray(product.category)
  );

  // Normaliser
  return {
    ...product,
    id: product._id,
  };
};

// Récupérer un produit par son ID
export const getProductById = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/api/products/${productId}`);
    if (!response.ok)
      throw new Error("Erreur lors de la récupération du produit");
    const data = await response.json();
    console.log("getProductById data:", data); // <-- Debug
    return data.product ? data.product : data;
  } catch (error) {
    console.error("Erreur getProductById:", error);
    throw error;
  }
};

// Mettre à jour un produit
export const updateProduct = async (productId, productData) => {
  try {
    const formData = new FormData();
    formData.append("title", productData.title);
    formData.append("description", productData.description);
    formData.append("gamme", productData.gamme || ""); // Gamme du produit (optionnel)
    formData.append("price", productData.price);
    formData.append("vatRate", productData.vatRate || 20);
    formData.append("minQuantity", productData.minQuantity);
    /* Ancien code pour category et navCategory - commenté
    // Envoyer category comme une chaîne JSON si c'est un tableau
    if (Array.isArray(productData.category)) {
      formData.append("category", JSON.stringify(productData.category));
    } else {
      // Fallback pour une chaîne simple ou undefined/null
      formData.append("category", productData.category || JSON.stringify([]));
    }
    formData.append("navCategory", productData.navCategory);
    */

    // Nouvelle gestion pour associations
    if (productData.associations && Array.isArray(productData.associations)) {
      formData.append("associations", JSON.stringify(productData.associations));
    } else {
      formData.append("associations", JSON.stringify([])); // Envoyer un tableau vide par défaut si non défini ou pas un tableau
    }

    formData.append("stock", productData.stock || 0);
    formData.append("lotSize", productData.lotSize || 1);
    formData.append("options", JSON.stringify(productData.options || []));

    // Log pour vérifier la valeur avant de l'ajouter au FormData
    console.log(
      "[Frontend Service] productData.deliveryMandatory:",
      productData.deliveryMandatory
    );
    formData.append("deliveryMandatory", productData.deliveryMandatory);

    // Ajouter les champs SEO
    if (productData.seo) {
      formData.append("seoTitle", productData.seo.title);
      formData.append("seoMetaDescription", productData.seo.metaDescription);
    }
    if (productData.image) {
      formData.append("image", productData.image);
    }

    // Ajouter les images du carrousel directement comme fichiers
    if (productData.carouselImages && productData.carouselImages.length > 0) {
      productData.carouselImages.forEach((img, index) => {
        if (img) {
          formData.append(`carouselImage${index}`, img);
        }
      });
    }

    // Log pour inspecter le contenu du FormData avant l'envoi
    console.log("[Frontend Service] FormData content before sending:");
    for (let [key, value] of formData.entries()) {
      console.log(`[FormData] ${key}:`, value);
    }

    const response = await fetch(`${API_URL}/api/products/${productId}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Erreur updateProduct:", response.status, errText);
      throw new Error("Failed to update product");
    }

    const updatedProduct = await response.json();
    return updatedProduct;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Supprimer un produit
export const deleteProduct = async (productId) => {
  try {
    // Assure-toi que productId est défini et correct
    if (!productId) {
      throw new Error("Product ID is undefined");
    }

    const response = await fetch(`${API_URL}/api/products/${productId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }

    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const fetchProducts = async () => {
  const response = await fetch(`${API_URL}/api/products`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  const products = await response.json();

  // Transforme _id en id pour que tout votre front utilise .id
  const normalized = products.map((prod) => ({
    ...prod,
    id: prod._id, // on crée un champ id
  }));

  return normalized;
};

export const getSimilarProducts = async (productId, category, gamme = null) => {
  try {
    console.log(`🔍 [Service] Recherche de produits similaires:`, {
      productId,
      gamme,
      category,
    });

    // Temporairement, utiliser l'ancienne logique en attendant le déploiement
    // 1. D'abord essayer de récupérer par gamme si elle est définie
    if (gamme && gamme.trim() !== "") {
      console.log(`🔍 [Service] Recherche par gamme: "${gamme}"`);

      const responseByGamme = await fetch(`${API_URL}/api/products`);
      if (responseByGamme.ok) {
        const allProducts = await responseByGamme.json();
        const productsByGamme = allProducts
          .filter((product) => product._id !== productId)
          .filter(
            (product) => product.gamme && product.gamme.trim() === gamme.trim()
          );

        console.log(
          `✅ [Service] ${productsByGamme.length} produits trouvés dans la gamme "${gamme}"`
        );

        if (productsByGamme.length >= 4) {
          return productsByGamme.slice(0, 8); // Limiter à 8 produits max
        }

        // Si moins de 4 produits dans la gamme, compléter avec la catégorie
        if (category && category.trim() !== "") {
          console.log(
            `🔍 [Service] Complément avec la catégorie "${category}"`
          );
          const productsByCategory = allProducts
            .filter((product) => product._id !== productId)
            .filter(
              (product) =>
                !product.gamme || product.gamme.trim() !== gamme.trim()
            ) // Exclure ceux déjà dans la gamme
            .filter(
              (product) =>
                product.associations &&
                product.associations.some(
                  (assoc) => assoc.categoryName === category.trim()
                )
            );

          const combined = [...productsByGamme, ...productsByCategory].slice(
            0,
            8
          );
          console.log(
            `✅ [Service] Total: ${combined.length} produits similaires (${productsByGamme.length} gamme + ${productsByCategory.length} catégorie)`
          );
          return combined;
        }

        return productsByGamme;
      }
    }

    // 2. Fallback sur la catégorie uniquement
    if (category && category.trim() !== "") {
      console.log(
        `🔍 [Service] Recherche par catégorie seulement: "${category}"`
      );
      const response = await fetch(`${API_URL}/api/products`);
      if (response.ok) {
        const allProducts = await response.json();
        const productsByCategory = allProducts
          .filter((product) => product._id !== productId)
          .filter(
            (product) =>
              product.associations &&
              product.associations.some(
                (assoc) => assoc.categoryName === category.trim()
              )
          );

        console.log(
          `✅ [Service] ${productsByCategory.length} produits trouvés dans la catégorie "${category}"`
        );
        return productsByCategory.slice(0, 8);
      }
    }

    console.log(`⚠️ [Service] Aucun paramètre valide fourni`);
    return [];
  } catch (error) {
    console.error("❌ [Service] Erreur:", error);
    return [];
  }
};
