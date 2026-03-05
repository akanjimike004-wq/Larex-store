import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Plus, Search, Filter, Edit, Trash2, Package, ExternalLink, AlertCircle, ChevronDown, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts, useCategories } from '../../hooks/useData';
import { formatPrice, formatDate, cn } from '../../utils/helpers';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { api } from '../../api';

export const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { data: products, isLoading, refetch } = useProducts();
  const { data: categories } = useCategories();

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    try {
      await api.products.delete(id);
      toast.success('Product deleted successfully (Local Storage)');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Error deleting product');
    }
  };

  const filteredProducts = products?.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-serif text-warm-brown mb-2">Inventory Management</h1>
            <p className="text-warm-brown/40 text-sm uppercase tracking-widest font-bold">
              {products?.length || 0} Products in your collection
            </p>
          </div>
          <Link 
            to="/admin/products/new"
            className="flex items-center bg-warm-brown text-white px-8 py-4 rounded-2xl text-xs uppercase tracking-widest font-bold hover:bg-gold transition-all shadow-xl shadow-warm-brown/10 group"
          >
            <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform" />
            Add New Product
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-warm-brown/5 shadow-sm flex flex-col lg:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-warm-brown/20 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-cream/30 border-none rounded-2xl focus:ring-2 focus:ring-gold/20 text-sm placeholder:text-warm-brown/30"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="relative min-w-[200px]">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none pl-6 pr-12 py-4 bg-cream/30 border-none rounded-2xl text-xs uppercase tracking-widest font-bold text-warm-brown/60 focus:ring-2 focus:ring-gold/20 cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories?.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-warm-brown/30 pointer-events-none" />
            </div>

            <button className="flex items-center justify-center space-x-3 px-8 py-4 bg-warm-brown text-white rounded-2xl text-xs uppercase tracking-widest font-bold hover:bg-gold transition-colors">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[3rem] border border-warm-brown/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-cream/30">
                  <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-bold text-warm-brown/40">Product Details</th>
                  <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-bold text-warm-brown/40">Category</th>
                  <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-bold text-warm-brown/40">Price</th>
                  <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-bold text-warm-brown/40">Stock Status</th>
                  <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-bold text-warm-brown/40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-brown/5">
                {isLoading ? (
                  [1,2,3,4,5].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-10 py-8"><div className="h-16 bg-cream/50 rounded-2xl" /></td>
                    </tr>
                  ))
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-32 text-center">
                      <div className="flex flex-col items-center opacity-10">
                        <Package size={64} className="mb-6" />
                        <p className="text-xl font-serif">No products found</p>
                        <p className="text-xs uppercase tracking-widest font-bold mt-2">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={product.id} 
                        className="hover:bg-cream/10 transition-colors group"
                      >
                        <td className="px-10 py-6">
                          <div className="flex items-center space-x-6">
                            <div className="w-16 h-20 bg-cream rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                              <img 
                                src={product.product_images?.[0]?.url || 'https://picsum.photos/seed/fashion/100/150'} 
                                alt="" 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div>
                              <p className="text-base font-bold text-warm-brown group-hover:text-gold transition-colors">{product.name}</p>
                              <p className="text-[10px] text-warm-brown/30 uppercase tracking-widest font-bold mt-1">SKU: {product.id.slice(0, 8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-warm-brown/40 bg-cream px-3 py-1 rounded-full">
                            {product.categories?.name || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                          <p className="text-base font-serif text-warm-brown">{formatPrice(product.price)}</p>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex items-center space-x-3">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              product.stock === 0 ? "bg-red-500" : 
                              product.stock <= 5 ? "bg-amber-500" : "bg-emerald-500"
                            )} />
                            <span className={cn(
                              "text-sm font-bold",
                              product.stock <= 5 ? "text-red-500" : "text-warm-brown"
                            )}>
                              {product.stock} in stock
                            </span>
                            {product.stock <= 5 && <AlertCircle size={14} className="text-red-500 animate-pulse" />}
                          </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex justify-end items-center space-x-2">
                            <Link 
                              to={`/product/${product.id}`}
                              target="_blank"
                              className="p-3 text-warm-brown/20 hover:text-gold transition-colors rounded-xl hover:bg-white shadow-sm hover:shadow-md"
                              title="View Live"
                            >
                              <ExternalLink size={18} />
                            </Link>
                            <button 
                              className="p-3 text-warm-brown/20 hover:text-gold transition-colors rounded-xl hover:bg-white shadow-sm hover:shadow-md"
                              title="Edit Product"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(product.id)}
                              className="p-3 text-warm-brown/20 hover:text-red-500 transition-colors rounded-xl hover:bg-white shadow-sm hover:shadow-md"
                              title="Delete Product"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
