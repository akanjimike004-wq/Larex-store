import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useProducts, useCategories } from '../hooks/useData';
import { formatPrice } from '../utils/helpers';
import { Layout } from '../components/layout/Layout';
import { ProductCard } from '../components/shop/ProductCard';

export const HomePage = () => {
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const featuredProducts = products?.filter(p => p.is_featured).slice(0, 4) || [];

  return (
    <Layout>
      <div className="bg-cream min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2070" 
              alt="Hero Background" 
              className="w-full h-full object-cover brightness-75"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-warm-brown/60 to-transparent" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl text-white"
            >
              <span className="inline-block text-xs uppercase tracking-[0.3em] font-bold mb-6 text-gold">New Collection 2024</span>
              <h1 className="text-6xl md:text-8xl font-serif mb-8 leading-tight">
                Elevate Your <br />
                <span className="italic">Everyday Style</span>
              </h1>
              <p className="text-lg text-cream/80 mb-10 max-w-lg leading-relaxed">
                Discover the perfect blend of comfort and sophistication with Sir Larex. 
                Crafted for those who appreciate the finer details in casual fashion.
              </p>
              <div className="flex flex-wrap gap-6">
                <Link 
                  to="/shop" 
                  className="bg-gold text-white px-10 py-5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-warm-brown transition-all duration-500 shadow-2xl shadow-gold/20"
                >
                  Shop Collection
                </Link>
                <Link 
                  to="/shop" 
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-white/20 transition-all duration-500"
                >
                  View Lookbook
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {[
                { icon: <Truck size={24} />, title: "Global Shipping", desc: "Fast & secure delivery worldwide" },
                { icon: <Shield size={24} />, title: "Secure Payment", desc: "100% protected transactions" },
                { icon: <Clock size={24} />, title: "24/7 Support", desc: "Dedicated team at your service" },
                { icon: <Star size={24} />, title: "Premium Quality", desc: "Handpicked materials only" }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center group"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cream text-gold mb-6 group-hover:bg-gold group-hover:text-white transition-all duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-sm uppercase tracking-widest font-bold text-warm-brown mb-2">{feature.title}</h3>
                  <p className="text-sm text-warm-brown/40 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-24 bg-cream/30">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-16">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-gold mb-4 block">Curated Selection</span>
                <h2 className="text-4xl md:text-5xl font-serif text-warm-brown">Featured Pieces</h2>
              </div>
              <Link to="/shop" className="group flex items-center text-xs uppercase tracking-widest font-bold text-warm-brown hover:text-gold transition-colors">
                View All Products
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {productsLoading ? (
                [1,2,3,4].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-warm-brown/5 rounded-3xl mb-4" />
                    <div className="h-4 bg-warm-brown/5 rounded w-2/3 mb-2" />
                    <div className="h-4 bg-warm-brown/5 rounded w-1/3" />
                  </div>
                ))
              ) : featuredProducts.map((product, idx) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-gold mb-4 block">Collections</span>
              <h2 className="text-4xl md:text-5xl font-serif text-warm-brown mb-6">Shop by Category</h2>
              <p className="text-warm-brown/40 leading-relaxed">
                Explore our diverse range of casual fashion, from timeless basics to contemporary statement pieces.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categoriesLoading ? (
                [1,2,3].map(i => (
                  <div key={i} className="aspect-[4/5] bg-cream rounded-3xl animate-pulse" />
                ))
              ) : categories?.slice(0, 3).map((category, idx) => (
                <motion.div 
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative aspect-[4/5] group cursor-pointer overflow-hidden rounded-[2.5rem]"
                >
                  <img 
                    src={`https://picsum.photos/seed/${category.slug}/800/1000`} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-warm-brown/80 via-warm-brown/20 to-transparent" />
                  <div className="absolute bottom-10 left-10 right-10">
                    <h3 className="text-3xl font-serif text-white mb-4">{category.name}</h3>
                    <Link 
                      to={`/shop?category=${category.id}`}
                      className="inline-flex items-center text-xs uppercase tracking-widest font-bold text-white/80 hover:text-gold transition-colors"
                    >
                      Explore Collection
                      <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="relative rounded-[3rem] overflow-hidden bg-warm-brown py-24 px-12 text-center">
              <div className="absolute inset-0 opacity-20">
                <img 
                  src="https://images.unsplash.com/photo-1441984908747-5c39bb5d645d?auto=format&fit=crop&q=80&w=2070" 
                  alt="CTA Background" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-serif text-cream mb-8 leading-tight">
                  Join the Sir Larex <br />
                  <span className="italic text-gold">Inner Circle</span>
                </h2>
                <p className="text-cream/60 mb-12 text-lg leading-relaxed">
                  Subscribe to our newsletter and be the first to know about new arrivals, 
                  exclusive events, and seasonal offers.
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="flex-grow bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-8 py-5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                  <button className="bg-gold text-white px-10 py-5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-warm-brown transition-all duration-500">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};
