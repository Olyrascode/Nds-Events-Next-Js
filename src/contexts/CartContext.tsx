"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Définition de fixImageUrl
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

const fixImageUrl = (url: string | undefined | null): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const apiURL = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
  const imagePath = url.startsWith("/") ? url.slice(1) : url;
  if (!imagePath) return "";
  return `${apiURL}/api/files/${imagePath}`;
};

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
    const processedItem = { ...item };

    // Corriger l'URL de l'image principale de l'item
    if (processedItem.imageUrl) {
      processedItem.imageUrl = fixImageUrl(processedItem.imageUrl);
    }

    // Si c'est un pack et qu'il a des produits, corriger leurs URLs d'image aussi
    if (
      processedItem.isPack &&
      processedItem.products &&
      processedItem.products.length > 0
    ) {
      processedItem.products = processedItem.products.map((subProduct) => {
        if (subProduct.imageUrl) {
          return { ...subProduct, imageUrl: fixImageUrl(subProduct.imageUrl) };
        }
        return subProduct;
      });
    }

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem.id === processedItem.id &&
          JSON.stringify(cartItem.selectedOptions || {}) ===
            JSON.stringify(processedItem.selectedOptions || {})
      );
      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...processedItem,
          cartItemId: updatedCart[existingItemIndex].cartItemId || generateId(),
        };
        return updatedCart;
      } else {
        return [...prevCart, { ...processedItem, cartItemId: generateId() }];
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
