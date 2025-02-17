// import { useState } from 'react';
// import { useCart } from '../../../contexts/CartContext';

// export function useCartDrawer() {
//   const { cart, removeFromCart } = useCart();
//   const [error, setError] = useState(null);

//   const handleRemoveItem = (itemId) => {
//     try {
//       removeFromCart(itemId);
//     } catch (err) {
//       setError('Failed to remove item from cart');
//       console.error('Error removing item:', err);
//     }
//   };

//   const getCartTotal = () => {
//     if (!cart.length) return 0;
    
//     try {
//       const { startDate, endDate } = cart[0];
//       return calculateTotalPrice(cart, startDate, endDate);
//     } catch (error) {
//       console.error('Error calculating cart total:', error);
//       return 0;
//     }
//   };

//   return {
//     cart,
//     error,
//     total: getCartTotal(),
//     handleRemoveItem
//   };
// }