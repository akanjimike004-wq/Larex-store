import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { ShoppingBag, Eye, Clock, CheckCircle, Truck, AlertCircle, Search, Filter, ChevronDown, MoreHorizontal } from 'lucide-react';
import { useOrders } from '../../hooks/useData';
import { formatPrice, formatDate, cn } from '../../utils/helpers';
import { api } from '../../api';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { data: orders, isLoading, refetch } = useOrders();

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.orders.updateStatus(id, status);
      toast.success(`Order status updated to ${status} (Local Storage)`);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Error updating status');
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'pending': return "bg-amber-50 text-amber-600 border-amber-100";
      case 'processing': return "bg-blue-50 text-blue-600 border-blue-100";
      case 'shipped': return "bg-indigo-50 text-indigo-600 border-indigo-100";
      case 'delivered': return "bg-emerald-50 text-emerald-600 border-emerald-100";
      default: return "bg-stone-50 text-stone-600 border-stone-100";
    }
  };

  const filteredOrders = orders?.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.contact_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-serif text-warm-brown mb-2">Order Management</h1>
            <p className="text-warm-brown/40 text-sm uppercase tracking-widest font-bold">
              {orders?.length || 0} Total transactions processed
            </p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-warm-brown/5 shadow-sm flex flex-col lg:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-warm-brown/20 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Order ID, Email, or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-cream/30 border-none rounded-2xl focus:ring-2 focus:ring-gold/20 text-sm placeholder:text-warm-brown/30"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="relative min-w-[200px]">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none pl-6 pr-12 py-4 bg-cream/30 border-none rounded-2xl text-xs uppercase tracking-widest font-bold text-warm-brown/60 focus:ring-2 focus:ring-gold/20 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
              <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-warm-brown/30 pointer-events-none" />
            </div>

            <button className="flex items-center justify-center space-x-3 px-8 py-4 bg-warm-brown text-white rounded-2xl text-xs uppercase tracking-widest font-bold hover:bg-gold transition-colors">
              <Filter size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[3rem] border border-warm-brown/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-cream/30">
                  <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-bold text-warm-brown/40">Order ID</th>
                  <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-bold text-warm-brown/40">Customer Details</th>
                  <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-bold text-warm-brown/40">Total Amount</th>
                  <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-bold text-warm-brown/40">Status</th>
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
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-32 text-center">
                      <div className="flex flex-col items-center opacity-10">
                        <ShoppingBag size={64} className="mb-6" />
                        <p className="text-xl font-serif">No orders found</p>
                        <p className="text-xs uppercase tracking-widest font-bold mt-2">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filteredOrders.map((order) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={order.id} 
                        className="hover:bg-cream/10 transition-colors group"
                      >
                        <td className="px-10 py-6">
                          <span className="text-sm font-bold text-warm-brown">#{order.id.slice(0, 8)}</span>
                          <p className="text-[10px] text-warm-brown/30 uppercase tracking-widest font-bold mt-1">{formatDate(order.created_at)}</p>
                        </td>
                        <td className="px-10 py-6">
                          <p className="text-sm font-bold text-warm-brown">{order.contact_email}</p>
                          <p className="text-[10px] text-warm-brown/40 uppercase tracking-widest mt-1">Verified Purchase</p>
                        </td>
                        <td className="px-10 py-6">
                          <p className="text-base font-serif text-warm-brown">{formatPrice(order.total_amount)}</p>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <span className={cn(
                              "px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold border",
                              getStatusStyles(order.status)
                            )}>
                              {order.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex justify-end items-center space-x-3">
                            <div className="relative group/select">
                              <select 
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                className="appearance-none pl-4 pr-10 py-2 bg-cream/30 border-none rounded-xl text-[10px] uppercase tracking-widest font-bold text-warm-brown/60 focus:ring-2 focus:ring-gold/20 cursor-pointer"
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                              </select>
                              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-brown/30 pointer-events-none" />
                            </div>
                            
                            <button 
                              className="p-3 text-warm-brown/20 hover:text-gold transition-colors rounded-xl hover:bg-white shadow-sm hover:shadow-md"
                              title="View Details"
                            >
                              <Eye size={18} />
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
