export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  price: string;
  rating: number;
  reviews: number;
}

export interface Supplier {
  id: string;
  name: string;
  location: string;
  rating: number;
  experience: string;
  price: string;
  deliveryTime: string;
  contact: string;
  specialties: string[];
}