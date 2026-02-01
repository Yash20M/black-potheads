import { Product } from '@/types/product';
import hoodieBlack from '@/assets/products/hoodie-black.jpg';
import teeWhite from '@/assets/products/tee-white.jpg';
import cargoOlive from '@/assets/products/cargo-olive.jpg';
import sneakersBlack from '@/assets/products/sneakers-black.jpg';
import crewGray from '@/assets/products/crew-gray.jpg';
import beanieBlack from '@/assets/products/beanie-black.jpg';

export const products: Product[] = [
  {
    id: '1',
    name: 'Essential Oversized Hoodie',
    price: 149,
    category: 'hoodies',
    image: hoodieBlack,
    isNew: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Premium heavyweight cotton hoodie with oversized fit and kangaroo pocket.',
  },
  {
    id: '2',
    name: 'Graphic Print Tee',
    price: 79,
    originalPrice: 99,
    category: 'tees',
    image: teeWhite,
    isSale: true,
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Limited edition graphic tee featuring exclusive streetwear artwork.',
  },
  {
    id: '3',
    name: 'Tactical Cargo Pants',
    price: 189,
    category: 'pants',
    image: cargoOlive,
    sizes: ['28', '30', '32', '34', '36'],
    description: 'Military-inspired cargo pants with multiple utility pockets.',
  },
  {
    id: '4',
    name: 'Urban High-Top Sneakers',
    price: 219,
    category: 'footwear',
    image: sneakersBlack,
    isNew: true,
    sizes: ['7', '8', '9', '10', '11', '12'],
    description: 'Classic high-top sneakers reimagined with premium materials.',
  },
  {
    id: '5',
    name: 'Minimalist Crew Sweatshirt',
    price: 119,
    category: 'hoodies',
    image: crewGray,
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Clean and simple crewneck sweatshirt in premium fleece.',
  },
  {
    id: '6',
    name: 'Ribbed Knit Beanie',
    price: 45,
    category: 'accessories',
    image: beanieBlack,
    sizes: ['ONE SIZE'],
    description: 'Cozy knit beanie with a classic fisherman style.',
  },
];

export const categories = [
  { id: 'all', label: 'All' },
  { id: 'hoodies', label: 'Hoodies' },
  { id: 'tees', label: 'Tees' },
  { id: 'pants', label: 'Pants' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'accessories', label: 'Accessories' },
];
