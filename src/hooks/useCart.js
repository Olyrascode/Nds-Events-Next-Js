import { useState } from 'react';
import { addToCart as addToCartUtil } from '../utils/cartUtils';

export function useCart() {
  const [cart, setCart] = useState([]);

  const addToCart = (product, quantity, startDate, endDate) => {
    setCart(currentCart => addToCartUtil(currentCart, product, quantity, startDate, endDate));
  };

  const removeFromCart = (productId) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart
  };
}