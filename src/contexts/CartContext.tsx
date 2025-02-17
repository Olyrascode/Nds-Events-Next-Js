// "use client";

// import { createContext, useContext, useState } from "react";
// import { addToCart as addToCartUtil } from "@/utils/cartUtils";



// type CartItem = {
//   id: string;
//   title: string;
//   price: number;
//   quantity: number;
//   startDate: string | null;
//   endDate: string | null;
//   imageUrl?: string;
// };

// type CartContextType = {
//   cart: CartItem[];
//   addToCart: (product: CartItem, quantity: number, startDate: string, endDate: string) => void;
//   removeFromCart: (productId: string) => void;
//   clearCart: () => void;
//   isCartOpen: boolean;
//   setIsCartOpen: (isOpen: boolean) => void;
// };

// const CartContext = createContext<CartContextType | null>(null);

// export function useCart() {
//   return useContext(CartContext);
// }

// export function CartProvider({ children }: { children: React.ReactNode }) {
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [isCartOpen, setIsCartOpen] = useState(false);

//   const addToCart = (product: CartItem, quantity: number, startDate: string, endDate: string) => {
//     setCart((currentCart) => addToCartUtil(currentCart, product, quantity, startDate, endDate));
//     setIsCartOpen(true);
//   };

//   const removeFromCart = (productId: string) => {
//     setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
//   };

//   const clearCart = () => {
//     setCart([]);
//   };

//   return (
//     <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isCartOpen, setIsCartOpen }}>
//       {children}
//     </CartContext.Provider>
//   );
// }
"use client";

import React, { createContext, useContext, useState } from "react";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  startDate: Date | null;
  endDate: Date | null;
  imageUrl?: string;
  type?: "pack" | "product";
  selectedOptions?: {
    deliveryMandatory?: boolean;
    [key: string]: unknown;
  };
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  function addToCart(item: CartItem) {
    setCart(prev => [...prev, item]);
    setIsCartOpen(true);
  }

  function removeFromCart(productId: string) {
    setCart(prev => prev.filter(cartItem => cartItem.id !== productId));
  }

  function clearCart() {
    setCart([]);
  }

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
