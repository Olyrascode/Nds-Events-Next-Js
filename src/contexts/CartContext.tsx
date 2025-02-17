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

/**
 * Définition du type CartItem
 */
export interface CartItem {
  id: string;                  // Identifiant unique du produit (ou pack)
  title: string;               // Nom du produit
  price: number;               // Prix unitaire
  quantity: number;            // Quantité demandée
  startDate: Date | null;      // Date de début de location
  endDate: Date | null;        // Date de fin de location
  type?: "pack" | "product";   // Pour distinguer un pack d'un produit
  // Ajoutez d'autres champs si nécessaire (imageUrl, etc.)
}

/**
 * Définition de l'interface du contexte
 */
export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

// Création du contexte
const CartContext = createContext<CartContextType | null>(null);

/**
 * Hook pour accéder plus facilement au contexte
 */
export function useCart() {
  return useContext(CartContext);
}

/**
 * Provider qui enveloppe l'application
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  /**
   * Ajoute un article au panier
   */
  function addToCart(item: CartItem) {
    // Exemple simple : on concatène l'article sans vérification
    setCart((prevCart) => [...prevCart, item]);
    setIsCartOpen(true);
  }

  /**
   * Retire un article du panier
   */
  function removeFromCart(productId: string) {
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== productId));
  }

  /**
   * Vide complètement le panier
   */
  function clearCart() {
    setCart([]);
  }

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
