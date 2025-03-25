export interface Product {
  _id: string;
  id?: string;
  title: string;
  name?: string;
  description: string;
  imageUrl?: string;
  price: number;
  minQuantity?: number;
  discountPercentage?: number;
  navCategory?: string;
  category?: string;
  slug?: string;
  isPack?: boolean;
  products?: {
    product: {
      _id: string;
      title: string;
      imageUrl?: string;
      price: number;
    };
    quantity: number;
  }[];
}
