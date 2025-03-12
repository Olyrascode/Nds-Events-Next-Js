export const DELIVERY_FEE = 60;

/**
 * Calcule le total de la commande en utilisant les prix enregistrés dans le panier.
 * @param {Array} cart - Liste des articles dans le panier.
 * @param {string} deliveryMethod - Méthode de livraison (delivery/pickup).
 * @returns {Object} - Total des produits, frais de livraison, et total général.
 */
export const calculateOrderTotal = (cart, deliveryMethod) => {
  // On somme directement les prix déjà totaux de chaque article.
  const itemsTotal = cart.reduce((total, item) => total + parseFloat(item.price), 0);
  const deliveryFee = deliveryMethod === 'delivery' ? DELIVERY_FEE : 0;

  return {
    itemsTotal,
    deliveryFee,
    total: itemsTotal + deliveryFee
  };
};

/**
 * Formate le prix en ajoutant le symbole € et deux décimales.
 * @param {number} price - Le prix à formater.
 * @returns {string} - Le prix formaté.
 */
export const formatPrice = (price) => {
  return `€${typeof price === 'number' ? price.toFixed(2) : '0.00'}`;
};
