// API Product Response
export interface ApiProduct {
  _id: string;
  name: string;
  price: number;
  category: string;
  images: string[] | { url: string }[];
  sizes: string[];
  description?: string;
  stock?: number;
  isFeatured?: boolean;
}

// Frontend Product (normalized)
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images: string[];
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

// API Categories
export type ApiCategory = 'Shiva' | 'Shrooms' | 'LSD' | 'Chakras' | 'Dark' | 'Rick n Morty';

// Frontend Categories
export type Category = 'all' | 'Shiva' | 'Shrooms' | 'LSD' | 'Chakras' | 'Dark' | 'Rick n Morty';

// Helper to normalize API product to frontend format
export const normalizeProduct = (apiProduct: ApiProduct): Product => {
  // Filter out null/undefined images and extract URLs
  const images = apiProduct.images
    .filter(img => img != null) // Remove null/undefined
    .map(img => typeof img === 'string' ? img : img.url)
    .filter(url => url != null && url !== ''); // Remove empty strings
  
  // Fallback placeholder image if no images available
  const placeholderImage = 'https://via.placeholder.com/400x500?text=No+Image';
  
  return {
    id: apiProduct._id,
    name: apiProduct.name,
    price: apiProduct.price,
    category: apiProduct.category,
    image: images[0] || placeholderImage,
    images: images.length > 0 ? images : [placeholderImage],
    sizes: apiProduct.sizes,
    description: apiProduct.description,
    isFeatured: apiProduct.isFeatured,
    isNew: apiProduct.isFeatured,
  };
};
