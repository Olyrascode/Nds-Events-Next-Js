"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Fonction simple pour générer un identifiant unique
const generateId = () =>
  Date.now().toString() + Math.random().toString(36).substring(2, 9);

export interface CartItem {
  cartItemId?: string; // identifiant unique pour chaque entrée dans le panier
  id: string;
  title: string;
  price: number;
  quantity: number;
  startDate: Date | null;
  endDate: Date | null;
  imageUrl?: string;
  type?: "pack" | "product";
  lotSize?: number; // Taille du lot pour les produits vendus par lot
  deliveryMandatory?: boolean; // Indique si le produit lui-même impose la livraison
  selectedOptions?: {
    deliveryMandatory?: boolean;
    [key: string]: unknown;
  };
  // Champ pour les produits inclus dans un pack
  products?: Array<{
    id?: string;
    _id?: string;
    title?: string;
    imageUrl?: string;
    price?: number;
    quantity: number;
    lotSize?: number;
  }>;
  isPack?: boolean;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
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
  // Initialiser le panier depuis localStorage s'il existe
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Mettre à jour le localStorage chaque fois que le panier change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  function addToCart(item: CartItem) {
    setCart((prevCart) => {
      // On considère deux items identiques si leur id et leurs options (stringifiées) sont identiques
      const existingItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem.id === item.id &&
          JSON.stringify(cartItem.selectedOptions || {}) ===
            JSON.stringify(item.selectedOptions || {})
      );
      if (existingItemIndex !== -1) {
        // Remplacer complètement l'item existant par le nouvel item
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...item,
          cartItemId: updatedCart[existingItemIndex].cartItemId || generateId(),
        };
        return updatedCart;
      } else {
        // Ajouter le produit s'il n'existe pas encore dans le panier
        return [...prevCart, { ...item, cartItemId: generateId() }];
      }
    });
    setIsCartOpen(true);
  }

  function removeFromCart(cartItemId: string) {
    setCart((prev) =>
      prev.filter((cartItem) => cartItem.cartItemId !== cartItemId)
    );
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

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
