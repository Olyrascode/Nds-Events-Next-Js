// import { calculateRentalDays } from './dateUtils';

// export const calculateTotalPrice = (items, startDate, endDate) => {
//   try {
//     if (!items.length) return 0;
    
//     const days = calculateRentalDays(startDate, endDate);
    
//     return items.reduce((total, item) => {
//       const itemPrice = parseFloat(item.price) * parseInt(item.quantity) * days;
//       const discount = item.type === 'pack' ? (itemPrice * parseFloat(item.discountPercentage)) / 100 : 0;
//       return total + (itemPrice - discount);
//     }, 0);
//   } catch (error) {
//     console.error('Error calculating total price:', error);
//     return 0;
//   }
// };

// export const addToCart = (cart, product) => {
//   try {
//     // Clear cart if dates are different from existing items
//     if (cart.length > 0) {
//       const existingStart = new Date(cart[0].startDate).getTime();
//       const existingEnd = new Date(cart[0].endDate).getTime();
//       const newStart = new Date(product.startDate).getTime();
//       const newEnd = new Date(product.endDate).getTime();
      
//       if (newStart !== existingStart || newEnd !== existingEnd) {
//         cart = [];
//       }
//     }

//     const existingItem = cart.find(item => {
//       if (item.id !== product.id) return false;
//       if (!product.selectedOption && !item.selectedOption) return true;
//       if (!product.selectedOption || !item.selectedOption) return false;
//       return product.selectedOption.name === item.selectedOption.name &&
//              product.selectedOption.value === item.selectedOption.value;
//     });
    
//     if (existingItem) {
//       return cart.map(item =>
//         item === existingItem
//           ? { ...item, quantity: parseInt(item.quantity) + parseInt(product.quantity) }
//           : item
//       );
//     }
    
//     return [...cart, product];
//   } catch (error) {
//     console.error('Error adding to cart:', error);
//     throw error;
//   }
// };
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
