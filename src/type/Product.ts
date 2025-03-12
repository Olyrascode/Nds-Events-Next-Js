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
  // Ajoutez d'autres champs nécessaires ici.
}
