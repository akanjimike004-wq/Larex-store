import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ProductCard } from '../components/shop/ProductCard';
import { useProducts, useCategories } from '../hooks/useData';
import { Filter, X, ChevronDown, Search, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/helpers';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const activeCategory = searchParams.get('category');

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let result = [...products];

    // Category Filter
    if (activeCategory) {
      result = result.filter(p => p.category_id === activeCategory);
    }

    // Search Filter
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  const handleCategoryClick = (id: string | null) => {
    if (id) {
      setSearchParams({ category: id });
    } else {
      setSearchParams({});
    }
  };

  return (
    <Layout>
      <div className="bg-cream min-h-screen pt-32 pb-24">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-serif text-warm-brown mb-4">Shop Collection</h1>
            <div className="flex flex-wrap items-center justify-between gap-6">
              <p className="text-warm-brown/40 text-sm uppercase tracking-widest font-bold">
                Showing {filteredProducts.length} results
              </p>
              
              <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-brown/30 w-4 h-4" />
                  <input 
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white border border-warm-brown/5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 w-64"
                  />
                </div>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-warm-brown/5 rounded-full px-6 py-2 text-xs uppercase tracking-widest font-bold text-warm-brown focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <button 
                  onClick={() => setIsFilterOpen(true)}
                  className="md:hidden flex items-center gap-2 bg-warm-brown text-white px-6 py-2 rounded-full text-xs uppercase tracking-widest font-bold"
                >
                  <Filter size={14} />
                  Filters
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-12">
            {/* Sidebar Filter (Desktop) */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-32 space-y-10">
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-warm-brown mb-6">Categories</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => handleCategoryClick(null)}
                      className={cn(
                        "block text-sm transition-colors",
                        !activeCategory ? "text-gold font-bold" : "text-warm-brown/60 hover:text-warm-brown"
                      )}
                    >
                      All Collections
                    </button>
                    {categories?.map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className={cn(
                          "block text-sm transition-colors",
                          activeCategory === cat.id ? "text-gold font-bold" : "text-warm-brown/60 hover:text-warm-brown"
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-warm-brown mb-6">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <input type="number" placeholder="Min" className="w-full bg-white border border-warm-brown/5 rounded-lg p-2 text-xs" />
                      <span className="text-warm-brown/20">-</span>
                      <input type="number" placeholder="Max" className="w-full bg-white border border-warm-brown/5 rounded-lg p-2 text-xs" />
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-grow">
              {productsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[3/4] bg-warm-brown/5 rounded-3xl mb-4" />
                      <div className="h-4 bg-warm-brown/5 rounded w-2/3 mb-2" />
                      <div className="h-4 bg-warm-brown/5 rounded w-1/3" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-32 bg-white rounded-[3rem] border border-warm-brown/5">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cream text-warm-brown/20 mb-6">
                    <Search size={32} />
                  </div>
                  <h2 className="text-2xl font-serif text-warm-brown mb-2">No products found</h2>
                  <p className="text-warm-brown/40 text-sm">Try adjusting your filters or search query.</p>
                  <button 
                    onClick={() => {
                      setSearchParams({});
                      setSearchQuery('');
                    }}
                    className="mt-8 text-xs uppercase tracking-widest font-bold text-gold border-b border-gold/20 pb-1"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, idx) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-warm-brown/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-xs bg-white z-[101] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-2xl font-serif text-warm-brown">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 text-warm-brown/40 hover:text-warm-brown">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-12">
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-warm-brown mb-6">Categories</h3>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => handleCategoryClick(null)}
                      className={cn(
                        "px-4 py-2 rounded-full text-xs uppercase tracking-widest font-bold transition-all",
                        !activeCategory ? "bg-gold text-white" : "bg-cream text-warm-brown/60"
                      )}
                    >
                      All
                    </button>
                    {categories?.map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className={cn(
                          "px-4 py-2 rounded-full text-xs uppercase tracking-widest font-bold transition-all",
                          activeCategory === cat.id ? "bg-gold text-white" : "bg-cream text-warm-brown/60"
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-warm-brown mb-6">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-brown/30 w-4 h-4" />
                    <input 
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-cream rounded-2xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-warm-brown text-white py-4 rounded-full text-xs uppercase tracking-widest font-bold shadow-xl shadow-warm-brown/20"
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Layout>
  );
};
