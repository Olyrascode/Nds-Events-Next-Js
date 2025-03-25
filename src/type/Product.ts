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
  isPack?: boolean;
  slug?: string;
  products?: {
    product: {
      _id: string;
      title: string;
      imageUrl?: string;
      price: number;
    };
    quantity: number;
  }[];
  // Ajoutez d'autres champs nécessaires ici.
}
