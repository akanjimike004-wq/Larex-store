import { Category, Product, Order } from '../types/database';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'T-Shirts', slug: 't-shirts', created_at: new Date().toISOString() },
  { id: 'cat-2', name: 'Hoodies', slug: 'hoodies', created_at: new Date().toISOString() },
  { id: 'cat-3', name: 'Accessories', slug: 'accessories', created_at: new Date().toISOString() },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Classic White Tee',
    slug: 'classic-white-tee',
    description: 'A premium cotton t-shirt for everyday comfort.',
    price: 29.99,
    stock: 100,
    category_id: 'cat-1',
    is_featured: true,
    created_at: new Date().toISOString(),
    categories: MOCK_CATEGORIES[0],
    product_images: [
      { id: 'img-1', product_id: 'prod-1', url: 'https://picsum.photos/seed/tee1/800/1000', is_main: true, created_at: new Date().toISOString() }
    ]
  },
  {
    id: 'prod-2',
    name: 'Midnight Black Hoodie',
    slug: 'midnight-black-hoodie',
    description: 'Stay warm and stylish with our signature hoodie.',
    price: 59.99,
    stock: 50,
    category_id: 'cat-2',
    is_featured: true,
    created_at: new Date().toISOString(),
    categories: MOCK_CATEGORIES[1],
    product_images: [
      { id: 'img-2', product_id: 'prod-2', url: 'https://picsum.photos/seed/hoodie1/800/1000', is_main: true, created_at: new Date().toISOString() }
    ]
  },
  {
    id: 'prod-3',
    name: 'Leather Minimalist Wallet',
    slug: 'leather-minimalist-wallet',
    description: 'Handcrafted leather wallet for the modern professional.',
    price: 45.00,
    stock: 30,
    category_id: 'cat-3',
    is_featured: false,
    created_at: new Date().toISOString(),
    categories: MOCK_CATEGORIES[2],
    product_images: [
      { id: 'img-3', product_id: 'prod-3', url: 'https://picsum.photos/seed/wallet1/800/1000', is_main: true, created_at: new Date().toISOString() }
    ]
  }
];

export const MOCK_ORDERS: Order[] = [];
