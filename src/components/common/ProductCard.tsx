"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";

import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "react-hot-toast";

interface ProductCardProps {
  product: any;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.basePrice,
      image: product.images[0]?.url,
      quantity: 1
    });
    toast.success("Added to bag");
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.basePrice,
      image: product.images[0]?.url
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-accent">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]?.url || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        
        {/* Quick Actions */}
        <div className="absolute bottom-4 left-0 right-0 px-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-500 flex gap-2">
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-primary text-white py-2 text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/90"
          >
            <ShoppingBag size={14} /> Add to Cart
          </button>
          <button 
            onClick={handleToggleWishlist}
            className={`p-2 transition-colors ${isInWishlist(product._id) ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-secondary hover:text-white'}`}
          >
            <Heart size={16} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-start">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-secondary font-semibold mb-1">
            {product.category?.name}
          </p>
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm uppercase tracking-wider text-foreground hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>
        <p className="text-sm font-medium text-primary">
          ₹{product.basePrice?.toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
};
