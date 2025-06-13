const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

// Récupérer toutes les catégories
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/api/categories`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des catégories");
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    throw error;
  }
};

// Créer une nouvelle catégorie
export const createCategory = async (categoryData) => {
  try {
    const response = await fetch(`${API_URL}/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la création de la catégorie");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie:", error);
    throw error;
  }
};

// Mettre à jour une catégorie
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await fetch(`${API_URL}/api/categories/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour de la catégorie");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la catégorie:", error);
    throw error;
  }
};

// Supprimer une catégorie
export const deleteCategory = async (categoryId) => {
  try {
    const response = await fetch(`${API_URL}/api/categories/${categoryId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la suppression de la catégorie"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la suppression de la catégorie:", error);
    throw error;
  }
};
