import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const mainImage = product.product_images?.find((img: any) => img.is_main)?.url || product.product_images?.[0]?.url;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-cream mb-4">
        <Link to={`/product/${product.id}`}>
          <img
            src={mainImage || 'https://picsum.photos/seed/fashion/600/800'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </Link>
        
        {/* Quick Add */}
        <button 
          onClick={() => addItem(product)}
          className="absolute bottom-4 left-4 right-4 bg-white text-warm-brown py-3 text-[10px] uppercase tracking-widest font-bold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-gold hover:text-white"
        >
          Add to Bag
        </button>

        {product.is_featured && (
          <span className="absolute top-4 left-4 bg-gold text-white text-[8px] uppercase tracking-[0.2em] px-2 py-1 font-bold">
            Featured
          </span>
        )}
      </div>

      <div className="flex justify-between items-start">
        <div>
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="text-sm font-bold text-warm-brown hover:text-gold transition-colors mb-1">{product.name}</h3>
          </Link>
          <p className="text-[10px] uppercase tracking-widest text-warm-brown/40">
            {product.categories?.name}
          </p>
        </div>
        <p className="font-serif text-warm-brown">${product.price}</p>
      </div>
    </motion.div>
  );
};
