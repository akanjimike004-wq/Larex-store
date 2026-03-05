import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { useCart } from '../context/CartContext';
import { api } from '../api';
import { formatPrice, cn } from '../utils/helpers';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { ShieldCheck, Truck, CreditCard, ChevronLeft, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().min(5, 'Phone number is required'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema)
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) return;
    
    setIsProcessing(true);
    try {
      const order = await api.orders.create({
        contact_email: data.email,
        shipping_address: `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.postalCode}, ${data.country}`,
        total_amount: total,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        }))
      });

      setOrderId(order.id);
      setOrderComplete(true);
      clearCart();
      toast.success('Order placed successfully (Local Storage)!');
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <Layout>
        <div className="bg-cream min-h-screen pt-32 pb-24 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[3rem] p-12 max-w-xl w-full text-center shadow-2xl shadow-warm-brown/5 border border-warm-brown/5"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-50 text-emerald-500 mb-8">
              <CheckCircle2 size={48} />
            </div>
            <h1 className="text-4xl font-serif text-warm-brown mb-4">Thank You for Your Order</h1>
            <p className="text-warm-brown/60 mb-2 leading-relaxed">
              Your order <span className="font-bold text-warm-brown">#{orderId?.slice(0, 8)}</span> has been placed successfully.
            </p>
            <p className="text-warm-brown/40 text-sm mb-10">
              We've sent a confirmation email with all the details.
            </p>
            <div className="space-y-4">
              <Link 
                to="/shop" 
                className="block w-full bg-warm-brown text-white py-4 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-gold transition-all duration-500"
              >
                Continue Shopping
              </Link>
              <button className="text-xs uppercase tracking-widest font-bold text-warm-brown/40 hover:text-warm-brown transition-colors">
                Track Your Order
              </button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="bg-cream min-h-screen pt-32 pb-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-serif text-warm-brown mb-4">Your Bag is Empty</h1>
            <Link to="/shop" className="text-gold uppercase tracking-widest font-bold text-xs border-b border-gold/20 pb-1">
              Go to Shop
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
            {/* Form */}
            <div className="flex-grow">
              <div className="mb-12">
                <Link to="/cart" className="inline-flex items-center text-[10px] uppercase tracking-widest font-bold text-warm-brown/40 hover:text-gold transition-colors mb-6">
                  <ChevronLeft size={14} className="mr-1" />
                  Back to Bag
                </Link>
                <h1 className="text-5xl font-serif text-warm-brown">Checkout</h1>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                {/* Contact Info */}
                <section>
                  <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-warm-brown mb-8 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-warm-brown text-white flex items-center justify-center text-[10px]">1</span>
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-warm-brown/40 mb-2">Email Address</label>
                      <input 
                        {...register('email')}
                        className={cn(
                          "w-full bg-white border rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all",
                          errors.email ? "border-red-500" : "border-warm-brown/5 focus:ring-2 focus:ring-gold/20"
                        )}
                        placeholder="alex@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-[10px] mt-2 uppercase font-bold">{errors.email.message}</p>}
                    </div>
                  </div>
                </section>

                {/* Shipping Info */}
                <section>
                  <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-warm-brown mb-8 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-warm-brown text-white flex items-center justify-center text-[10px]">2</span>
                    Shipping Address
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-warm-brown/40 mb-2">First Name</label>
                      <input 
                        {...register('firstName')}
                        className={cn(
                          "w-full bg-white border rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all",
                          errors.firstName ? "border-red-500" : "border-warm-brown/5 focus:ring-2 focus:ring-gold/20"
                        )}
                      />
                      {errors.firstName && <p className="text-red-500 text-[10px] mt-2 uppercase font-bold">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-warm-brown/40 mb-2">Last Name</label>
                      <input 
                        {...register('lastName')}
                        className={cn(
                          "w-full bg-white border rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all",
                          errors.lastName ? "border-red-500" : "border-warm-brown/5 focus:ring-2 focus:ring-gold/20"
                        )}
                      />
                      {errors.lastName && <p className="text-red-500 text-[10px] mt-2 uppercase font-bold">{errors.lastName.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-warm-brown/40 mb-2">Address</label>
                      <input 
                        {...register('address')}
                        className={cn(
                          "w-full bg-white border rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all",
                          errors.address ? "border-red-500" : "border-warm-brown/5 focus:ring-2 focus:ring-gold/20"
                        )}
                      />
                      {errors.address && <p className="text-red-500 text-[10px] mt-2 uppercase font-bold">{errors.address.message}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-warm-brown/40 mb-2">City</label>
                      <input 
                        {...register('city')}
                        className={cn(
                          "w-full bg-white border rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all",
                          errors.city ? "border-red-500" : "border-warm-brown/5 focus:ring-2 focus:ring-gold/20"
                        )}
                      />
                      {errors.city && <p className="text-red-500 text-[10px] mt-2 uppercase font-bold">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-warm-brown/40 mb-2">Postal Code</label>
                      <input 
                        {...register('postalCode')}
                        className={cn(
                          "w-full bg-white border rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all",
                          errors.postalCode ? "border-red-500" : "border-warm-brown/5 focus:ring-2 focus:ring-gold/20"
                        )}
                      />
                      {errors.postalCode && <p className="text-red-500 text-[10px] mt-2 uppercase font-bold">{errors.postalCode.message}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-warm-brown/40 mb-2">Country</label>
                      <input 
                        {...register('country')}
                        className={cn(
                          "w-full bg-white border rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all",
                          errors.country ? "border-red-500" : "border-warm-brown/5 focus:ring-2 focus:ring-gold/20"
                        )}
                      />
                      {errors.country && <p className="text-red-500 text-[10px] mt-2 uppercase font-bold">{errors.country.message}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-warm-brown/40 mb-2">Phone</label>
                      <input 
                        {...register('phone')}
                        className={cn(
                          "w-full bg-white border rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all",
                          errors.phone ? "border-red-500" : "border-warm-brown/5 focus:ring-2 focus:ring-gold/20"
                        )}
                      />
                      {errors.phone && <p className="text-red-500 text-[10px] mt-2 uppercase font-bold">{errors.phone.message}</p>}
                    </div>
                  </div>
                </section>

                {/* Payment Info */}
                <section>
                  <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-warm-brown mb-8 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-warm-brown text-white flex items-center justify-center text-[10px]">3</span>
                    Payment Method
                  </h2>
                  <div className="bg-white border border-warm-brown/5 rounded-[2rem] p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-gold">
                          <CreditCard size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-warm-brown">Credit or Debit Card</p>
                          <p className="text-[10px] text-warm-brown/40 uppercase tracking-widest">Secure encrypted payment</p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-40">
                        <div className="w-8 h-5 bg-warm-brown rounded-sm" />
                        <div className="w-8 h-5 bg-warm-brown rounded-sm" />
                      </div>
                    </div>
                    <div className="p-6 bg-cream/30 rounded-2xl border border-dashed border-warm-brown/10 text-center">
                      <p className="text-xs text-warm-brown/40 italic">Payment processing is simulated for this demo.</p>
                    </div>
                  </div>
                </section>

                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-warm-brown text-white py-6 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-gold transition-all duration-500 shadow-2xl shadow-warm-brown/20 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      Complete Purchase
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <aside className="w-full lg:w-[400px] flex-shrink-0">
              <div className="sticky top-32 space-y-8">
                <div className="bg-white rounded-[3rem] p-10 border border-warm-brown/5 shadow-sm">
                  <h2 className="text-2xl font-serif text-warm-brown mb-8">Your Order</h2>
                  <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-20 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                          <img 
                            src={item.image || 'https://picsum.photos/seed/fashion/200/300'} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-xs font-bold text-warm-brown line-clamp-1">{item.name}</h4>
                          <p className="text-[10px] text-warm-brown/40 uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                          <p className="text-xs font-serif text-warm-brown mt-1">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 pt-8 border-t border-warm-brown/5">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-warm-brown/40">
                      <span>Subtotal</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-warm-brown/40">
                      <span>Shipping</span>
                      <span className="text-emerald-500">Free</span>
                    </div>
                    <div className="flex justify-between items-end pt-4">
                      <span className="text-xs uppercase tracking-widest font-bold text-warm-brown">Total</span>
                      <span className="text-3xl font-serif text-warm-brown">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-[2rem] p-8 border border-emerald-100">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-widest mb-1">Secure Transaction</h4>
                      <p className="text-[10px] text-emerald-700 leading-relaxed">Your data is protected with industry-standard SSL encryption.</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 text-warm-brown/30">
                  <div className="flex items-center gap-2">
                    <Truck size={14} />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Premium Global Shipping</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
};
