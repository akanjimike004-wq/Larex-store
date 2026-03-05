import { Category, Product, Order } from '../types/database';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_ORDERS } from './mockData';

// Helper to manage local storage
const getStorage = <T>(key: string, initial: T): T => {
  const stored = localStorage.getItem(`sirlarex_${key}`);
  if (!stored) {
    localStorage.setItem(`sirlarex_${key}`, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

const setStorage = <T>(key: string, data: T) => {
  localStorage.setItem(`sirlarex_${key}`, JSON.stringify(data));
};

export const api = {
  products: {
    getAll: async (category?: string) => {
      const products = getStorage<Product[]>('products', MOCK_PRODUCTS);
      if (category) {
        return products.filter(p => p.category_id === category);
      }
      return products;
    },
    getOne: async (id: string) => {
      const products = getStorage<Product[]>('products', MOCK_PRODUCTS);
      const product = products.find(p => p.id === id);
      if (!product) throw new Error('Product not found');
      return product;
    },
    create: async (productData: any) => {
      const products = getStorage<Product[]>('products', MOCK_PRODUCTS);
      const newProduct: Product = {
        ...productData,
        id: `prod-${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
        product_images: productData.images || []
      };
      const updated = [newProduct, ...products];
      setStorage('products', updated);
      return newProduct;
    },
    update: async (id: string, productData: any) => {
      const products = getStorage<Product[]>('products', MOCK_PRODUCTS);
      const index = products.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Product not found');
      
      const updatedProduct = { ...products[index], ...productData };
      products[index] = updatedProduct;
      setStorage('products', products);
      return updatedProduct;
    },
    delete: async (id: string) => {
      const products = getStorage<Product[]>('products', MOCK_PRODUCTS);
      const updated = products.filter(p => p.id !== id);
      setStorage('products', updated);
    }
  },
  categories: {
    getAll: async () => {
      return getStorage<Category[]>('categories', MOCK_CATEGORIES);
    },
    create: async (categoryData: any) => {
      const categories = getStorage<Category[]>('categories', MOCK_CATEGORIES);
      const newCategory: Category = {
        ...categoryData,
        id: `cat-${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString()
      };
      const updated = [...categories, newCategory];
      setStorage('categories', updated);
      return newCategory;
    },
    delete: async (id: string) => {
      const categories = getStorage<Category[]>('categories', MOCK_CATEGORIES);
      const updated = categories.filter(c => c.id !== id);
      setStorage('categories', updated);
    }
  },
  orders: {
    getAll: async () => {
      return getStorage<Order[]>('orders', MOCK_ORDERS);
    },
    create: async (orderData: any) => {
      const orders = getStorage<Order[]>('orders', MOCK_ORDERS);
      const newOrder: Order = {
        ...orderData,
        id: `order-${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
        status: 'pending'
      };
      const updated = [newOrder, ...orders];
      setStorage('orders', updated);
      return newOrder;
    },
    updateStatus: async (id: string, status: string) => {
      const orders = getStorage<Order[]>('orders', MOCK_ORDERS);
      const index = orders.findIndex(o => o.id === id);
      if (index === -1) throw new Error('Order not found');
      
      orders[index].status = status as any;
      setStorage('orders', orders);
    }
  }
};
