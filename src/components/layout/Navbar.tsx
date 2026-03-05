import React from 'react';
import { ShoppingBag, Search, User, Menu } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export const Navbar = () => {
  const { count } = useCart();
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-cream/80 backdrop-blur-md border-b border-warm-brown/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Mobile Menu */}
          <div className="flex md:hidden">
            <button className="text-warm-brown p-2">
              <Menu size={24} />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="group">
              <span className="font-serif text-2xl tracking-widest uppercase text-warm-brown group-hover:text-gold transition-colors duration-300">
                Sir Larex
              </span>
              <span className="block text-[10px] text-center tracking-[0.3em] uppercase opacity-60 group-hover:opacity-100 transition-opacity">
                Casual Fashion
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-12">
            {['New Arrivals', 'Men', 'Women', 'Accessories', 'Journal'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-sm uppercase tracking-widest text-warm-brown/70 hover:text-warm-brown transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <button className="text-warm-brown hover:text-gold transition-colors">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link to="/admin/dashboard" className="text-warm-brown hover:text-gold transition-colors">
              <User size={20} strokeWidth={1.5} />
            </Link>
            <Link to="/cart" className="text-warm-brown hover:text-gold transition-colors relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
