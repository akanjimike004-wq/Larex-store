import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartPage = () => {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="bg-cream min-h-screen pt-32 pb-24 flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-xl shadow-warm-brown/5 mb-8 text-warm-brown/20">
              <ShoppingBag size={40} />
            </div>
            <h1 className="text-4xl font-serif text-warm-brown mb-4">Your bag is empty</h1>
            <p className="text-warm-brown/60 mb-10 leading-relaxed">
              Looks like you haven't added anything to your bag yet. Explore our latest collection and find something you love.
            </p>
            <Link 
              to="/shop" 
              className="inline-flex items-center bg-warm-brown text-white px-10 py-4 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-gold transition-all duration-500 shadow-xl shadow-warm-brown/20"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-cream min-h-screen pt-32 pb-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Cart Items */}
            <div className="flex-grow">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h1 className="text-5xl font-serif text-warm-brown mb-2">Shopping Bag</h1>
                  <p className="text-warm-brown/40 text-xs uppercase tracking-widest font-bold">
                    {items.reduce((acc, item) => acc + item.quantity, 0)} Items in your bag
                  </p>
                </div>
                <Link to="/shop" className="hidden md:flex items-center text-[10px] uppercase tracking-widest font-bold text-gold hover:text-warm-brown transition-colors">
                  <ChevronLeft size={14} className="mr-1" />
                  Continue Shopping
                </Link>
              </div>

              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white rounded-[2rem] p-6 flex flex-col sm:flex-row items-center gap-8 shadow-sm border border-warm-brown/5 group"
                    >
                      <div className="w-32 h-40 rounded-2xl overflow-hidden flex-shrink-0 bg-cream">
                        <img 
                          src={item.image || 'https://picsum.photos/seed/fashion/400/500'} 
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="flex-grow text-center sm:text-left">
                        <h3 className="text-xl font-serif text-warm-brown mb-1">{item.name}</h3>
                        <p className="text-xs uppercase tracking-widest font-bold text-gold mb-4">
                          Premium Collection
                        </p>
                        <p className="text-lg font-serif text-warm-brown">{formatPrice(item.price)}</p>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="flex items-center bg-cream rounded-full p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-2 text-warm-brown/40 hover:text-warm-brown transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-warm-brown">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 text-warm-brown/40 hover:text-warm-brown transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        <div className="text-right min-w-[100px] hidden sm:block">
                          <p className="text-lg font-serif text-warm-brown">{formatPrice(item.price * item.quantity)}</p>
                        </div>

                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-3 text-warm-brown/20 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Summary */}
            <aside className="w-full lg:w-[400px] flex-shrink-0">
              <div className="sticky top-32 bg-warm-brown rounded-[3rem] p-10 text-cream shadow-2xl shadow-warm-brown/20">
                <h2 className="text-3xl font-serif mb-8">Order Summary</h2>
                
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between text-sm uppercase tracking-widest font-bold text-cream/60">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm uppercase tracking-widest font-bold text-cream/60">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-sm uppercase tracking-widest font-bold text-cream/60">
                    <span>Tax</span>
                    <span>Included</span>
                  </div>
                  <div className="h-px bg-cream/10 pt-6" />
                  <div className="flex justify-between items-end">
                    <span className="text-xs uppercase tracking-widest font-bold text-cream/40">Total Amount</span>
                    <span className="text-4xl font-serif">{formatPrice(total)}</span>
                  </div>
                </div>

                <Link 
                  to="/checkout"
                  className="w-full bg-gold text-white py-5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-warm-brown transition-all duration-500 flex items-center justify-center gap-3 group"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="mt-8 text-center">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-cream/40">
                    Secure Checkout Powered by Sir Larex
                  </p>
                </div>
              </div>

              <div className="mt-8 p-8 border border-warm-brown/5 rounded-[2rem] bg-white/50">
                <h3 className="text-xs uppercase tracking-widest font-bold text-warm-brown mb-4">Promo Code</h3>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter code"
                    className="flex-grow bg-white border border-warm-brown/5 rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/20"
                  />
                  <button className="bg-warm-brown text-white px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold">
                    Apply
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
};
