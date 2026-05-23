import type { Product } from '@/types';

export const PRESET_PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550572017-edb799988225?q=80&w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=500&auto=format&fit=crop',
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Diethylpropion 25mg',
    category: 'Weight loss',
    price: 85.00,
    description: 'A prescription medication used to help with weight loss in people who are significantly overweight.',
    image: PRESET_PRODUCT_IMAGES[0],
    stock: 120,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Phentermine 37.5mg',
    category: 'Weight loss',
    price: 95.50,
    description: 'An appetite suppressant that affects the central nervous system to reduce hunger cues.',
    image: PRESET_PRODUCT_IMAGES[1],
    stock: 50,
    status: 'Active',
  }
];
