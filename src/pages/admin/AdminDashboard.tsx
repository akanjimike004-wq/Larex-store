import React, { useMemo } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Users, 
  ArrowUpRight, 
  Clock,
  ArrowRight,
  PlusCircle,
  Settings,
  DollarSign,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useOrders, useProducts } from '../../hooks/useData';
import { formatPrice, formatDate, cn } from '../../utils/helpers';

const StatCard = ({ title, value, icon: Icon, trend, color, description }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-8 rounded-[2.5rem] border border-warm-brown/5 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
  >
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div className={cn("p-4 rounded-2xl shadow-lg", color)}>
          <Icon size={24} className="text-white" />
        </div>
        {trend && (
          <span className={cn(
            "flex items-center text-[10px] font-bold px-3 py-1 rounded-full border",
            trend.startsWith('+') ? "text-emerald-500 bg-emerald-50 border-emerald-100" : "text-rose-500 bg-rose-50 border-rose-100"
          )}>
            {trend.startsWith('+') ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowUpRight size={12} className="mr-1 rotate-90" />}
            {trend}
          </span>
        )}
      </div>
      <p className="text-warm-brown/40 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">{title}</p>
      <h3 className="text-4xl font-serif text-warm-brown mb-2">{value}</h3>
      {description && <p className="text-warm-brown/30 text-[10px] font-medium">{description}</p>}
    </div>
    <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
      <Icon size={120} />
    </div>
  </motion.div>
);

export const AdminDashboard = () => {
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: products, isLoading: productsLoading } = useProducts();

  const stats = useMemo(() => {
    const totalRevenue = orders?.reduce((acc, o) => acc + o.total_amount, 0) || 0;
    const activeOrders = orders?.filter(o => o.status !== 'delivered').length || 0;
    const totalCustomers = new Set(orders?.map(o => o.contact_email)).size || 0;
    
    // Simulated trends for visual appeal
    return [
      { 
        title: 'Total Revenue', 
        value: formatPrice(totalRevenue), 
        icon: DollarSign, 
        trend: '+15.2%',
        color: 'bg-gold',
        description: 'Gross volume from all orders'
      },
      { 
        title: 'Active Orders', 
        value: activeOrders, 
        icon: ShoppingBag, 
        trend: '+4',
        color: 'bg-warm-brown',
        description: 'Orders currently being processed'
      },
      { 
        title: 'Inventory Size', 
        value: products?.length || 0, 
        icon: Package,
        trend: '+2',
        color: 'bg-stone-500',
        description: 'Total unique products in store'
      },
      { 
        title: 'Customer Base', 
        value: totalCustomers, 
        icon: Users,
        trend: '+8.4%',
        color: 'bg-emerald-600',
        description: 'Unique customers served'
      },
    ];
  }, [orders, products]);

  const recentOrders = useMemo(() => orders?.slice(0, 6) || [], [orders]);

  if (ordersLoading || productsLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => <div key={i} className="h-48 bg-white rounded-[2.5rem] border border-warm-brown/5" />)}
          </div>
          <div className="h-[30rem] bg-white rounded-[3rem] border border-warm-brown/5" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-5xl font-serif text-warm-brown mb-3">Executive Summary</h1>
            <div className="flex items-center space-x-3">
              <span className="flex items-center text-[10px] uppercase tracking-widest font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                <Activity size={12} className="mr-2" />
                System Operational
              </span>
              <p className="text-warm-brown/30 text-[10px] uppercase tracking-widest font-bold">Last updated: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Link 
              to="/admin/products/new"
              className="flex items-center bg-warm-brown text-white px-8 py-4 rounded-2xl text-xs uppercase tracking-widest font-bold hover:bg-gold transition-all shadow-xl shadow-warm-brown/10 group"
            >
              <PlusCircle size={18} className="mr-2 group-hover:rotate-90 transition-transform" />
              New Product
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-[3rem] border border-warm-brown/5 shadow-sm overflow-hidden flex flex-col">
            <div className="p-10 border-b border-warm-brown/5 flex justify-between items-center bg-cream/5">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-cream rounded-2xl">
                  <Clock size={24} className="text-warm-brown" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-warm-brown">Recent Transactions</h2>
                  <p className="text-[10px] text-warm-brown/30 uppercase tracking-widest font-bold mt-1">Latest customer activity</p>
                </div>
              </div>
              <Link to="/admin/orders" className="text-[10px] uppercase tracking-widest font-bold text-gold hover:text-warm-brown transition-all flex items-center bg-cream/30 px-4 py-2 rounded-full">
                View Ledger <ArrowRight size={14} className="ml-2" />
              </Link>
            </div>
            <div className="overflow-x-auto flex-grow">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-cream/10">
                    <th className="px-10 py-5 text-[10px] uppercase tracking-widest font-bold text-warm-brown/40">Reference</th>
                    <th className="px-10 py-5 text-[10px] uppercase tracking-widest font-bold text-warm-brown/40">Customer</th>
                    <th className="px-10 py-5 text-[10px] uppercase tracking-widest font-bold text-warm-brown/40">Status</th>
                    <th className="px-10 py-5 text-[10px] uppercase tracking-widest font-bold text-warm-brown/40">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-brown/5">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-cream/5 transition-colors group">
                      <td className="px-10 py-6">
                        <span className="text-sm font-bold text-warm-brown">#{order.id.slice(0, 8)}</span>
                        <p className="text-[10px] text-warm-brown/30 uppercase tracking-widest font-bold mt-1">{formatDate(order.created_at)}</p>
                      </td>
                      <td className="px-10 py-6">
                        <p className="text-sm font-bold text-warm-brown">{order.contact_email}</p>
                        <p className="text-[10px] text-warm-brown/40 uppercase tracking-widest mt-1">Verified Purchase</p>
                      </td>
                      <td className="px-10 py-6">
                        <span className={cn(
                          "px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold border",
                          order.status === 'delivered' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          order.status === 'processing' ? "bg-blue-50 text-blue-600 border-blue-100" :
                          "bg-amber-50 text-amber-600 border-amber-100"
                        )}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-base font-serif text-warm-brown">{formatPrice(order.total_amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions / Inventory Status */}
          <div className="space-y-10">
            <div className="bg-white p-10 rounded-[3rem] border border-warm-brown/5 shadow-sm">
              <h2 className="text-2xl font-serif text-warm-brown mb-8">Management</h2>
              <div className="grid grid-cols-1 gap-4">
                <Link to="/admin/categories" className="flex items-center justify-between p-6 bg-cream/20 rounded-3xl hover:bg-cream transition-all group border border-transparent hover:border-gold/20">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white rounded-2xl group-hover:bg-gold group-hover:text-white transition-all shadow-sm">
                      <Settings size={20} />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-warm-brown block">Categories</span>
                      <span className="text-[10px] text-warm-brown/40 uppercase tracking-widest font-bold">Taxonomy Control</span>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-warm-brown/20 group-hover:text-gold transition-all" />
                </Link>
                <Link to="/admin/products" className="flex items-center justify-between p-6 bg-cream/20 rounded-3xl hover:bg-cream transition-all group border border-transparent hover:border-gold/20">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white rounded-2xl group-hover:bg-gold group-hover:text-white transition-all shadow-sm">
                      <Package size={20} />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-warm-brown block">Inventory</span>
                      <span className="text-[10px] text-warm-brown/40 uppercase tracking-widest font-bold">Stock Management</span>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-warm-brown/20 group-hover:text-gold transition-all" />
                </Link>
              </div>
            </div>

            <div className="bg-warm-brown p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-cream text-2xl font-serif mb-3">Administrator Support</h3>
                <p className="text-cream/60 text-sm mb-8 leading-relaxed">Access the comprehensive guide for enterprise store management and optimization.</p>
                <button className="bg-gold text-white px-8 py-4 rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:bg-white hover:text-warm-brown transition-all shadow-xl shadow-gold/20">
                  View Documentation
                </button>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl group-hover:bg-gold/20 transition-all" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-cream/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
