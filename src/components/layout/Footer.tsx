import React from 'react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-warm-brown text-cream pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-serif text-2xl uppercase tracking-widest mb-6">Sir Larex</h3>
            <p className="text-sm text-cream/60 leading-relaxed mb-6">
              Elevating the everyday through curated casual elegance. Our pieces are designed for the modern individual who values quality and timeless style.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-gold">Shop</h4>
            <ul className="space-y-4 text-sm text-cream/60">
              <li><a href="#" className="hover:text-cream transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-cream transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-cream transition-colors">Men's Collection</a></li>
              <li><a href="#" className="hover:text-cream transition-colors">Women's Collection</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-gold">Company</h4>
            <ul className="space-y-4 text-sm text-cream/60">
              <li><a href="#" className="hover:text-cream transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-cream transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-cream transition-colors">Journal</a></li>
              <li><a href="#" className="hover:text-cream transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-gold">Newsletter</h4>
            <p className="text-sm text-cream/60 mb-4">Subscribe to receive updates and exclusive offers.</p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Email Address"
                className="bg-transparent border-b border-cream/20 py-2 text-sm focus:outline-none focus:border-gold transition-colors"
              />
              <button className="text-xs uppercase tracking-widest text-left py-2 hover:text-gold transition-colors">
                Subscribe →
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-cream/40">
          <p>© {currentYear} Sir Larex Casual Fashion Home. All Rights Reserved.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-cream transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cream transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-cream transition-colors">Shipping & Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
