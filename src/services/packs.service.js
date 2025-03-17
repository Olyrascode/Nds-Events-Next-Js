const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-nds-events.fr';


// Créer un pack
export const createPack = async (packData) => {
  try {
    const formData = new FormData();
    formData.append('title', packData.title);
    formData.append('description', packData.description);

    // On ne fait qu'une fois le mapping
    const convertedProducts = packData.products.map(item => ({
      product: item.id || item._id,
      quantity: item.quantity
    }));
    formData.append('products', JSON.stringify(convertedProducts));

    formData.append('discountPercentage', packData.discountPercentage);
    formData.append('minRentalDays', packData.minRentalDays);
    formData.append('category', packData.category);
    formData.append('navCategory', packData.navCategory);
    if (packData.seo) {
      formData.append('seoTitle', packData.seo.title);
      formData.append('seoMetaDescription', packData.seo.metaDescription);
    }
    if (packData.image) {
      formData.append('image', packData.image);
    }

    const response = await fetch(`${API_URL}/api/packs`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create pack');
    }

    const newPack = await response.json();
    return newPack;
  } catch (error) {
    console.error('Error creating pack:', error);
    throw error;
  }
};

// Récupérer tous les packs
export const fetchPacks = async () => {
  try {
    const response = await fetch(`${API_URL}/api/packs`);
    if (!response.ok) {
      throw new Error('Failed to fetch packs');
    }
    const packs = await response.json();
    // Normalisation de _id en id
    const normalized = packs.map(pack => ({
      ...pack,
      id: pack._id,
    }));
    return normalized;
  } catch (error) {
    console.error('Error fetching packs:', error);
    throw error;
  }
};


// Récupérer un pack par ID
export const fetchPackById = async (packId) => {
  try {
    const response = await fetch(`${API_URL}/api/packs/${packId}`);
    if (!response.ok) {
      throw new Error('Pack not found');
    }
    const pack = await response.json();
    return pack;
  } catch (error) {
    console.error('Error fetching pack:', error);
    throw error;
  }
};
// Récupérer un pack par slug
export const fetchPackBySlug = async (slug) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/packs/`);
  if (!response.ok) {
    throw new Error('Pack not found');
  }
  const pack = await response.json();
  return pack;
};



// Mettre à jour un pack
export const updatePack = async (packId, packData) => {
  try {
    const formData = new FormData();
    formData.append('title', packData.title);
    formData.append('description', packData.description);

    // On convertit comme pour createPack
    const convertedProducts = packData.products.map(item => ({
      product: item.id || item._id,
      quantity: item.quantity
    }));
    formData.append('products', JSON.stringify(convertedProducts));

    formData.append('discountPercentage', packData.discountPercentage);
    formData.append('minRentalDays', packData.minRentalDays);

    if (packData.image) {
      formData.append('image', packData.image);
    }

    const response = await fetch(`${API_URL}/api/packs/${packId}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to update pack');
    }

    const updatedPack = await response.json();
    return updatedPack;
  } catch (error) {
    console.error('Error updating pack:', error);
    throw error;
  }
};


// Supprimer un pack
export const deletePack = async (packId) => {
  try {
    if (!packId) {
      throw new Error('Pack ID is undefined');
    }

    const response = await fetch(`${API_URL}/api/packs/${packId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete pack');
    }

    return true;
  } catch (error) {
    console.error('Error deleting pack:', error);
    throw error;
  }
};
