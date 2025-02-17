// src/types/Product.ts
export interface Product {
    id: string;
    _id: string;
    title: string;
    name: string;
    description: string;
    price: number;
    minQuantity: number;
    imageUrl: string;
    discountPercentage: number;
    navCategory: string;
    category: string;
    // Add any additional fields needed (e.g. if you need id, title always, etc.)
  }
  