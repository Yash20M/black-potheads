export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  isNew?: boolean;
  isSale?: boolean;
  sizes: string[];
  description?: string;
  badge?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

export type Category = 'all' | 'skulls' | 'gothic' | 'tribal' | 'graffiti' | 'tattoo' | 'typography';
