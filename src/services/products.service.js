const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

// Créer un produit
export const createProduct = async (productData) => {
  try {
    const formData = new FormData();
    formData.append("title", productData.title);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("minQuantity", productData.minQuantity);
    formData.append("category", productData.category);
    formData.append("navCategory", productData.navCategory);
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
    formData.append("price", productData.price);
    formData.append("minQuantity", productData.minQuantity);
    formData.append("category", productData.category);
    formData.append("navCategory", productData.navCategory);
    formData.append("stock", productData.stock || 0);
    formData.append("lotSize", productData.lotSize || 1);
    formData.append("options", JSON.stringify(productData.options || []));
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
