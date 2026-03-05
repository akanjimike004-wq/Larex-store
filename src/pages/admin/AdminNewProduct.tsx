import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '../../api';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Upload, X, Plus, ChevronLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import { useCategories } from '../../hooks/useData';
import { slugify, cn } from '../../utils/helpers';
import { toast } from 'sonner';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  stock: z.number().min(0, 'Stock cannot be negative'),
  category_id: z.string().min(1, 'Please select a category'),
  description: z.string(),
  is_featured: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export const AdminNewProduct = () => {
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: 0,
      stock: 0,
      category_id: '',
      description: '',
      is_featured: false,
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages([...images, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file as Blob));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const onSubmit = async (values: ProductFormValues) => {
    if (previews.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setUploading(true);
    try {
      const slug = slugify(values.name);
      
      // Local testing: use preview URLs as "uploaded" URLs
      const mockImages = previews.map((url, index) => ({
        url,
        is_main: index === 0
      }));

      await api.products.create({
        ...values,
        slug,
        images: mockImages
      });

      toast.success('Product created successfully (Local Storage)');
      navigate('/admin/products');
    } catch (error: any) {
      toast.error(error.message || 'Error creating product');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-xs uppercase tracking-widest font-bold text-warm-brown/40 hover:text-warm-brown mb-8 transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Inventory
        </button>

        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-serif text-warm-brown mb-2">New Product</h1>
            <p className="text-warm-brown/40 text-sm uppercase tracking-widest font-bold">Add a new piece to your collection</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          {/* Basic Info */}
          <section className="bg-white p-8 rounded-3xl border border-warm-brown/5 shadow-sm space-y-8">
            <h2 className="text-xs uppercase tracking-[0.3em] text-gold font-bold">General Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-warm-brown/40 mb-2">Product Name</label>
                <input
                  {...register('name')}
                  className={cn(
                    "w-full px-0 py-3 bg-transparent border-b border-warm-brown/10 focus:outline-none focus:border-gold text-sm transition-colors",
                    errors.name && "border-red-500"
                  )}
                  placeholder="e.g. Premium Silk Shirt"
                />
                {errors.name && <p className="text-red-500 text-[10px] mt-1 uppercase font-bold">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-warm-brown/40 mb-2">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  className={cn(
                    "w-full px-0 py-3 bg-transparent border-b border-warm-brown/10 focus:outline-none focus:border-gold text-sm transition-colors",
                    errors.price && "border-red-500"
                  )}
                />
                {errors.price && <p className="text-red-500 text-[10px] mt-1 uppercase font-bold">{errors.price.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-warm-brown/40 mb-2">Stock Quantity</label>
                <input
                  type="number"
                  {...register('stock', { valueAsNumber: true })}
                  className={cn(
                    "w-full px-0 py-3 bg-transparent border-b border-warm-brown/10 focus:outline-none focus:border-gold text-sm transition-colors",
                    errors.stock && "border-red-500"
                  )}
                />
                {errors.stock && <p className="text-red-500 text-[10px] mt-1 uppercase font-bold">{errors.stock.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-warm-brown/40 mb-2">Category</label>
                <select
                  {...register('category_id')}
                  className={cn(
                    "w-full px-0 py-3 bg-transparent border-b border-warm-brown/10 focus:outline-none focus:border-gold text-sm transition-colors appearance-none",
                    errors.category_id && "border-red-500"
                  )}
                >
                  <option value="">Select Category</option>
                  {categories?.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.category_id && <p className="text-red-500 text-[10px] mt-1 uppercase font-bold">{errors.category_id.message}</p>}
              </div>

              <div className="flex items-center space-x-3 pt-6">
                <input
                  type="checkbox"
                  id="is_featured"
                  {...register('is_featured')}
                  className="w-4 h-4 rounded border-warm-brown/10 text-gold focus:ring-gold"
                />
                <label htmlFor="is_featured" className="text-xs uppercase tracking-widest font-bold text-warm-brown/60 cursor-pointer">
                  Featured Product
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-warm-brown/40 mb-2">Description</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-3 bg-cream/30 border-none rounded-2xl focus:ring-2 focus:ring-gold/20 text-sm resize-none"
                  placeholder="Describe the material, fit, and care instructions..."
                />
              </div>
            </div>
          </section>

          {/* Media */}
          <section className="bg-white p-8 rounded-3xl border border-warm-brown/5 shadow-sm space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xs uppercase tracking-[0.3em] text-gold font-bold">Product Media</h2>
              <span className="text-[10px] text-warm-brown/40 uppercase font-bold">{images.length} images selected</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previews.map((preview, idx) => (
                <div key={idx} className="relative aspect-[3/4] group rounded-2xl overflow-hidden bg-cream">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X size={14} />
                  </button>
                  {idx === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gold/90 text-white text-[8px] uppercase tracking-widest font-bold py-1 text-center">
                      Main Image
                    </div>
                  )}
                </div>
              ))}
              
              <label className="aspect-[3/4] border-2 border-dashed border-warm-brown/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-gold/40 hover:bg-gold/5 transition-all group">
                <div className="p-3 bg-cream rounded-full mb-3 group-hover:bg-gold group-hover:text-white transition-all">
                  <Plus size={20} />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-warm-brown/40 group-hover:text-gold">Add Image</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-10 py-4 text-xs uppercase tracking-widest font-bold text-warm-brown/40 hover:text-warm-brown transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || uploading}
              className="bg-warm-brown text-cream px-12 py-4 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-gold transition-all shadow-xl shadow-warm-brown/10 disabled:opacity-50 flex items-center"
            >
              {(isSubmitting || uploading) ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
