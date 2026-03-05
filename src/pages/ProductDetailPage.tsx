import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { useProduct, useProducts } from '../hooks/useData';
import { useCart } from '../context/CartContext';
import { formatPrice, cn } from '../utils/helpers';
import { ShoppingBag, Heart, Share2, ChevronRight, Minus, Plus, Star, Shield, Truck, RefreshCw, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductCard } from '../components/shop/ProductCard';
import { toast } from 'sonner';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id!);
  const { data: allProducts } = useProducts();
  const { addItem } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const relatedProducts = allProducts
    ?.filter(p => p.category_id === product?.category_id && p.id !== product?.id)
    .slice(0, 4) || [];

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="bg-cream min-h-screen pt-32 pb-24 animate-pulse">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="aspect-square bg-warm-brown/5 rounded-[3rem]" />
              <div className="space-y-8">
                <div className="h-4 bg-warm-brown/5 rounded w-1/4" />
                <div className="h-12 bg-warm-brown/5 rounded w-3/4" />
                <div className="h-6 bg-warm-brown/5 rounded w-1/4" />
                <div className="h-32 bg-warm-brown/5 rounded w-full" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="bg-cream min-h-screen pt-32 pb-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-serif text-warm-brown mb-4">Product Not Found</h1>
            <Link to="/shop" className="text-gold uppercase tracking-widest font-bold text-xs border-b border-gold/20 pb-1">
              Back to Shop
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const images = product.product_images?.map(img => img.url) || ['https://picsum.photos/seed/fashion/800/1000'];

  return (
    <Layout>
      <div className="bg-cream min-h-screen pt-32 pb-24">
        <div className="container mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-warm-brown/40 mb-12">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight size={10} />
            <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
            <ChevronRight size={10} />
            <span className="text-warm-brown">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
            {/* Image Gallery */}
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="aspect-square rounded-[3rem] overflow-hidden bg-white shadow-2xl shadow-warm-brown/5"
              >
                <img 
                  src={images[selectedImage]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={cn(
                        "aspect-square rounded-2xl overflow-hidden border-2 transition-all",
                        selectedImage === idx ? "border-gold shadow-lg shadow-gold/20" : "border-transparent opacity-60 hover:opacity-100"
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-8">
                <span className="inline-block text-[10px] uppercase tracking-[0.3em] font-bold text-gold mb-4">
                  {product.categories?.name || 'Collection'}
                </span>
                <h1 className="text-5xl font-serif text-warm-brown mb-4 leading-tight">{product.name}</h1>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex text-gold">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= 4 ? "currentColor" : "none"} />)}
                  </div>
                  <span className="text-xs text-warm-brown/40 uppercase tracking-widest font-bold">4.8 (24 Reviews)</span>
                </div>
                <p className="text-3xl font-serif text-warm-brown">{formatPrice(product.price)}</p>
              </div>

              <div className="prose prose-stone mb-10">
                <p className="text-warm-brown/60 leading-relaxed">
                  {product.description || 'Elevate your casual wardrobe with this premium piece from Sir Larex. Meticulously crafted with attention to detail and designed for both comfort and sophistication.'}
                </p>
              </div>

              <div className="space-y-8 mb-12">
                {/* Quantity */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-warm-brown/40 mb-4">Quantity</label>
                  <div className="inline-flex items-center bg-white border border-warm-brown/5 rounded-full p-1">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 text-warm-brown/40 hover:text-warm-brown transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-bold text-warm-brown">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 text-warm-brown/40 hover:text-warm-brown transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-grow bg-warm-brown text-white px-10 py-5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-gold transition-all duration-500 shadow-2xl shadow-warm-brown/20 flex items-center justify-center gap-3"
                  >
                    <ShoppingBag size={18} />
                    Add to Cart
                  </button>
                  <button className="p-5 bg-white border border-warm-brown/5 rounded-full text-warm-brown/40 hover:text-red-500 transition-all duration-500">
                    <Heart size={20} />
                  </button>
                  <button className="p-5 bg-white border border-warm-brown/5 rounded-full text-warm-brown/40 hover:text-gold transition-all duration-500">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-warm-brown/5">
                <div className="text-center">
                  <Truck size={20} className="mx-auto text-gold mb-2" />
                  <span className="block text-[8px] uppercase tracking-widest font-bold text-warm-brown/40">Free Delivery</span>
                </div>
                <div className="text-center">
                  <Shield size={20} className="mx-auto text-gold mb-2" />
                  <span className="block text-[8px] uppercase tracking-widest font-bold text-warm-brown/40">Secure Payment</span>
                </div>
                <div className="text-center">
                  <RefreshCw size={20} className="mx-auto text-gold mb-2" />
                  <span className="block text-[8px] uppercase tracking-widest font-bold text-warm-brown/40">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <div className="flex justify-between items-end mb-12">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-gold mb-4 block">Complete the Look</span>
                  <h2 className="text-4xl font-serif text-warm-brown">Related Products</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
};
