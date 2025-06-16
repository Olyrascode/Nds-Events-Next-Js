export interface Product {
  id: string;
  _id: string;
  title: string;
  name: string;
  description: string;
  price: number;
  vatRate?: number; // Taux de TVA (20 ou 5.5)
  minQuantity?: number;
  lotSize?: number;
  imageUrl?: string;
  discountPercentage?: number;
  associations?: Array<{
    categoryName: string;
    navCategorySlug: string;
    _id?: string;
  }>;
  options?: Array<{
    name: string;
    price: number;
  }>;
  carouselImages?: Array<{
    url: string;
    fileName?: string;
  }>;
  deliveryMandatory?: boolean;
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
