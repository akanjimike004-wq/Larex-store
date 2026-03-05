import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingBag, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/helpers';

export const AdminSidebar = () => {
  const { signOut } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: Tags, label: 'Categories', path: '/admin/categories' },
    { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-warm-brown/5 h-screen sticky top-0 flex flex-col">
      <div className="p-8 border-b border-warm-brown/5">
        <NavLink to="/" className="group block">
          <span className="font-serif text-xl tracking-widest uppercase text-warm-brown group-hover:text-gold transition-colors">
            Sir Larex
          </span>
          <span className="block text-[8px] tracking-[0.3em] uppercase opacity-40">
            Admin Panel
          </span>
        </NavLink>
      </div>

      <nav className="flex-grow p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }: { isActive: boolean }) => cn(
              "flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-200 group",
              isActive 
                ? "bg-gold text-white shadow-lg shadow-gold/20" 
                : "text-warm-brown/60 hover:bg-cream hover:text-warm-brown"
            )}
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                <div className="flex items-center space-x-3">
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="font-medium tracking-wide">{item.label}</span>
                </div>
                <ChevronRight size={14} className={cn("opacity-0 transition-opacity", isActive && "opacity-100")} />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-warm-brown/5">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
