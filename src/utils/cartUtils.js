
/**
 * Calcule le total du panier basé uniquement sur le prix sauvegardé lors de l'ajout
 * @param {Array} items - Liste des articles dans le panier.
 * @returns {number} - Prix total du panier
 */
export const calculateTotalPrice = (items) => {
  try {
      if (!items.length) return 0;

      // Utilisation du prix total déjà enregistré dans le panier
      return items.reduce((total, item) => {
          const itemTotal = parseFloat(item.price); // Utilisation directe du prix stocké
          return total + itemTotal;
      }, 0);
  } catch (error) {
      console.error('Erreur lors du calcul du prix total:', error);
      return 0;
  }
};

/**
* Ajoute un produit dans le panier avec le prix total déjà calculé
* @param {Array} cart - Liste actuelle des articles dans le panier
* @param {Object} product - Produit à ajouter
* @returns {Array} - Panier mis à jour
*/
export const addToCart = (cart, product) => {
  try {
      const existingItem = cart.find(item => item.id === product.id);
      
      if (existingItem) {
          return cart.map(item =>
              item === existingItem
                  ? { ...item, quantity: item.quantity + product.quantity }
                  : item
          );
      }

      // Ajout du produit avec le prix total déjà calculé
      return [...cart, product];
  } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
  }
};
