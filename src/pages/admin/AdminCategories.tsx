import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Plus, Trash2, Edit, Tag, Loader2, X, Check, Search, Hash } from 'lucide-react';
import { useCategories } from '../../hooks/useData';
import { api } from '../../api';
import { toast } from 'sonner';
import { slugify, cn } from '../../utils/helpers';
import { motion, AnimatePresence } from 'motion/react';

export const AdminCategories = () => {
  const { data: categories, isLoading, refetch } = useCategories();
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setSubmitting(true);
    try {
      const slug = slugify(newCategory);
      await api.categories.create({ name: newCategory, slug });
      
      toast.success('Category added successfully (Local Storage)');
      setNewCategory('');
      setIsAdding(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Error adding category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deleting this category may affect products assigned to it. Continue?')) return;

    try {
      await api.categories.delete(id);
      toast.success('Category deleted (Local Storage)');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Error deleting category');
    }
  };

  const filteredCategories = categories?.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <AdminLayout>
      <div className="max-w-5xl space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-serif text-warm-brown mb-2">Categories</h1>
            <p className="text-warm-brown/40 text-sm uppercase tracking-widest font-bold">
              {categories?.length || 0} Product categories defined
            </p>
          </div>
          {!isAdding && (
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center bg-warm-brown text-white px-8 py-4 rounded-2xl text-xs uppercase tracking-widest font-bold hover:bg-gold transition-all shadow-xl shadow-warm-brown/10 group"
            >
              <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform" />
              Add New Category
            </button>
          )}
        </div>

        {/* Search & Add Form */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-gold/20 shadow-xl shadow-gold/5">
                  <form onSubmit={handleAddCategory} className="flex flex-col md:flex-row items-end gap-6">
                    <div className="flex-grow space-y-2">
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-warm-brown/40 ml-1">Category Name</label>
                      <input
                        autoFocus
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="e.g. Premium Silk Collection"
                        className="w-full px-6 py-4 bg-cream/30 border-none rounded-2xl focus:ring-2 focus:ring-gold/20 text-sm placeholder:text-warm-brown/20"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsAdding(false)}
                        className="p-4 text-warm-brown/40 hover:text-warm-brown transition-colors rounded-2xl bg-cream/30"
                      >
                        <X size={20} />
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-gold text-white px-8 py-4 rounded-2xl text-xs uppercase tracking-widest font-bold hover:bg-gold/90 transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {submitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                        <span>Create Category</span>
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white p-6 rounded-[2.5rem] border border-warm-brown/5 shadow-sm">
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-warm-brown/20 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-cream/30 border-none rounded-2xl focus:ring-2 focus:ring-gold/20 text-sm placeholder:text-warm-brown/30"
                  />
                </div>
              </div>
            )}
          </AnimatePresence>

          <div className="bg-white rounded-[3rem] border border-warm-brown/5 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-cream/30">
                    <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-bold text-warm-brown/40">Category Name</th>
                    <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-bold text-warm-brown/40">URL Slug</th>
                    <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-bold text-warm-brown/40 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-brown/5">
                  {isLoading ? (
                    [1,2,3].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={3} className="px-10 py-8"><div className="h-12 bg-cream/50 rounded-2xl" /></td>
                      </tr>
                    ))
                  ) : filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-10 py-32 text-center">
                        <div className="flex flex-col items-center opacity-10">
                          <Tag size={64} className="mb-6" />
                          <p className="text-xl font-serif">No categories found</p>
                          <p className="text-xs uppercase tracking-widest font-bold mt-2">Try adding a new one</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {filteredCategories.map((category) => (
                        <motion.tr 
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key={category.id} 
                          className="hover:bg-cream/10 transition-colors group"
                        >
                          <td className="px-10 py-6">
                            <div className="flex items-center space-x-5">
                              <div className="p-3 bg-cream rounded-2xl text-warm-brown/20 group-hover:text-gold group-hover:bg-white transition-all shadow-sm">
                                <Tag size={20} />
                              </div>
                              <span className="text-base font-bold text-warm-brown">{category.name}</span>
                            </div>
                          </td>
                          <td className="px-10 py-6">
                            <div className="flex items-center space-x-2 text-warm-brown/40">
                              <Hash size={14} className="opacity-30" />
                              <span className="text-xs font-mono tracking-tight">{category.slug}</span>
                            </div>
                          </td>
                          <td className="px-10 py-6 text-right">
                            <div className="flex justify-end items-center space-x-2">
                              <button className="p-3 text-warm-brown/20 hover:text-gold transition-colors rounded-xl hover:bg-white shadow-sm hover:shadow-md">
                                <Edit size={18} />
                              </button>
                              <button 
                                onClick={() => handleDelete(category.id)}
                                className="p-3 text-warm-brown/20 hover:text-red-500 transition-colors rounded-xl hover:bg-white shadow-sm hover:shadow-md"
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
      </div>
    </AdminLayout>
  );
};
