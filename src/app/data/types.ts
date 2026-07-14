export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  collections?: Array<{ id: string; name: string; image: string }>;
  colors: string[];
  sizes: string[];
  image: string;
  images: string[];
  badge?: "new" | "sale" | "hot";
  description: string;
  rating: number;
  reviewCount: number;
  stock?: number;
  createdAt?: string;
}

export interface User {
  id: number;
  email: string;
  name: string | null;
  role?: string;
}

export interface Review {
  id: number;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  product: string;
}
